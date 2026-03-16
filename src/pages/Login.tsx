import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/authSlice";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(clearError());
    setProgress(30);

    try {
      await dispatch(loginUser(form)).unwrap();

      setProgress(100);

      // navigate after login success
      navigate("/app", { replace: true });

    } catch (err) {
      setProgress(0);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">
            DukaSmart
          </span>
        </div>

        <div className="stat-card">
          <h1 className="text-xl font-bold text-foreground mb-1">
            Karibu Tena
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Ingia kwenye akaunti yako
          </p>

          {loading && (
            <Progress value={progress} className="h-1 mb-4" />
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                type="email"
                placeholder="Barua pepe"
                className="pl-10"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                type={showPass ? "text" : "password"}
                placeholder="Nywila"
                className="pl-10 pr-10"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Umesahau nywila?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
            >
              <Loader2
                className={`h-4 w-4 animate-spin ${
                  loading ? "opacity-100" : "opacity-0"
                }`}
              />
              <span>{loading ? "Inaendelea..." : "Ingia"}</span>
            </Button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Huna akaunti?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Jisajili
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}