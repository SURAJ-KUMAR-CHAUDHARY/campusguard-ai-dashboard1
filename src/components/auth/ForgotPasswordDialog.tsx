import { useState } from "react";
import { X, ShieldQuestion, CheckCircle, Lock } from "lucide-react";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const securityQuestions = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What is your mother's maiden name?",
  "What was your childhood nickname?",
];

const ForgotPasswordDialog = ({ open, onOpenChange }: ForgotPasswordDialogProps) => {
  const [step, setStep] = useState<"question" | "success">("question");
  const [answer, setAnswer] = useState("");
  const [selectedQuestion] = useState(securityQuestions[0]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!answer.trim()) return;
    setIsVerifying(true);
    
    setTimeout(() => {
      setIsVerifying(false);
      setStep("success");
    }, 1500);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("question");
      setAnswer("");
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-md glass-glow-cyan rounded-3xl p-8 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === "question" ? (
          <>
            {/* Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                <ShieldQuestion className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Security Verification</h2>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Answer your security question to reset your password
              </p>
            </div>

            {/* Security Question */}
            <div className="space-y-4">
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-1">Security Question</p>
                <p className="text-foreground font-medium">{selectedQuestion}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Your Answer</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="w-full px-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <button
                onClick={handleVerify}
                disabled={!answer.trim() || isVerifying}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
                }}
              >
                {isVerifying ? (
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Verify & Reset Password
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-6 animate-scale-in">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">Verification Successful!</h2>
              <p className="text-sm text-muted-foreground mb-6">
                A password reset link has been sent to your registered email address.
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-success/20 text-success font-medium rounded-xl hover:bg-success/30 transition-all"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordDialog;