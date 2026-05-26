import React, { useState, useEffect } from "react";

export interface ResponsiveImageProps {
  src?: string;
  alt?: string;
  className?: string;
  aspectRatio?: "1:1" | "16:9" | "4:3" | "3:4" | "auto";
  fallbackSrc?: string;
  isHero?: boolean;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
  srcSet?: string;
  sizes?: string;
}

/**
 * A highly optimized, responsive, and performance-tuned image element.
 * - Prevents Cumulative Layout Shift (CLS) using explicit aspect-ratio containment.
 * - Supports automatic srcSet generation for known CDNs (Unsplash, Picsum).
 * - Implements lazy loading, async decoding, and secure referrer policy.
 * - Employs smooth native fade-in transitions on load success to eliminate harsh flickering.
 */
export default function ResponsiveImage({
  src,
  alt,
  className = "",
  aspectRatio = "auto",
  fallbackSrc = "https://picsum.photos/seed/ZOE/400/300",
  isHero = false,
  style,
  loading,
  srcSet,
  sizes,
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    if (src) {
      setCurrentSrc(src);
      setLoaded(false);
    }
  }, [src]);

  // Determine aspect-ratio utility class
  const aspectClass = {
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "3:4": "aspect-[3/4]",
    "auto": ""
  }[aspectRatio];

  // If the source is an Unsplash/Picsum CDN link, we can dynamically build high-performance srcSets.
  const isCDN = currentSrc.includes("images.unsplash.com") || currentSrc.includes("picsum.photos");
  
  let generatedSrcSet = srcSet;
  let generatedSizes = sizes;

  if (isCDN && !srcSet) {
    if (currentSrc.includes("images.unsplash.com")) {
      // Unsplash optimization mapping
      const baseUrl = currentSrc.split("?")[0];
      const params = new URLSearchParams(currentSrc.split("?")[1] || "");
      params.set("auto", "format");
      params.set("fit", "crop");
      
      const widths = [320, 480, 640, 768, 1024, 1280, 1600];
      generatedSrcSet = widths
        .map((w) => {
          params.set("w", String(w));
          params.set("q", "80");
          return `${baseUrl}?${params.toString()} ${w}w`;
        })
        .join(", ");
        
      generatedSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";
    } else if (currentSrc.includes("picsum.photos")) {
      // Picsum dynamic scaling format
      const isSeed = currentSrc.includes("/seed/");
      let parts = currentSrc.split("/");
      // E.g. https://picsum.photos/seed/ZOE/400/300 -> replace width and height
      const widths = [320, 480, 640, 768, 1024, 1280];
      
      if (isSeed) {
        // Find seed index and construct sizing
        const seedIndex = parts.indexOf("seed");
        if (seedIndex !== -1 && parts[seedIndex + 2]) {
          const baseParts = parts.slice(0, seedIndex + 2).join("/"); // https://picsum.photos/seed/{seed_name}
          generatedSrcSet = widths
            .map((w) => `${baseParts}/${w}/${Math.round(w * (aspectRatio === "16:9" ? 0.5625 : aspectRatio === "4:3" ? 0.75 : 1))} 1280w`)
            .join(", ");
        }
      }
    }
  }

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative overflow-hidden w-full ${aspectClass} ${className} bg-zinc-900/50 rounded-xl`}>
      {/* Loading Skeleton Placeholder Overlay */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 animate-shimmer bg-[length:200%_100%] z-10 pointer-events-none" />
      )}
      
      <img
        src={currentSrc}
        srcSet={generatedSrcSet}
        sizes={generatedSizes}
        alt={alt || "ZOE Platform Asset"}
        loading={isHero ? "eager" : loading || "lazy"}
        decoding={isHero ? "sync" : "async"}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        style={style}
      />
    </div>
  );
}

