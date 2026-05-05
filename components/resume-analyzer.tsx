"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ResumeUpload } from "./resume-upload"
import { ResultsPanel, AnalysisResult } from "./results-panel"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, ArrowRight, RefreshCw, FileText, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ResumeAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setResults(null)
  }

  const handleClear = () => {
    setSelectedFile(null)
    setResults(null)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("jobDescription", jobDescription)

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to analyze resume")
      }

      const data = await response.json()
      setResults(data)
      
      toast({
        title: "Analysis Complete",
        description: `Your resume scored ${data.overallScore}/10`,
      })
    } catch (error) {
      console.error("Analysis error:", error)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setJobDescription("")
    setResults(null)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <AnimatePresence mode="wait">
        {!results ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Upload Card */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Upload Your Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume in PDF, DOCX, or TXT format for AI-powered analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResumeUpload
                  onFileSelect={handleFileSelect}
                  isLoading={isAnalyzing}
                  selectedFile={selectedFile}
                  onClear={handleClear}
                />
              </CardContent>
            </Card>

            {/* Job Description Card */}
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" />
                  Target Job Description
                  <span className="text-xs font-normal text-muted-foreground ml-2">(Optional)</span>
                </CardTitle>
                <CardDescription>
                  Paste a job description to get tailored feedback and keyword analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here to get more specific recommendations..."
                  className="min-h-[150px] bg-input/50 border-border/50 resize-none"
                />
              </CardContent>
            </Card>

            {/* Analyze Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!selectedFile || isAnalyzing}
                className="px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze Resume
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4"
            >
              {[
                { title: "AI-Powered Analysis", desc: "Get detailed feedback from advanced AI" },
                { title: "ATS Optimization", desc: "Improve your score with ATS systems" },
                { title: "Course Recommendations", desc: "Personalized learning suggestions" },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl bg-secondary/30 border border-border/50 text-center"
                >
                  <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Reset Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
                <p className="text-muted-foreground">
                  {selectedFile?.name}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-border/50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Analyze Another
              </Button>
            </div>

            <ResultsPanel results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
