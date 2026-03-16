import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Search,
  Store,
  MapPin,
  Phone,
  Package,
  ArrowLeft,
  Menu,
  X,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { BsShop } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { getAllShops, getProductsByShop } from "@/lib/firestore";
import type { Shop, Product } from "@/types";

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-low" | "price-high">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      if (!shopId) return;
      try {
        const allShops = await getAllShops();
        const found = allShops.find((s) => s.id === shopId);
        setShop(found || null);

        const prods = await getProductsByShop(shopId);
        setProducts(prods.filter((p) => p.status !== "inactive" && p.status !== "discontinued"));
      } catch (err) {
        console.error("Failed to load shop:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shopId]);

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))].sort(),
    [products]
  );

  const filtered = useMemo(() => {
    let result = products;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === "price-low") return a.sellingPrice - b.sellingPrice;
      if (sortBy === "price-high") return b.sellingPrice - a.sellingPrice;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const navLinks = [
    { label: "Nyumbani", href: "/" },
    { label: "Maduka", href: "/maduka" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <Store className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-bold text-foreground">Duka halipatikani</h2>
        <Link to="/maduka"><Button variant="outline">Rudi kwenye Maduka</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${shop.name} — Bidhaa na Bei | DukaSmart`}
        description={`Tazama bidhaa za ${shop.name} ${shop.location ? "- " + shop.location : ""}. Bei bora na bidhaa bora kwenye DukaSmart.`}
        keywords={`${shop.name}, bidhaa, bei, duka, ${shop.location || ""}`}
        canonical={`/maduka/${shop.id}`}
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
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {l.label}
              </Link>
            ))}
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
            {navLinks.map((l) => (
              <Link key={l.href} to={l.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Shop Header */}
      <section className="border-b bg-muted/30 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/maduka" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Rudi kwenye Maduka
          </Link>
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-20 sm:w-20">
              <Store className="h-8 w-8 sm:h-10 sm:w-10" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{shop.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {shop.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {shop.location}</span>
                )}
                {shop.phone && (
                  <a href={`tel:${shop.phone}`} className="flex items-center gap-1 hover:text-foreground">
                    <Phone className="h-4 w-4" /> {shop.phone}
                  </a>
                )}
                <span className="flex items-center gap-1"><Package className="h-4 w-4" /> {products.length} bidhaa</span>
              </div>
              {shop.description && (
                <p className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">{shop.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tafuta bidhaa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Kategoria zote</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="name">Jina (A-Z)</option>
              <option value="price-low">Bei (Chini)</option>
              <option value="price-high">Bei (Juu)</option>
            </select>
            <div className="hidden sm:flex items-center border rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <p className="mb-4 text-sm text-muted-foreground">
          <strong className="text-foreground">{filtered.length}</strong> bidhaa zimepatikana
        </p>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-3 text-lg font-bold text-foreground">Hakuna bidhaa</h3>
            <p className="mt-1 text-sm text-muted-foreground">Jaribu kubadilisha maneno ya utafutaji.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <div key={product.id} className="group rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20">
                {/* Image */}
                <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  )}
                </div>
                <Badge variant="secondary" className="text-xs mb-2">{product.category}</Badge>
                <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
                {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    TZS {product.sellingPrice.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <span className={product.stock > 0 ? "text-accent" : "text-destructive"}>
                    {product.stock > 0 ? `Inapatikana (${product.stock})` : "Imeisha"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => (
              <div key={product.id} className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground truncate">{product.name}</h4>
                    <Badge variant="secondary" className="text-xs shrink-0">{product.category}</Badge>
                  </div>
                  {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-primary">TZS {product.sellingPrice.toLocaleString()}</p>
                  <p className={`text-xs ${product.stock > 0 ? "text-accent" : "text-destructive"}`}>
                    {product.stock > 0 ? `Inapatikana (${product.stock})` : "Imeisha"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t bg-sidebar py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col flex-wrap items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <BsShop className="h-4 w-4 text-sidebar-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-sidebar-primary-foreground">DukaSmart</span>
            </div>
            <p className="text-sm text-sidebar-muted">
              © {new Date().getFullYear()} DukaSmart by Twende Digital. Haki zote zimehifadhiwa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
