"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Star, Send, CheckCircle2, ThumbsUp, Lightbulb, Target, BookOpen } from "lucide-react"

const helpfulAreas = [
  { id: "score", label: "Score Analysis", icon: Target },
  { id: "strengths", label: "Strengths Identification", icon: ThumbsUp },
  { id: "improvements", label: "Improvement Suggestions", icon: Lightbulb },
  { id: "courses", label: "Course Recommendations", icon: BookOpen },
  { id: "ats", label: "ATS Optimization Tips", icon: CheckCircle2 },
]

export function ReviewFeedback() {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [feedback, setFeedback] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleArea = (areaId: string) => {
    setSelectedAreas((prev) =>
      prev.includes(areaId)
        ? prev.filter((id) => id !== areaId)
        : [...prev, areaId]
    )
  }

  const handleSubmit = async () => {
    if (rating === 0) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          helpfulAreas: selectedAreas,
          feedback,
          timestamp: new Date().toISOString(),
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }
      
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      setIsSubmitting(false)
      alert("Failed to submit feedback. Please try again.")
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-border/50">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center"
              >
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Thank You for Your Feedback!</h3>
                <p className="text-muted-foreground mt-2">
                  Your review helps us improve the AI Resume Analyzer for everyone.
                </p>
              </div>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            Share Your Experience
          </CardTitle>
          <CardDescription>
            Did this AI Resume Analyzer help you? Let us know what worked and what could be better.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              How would you rate this analysis?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                {rating === 1 && "We're sorry to hear that. Please tell us how we can improve."}
                {rating === 2 && "Thanks for the feedback. We'd love to know what could be better."}
                {rating === 3 && "Thanks! What aspects were most and least helpful?"}
                {rating === 4 && "Great! We're glad it was helpful."}
                {rating === 5 && "Awesome! We're thrilled you found it valuable!"}
              </motion.p>
            )}
          </div>

          {/* Helpful Areas */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Which aspects helped you the most? (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {helpfulAreas.map((area) => {
                const Icon = area.icon
                const isSelected = selectedAreas.includes(area.id)
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => toggleArea(area.id)}
                    className="focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
                  >
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all px-3 py-1.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-transparent border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5" />
                      {area.label}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Additional comments (optional)
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience... What did you find most useful? What could we improve?"
              className="min-h-[100px] bg-input/50 border-border/50 resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
              />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
