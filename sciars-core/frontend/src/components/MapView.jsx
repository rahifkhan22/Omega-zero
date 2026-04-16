import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const markerStyles = document.createElement('style');
markerStyles.textContent = `
  .leaflet-default-icon-path { display: none !important; }
  .leaflet-marker-icon { border: none !important; background: none !important; box-shadow: none !important; }
`;
document.head.appendChild(markerStyles);

// ─── Status → Color mapping ──────────────────────────────────────────────────
const STATUS_CONFIG = {
  Open:          { color: '#ef4444', bg: '#fef2f2', label: 'Open' },
  'In Progress': { color: '#f59e0b', bg: '#fffbeb', label: 'In Progress' },
  Resolved:      { color: '#3b82f6', bg: '#eff6ff', label: 'Resolved' },
  Closed:        { color: '#22c55e', bg: '#f0fdf4', label: 'Closed' },
};

const FALLBACK = { color: '#6b7280', bg: '#f9fafb', label: 'Unknown' };

// ─── Custom circular marker icon ─────────────────────────────────────────────
const createCustomIcon = (status) => {
  const { color } = STATUS_CONFIG[status] || FALLBACK;
  return L.divIcon({
    className: 'custom-marker-icon',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 10px rgba(0,0,0,0.35);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

// ─── Popup content builder (inline styles — Tailwind won't reach Leaflet DOM) ─
const buildPopupContent = (issue) => {
  const cfg = STATUS_CONFIG[issue.status] || FALLBACK;
  return `
    <div style="font-family: Inter, system-ui, sans-serif; min-width: 220px; max-width: 280px; padding: 0;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #f3f4f6;">
        <span style="font-weight: 700; font-size: 15px; color: #1f2937; line-height: 1.3; margin: 0; flex: 1; padding-right: 8px;">
          ${issue.category || 'Uncategorized'}
        </span>
        <span style="
          display: inline-block;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 700;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #fff;
          background: ${cfg.color};
          white-space: nowrap;
          flex-shrink: 0;
        ">${cfg.label}</span>
      </div>

      <!-- Description -->
      <p style="
        font-size: 13px;
        color: #4b5563;
        margin: 0 0 10px 0;
        padding-left: 10px;
        border-left: 3px solid ${cfg.color};
        line-height: 1.5;
      ">${issue.description || 'No description provided.'}</p>

      <!-- Location -->
      <div style="
        font-size: 12px;
        color: #6b7280;
        background: #f9fafb;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid #f3f4f6;
        display: flex;
        align-items: center;
        gap: 6px;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span style="font-weight: 500; color: #374151;">${issue.location?.text || 'Location not specified'}</span>
      </div>
    </div>
  `;
};

// ─── MapView Component ────────────────────────────────────────────────────────
const MapView = ({ issues = [], center = [17.3850, 78.4867], zoom = 15 }) => {
  // Filter out issues that lack valid coordinates
  const validIssues = useMemo(() => {
    return issues.filter((issue) => {
      const lat = issue.location?.lat ?? issue.lat;
      const lng = issue.location?.lng ?? issue.lng;
      return lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
    }).map((issue) => ({
      ...issue,
      _lat: issue.location?.lat ?? issue.lat,
      _lng: issue.location?.lng ?? issue.lng,
    }));
  }, [issues]);

  // Count issues per status for the legend
  const statusCounts = useMemo(() => {
    const counts = {};
    validIssues.forEach((issue) => {
      counts[issue.status] = (counts[issue.status] || 0) + 1;
    });
    return counts;
  }, [validIssues]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 transition-all duration-300 hover:shadow-lg">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Campus Issues Map
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {validIssues.length > 0
              ? `Showing ${validIssues.length} issue${validIssues.length !== 1 ? 's' : ''} on campus`
              : 'No issues to display on the map'}
          </p>
        </div>

        {/* ── Legend ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
            <div
              key={status}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors"
              style={{
                borderColor: cfg.color + '30',
                backgroundColor: cfg.bg,
                color: cfg.color,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: cfg.color, boxShadow: `0 0 0 2px ${cfg.color}25` }}
              />
              {cfg.label}
              {statusCounts[status] > 0 && (
                <span className="ml-0.5 font-bold">{statusCounts[status]}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Map or Empty State ─────────────────────────────────────────── */}
      {validIssues.length === 0 ? (
        <div className="w-full rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50/80 py-20">
          <p className="text-base font-semibold text-gray-500 mb-1">No issues to display</p>
          <p className="text-sm text-gray-400">Reported issues with valid locations will appear here.</p>
        </div>
      ) : (
        <div className="w-full rounded-xl overflow-hidden border border-gray-100 relative" style={{ height: '420px' }}>
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            className="w-full h-full !important"
            style={{ width: '100%', height: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {validIssues.map((issue, index) => (
              <Marker
                key={issue.id || `marker-${index}`}
                position={[issue._lat, issue._lng]}
                icon={createCustomIcon(issue.status)}
              >
                <Popup
                  className="sciars-popup"
                  maxWidth={300}
                  minWidth={220}
                  closeButton={true}
                >
                  <div dangerouslySetInnerHTML={{ __html: buildPopupContent(issue) }} />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default MapView;
