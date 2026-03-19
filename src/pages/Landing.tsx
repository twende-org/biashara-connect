import { useState } from "react";
import { Link } from "react-router-dom";
import { Store, Menu, X, BarChart3, Smartphone, Users, Package, ArrowRight, Check, ChevronDown, ChevronUp, Globe, Search, Eye } from "lucide-react";
import { Mail, Phone } from "lucide-react";
import { BsShop } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useI18n();

  const navLinks = [
    { label: t("nav.home"), href: "#home" },
    { label: t("nav.shops"), href: "/maduka", isRoute: true },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.pricing"), href: "#pricing" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.privacy"), href: "#privacy" },
  ];

  const features = [
    { icon: Package, title: t("feature.manageProducts"), desc: t("feature.manageProductsDesc") },
    { icon: Globe, title: t("feature.advertiseShop"), desc: t("feature.advertiseShopDesc") },
    { icon: BarChart3, title: t("feature.salesReports"), desc: t("feature.salesReportsDesc") },
    { icon: Search, title: t("feature.searchShops"), desc: t("feature.searchShopsDesc") },
    { icon: Users, title: t("feature.teamRoles"), desc: t("feature.teamRolesDesc") },
    { icon: Smartphone, title: t("feature.workAnywhere"), desc: t("feature.workAnywhereDesc") },
  ];

  const steps = [
    { step: "01", title: t("step.1.title"), desc: t("step.1.desc") },
    { step: "02", title: t("step.2.title"), desc: t("step.2.desc") },
    { step: "03", title: t("step.3.title"), desc: t("step.3.desc") },
    { step: "04", title: t("step.4.title"), desc: t("step.4.desc") },
  ];

  const plans = [
    {
      name: t("plan.small"), price: "9,900", period: "/mwezi", desc: t("plan.smallDesc"),
      features: [t("plan.shop1"), t("plan.products50"), t("plan.onlineShop"), t("plan.basicReports")],
      cta: t("plan.startSmall"), highlight: false,
    },
    {
      name: t("plan.business"), price: "29,900", period: "/mwezi", desc: t("plan.businessDesc"),
      features: [t("plan.shops5"), t("plan.unlimitedProducts"), t("plan.staff10"), t("plan.shopsOnline"), t("plan.detailedReports"), t("plan.prioritySupport")],
      cta: t("plan.startNow"), highlight: true,
    },
    {
      name: t("plan.enterprise"), price: "79,900", period: "/mwezi", desc: t("plan.enterpriseDesc"),
      features: [t("plan.unlimitedShops"), t("plan.unlimitedProducts"), t("plan.unlimitedStaff"), "API access", t("plan.support247")],
      cta: t("plan.contactUs"), highlight: false,
    },
  ];

  const faqs = [
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
    { q: t("faq.5.q"), a: t("faq.5.a") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Simamia & Tangaza Biashara Yako Mtandaoni — DukaSmart"
        description="DukaSmart ni mfumo kamili wa kusimamia duka lako na kulitangaza mtandaoni. Simamia bidhaa, mauzo, stoo na wafanyakazi — huku wateja wakikupata na kupata bidhaa zako moja kwa moja."
        keywords="duka, dukasmart, duka smart, twendedigital, duka pos system, pos tanzania, shop management, mfumo wa duka, biashara software, inventory management, mauzo, stoo, tangaza duka, tafuta bidhaa, maduka mtandaoni"
        canonical="/"
      />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Store className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-extrabold text-foreground">DukaSmart</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) =>
              l.isRoute ? (
                <Link key={l.href} to={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">{l.label}</a>
              )
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle variant="ghost" />
            <Link to="/login"><Button variant="ghost" size="sm">{t("auth.login")}</Button></Link>
            <Link to="/register"><Button size="sm">{t("auth.registerFree")}</Button></Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle variant="ghost" />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t bg-background px-4 py-4 md:hidden">
            {navLinks.map((l) =>
              l.isRoute ? (
                <Link key={l.href} to={l.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{l.label}</Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">{l.label}</a>
              )
            )}
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/login"><Button variant="outline" className="w-full">{t("auth.login")}</Button></Link>
              <Link to="/register"><Button className="w-full">{t("auth.registerFree")}</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(36_90%_50%/0.12),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            {t("landing.heroTag")}
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("landing.heroTitle1")}
            <span className="block text-primary"> {t("landing.heroTitle2")}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{t("landing.heroDesc")}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8">{t("landing.startFree")} <ArrowRight className="h-5 w-5" /></Button>
            </Link>
            <Link to="/maduka">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8"><Eye className="h-5 w-5" /> {t("landing.viewShops")}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="border-t py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("landing.featuresTitle")}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t("landing.featuresDesc")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="stat-card group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("landing.howItWorksTitle")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("landing.howItWorksDesc")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-extrabold">{s.step}</div>
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">{t("landing.pricingTitle")}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{t("landing.pricingDesc")}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div key={p.name} className={`stat-card flex flex-col ${p.highlight ? "ring-2 ring-primary relative" : ""}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">{t("landing.popular")}</div>
                )}
                <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-foreground">TZS {p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-accent" /> {f}</li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8">
                  <Button className="w-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">{t("landing.faqTitle")}</h2>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="stat-card">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between text-left">
                  <span className="font-semibold text-foreground">{f.q}</span>
                  {openFaq === i ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </button>
                {openFaq === i && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section id="privacy" className="border-t py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">{t("privacy.title")}</h2>
          <div className="prose prose-sm text-muted-foreground space-y-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n}>
                <h3 className="text-lg font-semibold text-foreground">{t(`privacy.section${n}.title` as any)}</h3>
                <p>{t(`privacy.section${n}.desc` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-sidebar py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col flex-wrap items-center justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <BsShop className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-primary-foreground">DukaSmart</span>
            </div>
            <div className="flex flex-col items-center text-sm text-sidebar-muted gap-2 md:flex-row md:gap-6">
              <a href="tel:+255692671206" className="flex items-center gap-1 hover:text-sidebar-accent transition-colors">
                <Phone className="h-4 w-4" /><span>+255 692 671 206</span>
              </a>
              <a href="mailto:twendegital3@gmail.com" className="flex items-center gap-1 hover:text-sidebar-accent transition-colors">
                <Mail className="h-4 w-4" /><span>twendegital3@gmail.com</span>
              </a>
            </div>
            <p className="text-sm text-sidebar-muted text-center md:text-left">
              © {new Date().getFullYear()} DukaSmart by Twende Digital. {t("landing.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
