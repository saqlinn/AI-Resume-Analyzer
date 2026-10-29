import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { isBackendAvailable, analyzeWithBackend } from "@/utils/backend";
import { User } from "@supabase/supabase-js";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });
  }, [navigate]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const validFile = files.find(
      (f) =>
        f.type === "application/pdf" ||
        f.type === "application/msword" ||
        f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    if (validFile) {
      setFile(validFile);
      toast.success("File uploaded successfully!");
    } else {
      toast.error("Please upload a PDF, DOC, or DOCX file");
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFile(files[0]);
      toast.success("File uploaded successfully!");
    }
  };

  const removeFile = () => {
    setFile(null);
    toast.info("File removed");
  };

  const handleAnalyze = async () => {
    if (!file || !user) {
      toast.error("Please upload a file first");
      return;
    }

    setIsAnalyzing(true);

    try {
      // If backend is available, use it; otherwise fall back to demo analysis
      const backendUp = await isBackendAvailable();

      if (backendUp) {
        toast.loading('Analyzing with backend...');
        // send file blob to backend
        const response = await analyzeWithBackend(file, file.name);
        // Expect backend response shape; adapt as needed
        const analysis = response.analysis || response;

        const resultId = analysis.id || `backend-${Date.now()}`;
        const stored = {
          id: resultId,
          category: analysis.category || analysis.job_title || 'Analysis',
          ats_score: analysis.ats_score ?? analysis.score ?? 0,
          keyword_score: analysis.keyword_score ?? 0,
          role_relevancy_score: analysis.role_relevancy_score ?? 0,
          technical_skills: analysis.technical_skills || analysis.skills?.present || [],
          soft_skills: analysis.soft_skills || [],
          tools_technologies: analysis.tools_technologies || [],
          certifications: analysis.certifications || [],
          missing_skills: analysis.missing_skills || [],
          improvement_areas: analysis.improvement_areas || analysis.recommendations || [],
          strong_skills: analysis.strong_skills || [],
          recommendations: analysis.recommendations || [],
        };

        sessionStorage.setItem(`demo-result-${stored.id}`, JSON.stringify({ ...stored, fileName: file.name, user_email: user.email }));
        toast.success('Analysis complete (backend)');
        navigate(`/results/${stored.id}`);
      } else {
        // Demo deterministic analysis when backend is not reachable
        const fileHash = file.name.length + file.size;
        const seededRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000;
          return x - Math.floor(x);
        };

        const baseScore = Math.round(seededRandom(fileHash) * 40 + 60); // 60-100 range
        
        const mockAnalysis = {
          id: `demo-${Date.now()}`,
          category: "Software Engineer",
          ats_score: baseScore,
          keyword_score: Math.round(seededRandom(fileHash + 1) * 40 + 60),
          role_relevancy_score: Math.round(seededRandom(fileHash + 2) * 40 + 60),
          technical_skills: ["JavaScript", "React", "TypeScript", "Node.js"],
          soft_skills: ["Communication", "Leadership", "Problem Solving"],
          tools_technologies: ["Git", "Docker", "AWS"],
          certifications: ["AWS Certified", "React Certified"],
          missing_skills: ["Kubernetes", "GraphQL"],
          improvement_areas: ["Add more project details", "Include metrics"],
          strong_skills: ["Full Stack Development", "React Expertise"],
          recommendations: [
            "Add quantifiable metrics to your achievements",
            "Include more technical keywords from the job description",
            "Highlight your leadership experience"
          ]
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        toast.success("Analysis complete (demo)!");
        
        // Store demo result in session storage for the results page
        sessionStorage.setItem(`demo-result-${mockAnalysis.id}`, JSON.stringify({
          ...mockAnalysis,
          fileName: file.name,
          user_email: user.email
        }));

        navigate(`/results/${mockAnalysis.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to analyze");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center animate-slide-up">
            <h1 className="text-4xl font-bold mb-4">
              Upload Your <span className="gradient-text">Resume</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Upload your resume and get instant AI-powered analysis
            </p>
          </div>

          <Card className="glass-card p-8 card-3d">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                isDragging ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50"
              }`}
            >
              {!file ? (
                <>
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-float">
                    <UploadIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-6">or click to browse</p>
                  <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileInput} />
                  <label htmlFor="file-upload">
                    <Button type="button" onClick={() => document.getElementById("file-upload")?.click()} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-sm text-muted-foreground mt-4">Supports PDF, DOC, DOCX (Max 10MB)</p>
                </>
              ) : (
                <div className="animate-scale-in">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                  <p className="text-muted-foreground mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button variant="outline" onClick={removeFile} className="gap-2" disabled={isAnalyzing}>
                    <X className="h-4 w-4" />Remove File
                  </Button>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-8 flex gap-4">
                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6">
                  {isAnalyzing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Analyzing...</> : "Analyze Resume"}
                </Button>
                <Button variant="outline" onClick={() => navigate("/dashboard")} className="glass-card" disabled={isAnalyzing}>Cancel</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upload;
