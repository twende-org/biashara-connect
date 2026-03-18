import { useMemo } from "react";
import { ExternalLink, MapPin, Navigation } from "lucide-react";

interface ShopMapProps {
  location: string;
  shopName?: string;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

export default function ShopMap({
  location,
  shopName,
  className = "",
  compact = false,
  showActions = true,
}: ShopMapProps) {
  const locationQuery = useMemo(
    () => `${location}${shopName ? ` ${shopName}` : ""}`.trim(),
    [location, shopName],
  );

  const encodedQuery = useMemo(() => encodeURIComponent(locationQuery), [locationQuery]);

  const mapEmbedLink = useMemo(
    () => `https://www.google.com/maps?q=${encodedQuery}&z=15&output=embed`,
    [encodedQuery],
  );

  const directionsLink = useMemo(
    () =>
      `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodedQuery}&travelmode=driving`,
    [encodedQuery],
  );

  const googleMapsLink = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
    [encodedQuery],
  );

  const mapTitle = `Google Map${shopName ? ` - ${shopName}` : ""}`;

  if (compact) {
    return (
      <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
        <div className="relative h-full min-h-[120px]">
          <iframe
            src={mapEmbedLink}
            title={mapTitle}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-background/80 to-transparent" />

          <div className="pointer-events-none absolute left-2 top-2 inline-flex max-w-[80%] items-center gap-1 rounded-full border border-border/50 bg-background/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-sm">
            <MapPin className="h-3 w-3 shrink-0 text-primary" />
            <span className="truncate">{shopName || location}</span>
          </div>

          {showActions && (
            <div className="absolute bottom-2 right-2">
              <a
                href={directionsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Navigation className="h-3 w-3" /> Ongozwa
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
      <div className="relative h-56 border-b bg-muted">
        <iframe
          src={mapEmbedLink}
          title={mapTitle}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/85 to-transparent" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">{shopName || "Duka"}</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Bonyeza Ongozwa kupata njia ya Google Maps kutoka ulipo sasa hadi dukani.
        </p>

        {showActions && (
          <div className="flex flex-wrap gap-2">
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Navigation className="h-4 w-4" /> Ongozwa hadi Dukani
            </a>
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" /> Fungua Google Maps
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
