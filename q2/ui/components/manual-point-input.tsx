"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, FileText, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Point {
  x: string
  y: string
}

interface ManualPointInputProps {
  onGenerate: (content: string) => void
}

export function ManualPointInput({ onGenerate }: ManualPointInputProps) {
  const [points, setPoints] = useState<Point[]>([
    { x: "", y: "" },
    { x: "", y: "" },
    { x: "", y: "" }
  ])
  const [bulkInput, setBulkInput] = useState("")
  const [inputMode, setInputMode] = useState<"form" | "bulk">("form")
  const [error, setError] = useState("")

  const addPoint = () => {
    setPoints([...points, { x: "", y: "" }])
  }

  const removePoint = (index: number) => {
    if (points.length > 1) {
      setPoints(points.filter((_, i) => i !== index))
    }
  }

  const updatePoint = (index: number, field: "x" | "y", value: string) => {
    const newPoints = [...points]
    newPoints[index][field] = value
    setPoints(newPoints)
  }

  const generateFromForm = () => {
    setError("")

    // Validate points
    const validPoints = points.filter(p => p.x.trim() !== "" && p.y.trim() !== "")

    if (validPoints.length < 2) {
      setError("Please enter at least 2 points")
      return
    }

    // Check if all are valid numbers
    for (const point of validPoints) {
      if (isNaN(parseFloat(point.x)) || isNaN(parseFloat(point.y))) {
        setError("All coordinates must be valid numbers")
        return
      }
    }

    // Generate file content
    let content = `${validPoints.length}\n`
    validPoints.forEach(p => {
      content += `${p.x} ${p.y}\n`
    })

    onGenerate(content)
  }

  const generateFromBulk = () => {
    setError("")

    const lines = bulkInput.trim().split('\n').filter(l => l.trim() !== "")

    if (lines.length < 2) {
      setError("Please enter at least 2 points")
      return
    }

    // Validate format
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/)
      if (parts.length !== 2) {
        setError(`Line ${i + 1} should have exactly 2 numbers (x and y)`)
        return
      }
      if (isNaN(parseFloat(parts[0])) || isNaN(parseFloat(parts[1]))) {
        setError(`Line ${i + 1} contains invalid numbers`)
        return
      }
    }

    // Generate file content
    let content = `${lines.length}\n${bulkInput.trim()}\n`
    onGenerate(content)
  }

  const handleGenerate = () => {
    if (inputMode === "form") {
      generateFromForm()
    } else {
      generateFromBulk()
    }
  }

  const fillRandom = (count: number) => {
    setError("")
    let randomPoints = ""
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 200 - 100).toFixed(2)
      const y = (Math.random() * 200 - 100).toFixed(2)
      randomPoints += `${x} ${y}\n`
    }
    setBulkInput(randomPoints.trim())
  }

  const fillRandomForm = (count: number) => {
    setError("")
    const newPoints: Point[] = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 200 - 100).toFixed(2)
      const y = (Math.random() * 200 - 100).toFixed(2)
      newPoints.push({ x, y })
    }
    setPoints(newPoints)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={inputMode === "form" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("form")}
          className="flex-1"
        >
          Point by Point
        </Button>
        <Button
          variant={inputMode === "bulk" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("bulk")}
          className="flex-1"
        >
          Bulk Input
        </Button>
      </div>

      {inputMode === "form" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Quick Fill (Random)</Label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandomForm(10)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandomForm(20)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                20
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandomForm(30)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                30
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandomForm(40)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                40
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {points.map((point, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                <Input
                  placeholder="x"
                  value={point.x}
                  onChange={(e) => updatePoint(index, "x", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="y"
                  value={point.y}
                  onChange={(e) => updatePoint(index, "y", e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePoint(index)}
                  disabled={points.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={addPoint}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Point
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Enter points (one per line: x y)</Label>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandom(10)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                10
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandom(20)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                20
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandom(30)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                30
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fillRandom(40)}
                className="text-xs h-7"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                40
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="Example:&#10;10.5 20.3&#10;-5.2 15.7&#10;30.0 -10.5&#10;0.0 0.0"
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            className="font-mono text-sm min-h-40"
          />
          <p className="text-xs text-muted-foreground">
            Format: Each line should contain two numbers separated by space (x y)
          </p>
        </div>
      )}

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
