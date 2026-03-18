import { useState, useEffect } from "react";
import { MapPin, ExternalLink, Navigation, Phone, Clock, Route } from "lucide-react";

interface ShopMapProps {
  location: string;
  shopName?: string;
  className?: string;
  showDirectionsButton?: boolean;
}

export default function ShopMap({ location, shopName, className = "", showDirectionsButton = true }: ShopMapProps) {
  const [hasError, setHasError] = useState(false);

  const query = encodeURIComponent(location + (shopName ? " " + shopName : ""));

  // Google Maps embed URL
  const embedSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // Direct link to view location on Google Maps
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  // Directions link — uses user's current location as origin
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`;

  if (hasError) {
    return (
      <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{shopName || "Duka"}</p>
            <p className="mt-1 text-sm text-muted-foreground flex items-center justify-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Navigation className="h-4 w-4" /> Ongozwa hadi Dukani
            </a>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Fungua Google Maps
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border bg-card ${className}`}>
      <iframe
        src={embedSrc}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 200 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ramani - ${shopName || location}`}
        onError={() => setHasError(true)}
      />

      {/* Overlay buttons */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        {showDirectionsButton && (
          <a
            href={directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors sm:text-sm"
          >
            <Navigation className="h-4 w-4" /> Ongozwa hadi Dukani
          </a>
        )}
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-background/90 px-3 py-2 text-xs font-medium text-primary shadow-sm hover:bg-background transition-colors border"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Fungua Maps
        </a>
      </div>
    </div>
  );
}
