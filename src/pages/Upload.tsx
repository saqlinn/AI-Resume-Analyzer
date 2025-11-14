import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileText, X } from "lucide-react";
import { toast } from "sonner";

const Upload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }
    toast.info("Analysis feature coming soon!");
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
                isDragging
                  ? "border-primary bg-primary/10 scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {!file ? (
                <>
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-float">
                    <UploadIcon className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-2">
                    Drop your resume here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse your files
                  </p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="file-upload">
                    <Button
                      type="button"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      Browse Files
                    </Button>
                  </label>
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Supports PDF, DOC, DOCX (Max 10MB)
                  </p>
                </>
              ) : (
                <div className="animate-scale-in">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{file.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={removeFile}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove File
                  </Button>
                </div>
              )}
            </div>

            {file && (
              <div className="mt-8 flex gap-4">
                <Button
                  onClick={handleAnalyze}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
                >
                  Analyze Resume
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="glass-card"
                >
                  Cancel
                </Button>
              </div>
            )}
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-primary mb-1">&lt; 30s</p>
              <p className="text-sm text-muted-foreground">Analysis Time</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-secondary mb-1">AI</p>
              <p className="text-sm text-muted-foreground">Powered Analysis</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-accent mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Secure & Private</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
