
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RoadStop } from '@/services/types';
import { MapPin, Navigation } from 'lucide-react';

// You'll need to get a Mapbox access token from https://mapbox.com/
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsbjRxbTB1MzBwbmoybG51bmZ1YnGGWMifQ.0OGn9k9LMhHlY_zhxv_vLw";

interface MapViewProps {
  stops: RoadStop[];
  startLocation: string;
  endLocation: string;
}

const MapView: React.FC<MapViewProps> = ({ stops, startLocation, endLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialCoordinates = stops.length > 0 
      ? getCoordinatesFromStop(stops[0]) 
      : [0, 0];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite streets style
      center: initialCoordinates as [number, number],
      zoom: 8
    });
    
    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      if (!map.current) return;
      
      // Add markers for all stops
      addStopsToMap(map.current, stops);
      
      // Fit bounds to show all stops
      fitMapToStops(map.current, stops);
    });
    
    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [stops]);

  // Helper to extract coordinates from a stop
  const getCoordinatesFromStop = (stop: RoadStop): [number, number] => {
    // In a real app, you would have actual coordinates stored in the database
    // For now, we'll use a simple function to generate fake coordinates based on the stop name
    // This should be replaced with real geocoding or stored coordinates
    const hash = stop.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return [
      -122.4194 + (hash % 10) / 100, // Fake longitude near San Francisco
      37.7749 + (hash % 10) / 100,   // Fake latitude near San Francisco
    ];
  };
  
  // Add all stops to the map
  const addStopsToMap = (mapInstance: mapboxgl.Map, stops: RoadStop[]) => {
    // Create markers for each stop
    stops.forEach((stop, index) => {
      const coordinates = getCoordinatesFromStop(stop);
      
      // Create HTML element for marker
      const markerElement = document.createElement('div');
      markerElement.className = 'flex flex-col items-center';
      
      const pinElement = document.createElement('div');
      pinElement.className = `w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-md ${index === 0 ? 'bg-blue-600' : index === stops.length - 1 ? 'bg-red-600' : 'bg-forest-700'}`;
      pinElement.textContent = (index + 1).toString();
      
      markerElement.appendChild(pinElement);
      
      // Create popup with stop information
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-bold">${stop.name}</h3>
            <p class="text-sm text-gray-600">${stop.location || 'No location specified'}</p>
            ${stop.description ? `<p class="text-sm mt-2">${stop.description}</p>` : ''}
          </div>
        `);
      
      // Add marker to map
      new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(mapInstance);
    });
    
    // Draw route line if we have at least 2 stops
    if (stops.length >= 2) {
      const coordinates = stops.map(getCoordinatesFromStop);
      
      // Add route line
      mapInstance.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });
      
      mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ffffff',
          'line-width': 4,
          'line-opacity': 0.8,
          'line-dasharray': [0.5, 1.5]
        }
      });
      
      // Add glow effect
      mapInstance.addLayer({
        id: 'route-glow',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4ade80',
          'line-width': 8,
          'line-opacity': 0.15
        }
      }, 'route');
    }
  };
  
  // Fit map to show all stops
  const fitMapToStops = (mapInstance: mapboxgl.Map, stops: RoadStop[]) => {
    if (stops.length === 0) return;
    
    const coordinates = stops.map(getCoordinatesFromStop);
    
    // Find the bounds of all coordinates
    const bounds = coordinates.reduce((bound, coord) => {
      return bound.extend(coord as mapboxgl.LngLatLike);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
    
    // Fit the map to the bounds
    mapInstance.fitBounds(bounds, {
      padding: { top: 50, bottom: 50, left: 50, right: 50 },
      maxZoom: 15
    });
  };

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-0 left-0 m-4 bg-white bg-opacity-80 p-2 rounded-lg shadow-md z-10">
        <div className="flex items-center space-x-2 text-sm">
          <Navigation className="h-4 w-4 text-forest-700" />
          <span className="font-medium">Route Map</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
