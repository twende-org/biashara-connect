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

  // ─── Products ───
  "products.title": { sw: "Bidhaa", en: "Products" },
  "products.subtitle": { sw: "Simamia bidhaa zako zote — aina yoyote ya biashara", en: "Manage all your products — any type of business" },
  "products.add": { sw: "Ongeza Bidhaa", en: "Add Product" },
  "products.editTitle": { sw: "Hariri Bidhaa", en: "Edit Product" },
  "products.addTitle": { sw: "Ongeza Bidhaa Mpya", en: "Add New Product" },
  "products.name": { sw: "Jina la Bidhaa", en: "Product Name" },
  "products.brand": { sw: "Brand / Chapa", en: "Brand" },
  "products.category": { sw: "Aina / Category", en: "Category" },
  "products.unit": { sw: "Kipimo / Unit", en: "Unit" },
  "products.buyingPrice": { sw: "Bei ya Kununua (TZS)", en: "Buying Price (TZS)" },
  "products.sellingPrice": { sw: "Bei ya Kuuza (TZS)", en: "Selling Price (TZS)" },
  "products.stock": { sw: "Stoo", en: "Stock" },
  "products.minStock": { sw: "Stoo ya Chini", en: "Min Stock" },
  "products.supplier": { sw: "Msambazaji", en: "Supplier" },
  "products.image": { sw: "Picha ya Bidhaa", en: "Product Image" },
  "products.imageOnly": { sw: "Tafadhali chagua picha tu", en: "Please select images only" },
  "products.imageMaxSize": { sw: "Picha isizidi 5MB", en: "Image must be under 5MB" },
  "products.changeImage": { sw: "Badilisha picha", en: "Change image" },
  "products.clickToSelect": { sw: "Bonyeza kuchagua picha", en: "Click to select image" },
  "products.showMore": { sw: "Onyesha maelezo zaidi", en: "Show more details" },
  "products.hideMore": { sw: "Ficha maelezo zaidi", en: "Hide more details" },
  "products.sku": { sw: "SKU", en: "SKU" },
  "products.barcode": { sw: "Barcode", en: "Barcode" },
  "products.weight": { sw: "Uzito", en: "Weight" },
  "products.size": { sw: "Ukubwa / Size", en: "Size" },
  "products.color": { sw: "Rangi", en: "Color" },
  "products.expiryDate": { sw: "Tarehe ya Kuisha", en: "Expiry Date" },
  "products.status": { sw: "Hali", en: "Status" },
  "products.statusActive": { sw: "Inapatikana", en: "Available" },
  "products.statusInactive": { sw: "Haipo", en: "Inactive" },
  "products.statusDiscontinued": { sw: "Imesitishwa", en: "Discontinued" },
  "products.discount": { sw: "Punguzo % (Discount)", en: "Discount %" },
  "products.tax": { sw: "Kodi % (Tax)", en: "Tax %" },
  "products.warranty": { sw: "Dhamana / Warranty", en: "Warranty" },
  "products.tags": { sw: "Tags (tenganisha kwa koma)", en: "Tags (comma separated)" },
  "products.description": { sw: "Maelezo", en: "Description" },
  "products.update": { sw: "Sasisha", en: "Update" },
  "products.searchPlaceholder": { sw: "Tafuta jina, SKU, barcode, brand...", en: "Search name, SKU, barcode, brand..." },
  "products.allCategories": { sw: "Aina Zote", en: "All Categories" },
  "products.allStatuses": { sw: "Hali Zote", en: "All Statuses" },
  "products.detailTitle": { sw: "Maelezo ya Bidhaa", en: "Product Details" },
  "products.profit": { sw: "Faida", en: "Profit" },
  "products.sellingPriceShort": { sw: "Bei Kuuza", en: "Selling Price" },
  "products.buyingPriceShort": { sw: "Bei Kununua", en: "Buying Price" },
  "products.actions": { sw: "Vitendo", en: "Actions" },
  "products.noProducts": { sw: "Hakuna bidhaa bado", en: "No products yet" },
  "products.addShopFirst": { sw: "Ongeza duka kwanza ili kuona bidhaa", en: "Add a shop first to see products" },
  "products.total": { sw: "Jumla", en: "Total" },
  "products.stockValue": { sw: "Thamani ya Stoo", en: "Stock Value" },
  "products.selectShop": { sw: "Chagua duka kwanza", en: "Select a shop first" },
  "products.updated": { sw: "Bidhaa imesasishwa!", en: "Product updated!" },
  "products.added": { sw: "Bidhaa imeongezwa!", en: "Product added!" },
  "products.deleted": { sw: "Bidhaa imefutwa!", en: "Product deleted!" },
  "products.failed": { sw: "Imeshindikana", en: "Failed" },

  // ─── Sales ───
  "sales.title": { sw: "Mauzo", en: "Sales" },
  "sales.subtitle": { sw: "Rekodi na fuatilia mauzo yako", en: "Record and track your sales" },
  "sales.newSale": { sw: "Mauzo Mapya", en: "New Sale" },
  "sales.recordTitle": { sw: "Rekodi Mauzo Mapya", en: "Record New Sale" },
  "sales.searchPlaceholder": { sw: "Tafuta bidhaa, mteja...", en: "Search product, customer..." },
  "sales.allPayments": { sw: "Malipo Yote", en: "All Payments" },
  "sales.addShopFirst": { sw: "Ongeza duka kwanza", en: "Add a shop first" },
  "sales.completedTab": { sw: "Mauzo Kamili", en: "Completed Sales" },
  "sales.draftsTab": { sw: "Rasimu (Drafts)", en: "Drafts" },
  "sales.product": { sw: "Bidhaa", en: "Product" },
  "sales.customer": { sw: "Mteja", en: "Customer" },
  "sales.quantity": { sw: "Idadi", en: "Quantity" },
  "sales.total": { sw: "Jumla", en: "Total" },
  "sales.payment": { sw: "Malipo", en: "Payment" },
  "sales.date": { sw: "Tarehe", en: "Date" },
  "sales.noSales": { sw: "Hakuna mauzo bado", en: "No sales yet" },
  "sales.totalSales": { sw: "mauzo", en: "sales" },
  "sales.noDrafts": { sw: "Hakuna draft za mauzo", en: "No draft sales" },
  "sales.status": { sw: "Hali", en: "Status" },
  "sales.confirm": { sw: "Thibitisha", en: "Confirm" },
  "sales.selectProduct": { sw: "Chagua bidhaa...", en: "Select product..." },
  "sales.addToCart": { sw: "Ongeza", en: "Add" },
  "sales.price": { sw: "Bei", en: "Price" },
  "sales.grandTotal": { sw: "JUMLA", en: "TOTAL" },
  "sales.paymentMethod": { sw: "Njia ya Malipo", en: "Payment Method" },
  "sales.customerName": { sw: "Jina la Mteja", en: "Customer Name" },
  "sales.customerPhone": { sw: "Simu", en: "Phone" },
  "sales.notes": { sw: "Maelezo", en: "Notes" },
  "sales.optional": { sw: "Si lazima", en: "Optional" },
  "sales.recordSale": { sw: "Rekodi Mauzo", en: "Record Sale" },
  "sales.saveDraft": { sw: "Hifadhi Draft", en: "Save Draft" },
  "sales.stockInsufficient": { sw: "Stoo haitoshi!", en: "Insufficient stock!" },
  "sales.remaining": { sw: "Stoo iliyobaki", en: "Remaining stock" },
  "sales.recorded": { sw: "yamerekodiwa!", en: "recorded!" },
  "sales.draftsSaved": { sw: "zimehifadhiwa", en: "saved" },
  "sales.confirmed": { sw: "yamethibitishwa!", en: "confirmed!" },
  "sales.draftDeleted": { sw: "Draft imefutwa", en: "Draft deleted" },
  "sales.failedRecord": { sw: "Imeshindikana kurekodi mauzo", en: "Failed to record sale" },
  "sales.failedConfirm": { sw: "Imeshindikana kuthibitisha draft", en: "Failed to confirm draft" },
  "sales.failedDelete": { sw: "Imeshindikana kufuta draft", en: "Failed to delete draft" },

  // ─── Expenses ───
  "expenses.title": { sw: "Matumizi", en: "Expenses" },
  "expenses.subtitle": { sw: "Rekodi na fuatilia matumizi ya biashara", en: "Record and track business expenses" },
  "expenses.newExpense": { sw: "Matumizi Mapya", en: "New Expense" },
  "expenses.editTitle": { sw: "Hariri Matumizi", en: "Edit Expense" },
  "expenses.addTitle": { sw: "Rekodi Matumizi Mapya", en: "Record New Expense" },
  "expenses.category": { sw: "Kategoria", en: "Category" },
  "expenses.date": { sw: "Tarehe", en: "Date" },
  "expenses.description": { sw: "Maelezo", en: "Description" },
  "expenses.amount": { sw: "Kiasi (TZS)", en: "Amount (TZS)" },
  "expenses.paymentMethod": { sw: "Njia ya Malipo", en: "Payment Method" },
  "expenses.reference": { sw: "Namba ya Risiti", en: "Receipt Number" },
  "expenses.moreNotes": { sw: "Maelezo Zaidi", en: "Additional Notes" },
  "expenses.saveChanges": { sw: "Hifadhi Mabadiliko", en: "Save Changes" },
  "expenses.record": { sw: "Rekodi Matumizi", en: "Record Expense" },
  "expenses.searchPlaceholder": { sw: "Tafuta matumizi...", en: "Search expenses..." },
  "expenses.allCategories": { sw: "Kategoria Zote", en: "All Categories" },
  "expenses.totalExpenses": { sw: "Jumla Matumizi", en: "Total Expenses" },
  "expenses.count": { sw: "Idadi", en: "Count" },
  "expenses.average": { sw: "Wastani", en: "Average" },
  "expenses.highest": { sw: "Kubwa Zaidi", en: "Highest" },
  "expenses.addShopFirst": { sw: "Ongeza duka kwanza", en: "Add a shop first" },
  "expenses.noExpenses": { sw: "Hakuna matumizi bado", en: "No expenses yet" },
  "expenses.actions": { sw: "Vitendo", en: "Actions" },
  "expenses.fillRequired": { sw: "Jaza taarifa zote muhimu", en: "Fill in all required fields" },
  "expenses.updated": { sw: "Matumizi yamebadilishwa!", en: "Expense updated!" },
  "expenses.recorded": { sw: "Matumizi yamerekodiwa!", en: "Expense recorded!" },
  "expenses.deleted": { sw: "Matumizi yamefutwa", en: "Expense deleted" },
  "expenses.confirmDelete": { sw: "Una uhakika unataka kufuta matumizi haya?", en: "Are you sure you want to delete this expense?" },
  "expenses.failedDelete": { sw: "Imeshindikana kufuta", en: "Failed to delete" },

  // ─── Suppliers ───
  "suppliers.title": { sw: "Wasambazaji", en: "Suppliers" },
  "suppliers.subtitle": { sw: "Simamia wasambazaji wako", en: "Manage your suppliers" },
  "suppliers.add": { sw: "Ongeza Msambazaji", en: "Add Supplier" },
  "suppliers.editTitle": { sw: "Hariri Msambazaji", en: "Edit Supplier" },
  "suppliers.addTitle": { sw: "Ongeza Msambazaji Mpya", en: "Add New Supplier" },
  "suppliers.name": { sw: "Jina", en: "Name" },
  "suppliers.phone": { sw: "Simu", en: "Phone" },
  "suppliers.email": { sw: "Barua Pepe", en: "Email" },
  "suppliers.address": { sw: "Anwani", en: "Address" },
  "suppliers.products": { sw: "Bidhaa", en: "Products" },
  "suppliers.notes": { sw: "Maelezo", en: "Notes" },
  "suppliers.searchPlaceholder": { sw: "Tafuta msambazaji...", en: "Search supplier..." },
  "suppliers.noSuppliers": { sw: "Hakuna wasambazaji bado", en: "No suppliers yet" },
  "suppliers.updated": { sw: "Msambazaji amesasishwa!", en: "Supplier updated!" },
  "suppliers.added": { sw: "Msambazaji ameongezwa!", en: "Supplier added!" },
  "suppliers.deleted": { sw: "Msambazaji amefutwa!", en: "Supplier deleted!" },
  "suppliers.update": { sw: "Sasisha", en: "Update" },

  // ─── Shops ───
  "shops.title": { sw: "Maduka", en: "Shops" },
  "shops.subtitle": { sw: "Simamia maduka yako yote", en: "Manage all your shops" },
  "shops.add": { sw: "Ongeza Duka", en: "Add Shop" },
  "shops.editTitle": { sw: "Hariri Duka", en: "Edit Shop" },
  "shops.addTitle": { sw: "Ongeza Duka Jipya", en: "Add New Shop" },
  "shops.name": { sw: "Jina la Duka", en: "Shop Name" },
  "shops.location": { sw: "Mahali", en: "Location" },
  "shops.phone": { sw: "Simu", en: "Phone" },
  "shops.description": { sw: "Maelezo", en: "Description" },
  "shops.locationHint": { sw: "Andika anwani kamili — tutapata coordinates kupitia Google Maps", en: "Enter full address — we'll find coordinates via Google Maps" },
  "shops.searchPlaceholder": { sw: "Tafuta duka...", en: "Search shop..." },
  "shops.noShops": { sw: "Hakuna maduka bado. Ongeza duka lako la kwanza!", en: "No shops yet. Add your first shop!" },
  "shops.updated": { sw: "Duka limesasishwa!", en: "Shop updated!" },
  "shops.added": { sw: "Duka limeongezwa!", en: "Shop added!" },
  "shops.deleted": { sw: "Duka limefutwa!", en: "Shop deleted!" },
  "shops.update": { sw: "Sasisha", en: "Update" },

  // ─── User Management ───
  "users.title": { sw: "Usimamizi wa Watumiaji", en: "User Management" },
  "users.subtitle": { sw: "Wape watumiaji majukumu kwenye maduka", en: "Assign roles to users in shops" },
  "users.addUser": { sw: "Ongeza Mtumiaji", en: "Add User" },
  "users.addToShop": { sw: "Ongeza Mtumiaji kwenye Duka", en: "Add User to Shop" },
  "users.userEmail": { sw: "Barua Pepe ya Mtumiaji", en: "User Email" },
  "users.role": { sw: "Jukumu", en: "Role" },
  "users.assignRole": { sw: "Weka Jukumu", en: "Assign Role" },
  "users.selectShop": { sw: "Chagua Duka", en: "Select Shop" },
  "users.selectShopPlaceholder": { sw: "Chagua duka...", en: "Select a shop..." },
  "users.selectShopFirst": { sw: "Chagua duka ili kuona watumiaji", en: "Select a shop to see users" },
  "users.noUsers": { sw: "Hakuna watumiaji kwa duka hili", en: "No users for this shop" },
  "users.noUsersHint": { sw: "Bonyeza \"Ongeza Mtumiaji\" kuongeza", en: "Click \"Add User\" to add" },
  "users.loading": { sw: "Inapakia...", en: "Loading..." },
  "users.name": { sw: "Jina", en: "Name" },
  "users.email": { sw: "Barua Pepe", en: "Email" },
  "users.actions": { sw: "Vitendo", en: "Actions" },
  "users.notFound": { sw: "Mtumiaji hayupo. Hakikisha amesajiliwa kwanza.", en: "User not found. Make sure they registered first." },
  "users.assigned": { sw: "Mtumiaji amepewa jukumu!", en: "User role assigned!" },
  "users.removed": { sw: "Mtumiaji ameondolewa", en: "User removed" },
  "users.failedLoad": { sw: "Imeshindikana kupakia watumiaji", en: "Failed to load users" },
  "users.unknown": { sw: "Haijulikani", en: "Unknown" },

  // ─── NotFound ───
  "notFound.title": { sw: "Ukurasa haujapatikana", en: "Page not found" },
  "notFound.back": { sw: "Rudi Nyumbani", en: "Return to Home" },
  // ─── PWA ───
  "pwa.offline": { sw: "Huna mtandao — unatumia hali ya nje ya mtandao", en: "You're offline — using offline mode" },
  "pwa.installTitle": { sw: "Sakinisha DukaSmart", en: "Install DukaSmart" },
  "pwa.installDesc": { sw: "Ongeza kwenye skrini yako kuu ili upate ufikiaji wa haraka na utumie bila mtandao", en: "Add to your home screen for quick access and offline use" },
  "pwa.installBtn": { sw: "Sakinisha Sasa", en: "Install Now" },

  // ─── WhatsApp ───
  "whatsapp.shareReceipt": { sw: "Tuma Risiti WhatsApp", en: "Share Receipt via WhatsApp" },
  "whatsapp.sendToCustomer": { sw: "Tuma kwa Mteja", en: "Send to Customer" },
  "whatsapp.shareGeneral": { sw: "Shiriki WhatsApp", en: "Share via WhatsApp" },
  "whatsapp.lowStockAlert": { sw: "Tuma Tahadhari WhatsApp", en: "Send Low Stock Alert" },
  "whatsapp.lowStockTitle": { sw: "Bidhaa Zimepungua", en: "Low Stock Products" },
  "whatsapp.noLowStock": { sw: "Hakuna bidhaa zilizopungua", en: "No low stock products" },
  "whatsapp.notifyCustomer": { sw: "Arifu Mteja WhatsApp", en: "Notify Customer via WhatsApp" },
  "whatsapp.enterPhone": { sw: "Weka nambari ya simu", en: "Enter phone number" },
  "whatsapp.send": { sw: "Tuma", en: "Send" },

  // ─── Admin Panel ───
  "admin.dashboard": { sw: "Dashibodi", en: "Dashboard" },
  "admin.users": { sw: "Watumiaji", en: "Users" },
  "admin.payments": { sw: "Malipo", en: "Payments" },
  "admin.unauthorized": { sw: "Hauruhusiwi", en: "Unauthorized" },
  "admin.unauthorizedDesc": { sw: "Huna ruhusa ya kufikia paneli ya msimamizi", en: "You don't have permission to access the admin panel" },
  "admin.backToApp": { sw: "Rudi kwenye App", en: "Back to App" },
  "admin.totalUsers": { sw: "Watumiaji Wote", en: "Total Users" },
  "admin.activeSubscriptions": { sw: "Usajili Hai", en: "Active Subscriptions" },
  "admin.pendingPayments": { sw: "Malipo Yanayosubiri", en: "Pending Payments" },
  "admin.totalShops": { sw: "Maduka Yote", en: "Total Shops" },
  "admin.monthlyRevenue": { sw: "Mapato ya Mwezi", en: "Monthly Revenue" },
  "admin.dashboardTitle": { sw: "Paneli ya Msimamizi", en: "Admin Dashboard" },
  "admin.dashboardDesc": { sw: "Muhtasari wa mfumo mzima", en: "System-wide overview" },
  "admin.allUsers": { sw: "Watumiaji Wote", en: "All Users" },
  "admin.usersDesc": { sw: "Simamia watumiaji wote wa mfumo", en: "Manage all system users" },
  "admin.searchUsers": { sw: "Tafuta mtumiaji...", en: "Search user..." },
  "admin.noUsers": { sw: "Hakuna watumiaji", en: "No users found" },
  "admin.plan": { sw: "Mpango", en: "Plan" },
  "admin.status": { sw: "Hali", en: "Status" },
  "admin.paymentsTitle": { sw: "Usimamizi wa Malipo", en: "Payment Management" },
  "admin.paymentsDesc": { sw: "Thibitisha malipo na simamia usajili", en: "Confirm payments and manage subscriptions" },
  "admin.assignPlan": { sw: "Weka Mpango", en: "Assign Plan" },
  "admin.selectUser": { sw: "Chagua Mtumiaji", en: "Select User" },
  "admin.planLimits": { sw: "Mipaka ya mpango", en: "Plan limits" },
  "admin.shops": { sw: "maduka", en: "shops" },
  "admin.products": { sw: "bidhaa", en: "products" },
  "admin.staff": { sw: "wafanyakazi", en: "staff" },
  "admin.confirmAssign": { sw: "Thibitisha na Weka", en: "Confirm & Assign" },
  "admin.searchPayments": { sw: "Tafuta malipo...", en: "Search payments..." },
  "admin.statusActive": { sw: "Hai", en: "Active" },
  "admin.statusPending": { sw: "Inasubiri", en: "Pending" },
  "admin.statusExpired": { sw: "Imeisha", en: "Expired" },
  "admin.noPayments": { sw: "Hakuna malipo bado", en: "No payments yet" },
  "admin.paymentConfirmed": { sw: "Malipo yamethibitishwa!", en: "Payment confirmed!" },
  "admin.confirm": { sw: "Thibitisha", en: "Confirm" },
  "admin.expire": { sw: "Sitisha", en: "Expire" },

  // ─── Subscription / Limits ───
  "subscription.free": { sw: "Bure", en: "Free" },
  "subscription.freePlan": { sw: "Mpango wa Bure", en: "Free Plan" },
  "subscription.upgrade": { sw: "Boresha Mpango", en: "Upgrade Plan" },
  "subscription.shopLimit": { sw: "Umefika kikomo cha maduka kwa mpango wako", en: "You've reached the shop limit for your plan" },
  "subscription.productLimit": { sw: "Umefika kikomo cha bidhaa kwa mpango wako", en: "You've reached the product limit for your plan" },
  "subscription.currentPlan": { sw: "Mpango wako", en: "Your plan" },
  "subscription.upgradeDesc": { sw: "Boresha ili upate maduka na bidhaa zaidi", en: "Upgrade to get more shops and products" },

  // ─── Landing Free Plan ───
  "plan.free": { sw: "Bure", en: "Free" },
  "plan.freeDesc": { sw: "Kwa kuanza — milele bure", en: "To get started — free forever" },
  "plan.freeShop": { sw: "Duka 1", en: "1 Shop" },
  "plan.freeProducts": { sw: "Bidhaa hadi 20", en: "Up to 20 products" },
  "plan.freeOnline": { sw: "Duka linaonekana mtandaoni", en: "Shop visible online" },
  "plan.startFree": { sw: "Anza Bure", en: "Start Free" },
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
