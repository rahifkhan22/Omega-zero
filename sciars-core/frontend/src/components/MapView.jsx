import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
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
  .leaflet-container { border-radius: 16px; }
  .custom-marker { transition: transform 0.2s ease; }
  .custom-marker:hover { transform: scale(1.15); }
  .sciars-popup .leaflet-popup-content-wrapper { border-radius: 16px; padding: 0; }
`;
document.head.appendChild(markerStyles);

const STATUS_CONFIG = {
  Open:          { color: '#ef4444', bg: '#fef2f2', ring: '#ef444440', label: 'Open' },
  'In Progress': { color: '#f59e0b', bg: '#fffbeb', ring: '#f59e0b40', label: 'In Progress' },
  Closed:        { color: '#22c55e', bg: '#f0fdf4', ring: '#22c55e40', label: 'Closed' },
};

const FALLBACK_CONFIG = { color: '#6b7280', bg: '#f9fafb', ring: '#6b728040', label: 'Unknown' };

const getMarkerIcon = (status) => {
  const config = STATUS_CONFIG[status] || FALLBACK_CONFIG;
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: ${config.color};
        border: 3px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 0 0 3px ${config.ring};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
          opacity: 0.9;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const buildPopupContent = (issue) => {
  const config = STATUS_CONFIG[issue.status] || FALLBACK_CONFIG;
  return `
    <div style="font-family: 'Inter', system-ui, sans-serif; min-width: 260px; padding: 0;">
      <div style="padding: 16px 16px 12px; border-bottom: 1px solid #f3f4f6;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div style="flex: 1;">
            <h3 style="margin: 0; font-weight: 700; font-size: 15px; color: #111827; line-height: 1.3;">
              ${issue.category || 'Uncategorized'}
            </h3>
          </div>
          <span style="
            display: inline-flex;
            align-items: center;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: 600;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #ffffff;
            background: ${config.color};
          ">${config.label}</span>
        </div>
      </div>
      
      <div style="padding: 12px 16px; border-bottom: 1px solid #f3f4f6;">
        <p style="
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          padding-left: 12px;
          border-left: 3px solid ${config.color};
          line-height: 1.6;
        ">${truncateText(issue.description)}</p>
      </div>
      
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #f9fafb;
        border-radius: 0 0 12px 12px;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span style="font-size: 13px; font-weight: 500; color: #374151;">
          ${issue.location?.text || 'Location not specified'}
        </span>
      </div>
    </div>
  `;
};

const MapIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const EmptyMapIcon = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const MapView = ({ issues = [], center = [17.3850, 78.4867], zoom = 15 }) => {
  const validIssues = useMemo(() => {
    return issues
      .filter((issue) => {
        const lat = issue.location?.lat ?? issue.lat;
        const lng = issue.location?.lng ?? issue.lng;
        return lat != null && lng != null && !isNaN(lat) && !isNaN(lng);
      })
      .map((issue) => ({
        ...issue,
        _lat: issue.location?.lat ?? issue.lat,
        _lng: issue.location?.lng ?? issue.lng,
      }));
  }, [issues]);

  const mapCenter = useMemo(() => {
    if (validIssues.length > 0) {
      return [validIssues[0]._lat, validIssues[0]._lng];
    }
    return center;
  }, [validIssues, center]);

  const statusCounts = useMemo(() => {
    const counts = {};
    validIssues.forEach((issue) => {
      const status = issue.status || 'Unknown';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [validIssues]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MapIcon />
            Campus Issues Map
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {validIssues.length > 0
              ? `Tracking ${validIssues.length} issue${validIssues.length !== 1 ? 's' : ''} across campus`
              : 'Real-time issue tracking across campus'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <div
              key={status}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                backgroundColor: config.bg,
                color: config.color,
                border: `1px solid ${config.color}30`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: config.color, boxShadow: `0 0 0 2px ${config.ring}` }}
              />
              <span>{config.label}</span>
              {statusCounts[status] > 0 && (
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: config.color + '25' }}
                >
                  {statusCounts[status]}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {validIssues.length === 0 ? (
        <div className="w-full h-[400px] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50/50">
          <EmptyMapIcon />
          <p className="mt-4 text-base font-semibold text-gray-600">No issues to display on map</p>
          <p className="text-sm text-gray-400 mt-1">Reported issues with valid locations will appear here</p>
        </div>
      ) : (
        <div className="w-full h-[420px] rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
          <MapContainer
            center={mapCenter}
            zoom={zoom}
            scrollWheelZoom={true}
            className="w-full h-full"
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
                icon={getMarkerIcon(issue.status)}
              >
                <Tooltip direction="top" offset={[0, -16]} opacity={1}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {issue.category}
                  </span>
                </Tooltip>
                <Popup
                  className="sciars-popup"
                  maxWidth={320}
                  minWidth={260}
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
