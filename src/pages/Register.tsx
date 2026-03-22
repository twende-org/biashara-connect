import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Store, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser, clearError } from "@/store/authSlice";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const { t } = useI18n();
  const [form, setForm] = useState({ displayName: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    dispatch(clearError());
    if (form.password !== form.confirmPassword) {
      setLocalError(t("auth.passwordMismatch"));
      return;
    }
    if (form.password.length < 6) {
      setLocalError(t("auth.passwordTooShort"));
      return;
    }
    setProgress(30);
    const result = await dispatch(registerUser({ email: form.email, password: form.password, displayName: form.displayName }));
    setProgress(80);
    if (registerUser.fulfilled.match(result)) {
      setProgress(100);
      navigate("/app");
    } else {
      setProgress(0);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle variant="outline" />
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
            <Store className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">DukaSmart</span>
        </div>

        <div className="stat-card">
          <h1 className="text-xl font-bold text-foreground mb-1">{t("auth.registerTitle")}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("auth.registerSubtitle")}</p>

          {loading && <Progress value={progress} className="h-1 mb-4" />}
          {(error || localError) && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{localError || error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("auth.yourName")} className="pl-10" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" placeholder={t("auth.email")} className="pl-10" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type={showPass ? "text" : "password"} placeholder={t("auth.password")} className="pl-10 pr-10" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type={showPass ? "text" : "password"} placeholder={t("auth.confirmPassword")} className="pl-10" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("common.loading")}</> : t("auth.register")}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.hasAccount")}{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">{t("auth.login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
