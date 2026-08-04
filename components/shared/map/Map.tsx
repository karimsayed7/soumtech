"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { Database } from "@/lib/supabase/database.types";

type Asset = Database["public"]["Tables"]["assets"]["Row"];

export interface MapProps {
  assets: Asset[] | null;
  selectedAsset: Asset | null;
  onSelectAsset: (asset: Asset) => void;
}

const PRIMARY_COLOR = "#171D5B";
const GOLD_BORDER = "#fff";

// SVG pin shape — بنعمله كـ function عشان نقدر نتحكم في اللون والبوردر لكل حالة
function createPinIcon(isSelected: boolean) {
  const size = isSelected ? 40 : 32;
  const borderWidth = isSelected ? 2 : 0;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 15 9 15s9-8.25 9-15c0-4.97-4.03-9-9-9z"
        fill="${PRIMARY_COLOR}"
        stroke="${isSelected ? GOLD_BORDER : "none"}"
        stroke-width="${borderWidth}"
      />
      <circle cx="12" cy="9" r="3.5" fill="white" />
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "", // مهم! عشان تمنع الـ default Leaflet styling (خلفية بيضا/بوردر)
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // نص التحت هو نقطة الموقع الفعلية
    popupAnchor: [0, -size],
  });
}

function FlyToSelected({ asset }: { asset: Asset | null }) {
  const map = useMap();

  useEffect(() => {
    if (asset?.lat != null && asset?.lng != null) {
      map.flyTo([Number(asset.lat), Number(asset.lng)], map.getZoom(), {
        duration: 0.8,
      });
    }
  }, [asset, map]);

  return null;
}

export default function Map({ assets, selectedAsset, onSelectAsset }: MapProps) {
  const validAssets = useMemo(
    () => (assets ?? []).filter((a) => a.lat != null && a.lng != null),
    [assets]
  );

  const defaultCenter: [number, number] = validAssets.length
    ? [Number(validAssets[0].lat), Number(validAssets[0].lng)]
    : [30.0444, 31.2357];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      scrollWheelZoom
      // style={{ height: "100%", width: "100%" }}
      // className="rounded-xl z-0 shadow-lg w-full md:h-full h-[500px]"
      className="h-[300px] md:h-full w-full rounded-xl shadow-md md:shadow-lg mb-5 md:mb-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {validAssets.map((asset) => {
        const isSelected = asset.id === selectedAsset?.id;
        return (
          <Marker
            key={asset.id}
            position={[Number(asset.lat), Number(asset.lng)]}
            icon={createPinIcon(isSelected)}
            eventHandlers={{
              click: () => onSelectAsset(asset),
            }}
          >
            <Popup>{asset.property_name}</Popup>
          </Marker>
        );
      })}

      <FlyToSelected asset={selectedAsset} />
    </MapContainer>
  );
}