import Header from "@/components/dashboard/Header";
import QuickScan from "@/components/dashboard/QuickScan";
import DigitalHealthCheckup from "@/components/dashboard/DigitalHealthCheckup";
import WeeklyQuest from "@/components/dashboard/WeeklyQuest";
import AlertsSection from "@/components/dashboard/AlertsSection";
import AISecurityAdvisor from "@/components/dashboard/AISecurityAdvisor";

const Index = () => {
  return (
    <div className="min-h-screen bg-background grid-pattern">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <Header safetyScore={92} userName="Aniket Sharma" />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Quick Scan */}
          <div className="lg:col-span-4">
            <QuickScan />
          </div>

          {/* Center Column - Digital Health */}
          <div className="lg:col-span-4">
            <DigitalHealthCheckup />
          </div>

          {/* Right Column - Weekly Quest */}
          <div className="lg:col-span-4">
            <WeeklyQuest />
          </div>
        </div>

        {/* Alerts Section */}
        <AlertsSection />

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Threats Blocked"
              value="147"
              change="+12 this week"
              color="primary"
            />
            <StatCard
              title="Scans Completed"
              value="89"
              change="Last: 2 hrs ago"
              color="success"
            />
            <StatCard
              title="Security Level"
              value="Pro"
              change="Premium features"
              color="accent"
            />
          </div>

          {/* AI Security Advisor */}
          <div className="lg:col-span-1">
            <AISecurityAdvisor />
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default Index;