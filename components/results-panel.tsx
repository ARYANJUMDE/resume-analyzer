"use client"

import { motion } from "framer-motion"
import { ScoreDisplay } from "./score-display"
import { AnalysisSection } from "./analysis-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileCheck } from "lucide-react"

export interface AnalysisResult {
  overallScore: number
  basicScore: number
  atsScore: number
  strengths: string[]
  weaknesses: string[]
  improvements: string[]
  quickTips: string[]
  recommendedCourses: string[]
  missingKeywords: string[]
  detectedSkills: string[]
  summary: string
}

interface ResultsPanelProps {
  results: AnalysisResult
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 9) return "Excellent"
    if (score >= 8) return "Very Good"
    if (score >= 7) return "Good"
    if (score >= 6) return "Above Average"
    if (score >= 5) return "Average"
    if (score >= 4) return "Below Average"
    return "Needs Work"
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/90 leading-relaxed">{results.summary}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scores Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6 flex justify-center">
            <ScoreDisplay
              score={results.overallScore}
              label={getScoreLabel(results.overallScore)}
              description="Overall Score"
              size="lg"
            />
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6 flex justify-center">
            <ScoreDisplay
              score={results.basicScore}
              label="Content Score"
              description="Key sections present"
              size="md"
            />
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6 flex justify-center">
            <ScoreDisplay
              score={results.atsScore}
              label="ATS Score"
              description="Applicant Tracking System"
              size="md"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Detected Skills */}
      {results.detectedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FileCheck className="w-4 h-4 text-primary" />
                </div>
                Detected Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.detectedSkills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.03 }}
                  >
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisSection
          title="Strengths"
          items={results.strengths}
          type="strengths"
          delay={0.4}
        />
        <AnalysisSection
          title="Areas to Improve"
          items={results.weaknesses}
          type="weaknesses"
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisSection
          title="Specific Improvements"
          items={results.improvements}
          type="improvements"
          delay={0.6}
        />
        <AnalysisSection
          title="Quick Tips"
          items={results.quickTips}
          type="tips"
          delay={0.7}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisSection
          title="Recommended Courses"
          items={results.recommendedCourses}
          type="courses"
          delay={0.8}
        />
        <AnalysisSection
          title="Missing Keywords"
          items={results.missingKeywords}
          type="keywords"
          delay={0.9}
        />
      </div>
    </motion.div>
  )
}
