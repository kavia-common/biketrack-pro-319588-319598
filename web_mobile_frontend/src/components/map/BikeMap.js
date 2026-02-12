import React, { useMemo } from "react";
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";

const pin = new L.DivIcon({
  className: "",
  html: `<div style="
    width:14px;height:14px;border-radius:999px;
    background:linear-gradient(135deg,#3b82f6,#06b6d4);
    box-shadow:0 8px 18px rgba(17,24,39,0.25);
    border:2px solid white;"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

// PUBLIC_INTERFACE
export function BikeMap({ center, points = [], geofences = [], height = 520 }) {
  /**
   * Renders an interactive Leaflet map with:
   * - points: {lat,lng,label?} markers + optional polyline
   * - geofences: {center:{lat,lng}, radiusM, name} circles
   */
  const polyline = useMemo(() => points.map((p) => [p.lat, p.lng]), [points]);

  const effectiveCenter = center || (points[0] ? { lat: points[0].lat, lng: points[0].lng } : { lat: 37.7749, lng: -122.4194 });

  return (
    <div className="mapWrap" style={{ height }}>
      <MapContainer
        center={[effectiveCenter.lat, effectiveCenter.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geofences.map((g) => (
          <Circle
            key={g.id}
            center={[g.center.lat, g.center.lng]}
            radius={g.radiusM}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.12 }}
          >
            <Tooltip>{g.name} ({g.radiusM}m)</Tooltip>
          </Circle>
        ))}

        {polyline.length >= 2 ? (
          <Polyline positions={polyline} pathOptions={{ color: "#06b6d4", weight: 4, opacity: 0.85 }} />
        ) : null}

        {points.map((p, idx) => (
          <Marker key={`${p.id || idx}`} position={[p.lat, p.lng]} icon={pin}>
            {p.label ? <Tooltip>{p.label}</Tooltip> : null}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
