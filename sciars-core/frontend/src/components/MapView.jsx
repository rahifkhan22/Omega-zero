import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * MapView - Renders a Leaflet map with issue markers.
 * @param {Object} props
 * @param {Array} props.issues - Array of issue objects with lat/lng coordinates.
 * @param {Array} props.center - [lat, lng] center of the map.
 * @param {number} props.zoom - Initial zoom level.
 */
const MapView = ({ issues = [], center = [17.3850, 78.4867], zoom = 13, className = "h-96", interactive = true }) => {
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
        {issues.map((issue, index) => (
          <Marker key={issue.id || index} position={[issue.lat, issue.lng]}>
            <Popup>
              <strong>{issue.title}</strong>
              <p>{issue.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
