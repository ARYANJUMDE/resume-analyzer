import { generateText } from "ai"
import { NextRequest, NextResponse } from "next/server"
import mammoth from "mammoth"

// Force rebuild

// Enhanced skill detection patterns
const skillPatterns = {
  programming: /\b(python|java|javascript|typescript|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|r\b|matlab|perl|bash|shell|sql|nosql|html|css|sass|less)\b/gi,
  frameworks: /\b(react|angular|vue|next\.?js|node\.?js|express|django|flask|spring|rails|laravel|asp\.net|fastapi|svelte|nuxt|gatsby|remix)\b/gi,
  databases: /\b(mysql|postgresql|mongodb|redis|elasticsearch|dynamodb|cassandra|oracle|sql server|sqlite|firebase|supabase|prisma)\b/gi,
  cloud: /\b(aws|azure|gcp|google cloud|heroku|vercel|netlify|docker|kubernetes|terraform|jenkins|ci\/cd|github actions|gitlab)\b/gi,
  data: /\b(machine learning|deep learning|ai|artificial intelligence|data science|data analysis|pandas|numpy|tensorflow|pytorch|scikit-learn|keras|nlp|computer vision|big data|hadoop|spark|tableau|power bi)\b/gi,
  tools: /\b(git|jira|confluence|slack|figma|sketch|adobe|photoshop|illustrator|vs code|intellij|postman|swagger|graphql|rest api)\b/gi,
  soft: /\b(leadership|communication|teamwork|problem.solving|critical thinking|project management|agile|scrum|time management|presentation|negotiation|mentoring)\b/gi,
}

// ATS-friendly keywords by industry
const atsKeywords = {
  tech: ["developed", "implemented", "architected", "optimized", "deployed", "automated", "integrated", "scaled", "debugged", "maintained"],
  general: ["achieved", "managed", "led", "improved", "increased", "reduced", "delivered", "collaborated", "analyzed", "created"],
  metrics: ["revenue", "cost", "efficiency", "performance", "growth", "users", "customers", "team", "projects", "budget"],
}

// Course recommendations based on skill gaps
const courseRecommendations: Record<string, string[]> = {
  programming: [
    "Complete Python Bootcamp (Udemy) - Master Python programming fundamentals",
    "JavaScript: Understanding the Weird Parts - Deep dive into JS",
    "CS50: Introduction to Computer Science (Harvard/edX) - Strong CS foundation",
  ],
  frameworks: [
    "React - The Complete Guide (Udemy) - Modern React with hooks",
    "Node.js, Express, MongoDB Bootcamp - Full-stack development",
    "Next.js & React (Academind) - Production-ready applications",
  ],
  databases: [
    "SQL for Data Science (Coursera) - Essential database skills",
    "MongoDB University - NoSQL database fundamentals",
    "Database Design (freeCodeCamp) - Database architecture",
  ],
  cloud: [
    "AWS Certified Solutions Architect - Cloud infrastructure",
    "Docker and Kubernetes: The Complete Guide - Container orchestration",
    "Terraform Associate Certification - Infrastructure as Code",
  ],
  data: [
    "Machine Learning by Andrew Ng (Coursera) - ML fundamentals",
    "Deep Learning Specialization (DeepLearning.AI) - Neural networks",
    "Data Science Professional Certificate (IBM) - Comprehensive data skills",
  ],
  soft: [
    "Learning How to Learn (Coursera) - Meta-learning skills",
    "Project Management Professional (PMP) Prep - Project leadership",
    "Technical Writing (Google) - Documentation skills",
  ],
}

