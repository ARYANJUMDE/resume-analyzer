import { NextRequest, NextResponse } from "next/server"

// In-memory storage (you can replace this with a database later)
const feedbacks: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { rating, helpfulAreas, feedback, timestamp } = body
    
    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating. Must be between 1 and 5." },
        { status: 400 }
      )
    }
    
    // Create feedback object
    const feedbackData = {
      id: Date.now(),
      rating,
      helpfulAreas: helpfulAreas || [],
      feedback: feedback || "",
      timestamp: timestamp || new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
    }
    
    // Store in memory
    feedbacks.push(feedbackData)
    
    // Log to console for now
    console.log("[Feedback Received]", feedbackData)
    
    // TODO: Send email notification
    // await sendEmailNotification(feedbackData)
    
    // TODO: Save to database
    // await saveFeedbackToDB(feedbackData)
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Thank you for your feedback!",
        id: feedbackData.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve all feedbacks (admin only in production)
export async function GET(request: NextRequest) {
  try {
    // In production, add authentication check here
    const stats = {
      totalFeedbacks: feedbacks.length,
      averageRating: feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(2)
        : 0,
      ratingDistribution: {
        1: feedbacks.filter(f => f.rating === 1).length,
        2: feedbacks.filter(f => f.rating === 2).length,
        3: feedbacks.filter(f => f.rating === 3).length,
        4: feedbacks.filter(f => f.rating === 4).length,
        5: feedbacks.filter(f => f.rating === 5).length,
      },
      mostHelpfulAreas: getMostHelpfulAreas(feedbacks),
      recentFeedbacks: feedbacks.slice(-10).reverse(),
    }
    
    return NextResponse.json(stats, { status: 200 })
  } catch (error) {
    console.error("Failed to retrieve feedbacks:", error)
    return NextResponse.json(
      { error: "Failed to retrieve feedbacks" },
      { status: 500 }
    )
  }
}

function getMostHelpfulAreas(feedbacks: any[]) {
  const areaCounts: Record<string, number> = {}
  
  feedbacks.forEach(feedback => {
    feedback.helpfulAreas.forEach((area: string) => {
      areaCounts[area] = (areaCounts[area] || 0) + 1
    })
  })
  
  return Object.entries(areaCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
}
