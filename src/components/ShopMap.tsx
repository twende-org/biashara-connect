interface ShopMapProps {
  location: string;
  shopName?: string;
  className?: string;
}

export default function ShopMap({ location, shopName, className = "" }: ShopMapProps) {
  const query = encodeURIComponent(location + (shopName ? " " + shopName : ""));
  const src = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className={`overflow-hidden rounded-xl border bg-card ${className}`}>
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: 300 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={`Ramani - ${shopName || location}`}
      />
    </div>
  );
}
