import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Clock, Star, Maximize2 } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  price: number;
  type: string;
  lat: number;
  lng: number;
}

interface MapWidgetProps {
  venues?: Venue[];
  selectedVenue?: string;
  onVenueSelect?: (venueId: string) => void;
}

const MapWidget: React.FC<MapWidgetProps> = ({ venues = [], selectedVenue, onVenueSelect }) => {
  const [mapView, setMapView] = useState<'map' | 'list'>('map');

  // Mock venues data for map
  const mockVenues: Venue[] = venues.length > 0 ? venues : [
    {
      id: '1',
      name: 'Sân Cầu Lông Quận 1',
      location: 'Quận 1, TP.HCM',
      distance: '1.2 km',
      rating: 4.8,
      price: 200000,
      type: 'Badminton',
      lat: 10.7769,
      lng: 106.7009
    },
    {
      id: '2',
      name: 'Sân Bóng Đá Mini Q7',
      location: 'Quận 7, TP.HCM',
      distance: '2.5 km',
      rating: 4.6,
      price: 350000,
      type: 'Football',
      lat: 10.7378,
      lng: 106.7194
    },
    {
      id: '3',
      name: 'Sân Tennis Landmark',
      location: 'Quận 2, TP.HCM',
      distance: '3.1 km',
      rating: 4.9,
      price: 180000,
      type: 'Tennis',
      lat: 10.7829,
      lng: 106.7220
    }
  ];

  const getVenueTypeColor = (type: string) => {
    switch (type) {
      case 'Badminton':
        return 'bg-green-500';
      case 'Football':
        return 'bg-blue-500';
      case 'Tennis':
        return 'bg-orange-500';
      case 'Basketball':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Bản đồ sân</h3>
        <div className="flex items-center space-x-2">
          <Maximize2 size={14} className="text-gray-400" />
          <div className="flex bg-gray-800 rounded p-0.5">
            <button
              onClick={() => setMapView('map')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                mapView === 'map' ? 'bg-purple-600 text-white' : 'text-gray-400'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapView('list')}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                mapView === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {mapView === 'map' ? (
        <div className="space-y-3">
          {/* Fixed Height Map Container */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: '200px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
            
            {/* Map Markers - Fixed positioning to prevent overflow */}
            <div className="absolute inset-2">
              {mockVenues.map((venue, index) => (
                <div
                  key={venue.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                    selectedVenue === venue.id ? 'z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${Math.min(Math.max(20 + index * 20, 10), 85)}%`,
                    top: `${Math.min(Math.max(25 + index * 15, 15), 80)}%`
                  }}
                  onClick={() => onVenueSelect?.(venue.id)}
                >
                  <div className={`w-6 h-6 rounded-full ${getVenueTypeColor(venue.type)} flex items-center justify-center border-2 border-white shadow-lg hover:scale-110 transition-transform`}>
                    <MapPin size={12} className="text-white" />
                  </div>
                  
                  {selectedVenue === venue.id && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg p-2 min-w-40 shadow-xl z-30">
                      <div className="text-white font-medium text-xs mb-1 truncate">{venue.name}</div>
                      <div className="text-gray-400 text-xs mb-1 truncate">{venue.location}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star size={10} className="text-yellow-400 mr-1" />
                          <span className="text-white text-xs">{venue.rating}</span>
                        </div>
                        <div className="text-green-400 text-xs font-medium">
                          {(venue.price / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Current Location - Centered */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Map Controls - Fixed positioning */}
            <div className="absolute top-2 right-2 space-y-1">
              <button className="w-6 h-6 bg-white/90 rounded shadow-lg flex items-center justify-center hover:bg-white transition-colors">
                <span className="text-gray-700 font-bold text-xs">+</span>
              </button>
              <button className="w-6 h-6 bg-white/90 rounded shadow-lg flex items-center justify-center hover:bg-white transition-colors">
                <span className="text-gray-700 font-bold text-xs">-</span>
              </button>
            </div>

            {/* Current Location Button */}
            <div className="absolute bottom-2 right-2">
              <button className="w-8 h-8 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors">
                <Navigation size={12} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Compact Map Legend */}
          <div className="flex flex-wrap gap-1">
            {['Badminton', 'Football', 'Tennis', 'Basketball'].map((type) => (
              <div key={type} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${getVenueTypeColor(type)}`}></div>
                <span className="text-gray-400 text-xs">{type}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto scroll-container">
          {mockVenues.map((venue) => (
            <div
              key={venue.id}
              className={`p-2 bg-gray-800 rounded-lg cursor-pointer transition-colors hover:bg-gray-750 ${
                selectedVenue === venue.id ? 'ring-1 ring-purple-500' : ''
              }`}
              onClick={() => onVenueSelect?.(venue.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-medium text-xs truncate flex-1 mr-2">{venue.name}</h4>
                <span className={`px-1.5 py-0.5 rounded text-xs text-white ${getVenueTypeColor(venue.type)} flex-shrink-0`}>
                  {venue.type}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-400 flex-1 mr-2">
                  <MapPin size={10} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{venue.distance}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="flex items-center">
                    <Star size={10} className="text-yellow-400 mr-1" />
                    <span className="text-white">{venue.rating}</span>
                  </div>
                  <div className="text-green-400 font-medium">
                    {(venue.price / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compact Quick Actions */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center space-x-1 p-2 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-white text-xs">Gần nhất</span>
          </button>
          <button className="flex items-center justify-center space-x-1 p-2 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors">
            <Clock size={12} className="text-green-400" />
            <span className="text-white text-xs">Có sẵn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;