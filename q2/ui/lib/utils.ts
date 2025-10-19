import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return '0'
  return num.toLocaleString('en-US')
}

export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str
  return `${str.slice(0, maxLength)}...${str.slice(-maxLength)}`
}

export function getColorForPoint(isClosest: boolean, isDark: boolean): string {
  if (isClosest) return '#ef4444' // red for closest pair
  return isDark ? '#60a5fa' : '#3b82f6' // blue for normal points
}

export function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)} µs`
  if (ms < 1000) return `${ms.toFixed(2)} ms`
  return `${(ms / 1000).toFixed(2)} s`
}
