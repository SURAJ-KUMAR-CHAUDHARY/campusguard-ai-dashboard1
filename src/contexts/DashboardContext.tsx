import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface AlertItem {
  id: number;
  type: "phishing" | "password" | "leak";
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  time: string;
}

export interface QuestItem {
  id: number;
  title: string;
  completed: boolean;
  points: number;
}

interface DashboardState {
  userName: string;
  userEmail: string;
  safetyScore: number;
  quests: QuestItem[];
  alerts: AlertItem[];
  advisorMessages: string[];
  scansCompleted: number;
  threatsBlocked: number;
}

interface DashboardContextType extends DashboardState {
  verifyQuest: (id: number) => Promise<void>;
  addAlert: (alert: Omit<AlertItem, "id">) => void;
  clearAlerts: () => void;
  addAdvisorMessage: (msg: string) => void;
  incrementScans: () => void;
  incrementThreats: () => void;
}

const defaultQuests: QuestItem[] = [
  { id: 1, title: "Enable Two-Factor Authentication", completed: false, points: 20 },
  { id: 2, title: "Update your recovery email", completed: false, points: 20 },
  { id: 3, title: "Review app permissions", completed: false, points: 20 },
  { id: 4, title: "Complete security quiz", completed: false, points: 20 },
  { id: 5, title: "Set up login alerts", completed: false, points: 20 },
];

const STORAGE_KEY = "campusguard_dashboard";

function loadState(): Partial<DashboardState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: Partial<DashboardState>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const stored = loadState();
  const { user, profile } = useAuth();

  const userName = profile?.display_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Guest User";
  const userEmail = profile?.email || user?.email || "";

  const [quests, setQuests] = useState<QuestItem[]>(stored.quests || defaultQuests);
  const [alerts, setAlerts] = useState<AlertItem[]>(stored.alerts || []);
  const [advisorMessages, setAdvisorMessages] = useState<string[]>(stored.advisorMessages || []);
  const [scansCompleted, setScansCompleted] = useState(stored.scansCompleted || 0);
  const [threatsBlocked, setThreatsBlocked] = useState(stored.threatsBlocked || 0);

  // Load quest completion status from Supabase on mount
  useEffect(() => {
    if (!user) return;
    const loadQuests = async () => {
      const { data } = await supabase
        .from("user_quests")
        .select("quest_id, completed")
        .eq("user_id", user.id);
      if (data && data.length > 0) {
        setQuests((prev) =>
          prev.map((q) => {
            const dbQuest = data.find((d) => d.quest_id === q.id);
            return dbQuest ? { ...q, completed: dbQuest.completed } : q;
          })
        );
      }
    };
    loadQuests();
  }, [user]);

  const completedCount = quests.filter((q) => q.completed).length;
  const safetyScore = completedCount * 20;

  // Persist to localStorage
  useEffect(() => {
    saveState({ quests, alerts, advisorMessages, scansCompleted, threatsBlocked });
  }, [quests, alerts, advisorMessages, scansCompleted, threatsBlocked]);

  const verifyQuest = useCallback(async (id: number) => {
    if (!user) return;
    // Persist to Supabase
    await supabase
      .from("user_quests")
      .upsert({ user_id: user.id, quest_id: id, completed: true, completed_at: new Date().toISOString() }, { onConflict: "user_id,quest_id" });

    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, completed: true } : q)));
  }, [user]);

  const addAlert = useCallback((alert: Omit<AlertItem, "id">) => {
    setAlerts((prev) => [{ ...alert, id: Date.now() }, ...prev]);
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);

  const addAdvisorMessage = useCallback((msg: string) => {
    setAdvisorMessages((prev) => [...prev, msg]);
  }, []);

  const incrementScans = useCallback(() => setScansCompleted((p) => p + 1), []);
  const incrementThreats = useCallback(() => setThreatsBlocked((p) => p + 1), []);

  return (
    <DashboardContext.Provider
      value={{
        userName, userEmail, safetyScore, quests, alerts, advisorMessages,
        scansCompleted, threatsBlocked,
        verifyQuest, addAlert, clearAlerts, addAdvisorMessage, incrementScans, incrementThreats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
