"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PointsCanvas } from "@/components/points-canvas"
import { formatNumber, formatTime } from "@/lib/utils"
import { Play, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

interface Point {
  x: number
  y: number
}

interface Result {
  numPoints: number
  allPoints: Point[]
  closestPair: {
    point1: Point
    point2: Point
    distance: number
  }
  executionTime: number
}

const testFiles = [
  { value: "test_1_n100.txt", label: "Test 1 (100 points)" },
  { value: "test_2_n150.txt", label: "Test 2 (150 points)" },
  { value: "test_3_n200.txt", label: "Test 3 (200 points)" },
  { value: "test_4_n300.txt", label: "Test 4 (300 points)" },
  { value: "test_5_n400.txt", label: "Test 5 (400 points)" },
  { value: "test_6_n500.txt", label: "Test 6 (500 points)" },
  { value: "test_7_n600.txt", label: "Test 7 (600 points)" },
  { value: "test_8_n700.txt", label: "Test 8 (700 points)" },
  { value: "test_9_n850.txt", label: "Test 9 (850 points)" },
  { value: "test_10_n1000.txt", label: "Test 10 (1000 points)" },
]

export default function ClosestPairPage() {
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
      const response = await fetch("/api/closest-pair", {
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
        <h1 className="text-4xl font-bold mb-2">Closest Pair of Points</h1>
        <p className="text-muted-foreground">
          Find the two closest points using divide and conquer - O(n log n) complexity
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
                    <p className="text-sm text-muted-foreground">Number of Points</p>
                    <p className="text-2xl font-bold">{formatNumber(result.numPoints)}</p>
                  </div>

                  <div className="border-t pt-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Closest Distance</p>
                    <p className="text-2xl font-bold text-primary">
                      {result.closestPair.distance.toFixed(6)}
                    </p>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground mb-2">Point 1</p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      ({result.closestPair.point1.x.toFixed(3)}, {result.closestPair.point1.y.toFixed(3)})
                    </code>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Point 2</p>
                    <code className="text-xs bg-muted p-2 rounded block">
                      ({result.closestPair.point2.x.toFixed(3)}, {result.closestPair.point2.y.toFixed(3)})
                    </code>
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
            >
              <Card>
                <CardHeader>
                  <CardTitle>Visualization</CardTitle>
                  <CardDescription>
                    Blue dots represent all points, red dots with connecting line show the closest pair
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PointsCanvas
                    points={result.allPoints}
                    closestPair={{
                      point1: result.closestPair.point1,
                      point2: result.closestPair.point2,
                    }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a test file and click &quot;Run Algorithm&quot; to see the visualization</p>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Sort points by x-coordinate</li>
                  <li>Divide points into two halves</li>
                  <li>Recursively find closest pairs in each half</li>
                  <li>Find closest pair across the dividing line</li>
                  <li>Return the minimum distance found</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Time Complexity:</h4>
                <p className="text-sm text-muted-foreground">
                  O(n log n) - much better than brute force O(n²)
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Space Complexity:</h4>
                <p className="text-sm text-muted-foreground">
                  O(n) - for storing sorted arrays
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