// Extract text from PDF using regex-based extraction (serverless-compatible)
function extractTextFromPDF(buffer: Buffer): string {
  const pdfString = buffer.toString("binary")
  const textChunks: string[] = []
  
  // Method 1: Extract text between BT (Begin Text) and ET (End Text) markers
  const btEtPattern = /BT[\s\S]*?ET/g
  const btEtMatches = pdfString.match(btEtPattern) || []
  
  for (const match of btEtMatches) {
    // Extract text from Tj and TJ operators
    const tjPattern = /\(([^)]*)\)\s*Tj/g
    let tjMatch
    while ((tjMatch = tjPattern.exec(match)) !== null) {
      if (tjMatch[1]) {
        textChunks.push(decodeEscapedText(tjMatch[1]))
      }
    }
    
    // Extract text from TJ arrays
    const tjArrayPattern = /\[(.*?)\]\s*TJ/g
    let tjArrayMatch
    while ((tjArrayMatch = tjArrayPattern.exec(match)) !== null) {
      const arrayContent = tjArrayMatch[1]
      const stringPattern = /\(([^)]*)\)/g
      let stringMatch
      while ((stringMatch = stringPattern.exec(arrayContent)) !== null) {
        if (stringMatch[1]) {
          textChunks.push(decodeEscapedText(stringMatch[1]))
        }
      }
    }
  }
  
  // Method 2: Extract from stream content
  const streamPattern = /stream\s*([\s\S]*?)\s*endstream/g
  let streamMatch
  while ((streamMatch = streamPattern.exec(pdfString)) !== null) {
    const streamContent = streamMatch[1]
    // Look for readable ASCII text
    const readableText = streamContent.replace(/[^\x20-\x7E\n\r\t]/g, " ")
    const words = readableText.match(/[A-Za-z]{2,}/g) || []
    if (words.length > 5) {
      textChunks.push(words.join(" "))
    }
  }
  
  // Method 3: Extract any readable sequences
  const readablePattern = /[A-Za-z][A-Za-z0-9\s.,;:!?'"@#$%&*()\-+=]{10,}/g
  const readableMatches = pdfString.match(readablePattern) || []
  textChunks.push(...readableMatches.filter(m => m.length > 15))
  
  // Clean and join extracted text
  let text = textChunks.join(" ")
  text = text
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "")
    .replace(/\\t/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  
  return text
}

// Decode escaped characters in PDF text
function decodeEscapedText(text: string): string {
  return text
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\")
    .replace(/\\(\d{3})/g, (_, octal) => String.fromCharCode(parseInt(octal, 8)))
}

async function extractTextFromFile(buffer: Buffer, filename: string): Promise<string> {
  const lowerFilename = filename.toLowerCase()
  
  // Handle PDF files
  if (lowerFilename.endsWith('.pdf')) {
    try {
      const text = extractTextFromPDF(buffer)
      if (text && text.length > 50) {
        return text
      }
      
      // Fallback: Try to extract any readable content
      const rawText = buffer.toString("binary")
      const readableText = rawText.replace(/[^\x20-\x7E\n\r\t]/g, " ")
      const words = readableText.match(/[A-Za-z]{3,}/g) || []
      
      if (words.length > 20) {
        return words.join(" ")
      }
      
      throw new Error("Could not extract readable text from PDF. The PDF might be image-based or encrypted. Please try uploading a DOCX or TXT version.")
    } catch (error) {
      if (error instanceof Error && error.message.includes("Could not extract")) {
        throw error
      }
      throw new Error("Failed to parse PDF file. Please try uploading a DOCX or TXT file instead.")
    }
  }
  
  // Handle DOCX files
  if (lowerFilename.endsWith('.docx')) {
    try {
      const result = await mammoth.extractRawText({ buffer })
      return result.value || ""
    } catch (error) {
      console.error("DOCX parsing error:", error)
      throw new Error("Failed to parse DOCX file. Please ensure the file is a valid Word document.")
    }
  }
  
  // Handle TXT files
  if (lowerFilename.endsWith('.txt')) {
    return buffer.toString("utf-8")
  }
  
  // Try to parse as text for unknown formats
  const text = buffer.toString("utf-8")
  
  // Check if it's readable text
  const readableChars = text.replace(/[^\x20-\x7E\n\r\t]/g, "").length
  if (readableChars / text.length > 0.8) {
    return text
  }
  
  throw new Error("Unsupported file format. Please upload a PDF, DOCX, or TXT file.")
}

