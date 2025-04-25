
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { RoadStop } from '@/services/types';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

// You'll need to get a Mapbox access token from https://mapbox.com/
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsbjRxbTB1MzBwbmoybG51bmZ1YnF3aDMifQ.0OGn9k9LMhHlY_zhxv_vLw";

interface MapViewProps {
  stops: RoadStop[];
  startLocation: string;
  endLocation: string;
  interactiveMap?: boolean;
}

const MapView: React.FC<MapViewProps> = ({ 
  stops, 
  startLocation, 
  endLocation, 
  interactiveMap = true 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // Initialize mapbox
      mapboxgl.accessToken = MAPBOX_TOKEN;
      
      const initialCoordinates = stops.length > 0 
        ? getCoordinatesFromStop(stops[0]) 
        : [0, 0];
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite streets style
        center: initialCoordinates as [number, number],
        zoom: stops.length === 1 ? 12 : 8,
        interactive: interactiveMap,
      });
      
      // Add navigation controls if interactive
      if (interactiveMap) {
        map.current.addControl(
          new mapboxgl.NavigationControl({
            visualizePitch: true,
          }),
          'top-right'
        );
      }

      map.current.on('load', () => {
        if (!map.current) return;
        
        // Add markers for all stops
        addStopsToMap(map.current, stops);
        
        // Fit bounds to show all stops
        fitMapToStops(map.current, stops);
        
        // Add terrain if available
        try {
          map.current.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
          });
          
          // Add 3D terrain
          map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          
          // Add sky layer for realistic atmosphere
          map.current.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 0.0],
              'sky-atmosphere-sun-intensity': 15
            }
          });
        } catch (err) {
          console.log('Could not add terrain:', err);
        }
      });
      
      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('There was an error loading the map. Please try again later.');
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setMapError('Could not initialize the map. Please check your connection and try again.');
    }
    
    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [stops, interactiveMap]);

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
    // Clear existing markers if any
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());
    
    // Clear existing sources and layers if present
    if (mapInstance.getSource('route')) {
      mapInstance.removeLayer('route');
      mapInstance.removeLayer('route-glow');
      mapInstance.removeSource('route');
    }
    
    // Create markers for each stop
    stops.forEach((stop, index) => {
      const coordinates = getCoordinatesFromStop(stop);
      
      // Create HTML element for marker
      const markerElement = document.createElement('div');
      markerElement.className = 'flex flex-col items-center';
      
      const pinElement = document.createElement('div');
      pinElement.className = `w-8 h-8 rounded-full ${index === 0 ? 'bg-blue-600' : index === stops.length - 1 ? 'bg-red-600' : 'bg-forest-700'} flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-md transition-all hover:scale-110`;
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
      });
      
      // Add route line
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
      }, 'route-glow');
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
    
    // Add some padding
    const padding = { top: 50, bottom: 50, left: 50, right: 50 };
    
    // Fit the map to the bounds
    mapInstance.fitBounds(bounds, {
      padding,
      maxZoom: 15,
      duration: 1000,  // Animate the transition
      essential: true  // Make sure it happens even on reduced motion settings
    });
  };

  // Show error message if map failed to load
  if (mapError) {
    return (
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{mapError}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
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
