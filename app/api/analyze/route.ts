import { NextRequest, NextResponse } from "next/server"

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

function extractTextFromFile(buffer: Buffer, filename: string): string {
  // For simplicity, we'll extract text directly from the buffer
  // This works for TXT files and provides basic extraction for others
  const text = buffer.toString("utf-8")
  
  // Clean up the text - remove non-printable characters but keep structure
  const cleaned = text
    .replace(/[^\x20-\x7E\n\r\t\u00A0-\u00FF\u0100-\u017F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  
  return cleaned
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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const jobDescription = (formData.get("jobDescription") as string) || ""

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const text = extractTextFromFile(buffer, file.name)

    if (!text.trim() || text.length < 50) {
      return NextResponse.json({ 
        error: "Could not extract enough text from the file. Please upload a plain text (.txt) file with your resume content." 
      }, { status: 400 })
    }

    // Calculate scores
    const { score: basicScore, tips: quickTips } = calculateBasicScore(text)
    const atsScore = calculateATSScore(text)
    const detectedSkills = detectSkills(text)
    const missingKeywords = getMissingSkills(text, jobDescription)
    const recommendedCourses = getRecommendedCourses(detectedSkills, text)

    // Generate AI analysis
    const prompt = `You are an expert resume reviewer and career coach. Analyze this resume thoroughly.

Resume text:
${text.slice(0, 8000)}

${jobDescription ? `Target Job Description:\n${jobDescription.slice(0, 2000)}` : "No specific job description provided - give general feedback."}

Provide your analysis in the following JSON format (no markdown, just valid JSON):
{
  "overallScore": <number 1-10>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "improvements": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"],
  "summary": "<2-3 sentence overall assessment>"
}

Be specific, actionable, and constructive. Focus on:
1. Content quality and relevance
2. Structure and formatting
3. Achievement presentation (metrics, impact)
4. Skill alignment with market demands
5. ATS optimization
${jobDescription ? "6. Alignment with the provided job description" : ""}`

    // Generate comprehensive rule-based analysis
    const strengths: string[] = []
    const weaknesses: string[] = []
    const improvements: string[] = []
    
    // Analyze detected skills
    if (detectedSkills.length >= 10) {
      strengths.push("Strong technical skill diversity with " + detectedSkills.length + " skills identified")
    } else if (detectedSkills.length >= 5) {
      strengths.push("Good foundational skills present")
    }
    
    // Check for specific skill categories
    const lowerText = text.toLowerCase()
    if (skillPatterns.programming.test(lowerText)) {
      strengths.push("Programming languages clearly listed")
    } else {
      weaknesses.push("No programming languages detected - add technical skills if applicable")
    }
    
    if (skillPatterns.frameworks.test(lowerText)) {
      strengths.push("Modern frameworks and technologies mentioned")
    }
    
    if (skillPatterns.cloud.test(lowerText)) {
      strengths.push("Cloud/DevOps experience demonstrated")
    } else {
      improvements.push("Consider adding cloud platform experience (AWS, Azure, GCP)")
    }
    
    // Check for quantifiable achievements
    const metricsPattern = /(\d+%|\$[\d,]+|\d+\s*(users?|customers?|projects?|years?|months?|team|people|revenue|sales))/gi
    const metricsMatches = text.match(metricsPattern)
    if (metricsMatches && metricsMatches.length >= 3) {
      strengths.push("Good use of quantifiable metrics (" + metricsMatches.length + " found)")
    } else {
      weaknesses.push("Limited quantifiable achievements - add metrics to showcase impact")
      improvements.push("Transform vague statements into measurable outcomes (e.g., 'Increased efficiency by 30%')")
    }
    
    // Check for action verbs
    const actionVerbs = [...atsKeywords.tech, ...atsKeywords.general]
    const actionVerbCount = actionVerbs.filter(verb => lowerText.includes(verb)).length
    if (actionVerbCount >= 8) {
      strengths.push("Strong use of action verbs for impact")
    } else {
      weaknesses.push("Consider using more action verbs (developed, achieved, led, optimized)")
    }
    
    // Resume structure analysis
    const hasEducation = /education|degree|university|college|bachelor|master/i.test(text)
    const hasExperience = /experience|work|employment|position/i.test(text)
    const hasProjects = /projects?|portfolio/i.test(text)
    
    if (hasEducation && hasExperience) {
      strengths.push("Clear resume structure with key sections")
    }
    if (!hasProjects) {
      improvements.push("Add a projects section to showcase practical applications")
    }
    
    // Job description matching
    if (jobDescription && missingKeywords.length > 0) {
      weaknesses.push("Missing " + missingKeywords.length + " keywords from the job description")
      improvements.push("Incorporate these keywords naturally: " + missingKeywords.slice(0, 3).join(", "))
    }
    
    // Ensure we have enough items
    if (strengths.length === 0) {
      strengths.push("Resume content successfully extracted and analyzed")
    }
    if (weaknesses.length === 0 && quickTips.length > 0) {
      weaknesses.push(...quickTips.slice(0, 2))
    }
    if (improvements.length === 0 && quickTips.length > 2) {
      improvements.push(...quickTips.slice(2, 4))
    }
    
    // Calculate overall score
    const overallScore = Math.round(((basicScore * 0.6 + atsScore * 0.4)) * 10) / 10
    
    // Generate summary
    let summary = ""
    if (overallScore >= 7) {
      summary = "Your resume demonstrates strong qualifications with good structure and relevant skills. Focus on adding more quantifiable achievements and ensuring ATS optimization for best results."
    } else if (overallScore >= 5) {
      summary = "Your resume has a solid foundation but could benefit from improvements. Consider adding more specific achievements, technical skills, and ensuring all key sections are present."
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
    })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json(
      { error: "Failed to analyze resume. Please try a different file." },
      { status: 500 }
    )
  }
}
