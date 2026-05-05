# AI Resume Analyzer

An intelligent resume analysis tool powered by AI that provides comprehensive feedback on your resume, including scores, strengths, weaknesses, and personalized course recommendations.

![AI Resume Analyzer](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

### Core Analysis

* **AI-Powered Review** - Uses Groq's LLaMA 3.3 70B model
* **Multi-Score System** - Overall, content, and ATS score
* **Strengths & Weaknesses**
* **Actionable Improvements**

### Skill Detection

* Automatic skill extraction (languages, frameworks, etc.)

### Job Matching

* Resume vs job description comparison
* Missing keyword detection

### Course Recommendations

* Personalized learning suggestions

### User Experience

* Drag & drop upload
* Real-time analysis
* Dark UI
* Responsive design

---

## Tech Stack

* Next.js 16
* TypeScript
* Tailwind CSS
* shadcn/ui
* Groq (LLaMA 3.3)
* Framer Motion

---

## Getting Started

### Installation

```bash
git clone https://github.com/ARYANJUMDE/resume-analyzer.git
cd resume-analyzer
pnpm install
```

### Environment Variables

Create `.env.local`:

```bash
AI_GATEWAY_API_KEY=your_groq_api_key_here
```

### Run

```bash
pnpm dev
```

---

## Usage

1. Upload resume
2. Add job description (optional)
3. Analyze
4. Review feedback

---

## Scoring System

| Score Type | Weight |
| ---------- | ------ |
| AI Score   | 50%    |
| Content    | 30%    |
| ATS        | 20%    |

---

## Project Structure

```
app/
components/
README.md
```

---

## Deployment

Deploy on Vercel and add env variable.

---

## License

MIT

---

Built with AI by ARYANJUMDE
