import { Shield, User, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  safetyScore: number;
  userName: string;
}

const Header = ({ safetyScore, userName }: HeaderProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login", { replace: true });
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success neon-text-green";
    if (score >= 60) return "text-warning neon-text-orange";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-success to-primary";
    if (score >= 60) return "from-warning to-accent";
    return "from-destructive to-accent";
  };

  return (
    <header className="glass-glow-cyan rounded-2xl p-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Campus<span className="text-primary neon-text-cyan">Guard</span> AI
          </h1>
          <p className="text-xs text-muted-foreground">Intelligent Security Shield</p>
        </div>
      </div>

      {/* Safety Score Gauge */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(safetyScore / 100) * 251.2} 251.2`}
              className="drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 8px hsl(var(--success) / 0.5))",
              }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--success))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${getScoreColor(safetyScore)}`}>
              {safetyScore}
            </span>
            <span className="text-[10px] text-muted-foreground">/100</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground">Safety Score</p>
          <p className="text-xs text-success">Protected</p>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{userName}</p>
            <p className="text-xs text-muted-foreground">Premium Member</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-destructive/20 transition-colors group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
        </button>
      </div>
    </header>
  );
};

export default Header;