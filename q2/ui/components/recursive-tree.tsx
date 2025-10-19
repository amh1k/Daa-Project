"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Maximize2, ZoomIn, ZoomOut, Minimize2 } from "lucide-react"

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

interface RecursiveTreeProps {
  tree: TreeNode
  maxDepth: number
}

const NODE_WIDTH = 160
const NODE_HEIGHT = 100
const LEVEL_HEIGHT = 140
const HORIZONTAL_SPACING = 15
const SIBLING_SPACING = 25 // Space between siblings

function getNodeColor(type: string, isDark: boolean): { fill: string; stroke: string; textClass: string; contentTextClass: string } {
  if (isDark) {
    switch (type) {
      case "root":
        return {
          fill: "rgba(88, 28, 135, 0.8)", // purple-900/80
          stroke: "rgb(192, 132, 252)", // purple-400
          textClass: "text-purple-50",
          contentTextClass: "text-purple-100"
        }
      case "z2":
        return {
          fill: "rgba(30, 58, 138, 0.8)", // blue-900/80
          stroke: "rgb(96, 165, 250)", // blue-400
          textClass: "text-blue-50",
          contentTextClass: "text-blue-100"
        }
      case "z0":
        return {
          fill: "rgba(20, 83, 45, 0.8)", // green-900/80
          stroke: "rgb(74, 222, 128)", // green-400
          textClass: "text-green-50",
          contentTextClass: "text-green-100"
        }
      case "z1":
        return {
          fill: "rgba(124, 45, 18, 0.8)", // orange-900/80
          stroke: "rgb(251, 146, 60)", // orange-400
          textClass: "text-orange-50",
          contentTextClass: "text-orange-100"
        }
      default:
        return {
          fill: "rgb(31, 41, 55)", // gray-800
          stroke: "rgb(107, 114, 128)", // gray-500
          textClass: "text-gray-50",
          contentTextClass: "text-gray-100"
        }
    }
  } else {
    switch (type) {
      case "root":
        return {
          fill: "rgb(243, 232, 255)", // purple-100
          stroke: "rgb(147, 51, 234)", // purple-600
          textClass: "text-purple-900",
          contentTextClass: "text-purple-800"
        }
      case "z2":
        return {
          fill: "rgb(219, 234, 254)", // blue-100
          stroke: "rgb(37, 99, 235)", // blue-600
          textClass: "text-blue-900",
          contentTextClass: "text-blue-800"
        }
      case "z0":
        return {
          fill: "rgb(220, 252, 231)", // green-100
          stroke: "rgb(22, 163, 74)", // green-600
          textClass: "text-green-900",
          contentTextClass: "text-green-800"
        }
      case "z1":
        return {
          fill: "rgb(255, 237, 213)", // orange-100
          stroke: "rgb(234, 88, 12)", // orange-600
          textClass: "text-orange-900",
          contentTextClass: "text-orange-800"
        }
      default:
        return {
          fill: "rgb(243, 244, 246)", // gray-100
          stroke: "rgb(107, 114, 128)", // gray-500
          textClass: "text-gray-900",
          contentTextClass: "text-gray-800"
        }
    }
  }
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "root": return "Root"
    case "z2": return "z₂ = a × c"
    case "z0": return "z₀ = b × d"
    case "z1": return "z₁ = (a+b) × (c+d)"
    default: return type
  }
}

function calculateTreeWidth(node: TreeNode): number {
  if (node.children.length === 0) return NODE_WIDTH

  const childrenWidths = node.children.map(calculateTreeWidth)
  const totalChildrenWidth = childrenWidths.reduce((a, b) => a + b, 0) + (node.children.length - 1) * SIBLING_SPACING
  return Math.max(NODE_WIDTH, totalChildrenWidth)
}

interface NodePosition {
  x: number
  y: number
}

function calculatePositions(
  node: TreeNode,
  x: number,
  y: number,
  positions: Map<number, NodePosition>
): number {
  positions.set(node.id, { x, y })

  if (node.children.length === 0) return NODE_WIDTH

  const childWidths = node.children.map(child => calculateTreeWidth(child))
  const totalWidth = childWidths.reduce((a, b) => a + b, 0) + (node.children.length - 1) * SIBLING_SPACING

  let currentX = x - totalWidth / 2 + NODE_WIDTH / 2

  node.children.forEach((child, i) => {
    const childWidth = calculateTreeWidth(child)
    calculatePositions(child, currentX + childWidth / 2 - NODE_WIDTH / 2, y + LEVEL_HEIGHT, positions)
    currentX += childWidth + SIBLING_SPACING
  })

  return totalWidth
}

