import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardProvider, useDashboard } from "@/contexts/DashboardContext";
import Header from "@/components/dashboard/Header";
import QuickScan from "@/components/dashboard/QuickScan";
import DigitalHealthCheckup from "@/components/dashboard/DigitalHealthCheckup";
import WeeklyQuest from "@/components/dashboard/WeeklyQuest";
import AlertsSection from "@/components/dashboard/AlertsSection";
import AISecurityAdvisor from "@/components/dashboard/AISecurityAdvisor";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  color: "primary" | "success" | "accent";
}

const StatCard = ({ title, value, change, color }: StatCardProps) => {
  const colorStyles = {
    primary: "from-primary/20 to-primary/5 border-primary/20",
    success: "from-success/20 to-success/5 border-success/20",
    accent: "from-accent/20 to-accent/5 border-accent/20",
  };

  const textColors = {
    primary: "text-primary neon-text-cyan",
    success: "text-success neon-text-green",
    accent: "text-accent neon-text-orange",
  };

  return (
    <div className={`glass rounded-2xl p-5 bg-gradient-to-br ${colorStyles[color]} border hover:scale-105 transition-transform`}>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className={`text-3xl font-bold ${textColors[color]}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-2">{change}</p>
    </div>
  );
};

const DashboardContent = () => {
  const [isEntering, setIsEntering] = useState(true);
  const { userName, safetyScore, scansCompleted, threatsBlocked } = useDashboard();

  useEffect(() => {
    const timer = setTimeout(() => setIsEntering(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`min-h-screen bg-background grid-pattern transition-all duration-500 ${
        isEntering ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Header safetyScore={safetyScore} userName={userName} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <QuickScan />
          </div>
          <div className="lg:col-span-4">
            <DigitalHealthCheckup />
          </div>
          <div className="lg:col-span-4">
            <WeeklyQuest />
          </div>
        </div>

        <AlertsSection />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Threats Blocked"
              value={String(threatsBlocked)}
              change="From scans"
              color="primary"
            />
            <StatCard
              title="Scans Completed"
              value={String(scansCompleted)}
              change="Total scans"
              color="success"
            />
            <StatCard
              title="Safety Score"
              value={`${safetyScore}%`}
              change="Complete quests to improve"
              color="accent"
            />
          </div>
          <div className="lg:col-span-1">
            <AISecurityAdvisor />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
    // Sync profile to localStorage for DashboardContext
    if (profile) {
      localStorage.setItem("campusguard_user", JSON.stringify({
        name: profile.display_name || "Guest User",
        email: profile.email || "",
      }));
    }
  }, [user, loading, profile, navigate]);

  if (loading) return null;
  if (!user) return null;

  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
