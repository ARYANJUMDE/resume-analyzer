# AI Resume Analyzer

An intelligent resume analysis tool powered by AI that provides comprehensive feedback on your resume, including scores, strengths, weaknesses, and personalized course recommendations.

![AI Resume Analyzer](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

### Core Analysis
- **AI-Powered Review** - Uses Groq's LLaMA 3.3 70B model for intelligent resume analysis
- **Multi-Score System** - Overall score, content score, and ATS compatibility score
- **Strengths & Weaknesses** - Detailed breakdown of what works and what needs improvement
- **Actionable Improvements** - Specific suggestions to enhance your resume

### Skill Detection
- **Automatic Skill Extraction** - Detects programming languages, frameworks, databases, cloud tools, and soft skills
- **25+ Skill Categories** - Comprehensive coverage of technical and professional skills

### Job Matching
- **Job Description Comparison** - Paste a job description to see how well your resume matches
- **Missing Keywords** - Identifies important keywords from the job posting that are missing from your resume

### Course Recommendations
- **Personalized Learning Paths** - Recommends courses based on detected skill gaps
- **Platform Links** - Direct links to courses on Coursera, Udemy, LinkedIn Learning, and more

### User Experience
- **Drag & Drop Upload** - Easy file upload supporting PDF, DOCX, and TXT formats
- **Real-time Analysis** - Get results in seconds
- **Dark Theme** - Modern, professional dark interface
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **AI**: Groq LLaMA 3.3 70B via Vercel AI Gateway
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm/yarn
- Groq API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ARYANJUMDE/resume-analyzer.git
cd resume-analyzer
```
2. Install dependencies
   ```bash
   pnpm install
   ```
3.Run the development server:
``` bash
pnpm dev
```

## Usage

1. **Upload Your Resume** - Drag and drop or click to upload a PDF, DOCX, or TXT file
2. **Add Job Description** (Optional) - Paste a job description for targeted feedback
3. **Get Analysis** - Click "Analyze Resume" and wait for AI-powered results
4. **Review Feedback** - Explore your scores, strengths, weaknesses, and recommendations
5. **Take Action** - Follow the suggested improvements and courses

## Project Structure
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # AI analysis API endpoint
│   ├── globals.css           # Global styles and design tokens
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── analysis-section.tsx  # Analysis card component
│   ├── results-panel.tsx     # Results dashboard
│   ├── resume-analyzer.tsx   # Main analyzer component
│   ├── resume-upload.tsx     # File upload component
│   └── score-display.tsx     # Animated score display
└── README.md




