"use client";
import dynamic from "next/dynamic";
import type { MapProps } from "@/components/shared/map/Map";

const Map = dynamic(() => import("@/components/shared/map/Map"), {
  ssr: false,
  loading: () => <p>جاري تحميل الخريطة...</p>,
});

export default function MapPage(props: MapProps) {
  return <Map {...props} />;
}