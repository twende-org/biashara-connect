import { Provider } from "react-redux";
import { store } from "@/store";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { I18nProvider } from "@/lib/i18n";

import AuthGuard from "@/components/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import RoleGuard from "@/components/RoleGuard";
import OrganizationSchema from "@/components/seo/OrganizationSchema";

// Public pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";

// SEO landing pages
import DukaPosSystem from "@/pages/seo/DukaPosSystem";
import TwendeDigital from "@/pages/seo/TwendeDigital";
import DukSmart from "@/pages/seo/DukSmart";

// Public pages (lazy)
const ShopDirectory = lazy(() => import("@/pages/ShopDirectory"));
const ShopDetail = lazy(() => import("@/pages/ShopDetail"));

// Lazy-loaded protected pages
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Shops = lazy(() => import("@/pages/Shops"));
const Products = lazy(() => import("@/pages/Products"));
const Sales = lazy(() => import("@/pages/Sales"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const Suppliers = lazy(() => import("@/pages/Suppliers"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const ProtectedRoutes = () => (
  <AppLayout>
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="maduka" element={<RoleGuard path="/app/maduka"><Shops /></RoleGuard>} />
      <Route path="bidhaa" element={<RoleGuard path="/app/bidhaa"><Products /></RoleGuard>} />
      <Route path="mauzo" element={<RoleGuard path="/app/mauzo"><Sales /></RoleGuard>} />
      <Route path="matumizi" element={<RoleGuard path="/app/matumizi"><Expenses /></RoleGuard>} />
      <Route path="wasambazaji" element={<RoleGuard path="/app/wasambazaji"><Suppliers /></RoleGuard>} />
      <Route path="watumiaji" element={<RoleGuard path="/app/watumiaji"><UserManagement /></RoleGuard>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppLayout>
);

const App = () => (
  <HelmetProvider>
    <Provider store={store}>
      <I18nProvider>
      <TooltipProvider>
        <OrganizationSchema />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Public shop directory */}
              <Route path="/maduka" element={<ShopDirectory />} />
              <Route path="/maduka/:shopId" element={<ShopDetail />} />

              {/* SEO landing pages */}
              <Route path="/duka-pos-system" element={<DukaPosSystem />} />
              <Route path="/twendedigital" element={<TwendeDigital />} />
              <Route path="/duksmart" element={<DukSmart />} />

              {/* Protected routes */}
              <Route
                path="/app/*"
                element={
                  <AuthGuard fallback={<Navigate to="/login" replace />}>
                    <ProtectedRoutes />
                  </AuthGuard>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
      </I18nProvider>
    </Provider>
  </HelmetProvider>
);

export default App;