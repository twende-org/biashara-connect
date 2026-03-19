import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function LanguageToggle({ variant = "ghost", className = "" }: { variant?: "ghost" | "outline" | "default"; className?: string }) {
  const { lang, toggleLang } = useI18n();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={toggleLang}
      className={`gap-1.5 ${className}`}
      title={lang === "sw" ? "Switch to English" : "Badilisha kwa Kiswahili"}
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-semibold uppercase">{lang === "sw" ? "EN" : "SW"}</span>
    </Button>
  );
}
