import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoadStop } from '@/services/types';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

// Fix default marker icon issue in Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadowUrl from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  stops: RoadStop[];
  startLocation: string;
  endLocation: string;
  interactiveMap?: boolean;
}

// Helper to extract coordinates from a stop
const getCoordinatesFromStop = (stop: RoadStop): [number, number] => {
  if (typeof stop.longitude === 'number' && typeof stop.latitude === 'number') {
    return [stop.latitude, stop.longitude]; // Leaflet uses [lat, lng]
  }
  // Fallback: use fake coordinates based on stop name
  const hash = stop.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return [
    37.7749 + (hash % 10) / 100,   // Fake latitude near San Francisco
    -122.4194 + (hash % 10) / 100, // Fake longitude near San Francisco
  ];
};

// Fit map to all stops
const FitBounds = ({ stops }: { stops: RoadStop[] }) => {
  const map = useMap();
  React.useEffect(() => {
    if (stops.length === 0) return;
    const bounds = L.latLngBounds(stops.map(getCoordinatesFromStop));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [stops, map]);
  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  stops, 
  startLocation, 
  endLocation, 
  interactiveMap = true 
}) => {
  if (!stops || stops.length === 0) {
    return (
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>No stops to display on the map.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const polylinePositions = stops.map(getCoordinatesFromStop);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactiveMap}
        dragging={interactiveMap}
        doubleClickZoom={interactiveMap}
        zoomControl={interactiveMap}
        attributionControl={true}
        center={polylinePositions[0]}
        zoom={8}
        className="absolute inset-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <FitBounds stops={stops} />
        <Polyline positions={polylinePositions} color="#4ade80" weight={4} opacity={0.8} />
        {stops.map((stop, index) => (
          <Marker key={stop.id} position={getCoordinatesFromStop(stop)}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{stop.name}</h3>
                <p className="text-sm text-gray-600">{stop.location || 'No location specified'}</p>
                {stop.description && <p className="text-sm mt-2">{stop.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="absolute top-0 left-0 m-4 bg-white bg-opacity-80 p-2 rounded-lg shadow-md z-10">
        <div className="flex items-center space-x-2 text-sm">
          <Navigation className="h-4 w-4 text-forest-700" />
          <span className="font-medium">Route Map</span>
        </div>
      </div>
      {stops.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-3 text-xs">
          <div className="flex justify-between">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-blue-400" />
              <span>{startLocation}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-red-400" />
              <span>{endLocation}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
