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

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
# Create .env.local file
echo "AI_GATEWAY_API_KEY=your_groq_api_key_here" > .env.local
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_GATEWAY_API_KEY` | Your Groq API key for AI analysis | Yes |

### Getting a Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy and add it to your environment variables

## Usage

1. **Upload Your Resume** - Drag and drop or click to upload a PDF, DOCX, or TXT file
2. **Add Job Description** (Optional) - Paste a job description for targeted feedback
3. **Get Analysis** - Click "Analyze Resume" and wait for AI-powered results
4. **Review Feedback** - Explore your scores, strengths, weaknesses, and recommendations
5. **Take Action** - Follow the suggested improvements and courses

## Scoring System

| Score Type | Weight | Description |
|------------|--------|-------------|
| AI Score | 50% | Intelligent analysis of content quality and relevance |
| Content Score | 30% | Checks for essential sections (contact, education, experience, skills) |
| ATS Score | 20% | Applicant Tracking System compatibility |

## Project Structure

```
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
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add `AI_GATEWAY_API_KEY` to environment variables
4. Deploy

Or use the Vercel CLI:
```bash
vercel
```

## Built with v0

This project was built using [v0](https://v0.app). You can continue developing by visiting the link below:

[Continue working on v0](https://v0.app/chat/projects/prj_FuFa9c9NANnf0cwlZHZCmqSPnQem)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Groq](https://groq.com) for fast AI inference
- [Vercel](https://vercel.com) for hosting and AI Gateway
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Framer Motion](https://www.framer.com/motion/) for animations

---

Built with AI by [ARYANJUMDE](https://github.com/ARYANJUMDE)
