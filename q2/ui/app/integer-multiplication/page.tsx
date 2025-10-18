"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatNumber, formatTime, truncateString } from "@/lib/utils"
import { Play, Loader2, AlertCircle, CheckCircle2, Hash } from "lucide-react"

interface Result {
  num1Digits: number
  num2Digits: number
  productDigits: number
  product: string
  executionTime: number
}

const testFiles = [
  { value: "test_1_d100.txt", label: "Test 1 (100 digits)" },
  { value: "test_2_d150.txt", label: "Test 2 (150 digits)" },
  { value: "test_3_d200.txt", label: "Test 3 (200 digits)" },
  { value: "test_4_d250.txt", label: "Test 4 (250 digits)" },
  { value: "test_5_d300.txt", label: "Test 5 (300 digits)" },
  { value: "test_6_d400.txt", label: "Test 6 (400 digits)" },
  { value: "test_7_d500.txt", label: "Test 7 (500 digits)" },
  { value: "test_8_d600.txt", label: "Test 8 (600 digits)" },
  { value: "test_9_d800.txt", label: "Test 9 (800 digits)" },
  { value: "test_10_d1000.txt", label: "Test 10 (1000 digits)" },
]

export default function IntegerMultiplicationPage() {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRun = async () => {
    if (!selectedFile) {
      setError("Please select a test file")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/integer-multiplication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testFile: selectedFile }),
      })

      if (!response.ok) {
        throw new Error(`Failed to run algorithm: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">Integer Multiplication (Karatsuba)</h1>
        <p className="text-muted-foreground">
          Multiply large integers efficiently - O(n^1.585) complexity
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Test File</CardTitle>
              <CardDescription>Choose from 10 pre-generated test files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedFile} onValueChange={setSelectedFile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a test file" />
                </SelectTrigger>
                <SelectContent>
                  {testFiles.map((file) => (
                    <SelectItem key={file.value} value={file.value}>
                      {file.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleRun}
                disabled={loading || !selectedFile}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run Algorithm
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Input Digits</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(result.num1Digits)} × {formatNumber(result.num2Digits)}
                    </p>
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Product Digits</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatNumber(result.productDigits)}
                    </p>
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Execution Time</p>
                    <p className="text-lg font-semibold">{formatTime(result.executionTime)}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Product Result</CardTitle>
                  <CardDescription>
                    {result.productDigits > 100
                      ? "Showing first and last 50 digits"
                      : "Complete result"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm break-all">
                    {result.product.length > 100 ? (
                      <>
                        <span className="text-primary">{result.product.slice(0, 50)}</span>
                        <span className="text-muted-foreground">...</span>
                        <span className="text-primary">{result.product.slice(-50)}</span>
                      </>
                    ) : (
                      <span className="text-primary">{result.product}</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Multiplication Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Hash className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">Number 1 Digits</p>
                      <p className="text-2xl font-bold">{formatNumber(result.num1Digits)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Hash className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-muted-foreground">Number 2 Digits</p>
                      <p className="text-2xl font-bold">{formatNumber(result.num2Digits)}</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Hash className="h-6 w-6 mx-auto mb-2 text-green-500" />
                      <p className="text-sm text-muted-foreground">Product Digits</p>
                      <p className="text-2xl font-bold">{formatNumber(result.productDigits)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a test file and click "Run Algorithm" to see the results</p>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Karatsuba Algorithm:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  For two n-digit numbers x and y:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground pl-4">
                  <li>Split x = a·10^m + b and y = c·10^m + d</li>
                  <li>Compute z₂ = a × c</li>
                  <li>Compute z₀ = b × d</li>
                  <li>Compute z₁ = (a + b) × (c + d) - z₂ - z₀</li>
                  <li>Result = z₂·10^(2m) + z₁·10^m + z₀</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <p className="text-sm text-muted-foreground">
                  O(n^log₂3) ≈ O(n^1.585) - better than traditional O(n²)
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Insight:</h4>
                <p className="text-sm text-muted-foreground">
                  Reduces 4 multiplications to 3, improving asymptotic complexity
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