function detectSkills(text: string): string[] {
  const detectedSkills = new Set<string>()
  const lowerText = text.toLowerCase()
  
  for (const [, pattern] of Object.entries(skillPatterns)) {
    const matches = lowerText.match(pattern)
    if (matches) {
      matches.forEach(skill => {
        // Normalize skill names
        const normalized = skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()
        detectedSkills.add(normalized)
      })
    }
  }
  
  return Array.from(detectedSkills).slice(0, 25)
}

function calculateBasicScore(text: string): { score: number; tips: string[] } {
  const lowerText = text.toLowerCase()
  let score = 0
  const tips: string[] = []

  const checks = {
    email: { pattern: /\b[\w.-]+@[\w.-]+\.\w+\b/, weight: 1, tip: "Add a professional email address" },
    phone: { pattern: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/, weight: 1, tip: "Include a phone number" },
    linkedin: { pattern: /linkedin\.com|linkedin/i, weight: 0.5, tip: "Add your LinkedIn profile URL" },
    github: { pattern: /github\.com|github/i, weight: 0.5, tip: "Include your GitHub profile for tech roles" },
    education: { pattern: /\b(education|degree|university|college|bachelor|master|phd|diploma)\b/i, weight: 1.5, tip: "Add education details with degree and institution" },
    experience: { pattern: /\b(experience|work|employment|job|position|role)\b/i, weight: 1.5, tip: "Include detailed work experience section" },
    skills: { pattern: /\b(skills?|technologies|proficien|expert)\b/i, weight: 1, tip: "Create a clear skills section" },
    projects: { pattern: /\b(projects?|portfolio)\b/i, weight: 1, tip: "Add projects with measurable outcomes" },
    summary: { pattern: /\b(summary|objective|about|profile)\b/i, weight: 0.5, tip: "Include a professional summary at the top" },
    certifications: { pattern: /\b(certifi|license|credential)\b/i, weight: 0.5, tip: "Add relevant certifications" },
  }

  for (const [, check] of Object.entries(checks)) {
    if (check.pattern.test(lowerText)) {
      score += check.weight
    } else {
      tips.push(check.tip)
    }
  }

  // Check for action verbs (ATS optimization)
  const actionVerbs = [...atsKeywords.tech, ...atsKeywords.general]
  const actionVerbCount = actionVerbs.filter(verb => lowerText.includes(verb)).length
  score += Math.min(actionVerbCount * 0.1, 1)
  
  if (actionVerbCount < 5) {
    tips.push("Use more action verbs like 'developed', 'achieved', 'led', 'improved'")
  }

  // Check for metrics/numbers
  const hasMetrics = /\d+%|\$\d+|\d+ (users?|customers?|team|projects?|years?)/.test(text)
  if (hasMetrics) {
    score += 0.5
  } else {
    tips.push("Add quantifiable achievements (e.g., 'increased sales by 25%', 'managed team of 5')")
  }

  return { score: Math.min(score, 10), tips: tips.slice(0, 6) }
}

function calculateATSScore(text: string): number {
  const lowerText = text.toLowerCase()
  let score = 5 // Base score
  
  // Check for proper formatting indicators
  const hasProperSections = /\b(experience|education|skills)\b/i.test(text)
  if (hasProperSections) score += 1
  
  // Check for action verbs
  const allAtsWords = [...atsKeywords.tech, ...atsKeywords.general, ...atsKeywords.metrics]
  const atsWordCount = allAtsWords.filter(word => lowerText.includes(word)).length
  score += Math.min(atsWordCount * 0.15, 2)
  
  // Check for clean formatting (no special characters that might confuse ATS)
  const specialCharCount = (text.match(/[★●◆▪︎►■]/g) || []).length
  if (specialCharCount < 5) score += 0.5
  
  // Check for chronological format indicators
  const hasDateFormat = /\b(20\d{2}|19\d{2})|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/gi.test(text)
  if (hasDateFormat) score += 1
  
  // Check for contact info
  const hasContactInfo = /\b[\w.-]+@[\w.-]+\.\w+\b/.test(text) && /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)
  if (hasContactInfo) score += 0.5
  
  return Math.min(Math.max(score, 0), 10)
}

