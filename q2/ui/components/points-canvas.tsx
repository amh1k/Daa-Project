"use client"

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { getColorForPoint } from '@/lib/utils'

interface Point {
  x: number
  y: number
}

interface PointsCanvasProps {
  points: Point[]
  closestPair?: {
    point1: Point
    point2: Point
  }
  width?: number
  height?: number
}

export function PointsCanvas({ points, closestPair, width = 800, height = 600 }: PointsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

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

    const padding = 40
    const scaleX = (width - 2 * padding) / (maxX - minX)
    const scaleY = (height - 2 * padding) / (maxY - minY)

    // Transform point to canvas coordinates
    const transform = (p: Point) => ({
      x: padding + (p.x - minX) * scaleX,
      y: height - (padding + (p.y - minY) * scaleY) // Flip Y axis
    })

    // Draw grid
    ctx.strokeStyle = isDark ? '#333' : '#e5e5e5'
    ctx.lineWidth = 1
    for (let i = 0; i <= 10; i++) {
      const x = padding + (width - 2 * padding) * (i / 10)
      const y = padding + (height - 2 * padding) * (i / 10)

      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw all points
    points.forEach(point => {
      const pos = transform(point)
      const isClosest = closestPair && (
        (point.x === closestPair.point1.x && point.y === closestPair.point1.y) ||
        (point.x === closestPair.point2.x && point.y === closestPair.point2.y)
      )

      ctx.fillStyle = getColorForPoint(isClosest || false, isDark)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, isClosest ? 8 : 4, 0, 2 * Math.PI)
      ctx.fill()

      // Outline for closest pair
      if (isClosest) {
        ctx.strokeStyle = '#ef4444'
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })

    // Draw line between closest pair
    if (closestPair) {
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

  }, [points, closestPair, width, height, isDark])

  return (
    <div className="flex justify-center items-center p-4 bg-muted/20 rounded-lg">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-border rounded shadow-lg"
      />
    </div>
  )
}
