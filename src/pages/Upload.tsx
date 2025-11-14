import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file);

      if (uploadError) throw new Error("Failed to upload file");

      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: fileName
        })
        .select()
        .single();

      if (resumeError) throw new Error("Failed to save resume");

      const resumeText = `Resume: ${file.name}`;

      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText, fileName: file.name }
      });

      if (analysisError || !analysisData.success) {
        throw new Error(analysisData?.error || "Analysis failed");
      }

      await supabase.from('resume_analyses').insert({
        resume_id: resumeData.id,
        user_id: user.id,
        ...analysisData.analysis
      });

      toast.success("Analysis complete!");
      navigate(`/results/${resumeData.id}`);
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
