'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { geoMercator } from 'd3-geo';
import earcut from 'earcut';
import { Sparkles, MapPin, ExternalLink } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface StateProperties {
  name: string;
  slug: string;
  code: string;
  capital: string;
  type: string;
}

interface StateFeature {
  type: string;
  properties: StateProperties;
  geometry: {
    type: string;
    coordinates: number[][][][] | number[][][];
  };
}

interface GeoJSON {
  type: string;
  features: StateFeature[];
}

// ─── Constants ──────────────────────────────────────────────────────────────────

// Indian flag colours
const SAFFRON = new THREE.Color('#FF9933');
const WHITE_FLAG = new THREE.Color('#FFFFFF');
const INDIA_GREEN = new THREE.Color('#138808');
const CHAKRA_NAVY = new THREE.Color('#000080');
const HOVER_COLOR = new THREE.Color('#06b6d4');
const HOVER_EMISSIVE = new THREE.Color('#0891b2');

// Map configuration
const MAP_CENTER_LON = 82.0;
const MAP_CENTER_LAT = 23.0;
const MAP_SCALE = 900;
const EXTRUDE_DEPTH = 0.35;
const EXTRUDE_DEPTH_HOVER = 0.55;
const BEVEL_SIZE = 0.02;
const BEVEL_THICKNESS = 0.02;

// India's latitude bounds (for tricolour banding)
const INDIA_LAT_SOUTH = 8.0; // Kanyakumari
const INDIA_LAT_NORTH = 37.0; // Ladakh
const INDIA_LAT_RANGE = INDIA_LAT_NORTH - INDIA_LAT_SOUTH;

// Tricolour band boundaries (latitude-based)
const SAFFRON_THRESHOLD = INDIA_LAT_SOUTH + INDIA_LAT_RANGE * 0.667; // Top third
const GREEN_THRESHOLD = INDIA_LAT_SOUTH + INDIA_LAT_RANGE * 0.333; // Bottom third

// ─── Projection ─────────────────────────────────────────────────────────────────

const projection = geoMercator()
  .center([MAP_CENTER_LON, MAP_CENTER_LAT])
  .scale(MAP_SCALE)
  .translate([0, 0]);

function projectCoord(lon: number, lat: number): [number, number] {
  const p = projection([lon, lat]);
  if (!p) return [0, 0];
  // Scale down and flip Y for Three.js (Y-up)
  return [p[0] * 0.01, -p[1] * 0.01];
}

// ─── Get tricolour color based on latitude centroid ─────────────────────────────

function getTricolourForLatitude(lat: number): THREE.Color {
  if (lat >= SAFFRON_THRESHOLD) return SAFFRON.clone();
  if (lat <= GREEN_THRESHOLD) return INDIA_GREEN.clone();
  return WHITE_FLAG.clone();
}

function getTricolourEmissive(lat: number): THREE.Color {
  if (lat >= SAFFRON_THRESHOLD) return new THREE.Color('#CC7A29');
  if (lat <= GREEN_THRESHOLD) return new THREE.Color('#0F6B06');
  return new THREE.Color('#CCCCCC');
}

// ─── Compute centroid of a polygon in geographic coordinates ────────────────────

function computeGeoCentroid(coords: number[][][][]): [number, number] {
  let totalLon = 0;
  let totalLat = 0;
  let totalPoints = 0;

  for (const polygon of coords) {
    const ring = polygon[0];
    if (!ring) continue;
    for (const pt of ring) {
      totalLon += pt[0];
      totalLat += pt[1];
      totalPoints++;
    }
  }

  if (totalPoints === 0) return [82, 22];
  return [totalLon / totalPoints, totalLat / totalPoints];
}

// ─── Normalize coordinates to MultiPolygon format ───────────────────────────────

function normalizeCoordinates(geometry: StateFeature['geometry']): number[][][][] {
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates as number[][][][];
  }
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates as number[][][]];
  }
  return [];
}

// ─── Build a THREE.Shape from a ring of [lon, lat] points ───────────────────────

