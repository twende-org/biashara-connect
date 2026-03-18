import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Store,
  MapPin,
  Phone,
  Package,
  X,
  ArrowRight,
  SlidersHorizontal,
  Menu,
  Navigation,
} from "lucide-react";
import { BsShop } from "react-icons/bs";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import ShopMap from "@/components/ShopMap";
import { getAllShops, getProductsByShop } from "@/lib/firestore";
import type { Shop, Product } from "@/types";

interface ShopWithProducts extends Shop {
  products: Product[];
  productCount: number;
  categories: string[];
}

const navLinks = [
  { label: "Nyumbani", href: "/" },
  { label: "Maduka", href: "/maduka" },
];

export default function ShopDirectory() {
  const [shops, setShops] = useState<ShopWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "products" | "location">("name");

  useEffect(() => {
    async function load() {
      try {
        const allShops = await getAllShops();
        const enriched: ShopWithProducts[] = await Promise.all(
          allShops.map(async (shop) => {
            const products = await getProductsByShop(shop.id);
            const activeProducts = products.filter((p) => p.status !== "inactive" && p.status !== "discontinued");
            const categories = [...new Set(activeProducts.map((p) => p.category).filter(Boolean))];
            return { ...shop, products: activeProducts, productCount: activeProducts.length, categories };
          })
        );
        setShops(enriched);
      } catch (err) {
        console.error("Failed to load shops:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Derived filter options
  const allLocations = useMemo(
    () => [...new Set(shops.map((s) => s.location).filter(Boolean))].sort(),
    [shops]
  );
  const allCategories = useMemo(
    () => [...new Set(shops.flatMap((s) => s.categories))].sort(),
    [shops]
  );

  // Filtered & sorted shops
  const filteredShops = useMemo(() => {
    let result = shops;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.products.some((p) => p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q))
      );
    }

    if (selectedLocation) {
      result = result.filter((s) => s.location === selectedLocation);
    }

    if (selectedCategory) {
      result = result.filter((s) => s.categories.includes(selectedCategory));
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "products") return b.productCount - a.productCount;
      if (sortBy === "location") return (a.location || "").localeCompare(b.location || "");
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [shops, searchQuery, selectedLocation, selectedCategory, sortBy]);

  const activeFilters = [selectedLocation, selectedCategory].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedCategory("");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Maduka Yote — Tafuta Duka na Bidhaa | DukaSmart"
        description="Gundua maduka na bidhaa bora karibu nawe. Tafuta, linganisha bei, na upate unachohitaji kwenye DukaSmart."
        keywords="maduka, bidhaa, duka, tafuta duka, shop directory, products tanzania, bei, dukasmart"
        canonical="/maduka"
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
              <Link
                key={l.href}
                to={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
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
              <Link
                key={l.href}
                to={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link to="/login"><Button variant="outline" className="w-full">Ingia</Button></Link>
              <Link to="/register"><Button className="w-full">Jisajili Bure</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-muted/30 py-12 sm:py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(36_90%_50%/0.08),transparent_70%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Gundua Maduka na Bidhaa
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Tafuta maduka bora, linganisha bidhaa, na upate unachohitaji kwa urahisi.
          </p>

          {/* Main Search */}
          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tafuta duka, bidhaa, au eneo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 rounded-2xl border-2 pl-12 pr-14 text-base shadow-sm focus-visible:ring-primary"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Store className="h-4 w-4 text-primary" />
              <strong className="text-foreground">{shops.length}</strong> maduka
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="h-4 w-4 text-primary" />
              <strong className="text-foreground">{shops.reduce((sum, s) => sum + s.productCount, 0)}</strong> bidhaa
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              <strong className="text-foreground">{allLocations.length}</strong> maeneo
            </span>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
              {/* Location Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Eneo</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Maeneo yote</option>
                  {allLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex-1 min-w-[200px]">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Kategoria ya Bidhaa</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Kategoria zote</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1 min-w-[200px]">
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Panga kwa</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="name">Jina (A-Z)</option>
                  <option value="products">Bidhaa Nyingi</option>
                  <option value="location">Eneo</option>
                </select>
              </div>

              {/* Clear */}
              {activeFilters > 0 && (
                <div className="flex items-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1.5 text-destructive">
                    <X className="h-4 w-4" /> Ondoa Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Badges */}
      {activeFilters > 0 && (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Filters:</span>
            {selectedLocation && (
              <Badge variant="secondary" className="gap-1.5 cursor-pointer" onClick={() => setSelectedLocation("")}>
                <MapPin className="h-3 w-3" /> {selectedLocation} <X className="h-3 w-3" />
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1.5 cursor-pointer" onClick={() => setSelectedCategory("")}>
                <Package className="h-3 w-3" /> {selectedCategory} <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Shop Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border bg-card p-6">
                <div className="mb-4 h-12 w-12 rounded-xl bg-muted" />
                <div className="mb-2 h-5 w-2/3 rounded bg-muted" />
                <div className="mb-4 h-4 w-1/2 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-4/5 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="py-20 text-center">
            <Store className="mx-auto h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-xl font-bold text-foreground">Hakuna maduka yaliyopatikana</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery || activeFilters > 0
                ? "Jaribu kubadilisha maneno ya utafutaji au filters."
                : "Bado hakuna maduka yaliyosajiliwa."}
            </p>
            {(searchQuery || activeFilters > 0) && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Ondoa Filters Zote
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Yanaonyesha <strong className="text-foreground">{filteredShops.length}</strong> kati ya{" "}
                <strong className="text-foreground">{shops.length}</strong> maduka
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredShops.map((shop) => {
                // Get first few product images for preview
                const productImages = shop.products
                  .filter((p) => p.imageUrl)
                  .slice(0, 4);

                return (
                  <div
                    key={shop.id}
                    className="group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/30"
                  >
                    {/* Map + Product Images */}
                    <div className="relative h-32 bg-muted">
                      {shop.location ? (
                        <ShopMap location={shop.location} shopName={shop.name} className="h-full rounded-none border-0" />
                      ) : productImages.length > 0 ? (
                        <div className="grid grid-cols-4 h-full">
                          {productImages.map((p) => (
                            <div key={p.id} className="overflow-hidden border-r last:border-r-0 border-background/20">
                              <img src={p.imageUrl!} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Store className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                      )}
                    </div>

                    {/* Shop Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <Link to={`/maduka/${shop.id}`} className="group/link">
                        <h3 className="text-xl font-bold text-foreground group-hover/link:text-primary transition-colors">
                          {shop.name}
                        </h3>
                      </Link>

                      {shop.location && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="truncate">{shop.location}</span>
                        </p>
                      )}

                      {shop.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {shop.description}
                        </p>
                      )}

                      {/* Categories */}
                      {shop.categories.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {shop.categories.slice(0, 3).map((cat) => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                          {shop.categories.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{shop.categories.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Quick Actions Bar */}
                      <div className="mt-auto pt-4 border-t mt-4 flex items-center gap-2">
                        {shop.phone && (
                          <a
                            href={`tel:${shop.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" /> Piga Simu
                          </a>
                        )}
                        {shop.location && (
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shop.location + (shop.name ? " " + shop.name : ""))}&travelmode=driving`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/30"
                          >
                            <Navigation className="h-3.5 w-3.5" /> Ongozwa
                          </a>
                        )}
                        <Link
                          to={`/maduka/${shop.id}`}
                          className="ml-auto flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                          Bidhaa {shop.productCount} <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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
            <p className="text-sm text-sidebar-muted text-center md:text-left">
              © {new Date().getFullYear()} DukaSmart by Twende Digital. Haki zote zimehifadhiwa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
