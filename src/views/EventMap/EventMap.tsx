import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

interface EventMapProps {
  address: string;
}

const EventMap: React.FC<EventMapProps> = ({ address }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address || address.trim() === "") {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching coordinates:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <div className="w-full h-64 mt-4 relative rounded-lg overflow-hidden shadow-md">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-600 font-medium animate-pulse">📍 Loading map...</p>
        </div>
      )}

     
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <p className="text-red-600 font-semibold">❌ Location not found</p>
          <p className="text-gray-500 text-sm mt-1">Check if the address is correct.</p>
        </div>
      )}
      {coords && !error && !loading && (
        <MapContainer
        center={[coords.lat, coords.lng] as LatLngExpression}
        zoom={13}
          className="w-full h-full rounded-lg"
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[coords.lat, coords.lng]}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default EventMap;
