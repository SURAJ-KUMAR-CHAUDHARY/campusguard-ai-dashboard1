import { AlertTriangle, ShieldAlert, Lock, Database, Clock, ChevronRight, Trash2 } from "lucide-react";
import { useDashboard, AlertItem } from "@/contexts/DashboardContext";

const AlertsSection = () => {
  const { alerts, clearAlerts } = useDashboard();

  const getAlertIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "phishing": return <ShieldAlert className="w-5 h-5" />;
      case "password": return <Lock className="w-5 h-5" />;
      case "leak": return <Database className="w-5 h-5" />;
    }
  };

  const getSeverityStyles = (severity: AlertItem["severity"]) => {
    switch (severity) {
      case "high":
        return { bg: "bg-destructive/20", border: "border-destructive/30", text: "text-destructive", glow: "shadow-[0_0_15px_hsl(var(--destructive)/0.3)]" };
      case "medium":
        return { bg: "bg-warning/20", border: "border-warning/30", text: "text-warning", glow: "shadow-[0_0_15px_hsl(var(--warning)/0.3)]" };
      case "low":
        return { bg: "bg-success/20", border: "border-success/30", text: "text-success", glow: "shadow-[0_0_15px_hsl(var(--success)/0.3)]" };
    }
  };

  const AlertCard = ({ alert }: { alert: AlertItem }) => {
    const styles = getSeverityStyles(alert.severity);
    return (
      <div className={`p-4 rounded-xl border ${styles.bg} ${styles.border} ${styles.glow} hover:scale-[1.02] transition-all cursor-pointer`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${styles.bg}`}>
            <span className={styles.text}>{getAlertIcon(alert.type)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{alert.title}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.description}</p>
            <div className="flex items-center gap-1 mt-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{alert.time}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Security Alerts</h2>
            <p className="text-xs text-muted-foreground">Threats from scans appear here</p>
          </div>
        </div>
        {alerts.length > 0 && (
          <button
            onClick={clearAlerts}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No alerts yet. Scan a link to detect threats.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Recent Alerts
            </h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsSection;
