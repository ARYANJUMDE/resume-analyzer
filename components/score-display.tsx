"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScoreDisplayProps {
  score: number
  label: string
  description?: string
  size?: "sm" | "md" | "lg"
}

export function ScoreDisplay({ score, label, description, size = "md" }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-success"
    if (score >= 6) return "text-accent"
    if (score >= 4) return "text-warning"
    return "text-destructive"
  }

  const getScoreGradient = (score: number) => {
    if (score >= 8) return "from-success/20 to-success/5"
    if (score >= 6) return "from-accent/20 to-accent/5"
    if (score >= 4) return "from-warning/20 to-warning/5"
    return "from-destructive/20 to-destructive/5"
  }

  const sizeClasses = {
    sm: { container: "w-20 h-20", text: "text-2xl", label: "text-xs" },
    md: { container: "w-28 h-28", text: "text-3xl", label: "text-sm" },
    lg: { container: "w-36 h-36", text: "text-4xl", label: "text-base" },
  }

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 10) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className={cn("relative", sizeClasses[size].container)}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-secondary"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className={getScoreColor(score)}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={cn("font-bold", sizeClasses[size].text, getScoreColor(score))}
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-xs text-muted-foreground">/10</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "mt-3 px-4 py-2 rounded-lg bg-gradient-to-b",
          getScoreGradient(score)
        )}
      >
        <p className={cn("font-medium text-foreground text-center", sizeClasses[size].label)}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground text-center mt-1">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  )
}
