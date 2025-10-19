"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { getColorForPoint } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Point {
  x: number
  y: number
}

interface AnimatedPointsCanvasProps {
  points: Point[]
  closestPair?: {
    point1: Point
    point2: Point
  }
  width?: number
  height?: number
}

type Step = {
  type: 'divide' | 'search-left' | 'search-right' | 'strip' | 'result'
  description: string
  divideX?: number
  highlightRegion?: 'left' | 'right' | 'strip'
  stripX?: number
  stripWidth?: number
}

export function AnimatedPointsCanvas({
  points,
  closestPair,
  width = 800,
  height = 600
}: AnimatedPointsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)

  // Generate algorithm steps
  const steps: Step[] = [
    {
      type: 'divide',
      description: 'Step 1: Sort points by x-coordinate and divide into two halves',
      divideX: points.length > 0 ? (Math.max(...points.map(p => p.x)) + Math.min(...points.map(p => p.x))) / 2 : 0
    },
    {
      type: 'search-left',
      description: 'Step 2: Recursively find closest pair in left half',
      highlightRegion: 'left',
      divideX: points.length > 0 ? (Math.max(...points.map(p => p.x)) + Math.min(...points.map(p => p.x))) / 2 : 0
    },
    {
      type: 'search-right',
      description: 'Step 3: Recursively find closest pair in right half',
      highlightRegion: 'right',
      divideX: points.length > 0 ? (Math.max(...points.map(p => p.x)) + Math.min(...points.map(p => p.x))) / 2 : 0
    },
    {
      type: 'strip',
      description: 'Step 4: Check points in the strip near the dividing line',
      divideX: points.length > 0 ? (Math.max(...points.map(p => p.x)) + Math.min(...points.map(p => p.x))) / 2 : 0,
      highlightRegion: 'strip',
      stripX: points.length > 0 ? (Math.max(...points.map(p => p.x)) + Math.min(...points.map(p => p.x))) / 2 : 0,
      stripWidth: 100
    },
    {
      type: 'result',
      description: 'Step 5: Result - Found the closest pair!',
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1
          } else {
            setIsPlaying(false)
            return prev
          }
        })
      }, 2000) // 2 seconds per step
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || points.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = isDark ? '#1a1a1a' : '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Find bounds
    const xValues = points.map(p => p.x)
    const yValues = points.map(p => p.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    const padding = 60 // Increased padding to ensure points stay within canvas
    const pointRadius = 8 // Maximum point radius
    const effectivePadding = padding + pointRadius + 5 // Extra margin for safety

    // Use smaller scale to ensure all points fit
    const scaleX = (width - 2 * effectivePadding) / (maxX - minX || 1)
    const scaleY = (height - 2 * effectivePadding) / (maxY - minY || 1)

    // Transform point to canvas coordinates
    const transform = (p: Point) => ({
      x: effectivePadding + (p.x - minX) * scaleX,
      y: height - (effectivePadding + (p.y - minY) * scaleY)
    })

    // Draw grid
    ctx.strokeStyle = isDark ? '#333' : '#e5e5e5'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = effectivePadding + (width - 2 * effectivePadding) * (i / 10)
      const y = effectivePadding + (height - 2 * effectivePadding) * (i / 10)

      ctx.beginPath()
      ctx.moveTo(x, effectivePadding)
      ctx.lineTo(x, height - effectivePadding)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(effectivePadding, y)
      ctx.lineTo(width - effectivePadding, y)
      ctx.stroke()
    }

    const step = showAnimation ? steps[currentStep] : steps[steps.length - 1]

    // Draw division line
    if (step.divideX !== undefined) {
      const divX = effectivePadding + (step.divideX - minX) * scaleX
      ctx.strokeStyle = isDark ? '#fbbf24' : '#f59e0b'
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(divX, effectivePadding)
      ctx.lineTo(divX, height - effectivePadding)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw highlight regions
    if (step.highlightRegion) {
      ctx.fillStyle = isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'

      if (step.highlightRegion === 'left' && step.divideX !== undefined) {
        const divX = effectivePadding + (step.divideX - minX) * scaleX
        ctx.fillRect(effectivePadding, effectivePadding, divX - effectivePadding, height - 2 * effectivePadding)
      } else if (step.highlightRegion === 'right' && step.divideX !== undefined) {
        const divX = effectivePadding + (step.divideX - minX) * scaleX
        ctx.fillRect(divX, effectivePadding, width - effectivePadding - divX, height - 2 * effectivePadding)
      } else if (step.highlightRegion === 'strip' && step.stripX !== undefined && step.stripWidth !== undefined) {
        const stripCenterX = effectivePadding + (step.stripX - minX) * scaleX
        const stripW = step.stripWidth * scaleX / (maxX - minX)
        ctx.fillRect(stripCenterX - stripW/2, effectivePadding, stripW, height - 2 * effectivePadding)
      }
    }

    // Draw all points
    points.forEach(point => {
      const pos = transform(point)
      const isClosest = closestPair && (
        (point.x === closestPair.point1.x && point.y === closestPair.point1.y) ||
        (point.x === closestPair.point2.x && point.y === closestPair.point2.y)
      )

      // Show closest pair only in final step or when animation is off
      const showAsClosest = isClosest && (!showAnimation || step.type === 'result')

      ctx.fillStyle = getColorForPoint(showAsClosest || false, isDark)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, showAsClosest ? 8 : 4, 0, 2 * Math.PI)
      ctx.fill()

      if (showAsClosest) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // Draw line between closest pair (only in final step)
    if (closestPair && (!showAnimation || step.type === 'result')) {
      const p1 = transform(closestPair.point1)
      const p2 = transform(closestPair.point2)

      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Draw axes labels
    ctx.fillStyle = isDark ? '#999' : '#666'
    ctx.font = '12px sans-serif'
    ctx.fillText('X', width - padding + 10, height / 2)
    ctx.fillText('Y', width / 2, padding - 10)

  }, [points, closestPair, width, height, isDark, currentStep, showAnimation, steps])

  const handlePlayPause = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  return (
    <div className="space-y-4">
      {/* Animation Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">Algorithm Visualization</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAnimation(!showAnimation)}
            >
              {showAnimation ? 'Show Final Result' : 'Show Step-by-Step'}
            </Button>
          </div>
        </div>

        {showAnimation && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentStep >= steps.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-sm text-muted-foreground text-center">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>

            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm font-medium text-foreground">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-3 w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </>
        )}
      </Card>

      {/* Canvas */}
      <div className="flex justify-center items-center p-4 bg-muted/20 rounded-lg">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-border rounded shadow-lg"
        />
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <span>Normal points</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Closest pair</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-2 bg-yellow-500"></div>
          <span>Division line</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-4 bg-blue-500/20 border border-blue-500"></div>
          <span>Search region</span>
        </div>
      </div>
    </div>
  )
}
