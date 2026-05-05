"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, TrendingUp, Lightbulb, BookOpen, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisSectionProps {
  title: string
  items: string[]
  type: "strengths" | "weaknesses" | "improvements" | "tips" | "courses" | "keywords"
  delay?: number
}

const iconMap = {
  strengths: CheckCircle2,
  weaknesses: AlertCircle,
  improvements: TrendingUp,
  tips: Lightbulb,
  courses: BookOpen,
  keywords: Target,
}

const colorMap = {
  strengths: "text-success bg-success/10 border-success/20",
  weaknesses: "text-destructive bg-destructive/10 border-destructive/20",
  improvements: "text-primary bg-primary/10 border-primary/20",
  tips: "text-warning bg-warning/10 border-warning/20",
  courses: "text-accent bg-accent/10 border-accent/20",
  keywords: "text-chart-3 bg-chart-3/10 border-chart-3/20",
}

const titleMap = {
  strengths: "Strengths",
  weaknesses: "Areas to Improve",
  improvements: "Specific Improvements",
  tips: "Quick Tips",
  courses: "Recommended Courses",
  keywords: "Missing Keywords",
}

export function AnalysisSection({ title, items, type, delay = 0 }: AnalysisSectionProps) {
  const Icon = iconMap[type]
  const colors = colorMap[type]

  if (items.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={cn("p-1.5 rounded-lg", colors.split(" ").slice(1).join(" "))}>
              <Icon className={cn("w-4 h-4", colors.split(" ")[0])} />
            </div>
            {title || titleMap[type]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.1 + index * 0.05 }}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border",
                  colors.split(" ").slice(1).join(" ")
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0", colors.split(" ")[0].replace("text-", "bg-"))} />
                <span className="text-sm text-foreground/90">{item}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}
