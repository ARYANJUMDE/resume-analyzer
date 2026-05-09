import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

interface FeedbackData {
  rating: number
  helpfulAreas: string[]
  feedback: string
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const data: FeedbackData = await request.json()

    // Validate the data
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating provided" },
        { status: 400 }
      )
    }

    // Format the helpful areas for display
    const helpfulAreasMap: Record<string, string> = {
      score: "Score Analysis",
      strengths: "Strengths Identification",
      improvements: "Improvement Suggestions",
      courses: "Course Recommendations",
      ats: "ATS Optimization Tips",
    }

    const formattedAreas = data.helpfulAreas
      .map((area) => helpfulAreasMap[area] || area)
      .join(", ") || "None selected"

    // Generate star rating display
    const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating)

    // Format timestamp
    const submittedAt = new Date(data.timestamp).toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "long",
    })

    // Create email HTML content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Feedback Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
        New Feedback Received
      </h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">
        AI Resume Analyzer
      </p>
    </div>
    
    <div style="background: white; border-radius: 0 0 16px 16px; padding: 32px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <!-- Rating Section -->
      <div style="text-align: center; margin-bottom: 32px;">
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Overall Rating</p>
        <div style="font-size: 32px; color: #f59e0b; letter-spacing: 4px;">
          ${stars}
        </div>
        <p style="color: #111827; font-size: 18px; font-weight: 600; margin: 8px 0 0 0;">
          ${data.rating} out of 5 stars
        </p>
      </div>

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

      <!-- Helpful Areas -->
      <div style="margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
          Most Helpful Features
        </h2>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
          <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.6;">
            ${formattedAreas}
          </p>
        </div>
      </div>

      <!-- Additional Feedback -->
      ${data.feedback ? `
      <div style="margin-bottom: 24px;">
        <h2 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">
          Additional Comments
        </h2>
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; border-left: 4px solid #667eea;">
          <p style="color: #374151; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
            ${data.feedback}
          </p>
        </div>
      </div>
      ` : ""}

      <!-- Divider -->
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

      <!-- Metadata -->
      <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          <strong>Submitted:</strong> ${submittedAt}
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 20px;">
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        This is an automated notification from AI Resume Analyzer
      </p>
    </div>
  </div>
</body>
</html>
`

    // Create plain text version
    const emailText = `
New Feedback Received - AI Resume Analyzer
==========================================

Rating: ${data.rating}/5 ${stars}

Most Helpful Features:
${formattedAreas}

${data.feedback ? `Additional Comments:\n${data.feedback}\n` : ""}
Submitted: ${submittedAt}
`

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: "AI Resume Analyzer <onboarding@resend.dev>",
      to: ["jumdearyan7@gmail.com"],
      subject: `New Feedback: ${data.rating}/5 stars - AI Resume Analyzer`,
      html: emailHtml,
      text: emailText,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send feedback email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
    })
  } catch (error) {
    console.error("Feedback submission error:", error)
    return NextResponse.json(
      { error: "Failed to process feedback" },
      { status: 500 }
    )
  }
}