function getMissingSkills(text: string, jobDescription: string): string[] {
  const missing: string[] = []
  const lowerText = text.toLowerCase()
  const lowerJob = jobDescription.toLowerCase()
  
  if (!jobDescription) {
    // Generic missing skills check
    const commonTechSkills = ["python", "javascript", "sql", "git", "cloud", "api", "agile"]
    commonTechSkills.forEach(skill => {
      if (!lowerText.includes(skill)) {
        missing.push(skill.charAt(0).toUpperCase() + skill.slice(1))
      }
    })
    return missing.slice(0, 5)
  }
  
  // Extract keywords from job description
  const jobKeywords = lowerJob.match(/\b[a-z]{3,}\b/g) || []
  const uniqueJobKeywords = [...new Set(jobKeywords)]
  
  // Find keywords in job description that aren't in resume
  uniqueJobKeywords.forEach(keyword => {
    if (!lowerText.includes(keyword) && keyword.length > 3) {
      // Check if it's a meaningful keyword
      const isSkillWord = Object.values(skillPatterns).some(pattern => pattern.test(keyword))
      const isActionWord = [...atsKeywords.tech, ...atsKeywords.general].includes(keyword)
      if (isSkillWord || isActionWord) {
        missing.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
      }
    }
  })
  
  return missing.slice(0, 8)
}

function getRecommendedCourses(detectedSkills: string[], text: string): string[] {
  const lowerText = text.toLowerCase()
  const recommendations: string[] = []
  
  // Identify weak areas
  const skillAreas = {
    programming: skillPatterns.programming.test(lowerText),
    frameworks: skillPatterns.frameworks.test(lowerText),
    databases: skillPatterns.databases.test(lowerText),
    cloud: skillPatterns.cloud.test(lowerText),
    data: skillPatterns.data.test(lowerText),
    soft: skillPatterns.soft.test(lowerText),
  }
  
  // Recommend courses for areas with fewer skills
  for (const [area, hasSkills] of Object.entries(skillAreas)) {
    if (!hasSkills && courseRecommendations[area]) {
      recommendations.push(courseRecommendations[area][0])
    }
  }
  
  // If they have skills, recommend advanced courses
  if (recommendations.length < 3) {
    if (skillAreas.programming && !skillAreas.cloud) {
      recommendations.push(courseRecommendations.cloud[0])
    }
    if (skillAreas.frameworks && !skillAreas.data) {
      recommendations.push(courseRecommendations.data[0])
    }
  }
  
  return recommendations.slice(0, 5)
}

