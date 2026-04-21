"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface SPPGPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  prov: string;
  kab: string;
  investigation_status?: "FLAGGED" | "CLEAR";
}

interface InteractiveMapProps {
  points: SPPGPoint[];
}

export default function InteractiveMap({ points }: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || mapRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      const map = L.map(containerRef.current!, {
        center: [-2.5, 118],
        zoom: 5,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Custom marker icon using pure CSS
      const createCustomIcon = (p: SPPGPoint) => {
        const isFlagged = p.investigation_status === "FLAGGED";
        // Note: Leaflet CSS injection happens outside of standard React context, 
        // so we use solid colors but closer to our theme.
        const color = isFlagged ? "#EF4444" : "#10B981";
        
        return L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
          iconSize: [10, 10],
          iconAnchor: [5, 5]
        });
      };

      // Add markers
      const markerList: L.Marker[] = [];
      // Only show first 5000 points for performance if list is huge
      const displayPoints = points.slice(0, 5000);
      
      displayPoints.forEach(p => {
        const marker = L.marker([p.lat, p.lng], { icon: createCustomIcon(p) });
        
        const popupContent = `
          <div style="font-family: sans-serif; padding: 5px; color: #1e293b;">
            <b style="color: ${p.investigation_status === 'FLAGGED' ? '#EF4444' : '#0f172a'};">${p.label}</b><br/>
            <span style="font-size: 11px; color: #64748b;">${p.kab}, ${p.prov}</span>
            ${p.investigation_status === 'FLAGGED' ? '<br/><span style="color: #EF4444; font-weight: bold; font-size: 10px; text-transform: uppercase;">⚠️ Investigasi Aktif</span>' : ''}
          </div>
        `;
        
        marker.bindPopup(popupContent);
        markerList.push(marker);
      });

      const featureGroup = L.featureGroup(markerList).addTo(map);
      
      // If we have points, fit bounds
      if (markerList.length > 0) {
        map.fitBounds(featureGroup.getBounds(), { padding: [20, 20] });
      }

      mapRef.current = map;
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, points]);

  if (!isClient) {
    return (
      <div className="h-[650px] flex items-center justify-center bg-[var(--bg-surface-2)] animate-pulse rounded-lg text-[var(--text-tertiary)]">
        Inisialisasi Peta Nasional...
      </div>
    );
  }

  return (
    <div className="h-[650px] w-full rounded-xl overflow-hidden border shadow-2xl bg-[var(--bg-base)] relative" style={{ borderColor: "var(--border-strong)" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%", background: "var(--bg-base)" }} />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Operasional Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Dalam Investigasi</span>
        </div>
      </div>
    </div>
  );
}
