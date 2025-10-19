"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formatNumber, formatTime, truncateString } from "@/lib/utils"
import { Play, Loader2, AlertCircle, CheckCircle2, Hash, Network } from "lucide-react"
import { RecursiveTree } from "@/components/recursive-tree"
import { FileUpload } from "@/components/file-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ManualNumberInput } from "@/components/manual-number-input"

interface TreeNode {
  id: number
  type: string
  depth: number
  x: string
  y: string
  result: string
  xDigits: number
  yDigits: number
  resultDigits: number
  children: TreeNode[]
}

interface Result {
  num1Digits: number
  num2Digits: number
  productDigits: number
  product: string
  executionTime: number
  tree?: TreeNode | null
  treeDepth?: number
}

const testFiles = [
  { value: "test_demo_d12.txt", label: "Demo (12 digits) - With Tree", category: "small" },
  { value: "test_small_d20.txt", label: "Small (20 digits) - With Tree", category: "small" },
  { value: "test_demo_d24.txt", label: "Demo (24 digits) - With Tree", category: "small" },
  { value: "test_small_d30.txt", label: "Small (30 digits) - With Tree", category: "small" },
  { value: "test_1_d100.txt", label: "Test 1 (100 digits)", category: "large" },
  { value: "test_2_d150.txt", label: "Test 2 (150 digits)", category: "large" },
  { value: "test_3_d200.txt", label: "Test 3 (200 digits)", category: "large" },
  { value: "test_4_d250.txt", label: "Test 4 (250 digits)", category: "large" },
  { value: "test_5_d300.txt", label: "Test 5 (300 digits)", category: "large" },
  { value: "test_6_d400.txt", label: "Test 6 (400 digits)", category: "large" },
  { value: "test_7_d500.txt", label: "Test 7 (500 digits)", category: "large" },
  { value: "test_8_d600.txt", label: "Test 8 (600 digits)", category: "large" },
  { value: "test_9_d800.txt", label: "Test 9 (800 digits)", category: "large" },
  { value: "test_10_d1000.txt", label: "Test 10 (1000 digits)", category: "large" },
]

export default function IntegerMultiplicationPage() {
  const [selectedFile, setSelectedFile] = useState<string>("")
  const [customFileContent, setCustomFileContent] = useState<string>("")
  const [customFileName, setCustomFileName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<"predefined" | "custom" | "manual">("predefined")
  const [manualInputContent, setManualInputContent] = useState<string>("")

  const handleFileUpload = (fileName: string, content: string) => {
    setCustomFileName(fileName)
    setCustomFileContent(content)
    setSelectedFile("") // Clear predefined selection
    setManualInputContent("") // Clear manual input
  }

  const handleManualInput = (content: string) => {
    setManualInputContent(content)
    setSelectedFile("") // Clear predefined selection
    setCustomFileContent("") // Clear file upload
    setCustomFileName("")
  }

  const handleRun = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let response

      if (inputMode === "manual" && manualInputContent) {
        // Use manual input API
        response = await fetch("/api/integer-multiplication-custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent: manualInputContent }),
        })
      } else if (inputMode === "custom" && customFileContent) {
        // Use custom file API
        response = await fetch("/api/integer-multiplication-custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileContent: customFileContent }),
        })
      } else if (inputMode === "predefined" && selectedFile) {
        // Use predefined file API
        response = await fetch("/api/integer-multiplication", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testFile: selectedFile }),
        })
      } else {
        setError("Please provide input data")
        setLoading(false)
        return
      }

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
              <CardTitle>Select Input</CardTitle>
              <CardDescription>Choose a predefined test file or upload your own</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "predefined" | "custom" | "manual")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="predefined">Files</TabsTrigger>
                  <TabsTrigger value="custom">Upload</TabsTrigger>
                  <TabsTrigger value="manual">Manual</TabsTrigger>
                </TabsList>

                <TabsContent value="predefined" className="space-y-4">
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
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <FileUpload onFileSelect={handleFileUpload} />
                  {customFileName && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {customFileName}
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <ManualNumberInput onGenerate={handleManualInput} />
                </TabsContent>
              </Tabs>

              <Button
                onClick={handleRun}
                disabled={loading || (inputMode === "predefined" && !selectedFile) || (inputMode === "custom" && !customFileContent) || (inputMode === "manual" && !manualInputContent)}
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

              {result.tree && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="h-5 w-5" />
                        Recursive Breakdown Visualization
                      </CardTitle>
                      <CardDescription>
                        Interactive tree showing how Karatsuba divides the problem into smaller subproblems
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecursiveTree tree={result.tree} maxDepth={result.treeDepth || 0} />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {!result.tree && result.num1Digits > 50 && (
                <Card className="border-dashed">
                  <CardContent className="py-6 text-center text-muted-foreground">
                    <Network className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Tree visualization available for inputs ≤50 digits
                    </p>
                    <p className="text-xs mt-1">
                      Current input: {result.num1Digits} digits
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <Card className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a test file and click &quot;Run Algorithm&quot; to see the results</p>
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
