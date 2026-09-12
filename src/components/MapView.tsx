import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import { AnalyzedProject } from '../types';

interface MapViewProps {
  analyzedProjects: AnalyzedProject[];
  onSelectProject: (project: AnalyzedProject) => void;
}

interface DistrictGeo {
  name: string;
  state: string;
  x: number; // SVG coordinates 0-800
  y: number; // SVG coordinates 0-700
}

// Approximate schematic layout for Indian district hubs
const DISTRICT_HUBS: DistrictGeo[] = [
  // Rajasthan
  { name: 'Barmer', state: 'Rajasthan', x: 210, y: 250 },
  { name: 'Jaipur', state: 'Rajasthan', x: 290, y: 230 },
  { name: 'Jodhpur', state: 'Rajasthan', x: 240, y: 230 },
  { name: 'Udaipur', state: 'Rajasthan', x: 250, y: 290 },
  { name: 'Bikaner', state: 'Rajasthan', x: 240, y: 180 },
  { name: 'Kota', state: 'Rajasthan', x: 310, y: 280 },

  // Uttar Pradesh
  { name: 'Lucknow', state: 'Uttar Pradesh', x: 440, y: 230 },
  { name: 'Varanasi', state: 'Uttar Pradesh', x: 520, y: 260 },
  { name: 'Kanpur', state: 'Uttar Pradesh', x: 410, y: 250 },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', x: 510, y: 220 },
  { name: 'Prayagraj', state: 'Uttar Pradesh', x: 470, y: 270 },

  // Maharashtra
  { name: 'Pune', state: 'Maharashtra', x: 290, y: 460 },
  { name: 'Nagpur', state: 'Maharashtra', x: 430, y: 380 },
  { name: 'Nashik', state: 'Maharashtra', x: 270, y: 420 },
  { name: 'Kolhapur', state: 'Maharashtra', x: 280, y: 520 },
  { name: 'Solapur', state: 'Maharashtra', x: 330, y: 480 },

  // Madhya Pradesh
  { name: 'Bhopal', state: 'Madhya Pradesh', x: 360, y: 310 },
  { name: 'Indore', state: 'Madhya Pradesh', x: 310, y: 330 },
  { name: 'Jabalpur', state: 'Madhya Pradesh', x: 430, y: 320 },
  { name: 'Gwalior', state: 'Madhya Pradesh', x: 350, y: 220 },

  // Bihar
  { name: 'Patna', state: 'Bihar', x: 570, y: 250 },
  { name: 'Gaya', state: 'Bihar', x: 570, y: 280 },
  { name: 'Muzaffarpur', state: 'Bihar', x: 570, y: 220 },

  // Gujarat
  { name: 'Ahmedabad', state: 'Gujarat', x: 220, y: 320 },
  { name: 'Surat', state: 'Gujarat', x: 230, y: 370 },
  { name: 'Vadodara', state: 'Gujarat', x: 250, y: 340 },

  // Karnataka
  { name: 'Mysuru', state: 'Karnataka', x: 330, y: 590 },
  { name: 'Hubballi', state: 'Karnataka', x: 300, y: 520 },
  { name: 'Mangaluru', state: 'Karnataka', x: 280, y: 580 },

  // Tamil Nadu
  { name: 'Madurai', state: 'Tamil Nadu', x: 370, y: 640 },
  { name: 'Coimbatore', state: 'Tamil Nadu', x: 340, y: 620 },
  { name: 'Salem', state: 'Tamil Nadu', x: 370, y: 600 },
];

