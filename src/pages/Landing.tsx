import { useState } from "react";
import { Link } from "react-router-dom";
import { Store, Menu, X, BarChart3, ShieldCheck, Smartphone, Users, CreditCard, Package, ArrowRight, Check, ChevronDown, ChevronUp, Globe, Search, Eye } from "lucide-react";
import { Mail, Phone } from "lucide-react";
import { BsShop } from "react-icons/bs";

import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const navLinks = [
  { label: "Nyumbani", href: "#home" },
  { label: "Maduka", href: "/maduka", isRoute: true },
  { label: "Kuhusu", href: "#about" },
  { label: "Bei", href: "#pricing" },
  { label: "Jinsi Inavyofanya Kazi", href: "#how-it-works" },
  { label: "Sera ya Faragha", href: "#privacy" },
];

const features = [
  { icon: Package, title: "Simamia Bidhaa", desc: "Fuatilia stoo, bei, SKU, expiry na maelezo yote ya bidhaa zako kwa urahisi — kila kitu sehemu moja." },
  { icon: Globe, title: "Tangaza Duka Lako", desc: "Duka lako linaonekana mtandaoni. Wateja wapya wanaweza kutafuta na kupata bidhaa zako moja kwa moja." },
  { icon: BarChart3, title: "Mauzo & Ripoti", desc: "Rekodi mauzo kwa njia ya kitaalamu na upate ripoti za kina za faida, hasara, na mwenendo." },
  { icon: Search, title: "Tafuta Maduka & Bidhaa", desc: "Wateja wanaweza kutafuta maduka na bidhaa kwa eneo, kategoria, na bei — wapate wanachohitaji haraka." },
  { icon: Users, title: "Timu & Majukumu", desc: "Ongeza wafanyakazi na uwape majukumu tofauti — mmiliki, meneja, au mhudumu." },
  { icon: Smartphone, title: "Fanya Kazi Popote", desc: "Tumia simu, tablet au kompyuta — DukaSmart inafanya kazi kwenye kifaa chochote." },
];

const steps = [
  { step: "01", title: "Jisajili Bure", desc: "Fungua akaunti kwa dakika chache tu kwa barua pepe na nywila." },
  { step: "02", title: "Ongeza Duka Lako", desc: "Weka maelezo ya duka lako — jina, eneo, picha — na litangazwe mtandaoni mara moja." },
  { step: "03", title: "Ongeza Bidhaa", desc: "Ingiza bidhaa zako na maelezo kamili. Wateja wataziona moja kwa moja kwenye duka lako la mtandaoni." },
  { step: "04", title: "Simamia & Tangaza!", desc: "Rekodi mauzo, fuatilia faida, na duka lako linaendelea kuvutia wateja wapya mtandaoni." },
];

