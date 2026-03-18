import { useState } from "react";
import { MapPin, ExternalLink } from "lucide-react";

interface ShopMapProps {
  location: string;
  shopName?: string;
  className?: string;
}

export default function ShopMap({ location, shopName, className = "" }: ShopMapProps) {
  const [hasError, setHasError] = useState(false);
  const query = encodeURIComponent(location + (shopName ? " " + shopName : ""));
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  // Use OpenStreetMap embed as it doesn't have CORS/X-Frame-Options issues
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(location)}&layer=mapnik&marker=true`;
  // Nominatim search-based embed
  const leafletSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  if (hasError) {
    return (
      <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{shopName || location}</p>
            <p className="mt-1 text-sm text-muted-foreground">{location}</p>
          </div>
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ExternalLink className="h-4 w-4" /> Fungua Google Maps
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
      <iframe
        src={leafletSrc}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 200 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ramani - ${shopName || location}`}
        onError={() => setHasError(true)}
      />
      {/* Fallback link overlay */}
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-medium text-primary shadow-sm hover:bg-background transition-colors border"
      >
        <ExternalLink className="h-3 w-3" /> Fungua Maps
      </a>
    </div>
  );
}
