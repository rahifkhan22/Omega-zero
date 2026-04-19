import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Custom ball pin using divIcon (no image files — Vite safe) ──────────────
const statusColors = {
  Open:        { bg: '#ef4444', border: '#b91c1c' },
  'In Progress':{ bg: '#f59e0b', border: '#d97706' },
  Resolved:    { bg: '#22c55e', border: '#16a34a' },
};

const createBallPin = (status) => {
  const { bg, border } = statusColors[status] || { bg: '#6366f1', border: '#4338ca' };
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
      ">
        <div style="
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${bg};
          border: 3px solid ${border};
          box-shadow: 0 0 0 2px rgba(255,255,255,0.7);
        "></div>
        <div style="
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 8px solid ${border};
          margin-top: -2px;
        "></div>
      </div>`,
    iconSize: [22, 32],
    iconAnchor: [11, 32],
    popupAnchor: [0, -34],
  });
};

const createDraggablePin = () => {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));
        cursor: grab;
      ">
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #3b82f6;
          border: 4px solid #1e40af;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.8);
        "></div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 10px solid #1e40af;
          margin-top: -3px;
        "></div>
      </div>`,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
    draggable: true,
  });
};

const DraggableMarker = ({ position, onPositionChange }) => {
  const [markerPosition, setMarkerPosition] = useState(position);
  const map = useMapEvents({
    click: (e) => {
      setMarkerPosition([e.latlng.lat, e.latlng.lng]);
      onPositionChange && onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  return (
    <Marker
      position={markerPosition}
      icon={createDraggablePin()}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setMarkerPosition([newPos.lat, newPos.lng]);
          onPositionChange && onPositionChange([newPos.lat, newPos.lng]);
        },
      }}
    >
      <Popup>
        <div style={{ minWidth: '140px', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '12px', color: '#333' }}>
            Drag or click to adjust location
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

/**
 * MapView - Renders a Leaflet map with custom ball pin markers.
 * Pin colour reflects issue status: red=Open, yellow=In Progress, green=Resolved.
 */
const MapView = ({ issues = [], center = [17.4126, 78.5247], zoom = 15, className = 'h-96', interactive = true, singleLocation = null, onLocationChange = null }) => {
  return (
    <div className={`w-full ${className} rounded-xl overflow-hidden shadow-md relative z-0`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polygon
          positions={[
            [17.4240, 78.5100],
            [17.4240, 78.5400],
            [17.4080, 78.5450],
            [17.4050, 78.5380],
            [17.4070, 78.5080],
          ]}
          pathOptions={{ color: '#dc2626', weight: 3, dashArray: '10, 10', fillColor: '#dc2626', fillOpacity: 0.08 }}
        />
        {singleLocation ? (
          <DraggableMarker 
            position={singleLocation} 
            onPositionChange={onLocationChange} 
          />
        ) : (
          issues.map((issue, index) => (
            <Marker
              key={issue.id || index}
              position={[issue.location.lat, issue.location.lng]}
              icon={createBallPin(issue.status)}
            >
              <Popup>
                <div style={{ minWidth: '160px' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>
                    {issue.category || 'Issue'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                    {issue.description}
                  </p>
                  <p style={{ fontSize: '11px', color: '#888' }}>
                    📍 {issue.location?.text || ''}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;


