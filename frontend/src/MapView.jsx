import React from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Simple MapView component
// Props:
// - stations: array of station objects with at least { id, name, lat, lon, lines }
// - serviceStatus: array of line status objects to color-code in popups (optional)

export default function MapView({ stations = [], serviceStatus = [], lineColors = {}, routePolylines = [] }) {
  const center = [40.7527, -73.9772]; // Midtown default center (Grand Central)

  // Build a map of line -> status for quick lookup
  const statusByLine = {};
  serviceStatus.forEach(s => {
    statusByLine[s.id] = s.status;
  });

  // Group stations by line for drawing simple polylines
  const stationsByLine = {};
  stations.forEach(st => {
    if (!st.lines) return;
    st.lines.forEach(line => {
      if (!stationsByLine[line]) stationsByLine[line] = [];
      stationsByLine[line].push([st.lat, st.lon, st]);
    });
  });

  // Build polylines. Prefer explicit `routePolylines` if provided by backend (ordered coordinates).
  let polylines = [];
  if (routePolylines && routePolylines.length > 0) {
    polylines = routePolylines.map(r => ({ line: r.id, latlngs: (r.coordinates || []) }));
  } else {
    // Fallback: generate lightweight polylines from stations grouping
    polylines = Object.entries(stationsByLine).map(([line, coords]) => {
      const sorted = coords.sort((a, b) => {
        if (a[0] === b[0]) return a[1] - b[1];
        return b[0] - a[0]; // from north to south
      });
      return { line, latlngs: sorted.map(c => [c[0], c[1]]) };
    });
  }

  // Helper: offset polyline latlngs by a small perpendicular amount (degrees)
  const offsetPolyline = (latlngs, offsetDeg) => {
    if (!latlngs || latlngs.length < 2) return latlngs;
    const first = latlngs[0];
    const last = latlngs[latlngs.length - 1];
    const meanLat = (first[0] + last[0]) / 2;

    const dx = last[1] - first[1];
    const dy = last[0] - first[0];
    // perpendicular vector
    let perpLon = -dy;
    let perpLat = dx;

    // scale lon by cos(meanLat) for distance approximation
    const cosLat = Math.cos((meanLat * Math.PI) / 180) || 1;
    const length = Math.sqrt((perpLon * cosLat) * (perpLon * cosLat) + perpLat * perpLat) || 1;
    const ux = perpLon / length;
    const uy = perpLat / length;

    // Apply same offset to every point for a consistent parallel line
    return latlngs.map(p => {
      return [p[0] + uy * offsetDeg, p[1] + ux * offsetDeg];
    });
  };

  // Group polylines by an approximate coordinate signature so that overlapping routes can be offset
  const grouped = {};
  const coordKey = coords => coords.map(c => `${c[0].toFixed(4)},${c[1].toFixed(4)}`).join('|');
  polylines.forEach(p => {
    const key = coordKey(p.latlngs || []);
    grouped[key] = grouped[key] || [];
    grouped[key].push(p);
  });

  // Build a final list where overlapping groups get offsets
  const renderedPolylines = [];
  const OFFSET_BASE = 0.00018; // ~20m; tuned for NYC zoom

  Object.values(grouped).forEach(group => {
    const n = group.length;
    if (n === 1) {
      renderedPolylines.push({ poly: group[0], offsetIndex: 0, offsetCount: 1 });
    } else {
      group.forEach((p, idx) => {
        const center = (n - 1) / 2;
        const offsetMultiplier = idx - center; // negative to positive
        renderedPolylines.push({ poly: p, offsetIndex: offsetMultiplier, offsetCount: n });
      });
    }
  });

  return (
    <div className="h-[70vh] w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draw polylines per line (lightweight) */}
        {renderedPolylines.map(({ poly, offsetIndex, offsetCount }, i) => {
          const colors = lineColors[poly.line] || { hex: '#888' };
          // if multiple overlapping lines, make them thinner and offset them
          const isOverlap = offsetCount && offsetCount > 1;
          const weight = isOverlap ? 4 : 8;
          const offsetDeg = isOverlap ? OFFSET_BASE * offsetIndex : 0;
          const latlngs = isOverlap ? offsetPolyline(poly.latlngs, offsetDeg) : poly.latlngs;

          return (
            <Polyline key={`${poly.line}-${i}`} positions={latlngs} pathOptions={{ color: colors.hex || '#888', weight, opacity: 0.95 }} />
          );
        })}

        {/* Render lightweight circle markers for all stations */}
        {stations.map(station => (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lon]}
            radius={3}
            pathOptions={{ color: '#1f2937', fillColor: '#1f2937', fillOpacity: 0.9 }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.9}>
              <div className="text-xs">
                <strong>{station.name}</strong>
                <div className="mt-1">{(station.lines || []).join(', ')}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
