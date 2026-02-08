import { Bot, Send, Sparkles } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";
import { useState } from "react";

const AISecurityAdvisor = () => {
  const { userName, advisorMessages, addAdvisorMessage } = useDashboard();
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    const text = message.toLowerCase();
    setMessage("");

    // Simple AI-like response
    if (text.includes("http") || text.includes("scam") || text.includes(".exe") || text.includes("free")) {
      addAdvisorMessage("Bhai, yeh link khatarnak lag raha hai, dur raho! 🚨");
    } else if (text.includes("password")) {
      addAdvisorMessage("Strong password use karo — mix of letters, numbers aur symbols. 🔐");
    } else {
      addAdvisorMessage("Sab sahi hai, tension mat lo. ✅");
    }
  };

  return (
    <div className="glass-glow-cyan rounded-2xl p-5 h-full flex flex-col animate-float">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-success-foreground" />
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">AI Advisor</h2>
          <p className="text-xs text-success">Online • Ready to help</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-3 overflow-y-auto max-h-48">
        {/* Welcome message */}
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div className="bg-muted/50 rounded-2xl rounded-tl-md p-4 max-w-[85%]">
            <p className="text-sm text-foreground">
              Hey {userName}! Suspicious link ya email paste karo, main batata hoon safe hai ya nahi! 😊
            </p>
          </div>
        </div>

        {/* Dynamic messages from scans */}
        {advisorMessages.map((msg, i) => (
          <div key={i} className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted/50 rounded-2xl rounded-tl-md p-4 max-w-[85%]">
              <p className="text-sm text-foreground">{msg}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about security..."
          className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-3 bg-gradient-to-r from-primary to-accent rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: message.trim() ? "0 0 15px hsl(var(--primary) / 0.4)" : "none" }}
        >
          <Send className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};

export default AISecurityAdvisor;