function TreeNodeComponent({
  node,
  position,
  parentPosition,
  delay,
  isDark
}: {
  node: TreeNode
  position: NodePosition
  parentPosition?: NodePosition
  delay: number
  isDark: boolean
}) {
  const colors = getNodeColor(node.type, isDark)

  // Safety check: if position is undefined, return null
  if (!position) {
    console.error('Position is undefined for node:', node.id)
    return null
  }

  return (
    <>
      {parentPosition && (
        <motion.line
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 0.5, delay: delay }}
          x1={parentPosition.x + NODE_WIDTH / 2}
          y1={parentPosition.y + NODE_HEIGHT}
          x2={position.x + NODE_WIDTH / 2}
          y2={position.y}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
      )}

      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: delay + 0.2
        }}
      >
        <rect
          x={position.x}
          y={position.y}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
          rx="8"
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2"
        />

        <foreignObject
          x={position.x}
          y={position.y}
          width={NODE_WIDTH}
          height={NODE_HEIGHT}
        >
          <div className="h-full p-2 flex flex-col justify-between text-xs">
            <div>
              <div className={`font-bold mb-1 ${colors.textClass}`}>
                {getTypeLabel(node.type)}
              </div>
              <div className={`text-[10px] font-mono leading-tight space-y-0.5 ${colors.contentTextClass}`}>
                <div className="truncate">x: {node.x.length > 12 ? node.x.substring(0, 12) + '...' : node.x}</div>
                <div className="truncate">y: {node.y.length > 12 ? node.y.substring(0, 12) + '...' : node.y}</div>
              </div>
            </div>
            <div className={`text-[10px] border-t pt-1 ${colors.contentTextClass}`} style={{ borderColor: colors.stroke, opacity: 0.3 }}>
              <div className={`font-semibold truncate text-xs ${colors.textClass}`}>= {node.result.length > 10 ? node.result.substring(0, 10) + '...' : node.result}</div>
              <div className={`text-[9px] opacity-70`}>{node.resultDigits}d</div>
            </div>
          </div>
        </foreignObject>
      </motion.g>
    </>
  )
}

function renderTree(
  node: TreeNode,
  positions: Map<number, NodePosition>,
  isDark: boolean,
  parentPosition?: NodePosition,
  depth: number = 0
): JSX.Element[] {
  const position = positions.get(node.id)

  // Safety check: if position is undefined, skip this node
  if (!position) {
    console.error('Position not found for node:', node.id)
    return []
  }

  const delay = depth * 0.3

  const elements: JSX.Element[] = [
    <TreeNodeComponent
      key={node.id}
      node={node}
      position={position}
      parentPosition={parentPosition}
      delay={delay}
      isDark={isDark}
    />
  ]

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      elements.push(...renderTree(child, positions, isDark, position, depth + 1))
    })
  }

  return elements
}

function TreeVisualization({ tree, positions, dimensions, isDark }: { tree: TreeNode, positions: Map<number, NodePosition>, dimensions: { width: number, height: number }, isDark: boolean }) {
  return (
    <>
      <div className="w-full overflow-x-auto">
        <div className="min-w-full" style={{ minWidth: dimensions.width }}>
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="mx-auto"
            style={{ minHeight: '400px' }}
          >
            {renderTree(tree, positions, isDark)}
          </svg>
        </div>
      </div>

      {/* Legend - Footer style */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-purple-100 dark:bg-purple-900/80 border-2 border-purple-600 dark:border-purple-400 rounded"></div>
            <span className="text-muted-foreground">Root</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/80 border-2 border-blue-600 dark:border-blue-400 rounded"></div>
            <span className="text-muted-foreground">z₂ (High)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-100 dark:bg-green-900/80 border-2 border-green-600 dark:border-green-400 rounded"></div>
            <span className="text-muted-foreground">z₀ (Low)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-orange-100 dark:bg-orange-900/80 border-2 border-orange-600 dark:border-orange-400 rounded"></div>
            <span className="text-muted-foreground">z₁ (Middle)</span>
          </div>
        </div>
      </div>
    </>
  )
}

export function RecursiveTree({ tree, maxDepth }: RecursiveTreeProps) {
  const [positions, setPositions] = useState<Map<number, NodePosition>>(new Map())
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const pos = new Map<number, NodePosition>()
    const treeWidth = calculateTreeWidth(tree)
    const treeHeight = (maxDepth + 1) * LEVEL_HEIGHT + 80

    calculatePositions(tree, treeWidth / 2 - NODE_WIDTH / 2, 30, pos)

    setPositions(pos)
    setDimensions({ width: Math.max(600, treeWidth + 80), height: treeHeight })
  }, [tree, maxDepth])

  // Mouse event handlers for panning (left click + drag)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsPanning(true)
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      e.preventDefault()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleMouseLeave = () => {
    setIsPanning(false)
  }

  // Reset pan when dialog closes
  const handleResetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Expand Button */}
      <div className="absolute top-0 right-0 z-10">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Maximize2 className="h-4 w-4 mr-2" />
              Expand View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[98vw] max-h-[98vh] p-0 gap-0 flex flex-col">
            <DialogHeader className="sticky top-0 bg-background z-50 px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>Recursive Tree Visualization</DialogTitle>
                  <DialogDescription>
                    Left-click and drag to pan, or use zoom controls and scrollbars
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2">
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false)
                        setZoom(1)
                        setPan({ x: 0, y: 0 })
                      }}
                      title="Shrink to inline view"
                    >
                      <Minimize2 className="h-4 w-4 mr-1" />
                      Shrink
                    </Button>
                  </DialogClose>
                  <div className="w-px h-6 bg-border"></div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                    disabled={zoom <= 0.3}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
                    disabled={zoom >= 1.5}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetView}
                    title="Reset zoom and pan"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div
              className="flex-1 overflow-auto p-6"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{
                cursor: isPanning ? 'grabbing' : 'grab',
                userSelect: 'none'
              }}
            >
              <div
                className="inline-block min-w-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'top left',
                  transition: isPanning ? 'none' : 'transform 0.2s ease-out'
                }}
              >
                <TreeVisualization tree={tree} positions={positions} dimensions={dimensions} isDark={isDark} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Inline View */}
      <TreeVisualization tree={tree} positions={positions} dimensions={dimensions} isDark={isDark} />
    </div>
  )
}
