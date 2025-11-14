import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User, FileText, TrendingUp, Briefcase, Calendar } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  email: string;
}

interface Stats {
  totalResumes: number;
  avgScore: number;
  lastAnalysis: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalResumes: 0,
    avgScore: 0,
    lastAnalysis: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // Load stats
      const { data: resumes } = await supabase
        .from('resumes')
        .select('id, created_at')
        .eq('user_id', session.user.id);

      const { data: analyses } = await supabase
        .from('resume_analyses')
        .select('ats_score, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      const totalResumes = resumes?.length || 0;
      const avgScore = analyses?.length
        ? Math.round(analyses.reduce((sum, a) => sum + (a.ats_score || 0), 0) / analyses.length)
        : 0;
      const lastAnalysis = analyses?.[0]?.created_at || null;

      setStats({ totalResumes, avgScore, lastAnalysis });
      setLoading(false);
    };

    loadData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 animate-slide-up">
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Profile</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              View your profile information and statistics
            </p>
          </div>

          {/* Profile Card */}
          <Card className="glass-card card-3d p-8 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {profile?.full_name || "User"}
                </h2>
                <p className="text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/settings")}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              Edit Profile
            </Button>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-card card-3d p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalResumes}</p>
                  <p className="text-sm text-muted-foreground">Total Resumes</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card card-3d p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.avgScore}</p>
                  <p className="text-sm text-muted-foreground">Avg ATS Score</p>
                </div>
              </div>
            </Card>

            <Card className="glass-card card-3d p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Last Analysis</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.lastAnalysis
                      ? new Date(stats.lastAnalysis).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => navigate("/upload")}
                variant="outline"
                className="glass-card justify-start gap-3 h-auto p-4"
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Upload Resume</div>
                  <div className="text-xs text-muted-foreground">Analyze a new resume</div>
                </div>
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="glass-card justify-start gap-3 h-auto p-4"
              >
                <Briefcase className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">View Dashboard</div>
                  <div className="text-xs text-muted-foreground">See all your analyses</div>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