function ringToShape(ring: number[][]): THREE.Shape | null {
  if (!ring || ring.length < 3) return null;

  const shape = new THREE.Shape();
  const [sx, sy] = projectCoord(ring[0][0], ring[0][1]);
  shape.moveTo(sx, sy);

  for (let i = 1; i < ring.length; i++) {
    const [x, y] = projectCoord(ring[i][0], ring[i][1]);
    shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

// ─── State Mesh Component ───────────────────────────────────────────────────────

interface StateMeshProps {
  feature: StateFeature;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (feature: StateFeature | null) => void;
  onClick: (feature: StateFeature) => void;
}

const StateMesh: React.FC<StateMeshProps> = React.memo(({
  feature,
  isHovered,
  isSelected,
  onHover,
  onClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coords = useMemo(() => normalizeCoordinates(feature.geometry), [feature]);
  const centroid = useMemo(() => computeGeoCentroid(coords), [coords]);
  const centroidLat = centroid[1];

  // Build shapes for all polygons
  const shapes = useMemo(() => {
    const result: THREE.Shape[] = [];

    for (const polygon of coords) {
      const outerRing = polygon[0];
      const shape = ringToShape(outerRing);
      if (!shape) continue;

      // Add holes (inner rings)
      for (let h = 1; h < polygon.length; h++) {
        const holePath = new THREE.Path();
        const holeRing = polygon[h];
        if (!holeRing || holeRing.length < 3) continue;

        const [hx, hy] = projectCoord(holeRing[0][0], holeRing[0][1]);
        holePath.moveTo(hx, hy);
        for (let i = 1; i < holeRing.length; i++) {
          const [x, y] = projectCoord(holeRing[i][0], holeRing[i][1]);
          holePath.lineTo(x, y);
        }
        shape.holes.push(holePath);
      }

      result.push(shape);
    }

    return result;
  }, [coords]);

  // Tricolour material
  const baseColor = useMemo(() => getTricolourForLatitude(centroidLat), [centroidLat]);
  const emissiveColor = useMemo(() => getTricolourEmissive(centroidLat), [centroidLat]);

  const extrudeSettings = useMemo(() => ({
    depth: isHovered || isSelected ? EXTRUDE_DEPTH_HOVER : EXTRUDE_DEPTH,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: BEVEL_SIZE,
    bevelThickness: BEVEL_THICKNESS,
  }), [isHovered, isSelected]);

  // Smooth lift animation
  useFrame(() => {
    if (groupRef.current) {
      const targetZ = isHovered ? 0.15 : isSelected ? 0.1 : 0;
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        0.15
      );
    }
  });

  const materialColor = isHovered || isSelected ? HOVER_COLOR : baseColor;
  const materialEmissive = isHovered || isSelected ? HOVER_EMISSIVE : emissiveColor;
  const emissiveIntensity = isHovered ? 0.6 : isSelected ? 0.4 : 0.15;

  return (
    <group ref={groupRef}>
      {shapes.map((shape, idx) => (
        <mesh
          key={`${feature.properties.slug}-${idx}`}
          onClick={(e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClick(feature);
          }}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            onHover(feature);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = 'default';
          }}
          castShadow
          receiveShadow
        >
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshStandardMaterial
            color={materialColor}
            emissive={materialEmissive}
            emissiveIntensity={emissiveIntensity}
            roughness={0.35}
            metalness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
});

StateMesh.displayName = 'StateMesh';

// ─── State Boundary Lines ───────────────────────────────────────────────────────

interface StateBoundaryProps {
  features: StateFeature[];
}

const StateBoundaries: React.FC<StateBoundaryProps> = React.memo(({ features }) => {
  const lineGeometry = useMemo(() => {
    const positions: number[] = [];

    for (const feature of features) {
      const coords = normalizeCoordinates(feature.geometry);

      for (const polygon of coords) {
        const outerRing = polygon[0];
        if (!outerRing || outerRing.length < 3) continue;

        for (let i = 0; i < outerRing.length; i++) {
          const [x1, y1] = projectCoord(outerRing[i][0], outerRing[i][1]);
          const nextIdx = (i + 1) % outerRing.length;
          const [x2, y2] = projectCoord(outerRing[nextIdx][0], outerRing[nextIdx][1]);

          positions.push(x1, y1, EXTRUDE_DEPTH + 0.05);
          positions.push(x2, y2, EXTRUDE_DEPTH + 0.05);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [features]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial
        color="#1a365d"
        opacity={0.4}
        transparent
        linewidth={1}
      />
    </lineSegments>
  );
});

StateBoundaries.displayName = 'StateBoundaries';

// ─── Ashoka Chakra Component ────────────────────────────────────────────────────

const AshokaChakra: React.FC<{ position: [number, number, number] }> = React.memo(({ position }) => {
  const chakraRef = useRef<THREE.Group>(null);
  const SPOKES = 24;
  const OUTER_RADIUS = 0.42;
  const INNER_RADIUS = 0.38;
  const HUB_RADIUS = 0.08;
  const SPOKE_WIDTH = 0.015;

  // Subtle rotation
  useFrame((state) => {
    if (chakraRef.current) {
      chakraRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  // Outer ring
  const outerRingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, INNER_RADIUS, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSize: 0.005,
      bevelThickness: 0.005,
      bevelSegments: 2,
    });
  }, []);

  // Hub (center circle)
  const hubGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, HUB_RADIUS, 0, Math.PI * 2, false);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelSize: 0.003,
      bevelThickness: 0.003,
      bevelSegments: 2,
    });
  }, []);

  // 24 Spokes
  const spokes = useMemo(() => {
    const spokeGeometries: THREE.ExtrudeGeometry[] = [];

    for (let i = 0; i < SPOKES; i++) {
      const angle = (i / SPOKES) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Each spoke is a thin rectangle from hub to inner ring edge
      const spokeLength = INNER_RADIUS - HUB_RADIUS - 0.01;
      const startDist = HUB_RADIUS + 0.005;

      const shape = new THREE.Shape();
      // Create spoke as a thin tapered shape
      const halfWidth = SPOKE_WIDTH;
      const tipHalfWidth = SPOKE_WIDTH * 0.4;

      // Build the spoke in local coordinates (pointing along +X), then rotate
      shape.moveTo(startDist, -halfWidth);
      shape.lineTo(startDist + spokeLength, -tipHalfWidth);
      shape.lineTo(startDist + spokeLength, tipHalfWidth);
      shape.lineTo(startDist, halfWidth);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.065,
        bevelEnabled: false,
      });

      // Rotate the geometry around Z axis
      const matrix = new THREE.Matrix4().makeRotationZ(angle);
      geo.applyMatrix4(matrix);

      spokeGeometries.push(geo);
    }

    return spokeGeometries;
  }, []);

  return (
    <group ref={chakraRef} position={position}>
      {/* Outer ring */}
      <mesh castShadow>
        <primitive object={outerRingGeometry} attach="geometry" />
        <meshStandardMaterial
          color={CHAKRA_NAVY}
          emissive="#000040"
          emissiveIntensity={0.3}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* Hub */}
      <mesh castShadow>
        <primitive object={hubGeometry} attach="geometry" />
        <meshStandardMaterial
          color={CHAKRA_NAVY}
          emissive="#000040"
          emissiveIntensity={0.3}
          roughness={0.25}
          metalness={0.7}
        />
      </mesh>

      {/* 24 Spokes */}
      {spokes.map((geo, i) => (
        <mesh key={`spoke-${i}`} castShadow>
          <primitive object={geo} attach="geometry" />
          <meshStandardMaterial
            color={CHAKRA_NAVY}
            emissive="#000040"
            emissiveIntensity={0.3}
            roughness={0.25}
            metalness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
});

AshokaChakra.displayName = 'AshokaChakra';

// ─── Background Particles ──────────────────────────────────────────────────────

const BackgroundParticles: React.FC = React.memo(() => {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#1e3a5f"
        size={0.04}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
});

BackgroundParticles.displayName = 'BackgroundParticles';

// ─── Camera Controller ──────────────────────────────────────────────────────────

interface CameraControllerProps {
  target: [number, number, number] | null;
  controlsRef: React.RefObject<any>;
}

const CameraController: React.FC<CameraControllerProps> = ({ target, controlsRef }) => {
  const { camera } = useThree();

  useFrame(() => {
    if (target && controlsRef.current) {
      const controls = controlsRef.current;
      const targetVec = new THREE.Vector3(...target);

      // Smoothly move the orbit controls target
      controls.target.lerp(targetVec, 0.05);

      // Move camera closer to the target
      const desiredPos = new THREE.Vector3(
        target[0],
        target[1] - 2,
        10
      );
      camera.position.lerp(desiredPos, 0.03);

      controls.update();
    }
  });

  return null;
};

// ─── Main Scene Component ───────────────────────────────────────────────────────

interface MapSceneProps {
  geoData: StateFeature[];
  hoveredState: StateFeature | null;
  selectedState: StateFeature | null;
  setHoveredState: (f: StateFeature | null) => void;
  onStateClick: (f: StateFeature) => void;
}

const MapScene: React.FC<MapSceneProps> = ({
  geoData,
  hoveredState,
  selectedState,
  setHoveredState,
  onStateClick,
}) => {
  const controlsRef = useRef<any>(null);

  // Compute Ashoka Chakra position (center of India ~ 78.9°E, 23.5°N)
  const chakraPosition = useMemo((): [number, number, number] => {
    const [x, y] = projectCoord(79.0, 23.5);
    return [x, y, EXTRUDE_DEPTH + 0.07];
  }, []);

  // Camera target when a state is selected
  const cameraTarget = useMemo((): [number, number, number] | null => {
    if (!selectedState) return null;
    const coords = normalizeCoordinates(selectedState.geometry);
    const [lon, lat] = computeGeoCentroid(coords);
    const [x, y] = projectCoord(lon, lat);
    return [x, y, 0];
  }, [selectedState]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[8, 12, 20]}
        intensity={1.8}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, -8, 10]} intensity={0.4} color="#f0e6d3" />
      <pointLight position={[0, 0, 15]} intensity={0.3} color="#ffffff" />

      {/* Background */}
      <color attach="background" args={['#030711']} />
      <fog attach="fog" args={['#030711', 20, 45]} />

      {/* Particles */}
      <BackgroundParticles />

      {/* Map Group */}
      <group rotation={[-0.35, 0, 0]} position={[0, 0.5, 0]}>
        {/* State meshes */}
        {geoData.map((feature) => (
          <StateMesh
            key={feature.properties.slug}
            feature={feature}
            isHovered={hoveredState?.properties.slug === feature.properties.slug}
            isSelected={selectedState?.properties.slug === feature.properties.slug}
            onHover={setHoveredState}
            onClick={onStateClick}
          />
        ))}

        {/* State boundary lines */}
        <StateBoundaries features={geoData} />

        {/* Ashoka Chakra */}
        <AshokaChakra position={chakraPosition} />

        {/* Base shadow plane */}
        <mesh position={[0, 0, -0.5]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </group>

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableDamping
        dampingFactor={0.05}
        minDistance={6}
        maxDistance={22}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 8}
        autoRotate
        autoRotateSpeed={0.3}
      />

      {/* Camera animation for state selection */}
      <CameraController target={cameraTarget} controlsRef={controlsRef} />
    </>
  );
};

