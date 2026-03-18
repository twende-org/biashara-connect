import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, ExternalLink, Navigation } from "lucide-react";

interface ShopMapProps {
  location: string;
  shopName?: string;
  className?: string;
  compact?: boolean;
  showActions?: boolean;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export default function ShopMap({
  location,
  shopName,
  className = "",
  compact = false,
  showActions = true,
}: ShopMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [hasError, setHasError] = useState(false);

  const locationQuery = useMemo(
    () => `${location}${shopName ? ` ${shopName}` : ""}`.trim(),
    [location, shopName]
  );

  const encodedQuery = encodeURIComponent(locationQuery);

  useEffect(() => {
    const controller = new AbortController();

    const resolveCoordinates = async () => {
      setIsResolving(true);
      setHasError(false);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodedQuery}`,
          {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to geocode location");
        }

        const data = (await response.json()) as Array<{ lat: string; lon: string }>;

        if (!data.length) {
          setCoordinates(null);
          setHasError(true);
          return;
        }

        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);

        if (Number.isNaN(lat) || Number.isNaN(lon)) {
          setCoordinates(null);
          setHasError(true);
          return;
        }

        setCoordinates({ lat, lon });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setCoordinates(null);
          setHasError(true);
        }
      } finally {
        setIsResolving(false);
      }
    };

    void resolveCoordinates();
    return () => controller.abort();
  }, [encodedQuery]);

  const destination = coordinates ? `${coordinates.lat},${coordinates.lon}` : locationQuery;
  const directionsLink = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(destination)}&travelmode=driving`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  const osmLink = `https://www.openstreetmap.org/search?query=${encodedQuery}`;

  if (compact) {
    return (
      <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
        <div className="flex h-full flex-col items-center justify-center gap-2 p-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            {isResolving ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <MapPin className="h-5 w-5 text-primary" />
            )}
          </div>
          <p className="line-clamp-1 text-xs font-semibold text-foreground">{shopName || "Mahali pa duka"}</p>
          <p className="line-clamp-1 text-[11px] text-muted-foreground">{location}</p>
          {showActions && (
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Navigation className="h-3 w-3" /> Ongozwa
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
      <div className="flex h-full min-h-[220px] flex-col justify-between p-5">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
              {isResolving ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <MapPin className="h-5 w-5 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-foreground">{shopName || "Duka"}</p>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                <span className="truncate">{location}</span>
              </p>
              {coordinates && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Lat: {coordinates.lat.toFixed(5)}, Lon: {coordinates.lon.toFixed(5)}
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {hasError
              ? "Hatujaweza kupakia ramani ya ndani ya app, lakini maelekezo ya safari bado yapo tayari."
              : "Bonyeza Ongozwa kupata njia kutoka ulipo sasa hadi dukani."}
          </p>
        </div>

        {showActions && (
          <div className="mt-5 flex flex-wrap gap-2">
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
            <a
              href={osmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" /> OSM Fallback
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
