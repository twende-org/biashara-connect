import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPin, ExternalLink, Navigation } from "lucide-react";

interface ShopMapProps {
  location: string;
  shopName?: string;
  className?: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export default function ShopMap({ location, shopName, className = "" }: ShopMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isResolving, setIsResolving] = useState(true);
  const [hasError, setHasError] = useState(false);

  const locationQuery = useMemo(
    () => `${location}${shopName ? ` ${shopName}` : ""}`.trim(),
    [location, shopName]
  );

  const encodedQuery = encodeURIComponent(locationQuery);
  const openStreetMapSearchLink = `https://www.openstreetmap.org/search?query=${encodedQuery}`;

  const openStreetMapPlaceLink = coordinates
    ? `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lon}#map=16/${coordinates.lat}/${coordinates.lon}`
    : openStreetMapSearchLink;

  const embedSrc = useMemo(() => {
    if (!coordinates) return "";
    const delta = 0.01;
    const bbox = `${coordinates.lon - delta},${coordinates.lat - delta},${coordinates.lon + delta},${coordinates.lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`;
  }, [coordinates]);

  useEffect(() => {
    const controller = new AbortController();

    const resolveCoordinates = async () => {
      setIsResolving(true);
      setHasError(false);
      setCoordinates(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodedQuery}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to geocode location");
        }

        const data = (await response.json()) as Array<{ lat: string; lon: string }>;

        if (!data.length) {
          setHasError(true);
          return;
        }

        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);

        if (Number.isNaN(lat) || Number.isNaN(lon)) {
          setHasError(true);
          return;
        }

        setCoordinates({ lat, lon });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setHasError(true);
        }
      } finally {
        setIsResolving(false);
      }
    };

    void resolveCoordinates();

    return () => controller.abort();
  }, [encodedQuery]);

  const openExternalUrl = (url: string) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    if (!newTab) {
      window.location.href = url;
    }
  };

  const handleNavigate = async () => {
    if (!coordinates) {
      openExternalUrl(openStreetMapPlaceLink);
      return;
    }

    if (!navigator.geolocation) {
      openExternalUrl(openStreetMapPlaceLink);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        const destination = `${coordinates.lat},${coordinates.lon}`;
        const route = encodeURIComponent(`${origin};${destination}`);
        const directionsLink = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${route}`;
        openExternalUrl(directionsLink);
      },
      () => {
        openExternalUrl(openStreetMapPlaceLink);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  if (isResolving) {
    return (
      <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
        <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium text-foreground">Tunatafuta mahali pa duka...</p>
          <p className="text-xs text-muted-foreground">{locationQuery}</p>
        </div>
      </div>
    );
  }

  if (hasError || !coordinates) {
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
          <button
            type="button"
            onClick={handleNavigate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Navigation className="h-4 w-4" /> Ongozwa hadi Dukani
          </button>
          <a
            href={openStreetMapPlaceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" /> Fungua Ramani
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
        referrerPolicy="no-referrer"
        title={`Ramani - ${shopName || location}`}
        onError={() => setHasError(true)}
      />

      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleNavigate}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 sm:text-sm"
        >
          <Navigation className="h-4 w-4" /> Ongozwa hadi Dukani
        </button>
        <a
          href={openStreetMapPlaceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border bg-background/90 px-3 py-2 text-xs font-medium text-primary shadow-sm transition-colors hover:bg-background"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Fungua Ramani
        </a>
      </div>
    </div>
  );
}
