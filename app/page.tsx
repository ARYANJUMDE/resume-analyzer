import { ResumeAnalyzer } from "@/components/resume-analyzer"
import { Toaster } from "@/components/ui/toaster"
import { FileText, Sparkles, Target, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Resume Analysis</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
              Get Your Resume{" "}
              <span className="text-primary">Reviewed by AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Upload your resume and receive instant, detailed feedback with scores, 
              strengths, weaknesses, and personalized recommendations to land your dream job.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-12">
            {[
              { icon: FileText, label: "Detailed Analysis", value: "AI-Powered" },
              { icon: Target, label: "ATS Optimization", value: "Score Check" },
              { icon: BookOpen, label: "Learning Path", value: "Courses" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Analyzer */}
          <ResumeAnalyzer />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Upload Resume",
                description: "Upload your resume in PDF, DOCX, or TXT format. Our system securely processes your file.",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our AI analyzes your resume for content, structure, ATS compatibility, and skill alignment.",
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive detailed scores, actionable improvements, and personalized course recommendations.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-bold text-primary/10 absolute -top-4 -left-2">
                  {item.step}
                </div>
                <div className="relative pt-8 pl-4">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with AI to help you land your dream job
          </p>
        </div>
      </footer>

      <Toaster />
    </main>
  )
}
