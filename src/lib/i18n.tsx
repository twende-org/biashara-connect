import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "sw" | "en";

const translations = {
  // ─── Common ───
  "app.name": { sw: "DukaSmart", en: "DukaSmart" },
  "common.loading": { sw: "Inaendelea...", en: "Loading..." },
  "common.save": { sw: "Hifadhi", en: "Save" },
  "common.cancel": { sw: "Ghairi", en: "Cancel" },
  "common.delete": { sw: "Futa", en: "Delete" },
  "common.edit": { sw: "Hariri", en: "Edit" },
  "common.add": { sw: "Ongeza", en: "Add" },
  "common.search": { sw: "Tafuta", en: "Search" },
  "common.close": { sw: "Funga", en: "Close" },
  "common.back": { sw: "Rudi", en: "Back" },
  "common.yes": { sw: "Ndiyo", en: "Yes" },
  "common.no": { sw: "Hapana", en: "No" },
  "common.all": { sw: "Zote", en: "All" },

  // ─── Auth ───
  "auth.login": { sw: "Ingia", en: "Login" },
  "auth.register": { sw: "Jisajili", en: "Register" },
  "auth.logout": { sw: "Toka", en: "Logout" },
  "auth.email": { sw: "Barua pepe", en: "Email" },
  "auth.password": { sw: "Nywila", en: "Password" },
  "auth.confirmPassword": { sw: "Thibitisha nywila", en: "Confirm password" },
  "auth.yourName": { sw: "Jina lako", en: "Your name" },
  "auth.welcomeBack": { sw: "Karibu Tena", en: "Welcome Back" },
  "auth.loginSubtitle": { sw: "Ingia kwenye akaunti yako", en: "Sign in to your account" },
  "auth.forgotPassword": { sw: "Umesahau nywila?", en: "Forgot password?" },
  "auth.noAccount": { sw: "Huna akaunti?", en: "Don't have an account?" },
  "auth.hasAccount": { sw: "Una akaunti tayari?", en: "Already have an account?" },
  "auth.registerTitle": { sw: "Jisajili", en: "Register" },
  "auth.registerSubtitle": { sw: "Fungua akaunti mpya ya DukaSmart", en: "Create a new DukaSmart account" },
  "auth.registerFree": { sw: "Jisajili Bure", en: "Register Free" },
  "auth.passwordMismatch": { sw: "Nywila hazifanani", en: "Passwords don't match" },
  "auth.passwordTooShort": { sw: "Nywila lazima iwe na angalau herufi 6", en: "Password must be at least 6 characters" },
  "auth.forgotTitle": { sw: "Umesahau Nywila?", en: "Forgot Password?" },
  "auth.forgotSubtitle": { sw: "Weka barua pepe yako ili upate maelekezo", en: "Enter your email to get instructions" },
  "auth.sendInstructions": { sw: "Tuma Maelekezo", en: "Send Instructions" },
  "auth.checkEmail": { sw: "Angalia Barua Pepe", en: "Check Your Email" },
  "auth.resetSent": { sw: "Tumekutumia maelekezo ya kubadilisha nywila kwenye", en: "We sent password reset instructions to" },
  "auth.backToLogin": { sw: "Rudi kwenye Kuingia", en: "Back to Login" },

  // ─── Navigation ───
  "nav.dashboard": { sw: "Dashibodi", en: "Dashboard" },
  "nav.shops": { sw: "Maduka", en: "Shops" },
  "nav.products": { sw: "Bidhaa", en: "Products" },
  "nav.sales": { sw: "Mauzo", en: "Sales" },
  "nav.expenses": { sw: "Matumizi", en: "Expenses" },
  "nav.suppliers": { sw: "Wasambazaji", en: "Suppliers" },
  "nav.users": { sw: "Watumiaji", en: "Users" },
  "nav.home": { sw: "Nyumbani", en: "Home" },
  "nav.about": { sw: "Kuhusu", en: "About" },
  "nav.pricing": { sw: "Bei", en: "Pricing" },
  "nav.howItWorks": { sw: "Jinsi Inavyofanya Kazi", en: "How It Works" },
  "nav.privacy": { sw: "Sera ya Faragha", en: "Privacy Policy" },

  // ─── Layout ───
  "layout.selectShop": { sw: "Chagua Duka", en: "Select Shop" },
  "layout.user": { sw: "Mtumiaji", en: "User" },

  // ─── Roles ───
  "role.owner": { sw: "Mmiliki", en: "Owner" },
  "role.manager": { sw: "Meneja", en: "Manager" },
  "role.attendant": { sw: "Muuzaji", en: "Attendant" },

  // ─── Dashboard ───
  "dashboard.title": { sw: "Dashibodi", en: "Dashboard" },
  "dashboard.subtitle": { sw: "Muhtasari wa biashara yako ya leo", en: "Your business summary for today" },
  "dashboard.todaySales": { sw: "Mauzo ya Leo", en: "Today's Sales" },
  "dashboard.todayProfit": { sw: "Faida ya Leo", en: "Today's Profit" },
  "dashboard.totalProducts": { sw: "Bidhaa Zote", en: "All Products" },
  "dashboard.lowStock": { sw: "Stoo ya Chini", en: "Low Stock" },
  "dashboard.warning": { sw: "Tahadhari!", en: "Warning!" },
  "dashboard.ok": { sw: "Sawa", en: "OK" },
  "dashboard.sales": { sw: "mauzo", en: "sales" },
  "dashboard.weeklySales": { sw: "Mauzo ya Wiki (Siku 7 zilizopita)", en: "Weekly Sales (Last 7 Days)" },
  "dashboard.stockAlert": { sw: "Tahadhari ya Stoo", en: "Stock Alert" },
  "dashboard.noLowStock": { sw: "Hakuna bidhaa yenye stoo ya chini 🎉", en: "No low stock products 🎉" },
  "dashboard.remaining": { sw: "zilizobaki", en: "remaining" },
  "dashboard.recentSales": { sw: "Mauzo ya Hivi Karibuni", en: "Recent Sales" },
  "dashboard.noSalesYet": { sw: "Hakuna mauzo bado", en: "No sales yet" },
  "dashboard.addShopFirst": { sw: "Ongeza duka kwanza ili kuona takwimu", en: "Add a shop first to see stats" },
  "dashboard.recentActivity": { sw: "Shughuli za Hivi Karibuni", en: "Recent Activity" },
  "dashboard.noActivity": { sw: "Hakuna shughuli zilizorekodiwa bado", en: "No activity recorded yet" },

  // ─── Days ───
  "day.sunday": { sw: "Jumapili", en: "Sun" },
  "day.monday": { sw: "Jumatatu", en: "Mon" },
  "day.tuesday": { sw: "Jumanne", en: "Tue" },
  "day.wednesday": { sw: "Jumatano", en: "Wed" },
  "day.thursday": { sw: "Alhamisi", en: "Thu" },
  "day.friday": { sw: "Ijumaa", en: "Fri" },
  "day.saturday": { sw: "Jumamosi", en: "Sat" },

  // ─── Landing ───
  "landing.heroTag": { sw: "Sasa duka lako linaonekana mtandaoni!", en: "Your shop is now visible online!" },
  "landing.heroTitle1": { sw: "Simamia Duka Lako", en: "Manage Your Shop" },
  "landing.heroTitle2": { sw: "na Litangaze Mtandaoni", en: "& Advertise It Online" },
  "landing.heroDesc": { sw: "DukaSmart ni mfumo kamili wa kusimamia duka lako — bidhaa, mauzo, wafanyakazi, na ripoti — huku ukilitangaza mtandaoni ili wateja wapya wakupate kwa urahisi.", en: "DukaSmart is a complete system for managing your shop — products, sales, staff, and reports — while advertising online so new customers find you easily." },
  "landing.startFree": { sw: "Anza Bure Sasa", en: "Start Free Now" },
  "landing.viewShops": { sw: "Tazama Maduka", en: "View Shops" },
  "landing.featuresTitle": { sw: "Simamia Ndani, Tangaza Nje", en: "Manage Inside, Advertise Outside" },
  "landing.featuresDesc": { sw: "DukaSmart inakusaidia kusimamia biashara yako kwa ufanisi — na wakati huo huo duka lako linaonekana kwa wateja wapya mtandaoni.", en: "DukaSmart helps you manage your business efficiently — while your shop is visible to new customers online." },
  "landing.howItWorksTitle": { sw: "Jinsi Inavyofanya Kazi", en: "How It Works" },
  "landing.howItWorksDesc": { sw: "Hatua 4 rahisi kuanza kusimamia biashara yako", en: "4 simple steps to start managing your business" },
  "landing.pricingTitle": { sw: "Bei Rahisi na Wazi", en: "Simple & Transparent Pricing" },
  "landing.pricingDesc": { sw: "Chagua mpango unaokufaa. Hakuna gharama za siri.", en: "Choose the plan that fits you. No hidden fees." },
  "landing.faqTitle": { sw: "Maswali Yanayoulizwa Mara kwa Mara", en: "Frequently Asked Questions" },
  "landing.popular": { sw: "MAARUFU", en: "POPULAR" },
  "landing.copyright": { sw: "Haki zote zimehifadhiwa.", en: "All rights reserved." },

  // ─── Landing Features ───
  "feature.manageProducts": { sw: "Simamia Bidhaa", en: "Manage Products" },
  "feature.manageProductsDesc": { sw: "Fuatilia stoo, bei, SKU, expiry na maelezo yote ya bidhaa zako kwa urahisi — kila kitu sehemu moja.", en: "Track stock, prices, SKU, expiry, and all product details easily — everything in one place." },
  "feature.advertiseShop": { sw: "Tangaza Duka Lako", en: "Advertise Your Shop" },
  "feature.advertiseShopDesc": { sw: "Duka lako linaonekana mtandaoni. Wateja wapya wanaweza kutafuta na kupata bidhaa zako moja kwa moja.", en: "Your shop is visible online. New customers can search and find your products directly." },
  "feature.salesReports": { sw: "Mauzo & Ripoti", en: "Sales & Reports" },
  "feature.salesReportsDesc": { sw: "Rekodi mauzo kwa njia ya kitaalamu na upate ripoti za kina za faida, hasara, na mwenendo.", en: "Record sales professionally and get detailed profit, loss, and trend reports." },
  "feature.searchShops": { sw: "Tafuta Maduka & Bidhaa", en: "Search Shops & Products" },
  "feature.searchShopsDesc": { sw: "Wateja wanaweza kutafuta maduka na bidhaa kwa eneo, kategoria, na bei — wapate wanachohitaji haraka.", en: "Customers can search shops and products by location, category, and price — find what they need fast." },
  "feature.teamRoles": { sw: "Timu & Majukumu", en: "Team & Roles" },
  "feature.teamRolesDesc": { sw: "Ongeza wafanyakazi na uwape majukumu tofauti — mmiliki, meneja, au mhudumu.", en: "Add staff and assign different roles — owner, manager, or attendant." },
  "feature.workAnywhere": { sw: "Fanya Kazi Popote", en: "Work Anywhere" },
  "feature.workAnywhereDesc": { sw: "Tumia simu, tablet au kompyuta — DukaSmart inafanya kazi kwenye kifaa chochote.", en: "Use phone, tablet, or computer — DukaSmart works on any device." },

  // ─── Landing Steps ───
  "step.1.title": { sw: "Jisajili Bure", en: "Register Free" },
  "step.1.desc": { sw: "Fungua akaunti kwa dakika chache tu kwa barua pepe na nywila.", en: "Create an account in just minutes with email and password." },
  "step.2.title": { sw: "Ongeza Duka Lako", en: "Add Your Shop" },
  "step.2.desc": { sw: "Weka maelezo ya duka lako — jina, eneo, picha — na litangazwe mtandaoni mara moja.", en: "Enter your shop details — name, location, photo — and it goes online immediately." },
  "step.3.title": { sw: "Ongeza Bidhaa", en: "Add Products" },
  "step.3.desc": { sw: "Ingiza bidhaa zako na maelezo kamili. Wateja wataziona moja kwa moja kwenye duka lako la mtandaoni.", en: "Enter your products with full details. Customers will see them directly on your online shop." },
  "step.4.title": { sw: "Simamia & Tangaza!", en: "Manage & Advertise!" },
  "step.4.desc": { sw: "Rekodi mauzo, fuatilia faida, na duka lako linaendelea kuvutia wateja wapya mtandaoni.", en: "Record sales, track profits, and your shop keeps attracting new customers online." },

  // ─── Landing Plans ───
  "plan.small": { sw: "Ndogo", en: "Small" },
  "plan.smallDesc": { sw: "Kwa maduka madogo madogo yanayoanza", en: "For small shops just starting" },
  "plan.business": { sw: "Biashara", en: "Business" },
  "plan.businessDesc": { sw: "Kwa biashara zinazokua", en: "For growing businesses" },
  "plan.enterprise": { sw: "Kampuni", en: "Enterprise" },
  "plan.enterpriseDesc": { sw: "Kwa biashara kubwa", en: "For large businesses" },
  "plan.startSmall": { sw: "Anza Ndogo", en: "Start Small" },
  "plan.startNow": { sw: "Anza Sasa", en: "Start Now" },
  "plan.contactUs": { sw: "Wasiliana Nasi", en: "Contact Us" },
  "plan.shop1": { sw: "Duka 1", en: "1 Shop" },
  "plan.products50": { sw: "Bidhaa hadi 50", en: "Up to 50 products" },
  "plan.onlineShop": { sw: "Duka linaonekana mtandaoni", en: "Shop visible online" },
  "plan.basicReports": { sw: "Ripoti za msingi", en: "Basic reports" },
  "plan.shops5": { sw: "Maduka 5", en: "5 Shops" },
  "plan.unlimitedProducts": { sw: "Bidhaa zisizopungua", en: "Unlimited products" },
  "plan.staff10": { sw: "Wafanyakazi 10", en: "10 Staff" },
  "plan.shopsOnline": { sw: "Maduka yanayoonekana mtandaoni", en: "Shops visible online" },
  "plan.detailedReports": { sw: "Ripoti za kina", en: "Detailed reports" },
  "plan.prioritySupport": { sw: "Msaada wa kipaumbele", en: "Priority support" },
  "plan.unlimitedShops": { sw: "Maduka yasiyopungua", en: "Unlimited shops" },
  "plan.unlimitedStaff": { sw: "Wafanyakazi wasiopungua", en: "Unlimited staff" },
  "plan.support247": { sw: "Msaada 24/7", en: "24/7 Support" },

  // ─── Landing FAQs ───
  "faq.1.q": { sw: "Je, DukaSmart ni bure?", en: "Is DukaSmart free?" },
  "faq.1.a": { sw: "Hapana, lakini tuna mpango wa Ndogo unaofaa maduka madogo madogo. Mpango huu unakuruhusu kusimamia duka 1 na bidhaa hadi 50 kwa Tsh 9,900/mwezi. Unaweza kuboresha mpango wakati wowote.", en: "No, but we have a Small plan suitable for small shops. This plan lets you manage 1 shop and up to 50 products for Tsh 9,900/month. You can upgrade anytime." },
  "faq.2.q": { sw: "Je, wateja wanaweza kuona duka langu?", en: "Can customers see my shop?" },
  "faq.2.a": { sw: "Ndiyo! Ukishasajili duka lako na kuongeza bidhaa, duka lako litaonekana kwenye sehemu ya Maduka ambapo wateja wanaweza kutafuta na kupata bidhaa zako.", en: "Yes! Once you register your shop and add products, your shop will appear in the Shops section where customers can search and find your products." },
  "faq.3.q": { sw: "Je, data yangu ni salama?", en: "Is my data safe?" },
  "faq.3.a": { sw: "Kabisa. Tunatumia teknolojia za kisasa za usalama kulinda data yako. Hatushiriki data yako na mtu yeyote.", en: "Absolutely. We use modern security technology to protect your data. We don't share your data with anyone." },
  "faq.4.q": { sw: "Je, ninaweza kutumia simu yangu?", en: "Can I use my phone?" },
  "faq.4.a": { sw: "Ndiyo, DukaSmart imejengwa kufanya kazi vizuri kwenye simu, tablet na kompyuta.", en: "Yes, DukaSmart is built to work well on phones, tablets, and computers." },
  "faq.5.q": { sw: "Je, ninaweza kuongeza wafanyakazi?", en: "Can I add staff?" },
  "faq.5.a": { sw: "Ndiyo! Unaweza kuwapa majukumu tofauti — mmiliki, meneja, au mhudumu — kila mmoja na ruhusa zake.", en: "Yes! You can assign different roles — owner, manager, or attendant — each with their own permissions." },

  // ─── Privacy ───
  "privacy.title": { sw: "Sera ya Faragha", en: "Privacy Policy" },
  "privacy.section1.title": { sw: "1. Taarifa Tunazokusanya", en: "1. Information We Collect" },
  "privacy.section1.desc": { sw: "Tunakusanya taarifa unazotupa wakati wa kusajili akaunti: jina, barua pepe, na namba ya simu. Pia tunakusanya taarifa za biashara yako kama bidhaa, mauzo, na matumizi.", en: "We collect information you provide when registering: name, email, and phone number. We also collect business information like products, sales, and expenses." },
  "privacy.section2.title": { sw: "2. Matumizi ya Taarifa", en: "2. Use of Information" },
  "privacy.section2.desc": { sw: "Taarifa zako zinatumika tu kutoa huduma bora zaidi kwako. Hatauzi wala kushiriki taarifa zako na kampuni za nje.", en: "Your information is used only to provide better services. We don't sell or share your information with external companies." },
  "privacy.section3.title": { sw: "3. Usalama", en: "3. Security" },
  "privacy.section3.desc": { sw: "Tunatumia teknolojia za kisasa za usalama ikiwa ni pamoja na Firebase Authentication na Firestore Security Rules kulinda data yako.", en: "We use modern security technology including Firebase Authentication and Firestore Security Rules to protect your data." },
  "privacy.section4.title": { sw: "4. Haki Zako", en: "4. Your Rights" },
  "privacy.section4.desc": { sw: "Una haki ya kuomba nakala ya data yako, kusahihisha makosa, au kufuta akaunti yako wakati wowote kwa kuwasiliana nasi.", en: "You have the right to request a copy of your data, correct errors, or delete your account at any time by contacting us." },
  "privacy.section5.title": { sw: "5. Wasiliana Nasi", en: "5. Contact Us" },
  "privacy.section5.desc": { sw: "Kwa maswali kuhusu sera hii, wasiliana nasi kupitia info@twendedigital.tech.", en: "For questions about this policy, contact us at info@twendedigital.tech." },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("dukasmart-lang");
    return (saved === "en" || saved === "sw") ? saved : "sw";
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem("dukasmart-lang", l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "sw" ? "en" : "sw");
  }, [lang, setLang]);

  const t = useCallback((key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.sw || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
