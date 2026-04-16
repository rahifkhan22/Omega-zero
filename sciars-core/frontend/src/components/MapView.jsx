import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * MapView - Renders a Leaflet map with issue markers.
 * @param {Object} props
 * @param {Array} props.issues - Array of issue objects with lat/lng coordinates.
 * @param {Array} props.center - [lat, lng] center of the map.
 * @param {number} props.zoom - Initial zoom level.
 */
const MapView = ({ issues = [], center = [17.3850, 78.4867], zoom = 13 }) => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow-md">
      <MapContainer center={center} zoom={zoom} className="w-full h-full">
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
