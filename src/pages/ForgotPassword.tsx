import { useState } from "react";
import { Link } from "react-router-dom";
import { Store, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPassword, clearError } from "@/store/authSlice";
import { useI18n } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

export default function ForgotPassword() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setProgress(40);
    const result = await dispatch(resetPassword(email));
    setProgress(90);
    if (resetPassword.fulfilled.match(result)) {
      setProgress(100);
      setSent(true);
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
          {sent ? (
            <div className="text-center py-4">
              <Mail className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-xl font-bold text-foreground mb-2">{t("auth.checkEmail")}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t("auth.resetSent")} {email}</p>
              <Link to="/login"><Button variant="outline">{t("auth.backToLogin")}</Button></Link>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold text-foreground mb-1">{t("auth.forgotTitle")}</h1>
              <p className="text-sm text-muted-foreground mb-6">{t("auth.forgotSubtitle")}</p>
              {loading && <Progress value={progress} className="h-1 mb-4" />}
              {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder={t("auth.email")} className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t("common.loading")}</> : t("auth.sendInstructions")}
                </Button>
              </form>
              <p className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" /> {t("auth.backToLogin")}
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
