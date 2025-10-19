"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ManualNumberInputProps {
  onGenerate: (content: string) => void
}

export function ManualNumberInput({ onGenerate }: ManualNumberInputProps) {
  const [number1, setNumber1] = useState("")
  const [number2, setNumber2] = useState("")
  const [error, setError] = useState("")

  const validateNumber = (num: string): boolean => {
    return /^[0-9]+$/.test(num)
  }

  const handleGenerate = () => {
    setError("")

    const num1 = number1.trim()
    const num2 = number2.trim()

    if (!num1 || !num2) {
      setError("Both numbers are required")
      return
    }

    if (!validateNumber(num1)) {
      setError("Number 1 should contain only digits (0-9)")
      return
    }

    if (!validateNumber(num2)) {
      setError("Number 2 should contain only digits (0-9)")
      return
    }

    // Generate file content
    const content = `${num1}\n${num2}\n`
    onGenerate(content)
  }

  const generateRandom = (digits: number) => {
    let num = ""
    for (let i = 0; i < digits; i++) {
      num += Math.floor(Math.random() * 10)
    }
    // Remove leading zeros
    num = num.replace(/^0+/, "") || "0"
    return num
  }

  const fillWithRandom = (digits: number) => {
    setNumber1(generateRandom(digits))
    setNumber2(generateRandom(digits))
    setError("")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="num1">Number 1</Label>
          <Input
            id="num1"
            placeholder="Enter first number (digits only)"
            value={number1}
            onChange={(e) => setNumber1(e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {number1.length} digits
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="num2">Number 2</Label>
          <Input
            id="num2"
            placeholder="Enter second number (digits only)"
            value={number2}
            onChange={(e) => setNumber2(e.target.value)}
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {number2.length} digits
          </p>
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="text-sm font-medium mb-2">Quick Fill (Random)</p>
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fillWithRandom(10)}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            10
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fillWithRandom(20)}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            20
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fillWithRandom(30)}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            30
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fillWithRandom(40)}
          >
            <Sparkles className="h-3 w-3 mr-1" />
            40
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Tree visualization available for ≤50 digits
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleGenerate} className="w-full">
        <FileText className="h-4 w-4 mr-2" />
        Generate & Use Input
      </Button>
    </div>
  )
}
