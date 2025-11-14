import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FileText, Brain, Target, TrendingUp, Shield, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI examines your resume against industry standards and ATS requirements",
    },
    {
      icon: Target,
      title: "Skill Gap Detection",
      description: "Identify missing skills and get recommendations for improvement",
    },
    {
      icon: TrendingUp,
      title: "ATS Score",
      description: "Get comprehensive scoring based on keyword matching and formatting",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-block mb-6 px-4 py-2 glass-card rounded-full">
              <span className="text-sm font-medium text-accent flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Powered by Advanced AI
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Optimize Your Resume for{" "}
              <span className="gradient-text">ATS Success</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get instant AI-powered analysis of your resume. Identify skill gaps, 
              improve ATS compatibility, and land more interviews.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6 animate-glow"
              >
                Start Free Analysis
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="glass-card text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for <span className="gradient-text">Resume Success</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create an ATS-friendly resume that stands out
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card card-3d p-6 hover:border-primary/50 transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="glass-card p-12 text-center card-3d">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have improved their resumes with our AI-powered platform
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2024 ATS Resume Analyzer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
