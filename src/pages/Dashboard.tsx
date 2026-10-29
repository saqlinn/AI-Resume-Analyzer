import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  FileText, 
  TrendingUp, 
  Users, 
  Settings, 
  Briefcase,
  BarChart
} from "lucide-react";
import { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgAtsScore: 0,
    resumesAnalyzed: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      setStats({
        totalResumes: 3,
        avgAtsScore: 85,
        resumesAnalyzed: 5,
      });
      setLoading(false);
    };

    fetchUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchUserData();
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const dashboardCards = [
    {
      icon: Upload,
      title: "Upload Resume",
      description: "Drag & drop or browse your resume file",
      action: () => navigate("/upload"),
      gradient: "from-primary to-secondary",
    },
    {
      icon: FileText,
      title: "Previous Analyses",
      description: "View your past resume analyses",
      action: () => navigate("/profile"),
      gradient: "from-secondary to-accent",
    },
    {
      icon: BarChart,
      title: "Total Resumes",
      description: `${stats.totalResumes} resumes uploaded`,
      action: () => navigate("/profile"),
      gradient: "from-accent to-primary",
    },
    {
      icon: Briefcase,
      title: "Matching Jobs",
      description: "Find jobs that match your profile",
      action: () => {},
      gradient: "from-primary to-accent",
    },
    {
      icon: Users,
      title: "Profile Info",
      description: "Manage your account details",
      action: () => navigate("/profile"),
      gradient: "from-secondary to-primary",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure your preferences",
      action: () => navigate("/settings"),
      gradient: "from-accent to-secondary",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.email?.split("@")[0]}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your resumes and track your progress
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <Card
              key={index}
              className="glass-card card-3d p-6 cursor-pointer group"
              onClick={card.action}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div 
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <card.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-muted-foreground text-sm">{card.description}</p>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgAtsScore}</p>
                <p className="text-sm text-muted-foreground">Avg ATS Score</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resumesAnalyzed}</p>
                <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Job Matches</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