// ─── State Info Tooltip ─────────────────────────────────────────────────────────

interface StateTooltipProps {
  state: StateFeature;
  position: 'bottom-left' | 'bottom-right';
}

const StateTooltip: React.FC<StateTooltipProps> = ({ state }) => {
  const isUT = state.properties.type === 'ut';
  return (
    <div className="bg-navy-900/95 backdrop-blur-xl border border-cyan-500/50 p-4 rounded-xl shadow-2xl shadow-cyan-950/50 max-w-xs pointer-events-none animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="text-base font-black text-white">
          {state.properties.name}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
          {state.properties.code}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-navy-300">
        <MapPin className="w-3 h-3 text-cyan-400" />
        <span>Capital: <span className="text-white font-medium">{state.properties.capital}</span></span>
      </div>
      {isUT && (
        <div className="mt-1">
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
            Union Territory
          </span>
        </div>
      )}
      <div className="mt-2.5 text-[11px] font-semibold text-cyan-400 flex items-center gap-1">
        <ExternalLink className="w-3 h-3" />
        <span>Click to explore destinations</span>
      </div>
    </div>
  );
};

// ─── Selected State Panel ───────────────────────────────────────────────────────

interface SelectedStatePanelProps {
  state: StateFeature;
  onClose: () => void;
  onExplore: () => void;
}

