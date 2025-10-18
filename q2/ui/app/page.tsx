"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Zap, BarChart3 } from "lucide-react"

const algorithmCards = [
  {
    title: "Closest Pair of Points",
    description: "Find the two closest points among n points in 2D space using divide and conquer approach",
    complexity: "O(n log n)",
    icon: Activity,
    href: "/closest-pair",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Integer Multiplication",
    description: "Multiply large integers efficiently using the Karatsuba algorithm",
    complexity: "O(n^1.585)",
    icon: Zap,
    href: "/integer-multiplication",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Benchmark Dashboard",
    description: "Compare algorithm performance across multiple test cases",
    complexity: "Performance Analysis",
    icon: BarChart3,
    href: "/benchmark",
    gradient: "from-green-500 to-emerald-500",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function Home() {
  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          DAA Algorithm Visualizer
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Divide and Conquer Algorithms Visualization
        </p>
        <p className="text-sm text-muted-foreground">
          CS302 - Design and Analysis of Algorithms Project
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
      >
        {algorithmCards.map((algo) => (
          <motion.div key={algo.title} variants={item}>
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 h-full">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${algo.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <algo.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl mb-2">{algo.title}</CardTitle>
                <CardDescription className="text-sm">
                  {algo.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Complexity:</span>
                  <code className="text-sm font-mono bg-primary/10 px-2 py-1 rounded">
                    {algo.complexity}
                  </code>
                </div>
                <Link href={algo.href}>
                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    Try It Out
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>About This Project</CardTitle>
          </CardHeader>
          <CardContent className="text-left space-y-4">
            <p className="text-muted-foreground">
              This project demonstrates the implementation and visualization of two fundamental
              divide-and-conquer algorithms:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                <strong>Closest Pair of Points:</strong> Efficiently finds the two closest points
                in a 2D plane with O(n log n) time complexity.
              </li>
              <li>
                <strong>Integer Multiplication (Karatsuba):</strong> Multiplies large integers
                faster than traditional methods with O(n^1.585) complexity.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Each algorithm includes interactive visualizations, performance metrics, and
              the ability to test with various input sizes from 100 to 1000 elements.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
