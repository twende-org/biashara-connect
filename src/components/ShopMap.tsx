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

  const embedSrc = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  if (hasError) {
    return (
      <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{shopName || "Duka"}</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {location}
            </p>
          </div>
          <a
            href={mapsLink}
            target="_top"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4" /> Fungua Google Maps
          </a>
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

      <a
        href={mapsLink}
        target="_top"
        rel="noopener noreferrer"
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-lg border bg-background/90 px-3 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-background"
      >
        <ExternalLink className="h-3.5 w-3.5" /> Fungua Maps
      </a>
    </div>
  );
}