const SelectedStatePanel: React.FC<SelectedStatePanelProps> = ({ state, onClose, onExplore }) => {
  return (
    <div className="bg-navy-900/95 backdrop-blur-xl border border-cyan-500/40 p-5 rounded-2xl shadow-2xl shadow-cyan-950/50 max-w-sm animate-in slide-in-from-right-5 fade-in duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-black text-white">{state.properties.name}</h3>
          <p className="text-xs text-navy-300 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-cyan-400" />
            Capital: {state.properties.capital}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
            {state.properties.code}
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-navy-800 hover:bg-navy-700 text-navy-400 hover:text-white flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-navy-300 border border-navy-700">
          {state.properties.type === 'ut' ? 'Union Territory' : 'State'}
        </span>
      </div>

      <button
        onClick={onExplore}
        className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
      >
        <span>Explore {state.properties.name}</span>
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Legend Component ───────────────────────────────────────────────────────────

const TricolourLegend: React.FC = () => (
  <div className="flex items-center gap-3 text-[10px] font-medium text-navy-300">
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#FF9933' }} />
      <span>Saffron</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 rounded-sm border border-navy-600" style={{ backgroundColor: '#FFFFFF' }} />
      <span>White</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#138808' }} />
      <span>Green</span>
    </div>
    <div className="flex items-center gap-1">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#000080' }} />
      <span>Chakra</span>
    </div>
  </div>
);

// ─── Main Export Component ──────────────────────────────────────────────────────

export const IndiaMap3D: React.FC = () => {
  const router = useRouter();
  const [geoData, setGeoData] = useState<StateFeature[]>([]);
  const [hoveredState, setHoveredState] = useState<StateFeature | null>(null);
  const [selectedState, setSelectedState] = useState<StateFeature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load GeoJSON
  useEffect(() => {
    fetch('/geojson/india-states.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: GeoJSON) => {
        if (data.features && data.features.length > 0) {
          setGeoData(data.features);
        } else {
          setLoadError('No features found in GeoJSON');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load GeoJSON', err);
        setLoadError(err.message);
        setIsLoading(false);
      });
  }, []);

  const handleStateClick = useCallback((feature: StateFeature) => {
    setSelectedState((prev) =>
      prev?.properties.slug === feature.properties.slug ? null : feature
    );
  }, []);

  const handleExplore = useCallback(() => {
    if (selectedState) {
      router.push(`/explore/${selectedState.properties.slug}`);
    }
  }, [selectedState, router]);

  const handleDeselectState = useCallback(() => {
    setSelectedState(null);
  }, []);

  return (
    <div className="relative w-full h-[560px] sm:h-[660px] rounded-2xl overflow-hidden border border-navy-700/60 shadow-2xl bg-[#030711]">
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-navy-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-navy-700 text-xs font-semibold text-cyan-300 pointer-events-none select-none">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>3D India Map &bull; Tricolour Topography</span>
      </div>

      {/* Tricolour Legend */}
      <div className="absolute top-4 right-4 z-10 bg-navy-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-navy-700 pointer-events-none select-none">
        <TricolourLegend />
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 z-10 text-[10px] text-navy-400 font-medium pointer-events-none select-none">
        Drag to rotate &bull; Scroll to zoom &bull; Click a state to explore
      </div>

      {/* Hover Tooltip */}
      {hoveredState && !selectedState && (
        <div className="absolute bottom-16 left-6 z-10 pointer-events-none">
          <StateTooltip state={hoveredState} position="bottom-left" />
        </div>
      )}

      {/* Selected State Panel */}
      {selectedState && (
        <div className="absolute top-16 right-4 z-10">
          <SelectedStatePanel
            state={selectedState}
            onClose={handleDeselectState}
            onExplore={handleExplore}
          />
        </div>
      )}

      {/* 3D Canvas */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-3">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-navy-300">Loading 3D India Topography...</span>
          <span className="text-xs text-navy-500">Rendering tricolour map with Ashoka Chakra</span>
        </div>
      ) : loadError ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-3 text-center px-6">
          <div className="text-4xl">🗺️</div>
          <span className="text-sm font-medium text-red-400">Failed to load India map data</span>
          <span className="text-xs text-navy-400">{loadError}</span>
        </div>
      ) : (
        <Canvas
          camera={{ position: [0, -4, 15], fov: 42 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <MapScene
              geoData={geoData}
              hoveredState={hoveredState}
              selectedState={selectedState}
              setHoveredState={setHoveredState}
              onStateClick={handleStateClick}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
