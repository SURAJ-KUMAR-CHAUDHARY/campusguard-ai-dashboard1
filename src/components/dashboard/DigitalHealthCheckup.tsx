import { Shield, Key, Eye, Wifi, AlertCircle, CheckCircle } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

interface InsightItem {
  icon: React.ReactNode;
  label: string;
  status: "good" | "warning" | "critical";
  action?: string;
}

const DigitalHealthCheckup = () => {
  const { safetyScore } = useDashboard();

  const getHealthLabel = (score: number) => {
    if (score >= 80) return "GREAT";
    if (score >= 60) return "GOOD";
    if (score >= 40) return "FAIR";
    return "WEAK";
  };

  const insights: InsightItem[] = [
    {
      icon: <Key className="w-4 h-4" />,
      label: "Password Strength",
      status: safetyScore >= 40 ? "good" : "warning",
      action: safetyScore < 40 ? "Update weak passwords" : undefined,
    },
    {
      icon: <Eye className="w-4 h-4" />,
      label: "Privacy Settings",
      status: safetyScore >= 60 ? "good" : "warning",
      action: safetyScore < 60 ? "Review permissions" : undefined,
    },
    {
      icon: <Wifi className="w-4 h-4" />,
      label: "Network Security",
      status: safetyScore >= 20 ? "good" : "warning",
    },
    {
      icon: <Shield className="w-4 h-4" />,
      label: "2FA Enabled",
      status: safetyScore >= 80 ? "good" : "warning",
      action: safetyScore < 80 ? "Enable in Weekly Quest" : undefined,
    },
  ];

  const getStatusStyles = (status: InsightItem["status"]) => {
    switch (status) {
      case "good":
        return { bg: "bg-success/20", text: "text-success", icon: <CheckCircle className="w-4 h-4" /> };
      case "warning":
        return { bg: "bg-warning/20", text: "text-warning", icon: <AlertCircle className="w-4 h-4" /> };
      case "critical":
        return { bg: "bg-destructive/20", text: "text-destructive", icon: <AlertCircle className="w-4 h-4" /> };
    }
  };

  return (
    <div className="glass-glow-green rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-success" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Digital Health</h2>
          <p className="text-xs text-muted-foreground">Your security overview</p>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#healthGradient)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(safetyScore / 100) * 264} 264`}
              style={{ filter: "drop-shadow(0 0 10px hsl(var(--success) / 0.5))", transition: "stroke-dasharray 0.5s ease" }}
            />
            <defs>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--success))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-success neon-text-green">{getHealthLabel(safetyScore)}</span>
            <span className="text-xs text-muted-foreground">{safetyScore}% Secure</span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Actionable Insights</h3>
        <div className="space-y-2">
          {insights.map((insight, index) => {
            const styles = getStatusStyles(insight.status);
            return (
              <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${styles.bg} transition-all hover:scale-[1.02]`}>
                <span className={styles.text}>{insight.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{insight.label}</p>
                  {insight.action && <p className="text-xs text-muted-foreground">{insight.action}</p>}
                </div>
                <span className={styles.text}>{styles.icon}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DigitalHealthCheckup;
