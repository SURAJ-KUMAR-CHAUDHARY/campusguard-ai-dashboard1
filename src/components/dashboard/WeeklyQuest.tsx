import { Trophy, CheckCircle, Circle, Star, Loader2, ShieldCheck } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useState } from "react";

const WeeklyQuest = () => {
  const { quests, verifyQuest, safetyScore } = useDashboard();
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  const completedCount = quests.filter((q) => q.completed).length;

  const handleVerify = async (questId: number) => {
    setVerifyingId(questId);
    // Simulate verification delay
    await new Promise((r) => setTimeout(r, 1500));
    await verifyQuest(questId);
    setVerifyingId(null);
  };

  return (
    <div className="glass-glow-orange rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center animate-float">
            <Trophy className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Weekly Quest</h2>
            <p className="text-xs text-muted-foreground">Complete tasks to boost score</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-accent/20 rounded-full">
          <Star className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-accent">{safetyScore}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>{completedCount}/{quests.length} completed</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent to-warning rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / quests.length) * 100}%`,
              boxShadow: "0 0 10px hsl(var(--accent) / 0.5)",
            }}
          />
        </div>
      </div>

      {/* Quest List */}
      <div className="flex-1 space-y-2">
        {quests.map((quest) => (
          <div
            key={quest.id}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              quest.completed ? "opacity-70 bg-success/5" : ""
            }`}
          >
            {quest.completed ? (
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            )}
            <span
              className={`text-sm flex-1 ${
                quest.completed ? "text-muted-foreground line-through" : "text-foreground"
              }`}
            >
              {quest.title}
            </span>
            {quest.completed ? (
              <span className="text-xs text-success font-medium">✓ Done</span>
            ) : (
              <button
                onClick={() => handleVerify(quest.id)}
                disabled={verifyingId !== null}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-accent/20 text-accent hover:bg-accent/30 rounded-lg transition-all disabled:opacity-50"
              >
                {verifyingId === quest.id ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3 h-3" />
                )}
                {verifyingId === quest.id ? "Verifying..." : "Verify"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyQuest;
