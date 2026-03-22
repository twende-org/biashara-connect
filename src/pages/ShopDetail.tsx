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
  Navigation,
  ExternalLink,
  Share2,
} from "lucide-react";
import { BsShop } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import ShopMap from "@/components/ShopMap";
import { getAllShops, getProductsByShop } from "@/lib/firestore";
import type { Shop, Product } from "@/types";

const navLinks = [
  { label: "Nyumbani", href: "/" },
  { label: "Maduka", href: "/maduka" },
];

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Product | null>(null);

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
    return result;
  }, [products, searchQuery, selectedCategory]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${shop?.name} - DukaSmart`,
        text: `Tazama bidhaa za ${shop?.name} kwenye DukaSmart`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

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

  // JSON-LD: LocalBusiness for this specific shop
  const shopJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: shop.name,
    description: shop.description || `Duka la ${shop.name} - bidhaa bora kwa bei nzuri`,
    url: `https://duka.twendedigital.tech/maduka/${shop.id}`,
    ...(shop.phone && { telephone: shop.phone }),
    ...(shop.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: shop.location,
        addressCountry: "TZ",
      },
    }),
    ...(shop.lat && shop.lon && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: shop.lat,
        longitude: shop.lon,
      },
    }),
    ...(products.length > 0 && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Bidhaa za ${shop.name}`,
        itemListElement: products.slice(0, 20).map((p) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: p.name,
            ...(p.description && { description: p.description }),
            ...(p.brand && { brand: { "@type": "Brand", name: p.brand } }),
            ...(p.imageUrl && { image: p.imageUrl }),
            offers: {
              "@type": "Offer",
              price: p.sellingPrice,
              priceCurrency: "TZS",
              availability: p.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          },
        })),
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${shop.name} — Bidhaa na Bei | DukaSmart`}
        description={`Tazama bidhaa ${products.length} za ${shop.name}${shop.location ? " - " + shop.location : ""}. Bei bora na bidhaa bora kwenye DukaSmart Tanzania.`}
        keywords={`${shop.name}, bidhaa, bei, duka, ${shop.location || ""}, maduka, ${categories.join(", ")}`}
        canonical={`/maduka/${shop.id}`}
        jsonLd={shopJsonLd}
        breadcrumbs={[
          { name: "Nyumbani", url: "/" },
          { name: "Maduka", url: "/maduka" },
          { name: shop.name, url: `/maduka/${shop.id}` },
        ]}
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

      {/* Shop Header with Quick Actions */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <Link to="/maduka" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Rudi kwenye Maduka
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            {/* Shop Info */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:h-20 sm:w-20">
                <Store className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">{shop.name}</h1>
                {shop.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" /> {shop.location}
                  </p>
                )}
                {shop.description && (
                  <p className="mt-2 max-w-xl text-sm text-muted-foreground leading-relaxed">{shop.description}</p>
                )}
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" /> {products.length} bidhaa zinapatikana
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {shop.phone && (
                <a
                  href={`tel:${shop.phone}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">{shop.phone}</span>
                  <span className="sm:hidden">Piga Simu</span>
                </a>
              )}
              {shop.location && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    shop.lat && shop.lon
                      ? `${shop.lat},${shop.lon}`
                      : shop.location + (shop.name ? " " + shop.name : "")
                  )}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-primary bg-background px-5 py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  <Navigation className="h-4 w-4" /> Ongozwa hadi Dukani
                </a>
              )}
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <Share2 className="h-4 w-4" /> Shiriki
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {shop.location && (
        <section className="border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-foreground">
              <MapPin className="h-5 w-5 text-primary" /> Mahali pa Duka
            </h2>
            <ShopMap location={shop.location} shopName={shop.name} lat={shop.lat} lon={shop.lon} className="min-h-[350px]" />
          </div>
        </section>
      )}

      {/* Search & Category Tabs */}
      <div className="sticky top-16 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tafuta bidhaa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory("")}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                Zote ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Image Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-3 text-lg font-bold text-foreground">Hakuna bidhaa</h3>
            <p className="mt-1 text-sm text-muted-foreground">Jaribu kubadilisha maneno ya utafutaji.</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5"
                onClick={() => setSelectedImage(product)}
              >
                {/* Product Image - prominent */}
                <div className="aspect-square overflow-hidden bg-muted">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} - ${product.category} - TZS ${product.sellingPrice.toLocaleString()} kwenye ${shop.name}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                {/* Product Info */}
                <div className="p-3">
                  <h4 className="font-semibold text-sm text-foreground truncate">{product.name}</h4>
                  <p className="mt-1 text-base font-bold text-primary">
                    TZS {product.sellingPrice.toLocaleString()}
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{product.category}</Badge>
                    <span className={`text-[10px] font-medium ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                      {product.stock > 0 ? "Inapatikana" : "Imeisha"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-card overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Large Image */}
            <div className="aspect-square bg-muted">
              {selectedImage.imageUrl ? (
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedImage.name}</h3>
                  {selectedImage.brand && (
                    <p className="text-sm text-muted-foreground">{selectedImage.brand}</p>
                  )}
                </div>
                <p className="text-2xl font-extrabold text-primary shrink-0">
                  TZS {selectedImage.sellingPrice.toLocaleString()}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{selectedImage.category}</Badge>
                <Badge variant={selectedImage.stock > 0 ? "outline" : "destructive"}>
                  {selectedImage.stock > 0 ? `Stoo: ${selectedImage.stock}` : "Imeisha"}
                </Badge>
              </div>

              {selectedImage.description && (
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{selectedImage.description}</p>
              )}

              {/* Contact Actions */}
              <div className="mt-5 flex gap-3">
                {shop.phone && (
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="h-4 w-4" /> Piga Simu Kuulizia
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
