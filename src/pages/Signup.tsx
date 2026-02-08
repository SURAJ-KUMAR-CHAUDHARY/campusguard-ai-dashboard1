import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [shakePassword, setShakePassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordChecks = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[@#$!%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };
  const isPasswordStrong = Object.values(passwordChecks).every(Boolean);
  const isFormValid = formData.name && formData.email && isPasswordStrong && formData.password === formData.confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 400);
      toast.error("Security Alert: A strong password is required to access this dashboard.");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: formData.name,
        },
      },
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
      return;
    }

    // Check if email confirmation is required
    if (data.user && !data.session) {
      setIsLoading(false);
      toast.success("Account created! Please check your email to verify your account before signing in.");
      return;
    }

    localStorage.setItem("campusguard_user", JSON.stringify({ email: formData.email, name: formData.name }));
    setIsExiting(true);
    setTimeout(() => navigate("/dashboard"), 500);
  };

  return (
    <div 
      className={`min-h-screen bg-background grid-pattern flex items-center justify-center p-4 transition-all duration-500 ${
        isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6 animate-fade-in">
          <div className="relative mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-success flex items-center justify-center animate-float">
              <Shield className="w-8 h-8 text-accent-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-2.5 h-2.5 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Join Campus<span className="text-primary neon-text-cyan">Guard</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Create your secure account</p>
        </div>

        {/* Signup Card */}
        <div className="glass-glow-orange rounded-3xl p-8 animate-scale-in" style={{ animationDelay: "0.1s" }}>
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className={`relative ${shakePassword ? "animate-shake" : ""}`}>
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="grid grid-cols-2 gap-1.5 text-xs mt-1.5">
                  {[
                    { key: "length" as const, label: "8+ characters" },
                    { key: "uppercase" as const, label: "Uppercase letter" },
                    { key: "number" as const, label: "Number" },
                    { key: "special" as const, label: "Special char (@#$...)" },
                  ].map(({ key, label }) => (
                    <span key={key} className={passwordChecks[key] ? "text-success" : "text-destructive"}>
                      {passwordChecks[key] ? "✓" : "✗"} {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full py-4 px-6 bg-gradient-to-r from-accent to-warning text-accent-foreground font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              style={{
                boxShadow: "0 0 25px hsl(var(--accent) / 0.4)",
              }}
            >
              {isLoading ? (
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-accent-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-accent-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-accent-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-success" />
            <span>AI Protection</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
