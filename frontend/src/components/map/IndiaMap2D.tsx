'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StateFeature {
  type: string;
  properties: {
    name: string;
    slug: string;
    code: string;
    capital: string;
    type: string;
  };
  geometry: {
    type: string;
    coordinates: number[][][][] | number[][][];
  };
}

// Tricolour thresholds (latitude-based)
const LAT_SOUTH = 8.0;
const LAT_NORTH = 37.0;
const LAT_RANGE = LAT_NORTH - LAT_SOUTH;
const SAFFRON_THRESHOLD = LAT_SOUTH + LAT_RANGE * 0.667;
const GREEN_THRESHOLD = LAT_SOUTH + LAT_RANGE * 0.333;

function normalizeCoordinates(geometry: StateFeature['geometry']): number[][][][] {
  if (geometry.type === 'MultiPolygon') return geometry.coordinates as number[][][][];
  if (geometry.type === 'Polygon') return [geometry.coordinates as number[][][]];
  return [];
}

function computeLatCentroid(coords: number[][][][]): number {
  let totalLat = 0;
  let count = 0;
  for (const polygon of coords) {
    const ring = polygon[0];
    if (!ring) continue;
    for (const pt of ring) {
      totalLat += pt[1];
      count++;
    }
  }
  return count > 0 ? totalLat / count : 22;
}

function getTricolourFill(lat: number): string {
  if (lat >= SAFFRON_THRESHOLD) return '#FF9933';
  if (lat <= GREEN_THRESHOLD) return '#138808';
  return '#e8e8e8';
}

function getTricolourHover(lat: number): string {
  if (lat >= SAFFRON_THRESHOLD) return '#FFB366';
  if (lat <= GREEN_THRESHOLD) return '#1AAA0A';
  return '#ffffff';
}

export const IndiaMap2D: React.FC = () => {
  const router = useRouter();
  const [geoData, setGeoData] = useState<StateFeature[]>([]);
  const [hoveredState, setHoveredState] = useState<StateFeature | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/geojson/india-states.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.features) setGeoData(data.features);
      })
      .catch((err) => console.error('Failed to load 2D Map data', err));
  }, []);

  // Project geographic coordinates into SVG space (viewBox 0 0 750 850)
  const paths = useMemo(() => {
    const minLon = 68.0;
    const maxLon = 97.5;
    const minLat = 6.0;
    const maxLat = 37.5;

    const width = 750;
    const height = 850;
    const padX = 50;
    const padY = 40;

    return geoData.map((feature) => {
      let pathStr = '';
      const coords = normalizeCoordinates(feature.geometry);
      const centroidLat = computeLatCentroid(coords);

      for (const polygon of coords) {
        const ring = polygon[0];
        if (!ring || ring.length < 3) continue;

        ring.forEach(([lon, lat], i) => {
          const x = padX + ((lon - minLon) / (maxLon - minLon)) * (width - padX * 2);
          const y = height - padY - ((lat - minLat) / (maxLat - minLat)) * (height - padY * 2);
          pathStr += `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)} `;
        });
        pathStr += 'Z ';
      }

      return {
        feature,
        d: pathStr,
        fill: getTricolourFill(centroidLat),
        hoverFill: getTricolourHover(centroidLat),
      };
    });
  }, [geoData]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-4xl mx-auto h-[550px] sm:h-[680px] bg-[#030711] border border-navy-700/60 rounded-2xl overflow-hidden p-4 shadow-2xl flex items-center justify-center"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a5f_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

      {/* Header */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-navy-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-navy-700 text-xs font-semibold text-cyan-300 pointer-events-none">
        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
        <span>India Tricolour Atlas &bull; Hover and click any state</span>
      </div>

      {/* Tooltip */}
      {hoveredState && (
        <div
          className="absolute z-20 pointer-events-none bg-navy-900/95 backdrop-blur-md border border-cyan-500/60 px-4 py-2.5 rounded-xl shadow-xl shadow-cyan-950/60 text-left min-w-[160px]"
          style={{
            left: `${Math.min(Math.max(mousePos.x + 15, 20), 550)}px`,
            top: `${Math.min(Math.max(mousePos.y - 70, 20), 550)}px`,
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-white">
              {hoveredState.properties.name}
            </span>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {hoveredState.properties.code}
            </span>
          </div>
          <div className="text-xs text-navy-300 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Capital: <span className="text-white">{hoveredState.properties.capital}</span>
          </div>
          {hoveredState.properties.type === 'ut' && (
            <span className="mt-1 inline-block text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
              Union Territory
            </span>
          )}
          <div className="text-[10px] text-cyan-400 font-medium mt-1.5 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Click to view destinations
          </div>
        </div>
      )}

      {/* SVG Container */}
      <svg
        viewBox="0 0 750 850"
        className="w-full h-full filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
      >
        <defs>
          <filter id="state-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g>
          {paths.map(({ feature, d, fill, hoverFill }) => {
            const isHovered = hoveredState?.properties.slug === feature.properties.slug;
            return (
              <path
                key={feature.properties.slug}
                d={d}
                onClick={() => router.push(`/explore/${feature.properties.slug}`)}
                onMouseEnter={() => setHoveredState(feature)}
                onMouseLeave={() => setHoveredState(null)}
                fill={isHovered ? '#06b6d4' : fill}
                stroke={isHovered ? '#ffffff' : '#1a365d'}
                strokeWidth={isHovered ? 2.5 : 1}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isHovered ? 'drop-shadow(0 0 8px rgba(6,182,212,0.6))' : 'none',
                }}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
