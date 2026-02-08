import { useState } from "react";
import { Search, Zap, Shield, AlertTriangle } from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

// --- Helper Functions (Component ke bahar define karein) ---

const fetchVirusTotalReport = async (url: string) => {
  try {
    const postResponse = await fetch("https://www.virustotal.com/api/v3/urls", {
      method: "POST",
      headers: {
        "x-apikey": import.meta.env.VITE_VIRUSTOTAL_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ url }).toString(),
    });

    const postData = await postResponse.json();
    if (!postResponse.ok) return { malicious: 0, suspicious: 0 };

    // Analysis ke liye thoda wait
    await new Promise(resolve => setTimeout(resolve, 5000));

    const reportResponse = await fetch(`https://www.virustotal.com/api/v3/analyses/${postData.data.id}`, {
      method: "GET",
      headers: { "x-apikey": import.meta.env.VITE_VIRUSTOTAL_API_KEY }
    });

    const reportData = await reportResponse.json();
    return reportData.data.attributes.stats; //
  } catch (error) {
    console.error("VT API Error:", error);
    return { malicious: 0, suspicious: 0 };
  }
};

const askGeminiAboutLink = async (url: string, stats: any) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    // Sahi model name use karein: gemini-1.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `URL: ${url}. VirusTotal Stats: ${JSON.stringify(stats)}. 
                  Analyze if this link is a phishing scam. Check for 'wp-admin' or 'repair' patterns.
                  Reply ONLY in this JSON format: {"isRisky": boolean, "message": "Short Hinglish warning"}`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Detail:", errorData);
      throw new Error(`AI call failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Gemini Logic Error:", e);
    // Fallback logic agar AI fail ho jaye
    return { isRisky: url.includes("repair") || url.includes("admin"), message: "⚠️ AI verification failed, par link risky lag raha hai." };
  }
};

// --- Main Component ---

const QuickScan = () => {
  const [inputValue, setInputValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"safe" | "warning" | null>(null);
  const { addAlert, addAdvisorMessage, incrementScans, incrementThreats } = useDashboard();

  const handleScan = async () => {
    if (!inputValue.trim()) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      // 1. VirusTotal report lein
      const vtReport = await fetchVirusTotalReport(inputValue);
      
      // 2. Gemini AI se confirm karein
      const aiReasoning = await askGeminiAboutLink(inputValue, vtReport);

      incrementScans();

      // 3. Decision Logic
      if (vtReport.malicious > 0 || vtReport.suspicious > 0 || aiReasoning.isRisky) {
        setScanResult("warning");
        incrementThreats();
        addAdvisorMessage(aiReasoning.message);
        addAlert({
          type: "phishing",
          title: "AI Detection Alert",
          description: aiReasoning.message,
          severity: "high",
          time: "Just now"
        });
      } else {
        setScanResult("safe");
        addAdvisorMessage("✅ AI ne ise safe bataya hai. Tension mat lo.");
      }
    } catch (error) {
      console.error("Master Scan Error:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="glass-glow-cyan rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Scan</h2>
          <p className="text-xs text-muted-foreground">AI + VirusTotal Analysis</p>
        </div>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleScan()}
          placeholder="Paste suspicious link here..."
          className="w-full px-4 py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <button
        onClick={handleScan}
        disabled={!inputValue.trim() || isScanning}
        className="w-full py-4 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
        style={{ boxShadow: "0 0 20px hsl(var(--primary) / 0.3)" }}
      >
        <Zap className="w-5 h-5" />
        {isScanning ? "AI IS ANALYZING..." : "SCAN NOW"}
      </button>

      <div className="flex-1 flex items-center justify-center">
        {isScanning ? (
          <div className="flex items-end gap-1 h-16">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-primary to-accent rounded-full animate-wave"
                style={{ height: `${Math.random() * 40 + 20}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        ) : scanResult ? (
          <div className={`flex items-center gap-3 p-4 rounded-xl w-full ${scanResult === "safe" ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
            {scanResult === "safe" ? (
              <>
                <Shield className="w-8 h-8 text-success" />
                <div>
                  <p className="font-semibold text-success">All Clear!</p>
                  <p className="text-xs text-muted-foreground">AI Analysis: Verified Safe.</p>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Khatarnak Link!</p>
                  <p className="text-xs text-muted-foreground">AI Warning: Scams detected.</p>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm italic">Ready to protect you.</p>
        )}
      </div>
    </div>
  );
};

export default QuickScan;