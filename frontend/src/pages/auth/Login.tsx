import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, Eye, EyeOff, ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore, DEMO_USERS } from "@/store/authStore";

const features = [
  { icon: "🏢", title: "Centralized Asset Control", desc: "Track every asset across departments in real-time." },
  { icon: "🔁", title: "Seamless Transfers", desc: "Approve and manage asset transfers with full audit trail." },
  { icon: "📊", title: "Powerful Analytics", desc: "Deep reports on utilization, costs, and efficiency." },
  { icon: "🔔", title: "Smart Notifications", desc: "Stay updated on maintenance, bookings, and audits." },
];

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("admin@assetflow.io");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Where to go after login (or default to dashboard)
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const user = DEMO_USERS[email];
    if (!user) {
      setIsLoading(false);
      setError("Invalid email or password. Use a demo account below.");
      return;
    }
    login(user);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-[55%] bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-12 text-white"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/20">
            <Package className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">AssetFlow</span>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Enterprise Asset<br />Management, Simplified.
            </h1>
            <p className="text-purple-200 mt-4 text-lg leading-relaxed">
              A unified platform for tracking, allocating, and maintaining every asset in your organization.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
              >
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-xs text-purple-200 mt-1">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-purple-200 text-sm">
          <Building2 className="h-4 w-4" />
          <span>Trusted by 200+ enterprise organizations worldwide</span>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-8 bg-background"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">AssetFlow</span>
          </div>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription className="text-base">Sign in to your AssetFlow account</CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@assetflow.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                {/* Demo role quick-select */}
                <div className="rounded-lg bg-muted p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Quick Demo Login</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "Admin", email: "admin@assetflow.io" },
                      { label: "Asset Manager", email: "manager@assetflow.io" },
                      { label: "Employee", email: "emp@assetflow.io" },
                    ].map((role) => (
                      <button
                        key={role.label}
                        type="button"
                        onClick={() => { setEmail(role.email); setPassword("demo123"); setError(""); }}
                        className="text-xs px-2.5 py-1 rounded-md bg-background border hover:border-primary hover:text-primary transition-colors"
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <a href="#" className="text-primary font-medium hover:underline">Request access</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
