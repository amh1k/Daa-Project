"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatNumber, formatTime } from "@/lib/utils"
import { Play, Loader2, CheckCircle2, XCircle, BarChart3 } from "lucide-react"

interface TestResult {
  testName: string
  inputSize: number
  executionTime: number
  status: "success" | "failed"
}

export default function BenchmarkPage() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [closestPairResults, setClosestPairResults] = useState<TestResult[]>([])
  const [intMultResults, setIntMultResults] = useState<TestResult[]>([])

  const runAllTests = async () => {
    setLoading(true)
    setProgress(0)
    setClosestPairResults([])
    setIntMultResults([])

    const cpTests = Array.from({ length: 10 }, (_, i) => `test_${i + 1}_n${[100, 150, 200, 300, 400, 500, 600, 700, 850, 1000][i]}.txt`)
    const imTests = Array.from({ length: 10 }, (_, i) => `test_${i + 1}_d${[100, 150, 200, 250, 300, 400, 500, 600, 800, 1000][i]}.txt`)

    // Run Closest Pair tests
    for (let i = 0; i < cpTests.length; i++) {
      try {
        const response = await fetch("/api/closest-pair", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testFile: cpTests[i] }),
        })
        const data = await response.json()
        setClosestPairResults(prev => [...prev, {
          testName: `Test ${i + 1}`,
          inputSize: data.numPoints,
          executionTime: data.executionTime,
          status: "success"
        }])
      } catch {
        setClosestPairResults(prev => [...prev, {
          testName: `Test ${i + 1}`,
          inputSize: 0,
          executionTime: 0,
          status: "failed"
        }])
      }
      setProgress(((i + 1) / 20) * 100)
    }

    // Run Integer Multiplication tests
    for (let i = 0; i < imTests.length; i++) {
      try {
        const response = await fetch("/api/integer-multiplication", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testFile: imTests[i] }),
        })
        const data = await response.json()
        setIntMultResults(prev => [...prev, {
          testName: `Test ${i + 1}`,
          inputSize: data.num1Digits,
          executionTime: data.executionTime,
          status: "success"
        }])
      } catch {
        setIntMultResults(prev => [...prev, {
          testName: `Test ${i + 1}`,
          inputSize: 0,
          executionTime: 0,
          status: "failed"
        }])
      }
      setProgress(((i + 11) / 20) * 100)
    }

    setLoading(false)
  }

  const allResults = [...closestPairResults, ...intMultResults]
  const successCount = allResults.filter(r => r.status === "success").length
  const failCount = allResults.filter(r => r.status === "failed").length

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Benchmark Dashboard</h1>
        <p className="text-muted-foreground">
          Run all 20 test files and compare algorithm performance
        </p>
      </motion.div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Run All Tests
            </CardTitle>
            <CardDescription>
              Executes both algorithms on all 10 test files each (20 total tests)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runAllTests}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests... {progress.toFixed(0)}%
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>

            {loading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground text-center">
                  {Math.floor(progress / 5)} / 20 tests completed
                </p>
              </div>
            )}

            {!loading && allResults.length > 0 && (
              <Alert>
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    <CheckCircle2 className="inline h-4 w-4 mr-2 text-green-500" />
                    {successCount} passed
                  </span>
                  {failCount > 0 && (
                    <span>
                      <XCircle className="inline h-4 w-4 mr-2 text-red-500" />
                      {failCount} failed
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {closestPairResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Closest Pair Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Test</th>
                        <th className="text-right py-2">Input Size</th>
                        <th className="text-right py-2">Time</th>
                        <th className="text-center py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {closestPairResults.map((result, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{result.testName}</td>
                          <td className="text-right">{formatNumber(result.inputSize)}</td>
                          <td className="text-right">{formatTime(result.executionTime)}</td>
                          <td className="text-center">
                            {result.status === "success" ? (
                              <CheckCircle2 className="inline h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="inline h-4 w-4 text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {intMultResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Integer Multiplication Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Test</th>
                        <th className="text-right py-2">Input Size (digits)</th>
                        <th className="text-right py-2">Time</th>
                        <th className="text-center py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intMultResults.map((result, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-2">{result.testName}</td>
                          <td className="text-right">{formatNumber(result.inputSize)}</td>
                          <td className="text-right">{formatTime(result.executionTime)}</td>
                          <td className="text-center">
                            {result.status === "success" ? (
                              <CheckCircle2 className="inline h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="inline h-4 w-4 text-red-500" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
