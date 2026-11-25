'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Layers, Globe, Map as MapIcon } from 'lucide-react';
import { IndiaMap2D } from './IndiaMap2D';

// Dynamically import 3D map with SSR disabled to prevent WebGL SSR mismatch
const IndiaMap3D = dynamic(
  () => import('./IndiaMap3D').then((mod) => mod.IndiaMap3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] sm:h-[620px] rounded-2xl bg-navy-950 border border-navy-700/60 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-navy-300">Initializing 3D Viewport...</span>
      </div>
    ),
  }
);

interface MapContainerProps {
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  return (
    <div className={`relative w-full ${className}`}>
      {/* View Switcher Controls */}
      <div className="flex justify-end mb-3">
        <div className="inline-flex p-1 bg-navy-900 border border-navy-700 rounded-xl shadow-md">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '3d'
                ? 'bg-cyan-500 text-navy-950 shadow-sm'
                : 'text-navy-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Interactive</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('2d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === '2d'
                ? 'bg-cyan-500 text-navy-950 shadow-sm'
                : 'text-navy-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>2D Atlas</span>
          </button>
        </div>
      </div>

      {/* Render selected view */}
      {viewMode === '3d' ? <IndiaMap3D /> : <IndiaMap2D />}
    </div>
  );
};