export const MapView: React.FC<MapViewProps> = ({ analyzedProjects, onSelectProject }) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('Barmer');

  // Aggregate stats per district
  const districtData = useMemo(() => {
    const map = new Map<
      string,
      {
        total: number;
        high: number;
        medium: number;
        low: number;
        highestScore: number;
        projects: AnalyzedProject[];
      }
    >();

    analyzedProjects.forEach((ap) => {
      const d = ap.project.district;
      const cur = map.get(d) || {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        highestScore: 0,
        projects: [],
      };
      cur.total++;
      cur.projects.push(ap);
      if (ap.risk.totalScore > cur.highestScore) {
        cur.highestScore = ap.risk.totalScore;
      }
      if (ap.risk.category === 'HIGH') cur.high++;
      else if (ap.risk.category === 'MEDIUM') cur.medium++;
      else cur.low++;
      map.set(d, cur);
    });

    return map;
  }, [analyzedProjects]);

  const activeDistrictProjects = useMemo(() => {
    return districtData.get(selectedDistrictName)?.projects || [];
  }, [districtData, selectedDistrictName]);

  return (
    <div className="space-y-4">
      {/* Title & Guidance Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            District-Level Geographic Risk Heatmap
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Macro spatial decision support. Green (Low), Amber (Medium), Red (High risk cluster).
          </p>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="flex items-center gap-1 text-red-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> High Risk Cluster
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Medium Risk
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low / Compliant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Schematic Map (7 cols) */}
        <div className="lg:col-span-7 bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center">
          <div className="w-full flex justify-between items-center text-xs text-slate-500 mb-2">
            <span>Click any district node to review its project portfolio</span>
            <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
              Active: {selectedDistrictName}
            </span>
          </div>

          <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden shadow-inner border border-slate-800">
            <svg viewBox="0 0 750 700" className="w-full h-full select-none">
              {/* Background Grid Lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="#0f172a" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Sub-continental India Boundary Outline (Schematic Geo Polyline) */}
              <path
                d="M 230 110 L 290 80 L 370 120 L 480 160 L 590 190 L 660 210 L 610 280 L 550 330 L 490 410 L 430 480 L 380 580 L 370 660 L 340 670 L 300 590 L 270 510 L 230 420 L 200 350 L 190 280 L 200 210 Z"
                fill="#1e293b"
                fillOpacity="0.4"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Regional connection arcs */}
              <path d="M 210 250 Q 290 230 440 230" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.6" />
              <path d="M 290 230 Q 360 310 290 460" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.6" />
              <path d="M 440 230 Q 520 260 570 250" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.6" />
              <path d="M 290 460 Q 330 590 370 640" fill="none" stroke="#334155" strokeWidth="0.8" opacity="0.6" />

              {/* District Pins */}
              {DISTRICT_HUBS.map((hub) => {
                const stats = districtData.get(hub.name);
                const hasHigh = (stats?.high || 0) > 0;
                const hasMedium = (stats?.medium || 0) > 0;
                const isSelected = selectedDistrictName === hub.name;

                let pinColor = '#10b981'; // Green
                let pinGlow = 'rgba(16, 185, 129, 0.4)';
                if (hasHigh) {
                  pinColor = '#ef4444'; // Red
                  pinGlow = 'rgba(239, 68, 68, 0.6)';
                } else if (hasMedium) {
                  pinColor = '#f59e0b'; // Amber
                  pinGlow = 'rgba(245, 158, 11, 0.5)';
                }

                return (
                  <g
                    key={hub.name}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedDistrictName(hub.name)}
                  >
                    {/* Pulsing ring if selected or High Risk */}
                    {(isSelected || hasHigh) && (
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r={isSelected ? 16 : 12}
                        fill="none"
                        stroke={pinColor}
                        strokeWidth="1.5"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}

                    {/* Halo */}
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 10 : 7} fill={pinGlow} />

                    {/* Central Node */}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? 6 : 4.5}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '2' : '1'}
                    />

                    {/* Label */}
                    <text
                      x={hub.x + 8}
                      y={hub.y + 4}
                      fill={isSelected ? '#f8fafc' : '#94a3b8'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))"
                    >
                      {hub.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start space-x-2">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              District coordinate aggregation prevents fabricated GPS markers while providing clear administrative hierarchy for state and district magistrates.
            </p>
          </div>
        </div>

        {/* District Detail Drawer (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  District Audit Summary
                </span>
                <h3 className="text-base font-bold text-slate-900">{selectedDistrictName}</h3>
              </div>
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-semibold">
                {activeDistrictProjects.length} Projects Analysed
              </span>
            </div>

            {/* Quick metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
              <div className="bg-red-50 p-2 rounded-lg border border-red-200">
                <span className="text-red-700 font-bold text-sm block">
                  {districtData.get(selectedDistrictName)?.high || 0}
                </span>
                <span className="text-[10px] text-red-600">High Risk</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                <span className="text-amber-700 font-bold text-sm block">
                  {districtData.get(selectedDistrictName)?.medium || 0}
                </span>
                <span className="text-[10px] text-amber-600">Medium Risk</span>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <span className="text-emerald-700 font-bold text-sm block">
                  {districtData.get(selectedDistrictName)?.low || 0}
                </span>
                <span className="text-[10px] text-emerald-600">Low Risk</span>
              </div>
            </div>

            {/* Project List for Selected District */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Projects in {selectedDistrictName}:
              </span>
              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {activeDistrictProjects.map((item) => {
                  const isHigh = item.risk.category === 'HIGH';
                  return (
                    <div
                      key={item.project.id}
                      onClick={() => onSelectProject(item)}
                      className="p-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors text-xs flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-bold text-blue-700">{item.project.id}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                              isHigh
                                ? 'bg-red-100 text-red-700 border-red-300'
                                : 'bg-slate-200 text-slate-700 border-slate-300'
                            }`}
                          >
                            Score: {item.risk.totalScore}
                          </span>
                        </div>
                        <p className="text-slate-700 line-clamp-1 text-[11px]">
                          {item.project.description}
                        </p>
                        <span className="text-[10px] text-slate-500 block">
                          ₹{item.project.sanctionedCost}L • Gap: {item.metrics.progressGap} pts
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