// Generate a unique hash for the resume content to ensure different analyses
function generateResumeHash(text: string): string {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const jobDescription = (formData.get("jobDescription") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    let text: string
    try {
      text = await extractTextFromFile(buffer, file.name)
    } catch (extractError) {
      return NextResponse.json({ 
        error: extractError instanceof Error ? extractError.message : "Failed to extract text from file"
      }, { status: 400 })
    }

    // Clean up the extracted text
    const cleanedText = text
      .replace(/\s+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim()

    if (!cleanedText || cleanedText.length < 100) {
      return NextResponse.json({ 
        error: "Could not extract enough text from the file. The resume appears to be too short or the content could not be read properly. Please ensure your file contains at least 100 characters of content." 
      }, { status: 400 })
    }

    // Calculate scores
    const { score: basicScore, tips: quickTips } = calculateBasicScore(cleanedText)
    const atsScore = calculateATSScore(cleanedText)
    const detectedSkills = detectSkills(cleanedText)
    const missingKeywords = getMissingSkills(cleanedText, jobDescription)
    const recommendedCourses = getRecommendedCourses(detectedSkills, cleanedText)
    
    // Generate unique identifier for this resume to ensure varied responses
    const resumeHash = generateResumeHash(cleanedText)
    const timestamp = Date.now()

    // Generate AI analysis using Groq via AI Gateway
    const prompt = `You are an expert technical resume reviewer and career coach with 15+ years of experience in tech hiring at top companies like Google, Meta, and Amazon. Your task is to provide a thorough, personalized analysis of this specific resume.

IMPORTANT: This is a unique resume (ID: ${resumeHash}-${timestamp}). Provide analysis specific to THIS candidate's actual experience, skills, and background. Do NOT give generic advice.

=== RESUME CONTENT ===
${cleanedText.slice(0, 10000)}
=== END RESUME ===

${jobDescription ? `=== TARGET JOB DESCRIPTION ===\n${jobDescription.slice(0, 3000)}\n=== END JOB DESCRIPTION ===` : "No specific job description provided - give general technical career feedback."}

=== DETECTED SKILLS FROM RESUME ===
${detectedSkills.join(", ") || "No specific technical skills detected"}
=== END SKILLS ===

ANALYSIS INSTRUCTIONS:
1. Carefully read the ENTIRE resume content above
2. Identify the candidate's specific:
   - Years of experience and career level
   - Technical stack and expertise areas
   - Industry background
   - Notable achievements or projects
   - Education and certifications
3. Provide feedback that references SPECIFIC items from their resume
4. Be constructive but honest - point out real weaknesses you observe
5. Tailor advice to their career level (junior vs senior have different needs)

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "overallScore": <number 1-10 based on resume quality>,
  "strengths": [
    "<specific strength referencing actual resume content>",
    "<another specific strength>",
    "<third specific strength>"
  ],
  "weaknesses": [
    "<specific weakness you observed in this resume>",
    "<another specific area needing improvement>",
    "<third weakness with actionable context>"
  ],
  "improvements": [
    "<specific, actionable improvement for THIS candidate>",
    "<another specific recommendation>",
    "<third improvement suggestion>"
  ],
  "summary": "<2-3 sentences summarizing this specific candidate's profile, their career level, main strengths, and the most important thing they should focus on to improve their resume>"
}

Remember: Reference ACTUAL content from the resume in your analysis. Do not give generic advice that could apply to anyone.`

    try {
      const { text: aiResponse } = await generateText({
        model: "groq/llama-3.3-70b-versatile",
        prompt,
        temperature: 0.7, // Increased for more varied responses
        maxTokens: 2000,
      })

      // Parse AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Invalid AI response format")
      }

      const aiAnalysis = JSON.parse(jsonMatch[0])
      
      // Validate AI response has required fields
      if (!aiAnalysis.strengths || !aiAnalysis.weaknesses || !aiAnalysis.improvements) {
        throw new Error("Incomplete AI analysis")
      }
      
      // Calculate overall score (weighted average of AI score and basic scores)
      const aiScore = typeof aiAnalysis.overallScore === 'number' ? aiAnalysis.overallScore : 5
      const overallScore = Math.round(
        (aiScore * 0.5 + basicScore * 0.3 + atsScore * 0.2) * 10
      ) / 10

      return NextResponse.json({
        overallScore: Math.min(Math.max(overallScore, 1), 10),
        basicScore: Math.round(basicScore * 10) / 10,
        atsScore: Math.round(atsScore * 10) / 10,
        strengths: Array.isArray(aiAnalysis.strengths) ? aiAnalysis.strengths.slice(0, 5) : [],
        weaknesses: Array.isArray(aiAnalysis.weaknesses) ? aiAnalysis.weaknesses.slice(0, 5) : [],
        improvements: Array.isArray(aiAnalysis.improvements) ? aiAnalysis.improvements.slice(0, 5) : [],
        quickTips,
        recommendedCourses,
        missingKeywords,
        detectedSkills,
        summary: aiAnalysis.summary || "Resume analysis complete.",
        // Include extracted text length for debugging
        textLength: cleanedText.length,
      })
    } catch (aiError) {
      console.error("AI analysis error:", aiError)
      
      // Fallback to rule-based analysis if AI fails
      const strengths: string[] = []
      const weaknesses: string[] = []
      const improvements: string[] = []
      
      const lowerText = cleanedText.toLowerCase()
      
      if (detectedSkills.length >= 10) {
        strengths.push(`Strong technical skill diversity with ${detectedSkills.length} skills identified including ${detectedSkills.slice(0, 3).join(", ")}`)
      } else if (detectedSkills.length >= 5) {
        strengths.push(`Good foundational skills present: ${detectedSkills.slice(0, 4).join(", ")}`)
      } else if (detectedSkills.length > 0) {
        strengths.push(`Technical skills detected: ${detectedSkills.join(", ")}`)
      }
      
      if (skillPatterns.programming.test(lowerText)) {
        const progMatches = lowerText.match(skillPatterns.programming)
        if (progMatches) {
          strengths.push(`Programming expertise: ${[...new Set(progMatches)].slice(0, 4).join(", ")}`)
        }
      } else {
        weaknesses.push("No programming languages detected - add technical skills if applicable to your role")
      }
      
      if (skillPatterns.frameworks.test(lowerText)) {
        strengths.push("Modern frameworks and technologies mentioned")
      }
      
      if (skillPatterns.cloud.test(lowerText)) {
        strengths.push("Cloud/DevOps experience demonstrated")
      } else {
        improvements.push("Consider adding cloud platform experience (AWS, Azure, GCP) as it's increasingly required")
      }
      
      const metricsPattern = /(\d+%|\$[\d,]+|\d+\s*(users?|customers?|projects?|years?|months?|team|people|revenue|sales))/gi
      const metricsMatches = cleanedText.match(metricsPattern)
      if (metricsMatches && metricsMatches.length >= 3) {
        strengths.push(`Good use of quantifiable metrics (${metricsMatches.length} found)`)
      } else {
        weaknesses.push("Limited quantifiable achievements - add metrics to showcase impact")
        improvements.push("Transform vague statements into measurable outcomes (e.g., 'Increased efficiency by 30%')")
      }
      
      const actionVerbs = [...atsKeywords.tech, ...atsKeywords.general]
      const actionVerbCount = actionVerbs.filter(verb => lowerText.includes(verb)).length
      if (actionVerbCount >= 8) {
        strengths.push("Strong use of action verbs for impact")
      } else {
        weaknesses.push("Consider using more action verbs (developed, achieved, led, optimized)")
      }
      
      if (strengths.length === 0) {
        strengths.push("Resume content successfully extracted and analyzed")
      }
      if (weaknesses.length === 0 && quickTips.length > 0) {
        weaknesses.push(...quickTips.slice(0, 2))
      }
      if (improvements.length === 0 && quickTips.length > 2) {
        improvements.push(...quickTips.slice(2, 4))
      }
      
      const overallScore = Math.round(((basicScore * 0.6 + atsScore * 0.4)) * 10) / 10
      
      let summary = ""
      if (overallScore >= 7) {
        summary = `Your resume demonstrates strong qualifications with ${detectedSkills.length} skills identified. Focus on adding more quantifiable achievements and ensuring ATS optimization for best results.`
      } else if (overallScore >= 5) {
        summary = `Your resume has a solid foundation with skills in ${detectedSkills.slice(0, 2).join(" and ") || "various areas"}. Consider adding more specific achievements, technical skills, and ensuring all key sections are present.`
      } else {
        summary = "Your resume needs significant improvements to be competitive. Focus on adding key sections (experience, skills, education), quantifiable achievements, and relevant keywords."
      }

      return NextResponse.json({
        overallScore: Math.min(Math.max(overallScore, 1), 10),
        basicScore: Math.round(basicScore * 10) / 10,
        atsScore: Math.round(atsScore * 10) / 10,
        strengths: strengths.slice(0, 5),
        weaknesses: weaknesses.slice(0, 5),
        improvements: improvements.slice(0, 5),
        quickTips,
        recommendedCourses,
        missingKeywords,
        detectedSkills,
        summary,
        textLength: cleanedText.length,
      })
    }
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try a different file format or ensure the file is not corrupted." },
      { status: 500 }
    )
  }
}
