"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface TraceStep {
  type: 'divide' | 'base_case' | 'left_recurse' | 'right_recurse' | 'strip_check' | 'merge'
  depth: number
  divideX: number
  points: Point[]
  currentBest: {
    p1: Point
    p2: Point
    distance: number
  }
  stripPoints: Point[]
  stripWidth: number
}

interface ClosestPairStepVisualizationProps {
  allPoints: Point[]
  trace: TraceStep[]
  closestPair: {
    point1: Point
    point2: Point
  }
  width?: number
  height?: number
}

export function ClosestPairStepVisualization({
  allPoints,
  trace,
  closestPair,
  width = 900,
  height = 600
}: ClosestPairStepVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Auto-play animation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < trace.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < trace.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            return prev
          }
        })
      }, 1500) // 1.5 seconds per step
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, trace.length])

  // Get step description
  const getStepDescription = (step: TraceStep): string => {
    switch (step.type) {
      case 'divide':
        return `Divide: Split points at x = ${step.divideX.toFixed(2)}`
      case 'left_recurse':
        return `Recurse Left: Processing ${step.points.length} points in left half`
      case 'right_recurse':
        return `Recurse Right: Processing ${step.points.length} points in right half`
      case 'base_case':
        return `Base Case: Brute force on ${step.points.length} points (distance = ${step.currentBest.distance.toFixed(2)})`
      case 'strip_check':
        return `Strip Check: Checking ${step.stripPoints.length} points within distance ${(step.stripWidth / 2).toFixed(2)} from dividing line`
      case 'merge':
        return `Merge: Best distance found = ${step.currentBest.distance.toFixed(2)}`
      default:
        return 'Processing...'
    }
  }

  // Drawing function
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || allPoints.length === 0 || trace.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const step = trace[currentStep]

    // Clear canvas
    ctx.fillStyle = isDark ? '#0a0a0a' : '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Calculate bounds
    const xValues = allPoints.map(p => p.x)
    const yValues = allPoints.map(p => p.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    const padding = 50 // Base padding for axes and labels
    const pointRadius = 7 // Maximum point radius (for closest pair highlights)

    // Calculate range with a small buffer to ensure all points fit
    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1
    const bufferX = rangeX * 0.02 // 2% buffer on each side
    const bufferY = rangeY * 0.02

    // Available drawing area - ensure points stay within canvas
    const drawWidth = width - 2 * padding - pointRadius * 2
    const drawHeight = height - 2 * padding - pointRadius * 2

    // Scale to fit all points with buffer
    const scaleX = drawWidth / (rangeX + 2 * bufferX)
    const scaleY = drawHeight / (rangeY + 2 * bufferY)

    // Transform point to canvas coordinates
    const transform = (p: Point) => ({
      x: padding + pointRadius + (p.x - minX + bufferX) * scaleX,
      y: height - (padding + pointRadius + (p.y - minY + bufferY) * scaleY)
    })

    // Calculate grid boundaries
    const gridLeft = padding + pointRadius
    const gridRight = width - padding - pointRadius
    const gridTop = padding + pointRadius
    const gridBottom = height - padding - pointRadius

    // Draw grid
    ctx.strokeStyle = isDark ? '#1f1f1f' : '#e5e5e5'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = gridLeft + (gridRight - gridLeft) * (i / 10)
      const y = gridTop + (gridBottom - gridTop) * (i / 10)

      ctx.beginPath()
      ctx.moveTo(x, gridTop)
      ctx.lineTo(x, gridBottom)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(gridLeft, y)
      ctx.lineTo(gridRight, y)
      ctx.stroke()
    }

    // Highlight current subproblem points (teal background)
    if (step.points.length > 0 && (step.type === 'divide' || step.type === 'left_recurse' || step.type === 'right_recurse' || step.type === 'base_case')) {
      const subPoints = step.points.map(transform)
      if (subPoints.length > 0) {
        const minSubX = Math.min(...subPoints.map(p => p.x))
        const maxSubX = Math.max(...subPoints.map(p => p.x))
        const minSubY = Math.min(...subPoints.map(p => p.y))
        const maxSubY = Math.max(...subPoints.map(p => p.y))

        ctx.fillStyle = isDark ? 'rgba(20, 184, 166, 0.08)' : 'rgba(20, 184, 166, 0.05)'
        const expandPadding = 20
        ctx.fillRect(
          minSubX - expandPadding,
          minSubY - expandPadding,
          maxSubX - minSubX + 2 * expandPadding,
          maxSubY - minSubY + 2 * expandPadding
        )

        // Draw border around subproblem
        ctx.strokeStyle = isDark ? '#14b8a6' : '#0d9488'
        ctx.lineWidth = 2
        ctx.setLineDash([8, 4])
        ctx.strokeRect(
          minSubX - expandPadding,
          minSubY - expandPadding,
          maxSubX - minSubX + 2 * expandPadding,
          maxSubY - minSubY + 2 * expandPadding
        )
        ctx.setLineDash([])
      }
    }

    // Draw division line (red dashed)
    if (step.type !== 'base_case' && step.divideX > 0) {
      const divX = gridLeft + (step.divideX - minX + bufferX) * scaleX
      ctx.strokeStyle = isDark ? '#ef4444' : '#dc2626'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(divX, gridTop)
      ctx.lineTo(divX, gridBottom)
      ctx.stroke()
      ctx.setLineDash([])

      // Label the division line
      ctx.fillStyle = isDark ? '#ef4444' : '#dc2626'
      ctx.font = 'bold 12px sans-serif'
      ctx.fillText(`x = ${step.divideX.toFixed(1)}`, divX + 5, gridTop - 10)
    }

    // Draw strip region (lavender/purple)
    if (step.type === 'strip_check' && step.stripPoints.length > 0 && step.stripWidth > 0) {
      // Calculate strip center from current step context
      const stripCenterX = currentStep > 0 ? trace[currentStep - 1].divideX : 0
      const stripHalfWidth = step.stripWidth / 2

      const stripLeft = gridLeft + (stripCenterX - stripHalfWidth - minX + bufferX) * scaleX
      const stripRight = gridLeft + (stripCenterX + stripHalfWidth - minX + bufferX) * scaleX

      ctx.fillStyle = isDark ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.08)'
      ctx.fillRect(stripLeft, gridTop, stripRight - stripLeft, gridBottom - gridTop)

      // Draw strip borders
      ctx.strokeStyle = isDark ? '#a855f7' : '#9333ea'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(stripLeft, gridTop)
      ctx.lineTo(stripLeft, gridBottom)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(stripRight, gridTop)
      ctx.lineTo(stripRight, gridBottom)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw all points (smaller, gray)
    allPoints.forEach(point => {
      const pos = transform(point)
      ctx.fillStyle = isDark ? '#4b5563' : '#9ca3af'
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Highlight current subproblem points
    if (step.points.length > 0) {
      step.points.forEach(point => {
        const pos = transform(point)
        ctx.fillStyle = isDark ? '#14b8a6' : '#0d9488'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 5, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = isDark ? '#5eead4' : '#14b8a6'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    // Highlight strip points
    if (step.type === 'strip_check' && step.stripPoints.length > 0) {
      step.stripPoints.forEach(point => {
        const pos = transform(point)
        ctx.fillStyle = isDark ? '#a855f7' : '#9333ea'
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 6, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = isDark ? '#c084fc' : '#a855f7'
        ctx.lineWidth = 2
        ctx.stroke()
      })
    }

    // Draw current best pair (green line) if valid
    if (step.currentBest && step.currentBest.distance < 1e100) {
      const p1 = transform(step.currentBest.p1)
      const p2 = transform(step.currentBest.p2)

      // Draw line
      ctx.strokeStyle = isDark ? '#22c55e' : '#16a34a'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 3])
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw points
      ctx.fillStyle = isDark ? '#22c55e' : '#16a34a'
      ctx.beginPath()
      ctx.arc(p1.x, p1.y, 7, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = isDark ? '#86efac' : '#22c55e'
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(p2.x, p2.y, 7, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    }

    // Draw axes labels
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280'
    ctx.font = '14px sans-serif'
    ctx.fillText('X →', gridRight + 10, height / 2)
    ctx.fillText('Y →', width / 2, gridTop - 15)

  }, [allPoints, trace, currentStep, isDark, width, height])

  if (trace.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Step-by-step visualization available for datasets with ≤ 50 points only.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Algorithm Step-by-Step Visualization</h3>
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {trace.length}
            </div>
          </div>

          {/* Step description */}
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">
              {getStepDescription(trace[currentStep])}
            </p>
          </div>

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(0)}
              disabled={currentStep === 0}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (currentStep >= trace.length - 1) {
                  setCurrentStep(0)
                }
                setIsPlaying(!isPlaying)
              }}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.min(trace.length - 1, currentStep + 1))}
              disabled={currentStep >= trace.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / trace.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Canvas */}
      <div className="flex justify-center items-center p-6 bg-muted/20 rounded-lg border overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="rounded max-w-full"
          style={{ display: 'block' }}
        />
      </div>

      {/* Legend - Footer style */}
      <Card className="p-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-0.5 border-t-2 border-red-600 dark:border-red-500" style={{ borderStyle: 'dashed' }}></div>
            <span className="text-muted-foreground">Division</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-4 bg-purple-500/10 border border-purple-600 dark:border-purple-500 border-dashed"></div>
            <span className="text-muted-foreground">Strip</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-4 bg-teal-500/10 border border-teal-600 dark:border-teal-500 border-dashed"></div>
            <span className="text-muted-foreground">Subproblem</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-teal-600 dark:bg-teal-500 rounded-full"></div>
            <span className="text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-purple-600 dark:bg-purple-500 rounded-full"></div>
            <span className="text-muted-foreground">Strip pts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Closest</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