const plans = [
  {
    name: "Ndogo",
    price: "9,900",
    period: "/mwezi",
    desc: "Kwa maduka madogo madogo yanayoanza",
    features: [
      "Duka 1",
      "Bidhaa hadi 50",
      "Mauzo yasiyopungua",
      "Ripoti za msingi",
    ],
    cta: "Anza Ndogo",
    highlight: false, // sio plan ya ku-highlight, entry ndogo
  },
  {
    name: "Biashara",
    price: "29,900",
    period: "/mwezi",
    desc: "Kwa biashara zinazokua",
    features: [
      "Maduka 5",
      "Bidhaa zisizopungua",
      "Wafanyakazi 10",
      "Ripoti za kina",
      "Msaada wa kipaumbele",
    ],
    cta: "Anza Sasa",
    highlight: true, // hii ndio plan inayovutia zaidi
  },
  {
    name: "Kampuni",
    price: "79,900",
    period: "/mwezi",
    desc: "Kwa biashara kubwa",
    features: [
      "Maduka yasiyopungua",
      "Bidhaa zisizopungua",
      "Wafanyakazi wasiopungua",
      "API access",
      "Msaada 24/7",
    ],
    cta: "Wasiliana Nasi",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Je, DukaSmart ni bure?",
    a: "Hapana, lakini tuna mpango wa Ndogo unaofaa maduka madogo madogo. Mpango huu unakuruhusu kusimamia duka 1 na bidhaa hadi 50 kwa Tsh 9,900/mwezi. Unaweza kuboresha mpango wakati wowote ili kupata vipengele zaidi."
  },
  { q: "Je, data yangu ni salama?", a: "Kabisa. Tunatumia Firebase na encryption ya hali ya juu kulinda data yako. Hatushiriki data yako na mtu yeyote." },
  { q: "Je, ninaweza kutumia simu yangu?", a: "Ndiyo, DukaSmart imejengwa kufanya kazi vizuri kwenye simu, tablet na kompyuta." },
  { q: "Je, ninaweza kuongeza wafanyakazi?", a: "Ndiyo! Unaweza kuwapa majukumu tofauti — mmiliki, meneja, au mhudumu — kila mmoja na ruhusa zake." },
];

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Mfumo wa Kusimamia Biashara Yako - Duka POS System"
        description="DukaSmart ni mfumo bora wa kusimamia duka lako. Simamia bidhaa, mauzo, stoo, matumizi, wasambazaji na wafanyakazi kwa urahisi. Best duka POS system by TwendeDigital."
        keywords="duka, dukasmart, duka smart, duksmart, twendedigital, twende digital, duka pos system, pos tanzania, shop management, mfumo wa duka, biashara software, inventory management, mauzo, stoo, point of sale, smart shop management"
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
                <Link key={l.href} to={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {l.label}
                </a>
              )
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login"><Button variant="ghost" size="sm">Ingia</Button></Link>
            <Link to="/register"><Button size="sm">Jisajili Bure</Button></Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t bg-background px-4 py-4 md:hidden">
            {navLinks.map((l) =>
              l.isRoute ? (
                <Link key={l.href} to={l.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  {l.label}
                </a>
              )
            )}
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/login"><Button variant="outline" className="w-full">Ingia</Button></Link>
              <Link to="/register"><Button className="w-full">Jisajili Bure</Button></Link>
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
            Toleo Jipya — Sasa na Matumizi!
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Simamia Biashara Yako
            <span className="block text-primary"> Kwa Urahisi na Ufanisi</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            DukaSmart ni mfumo kamili wa kusimamia duka lako — bidhaa, mauzo, matumizi, wafanyakazi, na ripoti. Yote katika sehemu moja.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Anza Bure Sasa <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base px-8">Jinsi Inavyofanya Kazi</Button>
            </a>
          </div>
        </div>
      </section>

      {/* About / Features */}
      <section id="about" className="border-t py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Kwa Nini DukaSmart?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tumejengwa kwa ajili ya wafanyabiashara wa Tanzania. Rahisi, haraka, na yenye nguvu.
            </p>
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
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Jinsi Inavyofanya Kazi</h2>
            <p className="mt-4 text-lg text-muted-foreground">Hatua 4 rahisi kuanza kusimamia biashara yako</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-2xl font-extrabold">
                  {s.step}
                </div>
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
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Bei Rahisi na Wazi</h2>
            <p className="mt-4 text-lg text-muted-foreground">Chagua mpango unaokufaa. Hakuna gharama za siri.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((p) => (
              <div key={p.name} className={`stat-card flex flex-col ${p.highlight ? "ring-2 ring-primary relative" : ""}`}>
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                    MAARUFU
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold text-foreground">TZS {p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-accent" /> {f}
                    </li>
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
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Maswali Yanayoulizwa Mara kwa Mara</h2>
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

      {/* Privacy Policy */}
      <section id="privacy" className="border-t py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-foreground mb-8">Sera ya Faragha</h2>
          <div className="prose prose-sm text-muted-foreground space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">1. Taarifa Tunazokusanya</h3>
              <p>Tunakusanya taarifa unazotupa wakati wa kusajili akaunti: jina, barua pepe, na namba ya simu. Pia tunakusanya taarifa za biashara yako kama bidhaa, mauzo, na matumizi.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">2. Matumizi ya Taarifa</h3>
              <p>Taarifa zako zinatumika tu kutoa huduma bora zaidi kwako. Hatauzi wala kushiriki taarifa zako na kampuni za nje.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">3. Usalama</h3>
              <p>Tunatumia teknolojia za kisasa za usalama ikiwa ni pamoja na Firebase Authentication na Firestore Security Rules kulinda data yako.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">4. Haki Zako</h3>
              <p>Una haki ya kuomba nakala ya data yako, kusahihisha makosa, au kufuta akaunti yako wakati wowote kwa kuwasiliana nasi.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">5. Wasiliana Nasi</h3>
              <p>Kwa maswali kuhusu sera hii, wasiliana nasi kupitia info@twendedigital.tech.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}

<footer className="border-t bg-sidebar py-12">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col flex-wrap items-center justify-between gap-6 md:flex-row md:items-center">

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
          <BsShop className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-primary-foreground">DukaSmart</span>
      </div>

      {/* Contact Info */}
      <div className="flex flex-col items-center text-sm text-sidebar-muted gap-2 md:flex-row md:gap-6">
        <a href="tel:+255692671206" className="flex items-center gap-1 hover:text-sidebar-accent transition-colors">
          <Phone className="h-4 w-4" />
          <span>+255 692 671 206</span>
        </a>
        <a href="mailto:twendegital3@gmail.com" className="flex items-center gap-1 hover:text-sidebar-accent transition-colors">
          <Mail className="h-4 w-4" />
          <span>twendegital3@gmail.com</span>
        </a>
      </div>

      {/* Copyright */}
      <p className="text-sm text-sidebar-muted text-center md:text-left">
        © {new Date().getFullYear()} DukaSmart by Twende Digital. Haki zote zimehifadhiwa.
      </p>

    </div>
  </div>
</footer>
    </div>
  );
}
