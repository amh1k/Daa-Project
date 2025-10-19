"use client"

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { getColorForPoint } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Info } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface StaticPointsCanvasProps {
  points: Point[]
  closestPair: {
    point1: Point
    point2: Point
  }
  width?: number
  height?: number
}

export function StaticPointsCanvas({
  points,
  closestPair,
  width = 900,
  height = 600
}: StaticPointsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || points.length === 0) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = isDark ? '#0a0a0a' : '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Find bounds
    const xValues = points.map(p => p.x)
    const yValues = points.map(p => p.y)
    const minX = Math.min(...xValues)
    const maxX = Math.max(...xValues)
    const minY = Math.min(...yValues)
    const maxY = Math.max(...yValues)

    const padding = 50 // Base padding for axes and labels
    const pointRadius = 6 // Maximum point radius (for closest pair highlights)

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

    // Draw all points
    points.forEach(point => {
      const pos = transform(point)
      const isClosest =
        (point.x === closestPair.point1.x && point.y === closestPair.point1.y) ||
        (point.x === closestPair.point2.x && point.y === closestPair.point2.y)

      ctx.fillStyle = getColorForPoint(isClosest, isDark)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isClosest ? 6 : 3, 0, 2 * Math.PI)
      ctx.fill()

      if (isClosest) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // Draw line between closest pair
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

    // Draw axes labels
    ctx.fillStyle = isDark ? '#9ca3af' : '#6b7280'
    ctx.font = '14px sans-serif'
    ctx.fillText('X →', width - padding + 10, height / 2)
    ctx.fillText('Y →', width / 2, padding - 25)

  }, [points, closestPair, width, height, isDark])

  return (
    <div className="space-y-4">
      {/* Info card */}
      <Card className="p-3 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Step-by-step animation is available for datasets with ≤50 points.
            Showing static result visualization for this larger dataset.
          </p>
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
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">Normal points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-muted-foreground">Closest pair</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
