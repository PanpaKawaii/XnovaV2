import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Clock, Star, Maximize2 } from 'lucide-react';
import './MapWidget.css';

const MapWidget = ({ venues = [], selectedVenue, onVenueSelect }) => {
  const [mapView, setMapView] = useState('map');

  // Mock venues data for map
  const mockVenues = venues.length > 0 ? venues : [
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

  const getVenueTypeColor = (type) => {
    switch (type) {
      case 'Badminton':
        return 'map-widget__marker-icon--badminton';
      case 'Football':
        return 'map-widget__marker-icon--football';
      case 'Tennis':
        return 'map-widget__marker-icon--tennis';
      case 'Basketball':
        return 'map-widget__marker-icon--basketball';
      default:
        return 'map-widget__marker-icon--default';
    }
  };

  const getVenueTypeBadgeColor = (type) => {
    switch (type) {
      case 'Badminton':
        return { backgroundColor: '#22c55e' };
      case 'Football':
        return { backgroundColor: '#3b82f6' };
      case 'Tennis':
        return { backgroundColor: '#f97316' };
      case 'Basketball':
        return { backgroundColor: '#a855f7' };
      default:
        return { backgroundColor: '#6b7280' };
    }
  };

  const getLegendDotColor = (type) => {
    switch (type) {
      case 'Badminton':
        return { backgroundColor: '#22c55e' };
      case 'Football':
        return { backgroundColor: '#3b82f6' };
      case 'Tennis':
        return { backgroundColor: '#f97316' };
      case 'Basketball':
        return { backgroundColor: '#a855f7' };
      default:
        return { backgroundColor: '#6b7280' };
    }
  };

  return (
    <div className="map-widget">
      <div className="map-widget__header">
        <h3 className="map-widget__title">Bản đồ sân</h3>
        <div className="map-widget__controls">
          <Maximize2 size={14} className="map-widget__maximize" />
          <div className="map-widget__view-toggle">
            <button
              onClick={() => setMapView('map')}
              className={`map-widget__view-button ${
                mapView === 'map' ? 'map-widget__view-button--active' : 'map-widget__view-button--inactive'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setMapView('list')}
              className={`map-widget__view-button ${
                mapView === 'list' ? 'map-widget__view-button--active' : 'map-widget__view-button--inactive'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {mapView === 'map' ? (
        <div>
          {/* Map Container */}
          <div className="map-widget__map-container">
            <div className="map-widget__map-overlay"></div>
            
            {/* Map Markers */}
            <div className="map-widget__markers">
              {mockVenues.map((venue, index) => (
                <div
                  key={venue.id}
                  className={`map-widget__marker ${
                    selectedVenue === venue.id ? 'map-widget__marker--selected' : ''
                  }`}
                  style={{
                    left: `${Math.min(Math.max(20 + index * 20, 10), 85)}%`,
                    top: `${Math.min(Math.max(25 + index * 15, 15), 80)}%`
                  }}
                  onClick={() => onVenueSelect?.(venue.id)}
                >
                  <div className={`map-widget__marker-icon ${getVenueTypeColor(venue.type)}`}>
                    <MapPin size={12} color="white" />
                  </div>
                  
                  {selectedVenue === venue.id && (
                    <div className="map-widget__popup">
                      <div className="map-widget__popup-name">{venue.name}</div>
                      <div className="map-widget__popup-location">{venue.location}</div>
                      <div className="map-widget__popup-info">
                        <div className="map-widget__popup-rating">
                          <Star size={10} className="map-widget__popup-rating-star" />
                          <span className="map-widget__popup-rating-text">{venue.rating}</span>
                        </div>
                        <div className="map-widget__popup-price">
                          {(venue.price / 1000).toFixed(0)}K
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Current Location */}
              <div className="map-widget__current-location">
                <div className="map-widget__current-dot"></div>
                <div className="map-widget__current-ping"></div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="map-widget__zoom-controls">
              <button className="map-widget__zoom-button">
                <span className="map-widget__zoom-text">+</span>
              </button>
              <button className="map-widget__zoom-button">
                <span className="map-widget__zoom-text">-</span>
              </button>
            </div>

            {/* Current Location Button */}
            <button className="map-widget__location-button">
              <Navigation size={12} className="map-widget__location-icon" />
            </button>
          </div>

          {/* Legend */}
          <div className="map-widget__legend">
            {['Badminton', 'Football', 'Tennis', 'Basketball'].map((type) => (
              <div key={type} className="map-widget__legend-item">
                <div className="map-widget__legend-dot" style={getLegendDotColor(type)}></div>
                <span className="map-widget__legend-text">{type}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="map-widget__list">
          {mockVenues.map((venue) => (
            <div
              key={venue.id}
              className={`map-widget__list-item ${
                selectedVenue === venue.id ? 'map-widget__list-item--selected' : ''
              }`}
              onClick={() => onVenueSelect?.(venue.id)}
            >
              <div className="map-widget__list-item-header">
                <h4 className="map-widget__list-item-title">{venue.name}</h4>
                <span className="map-widget__list-item-badge" style={getVenueTypeBadgeColor(venue.type)}>
                  {venue.type}
                </span>
              </div>
              
              <div className="map-widget__list-item-info">
                <div className="map-widget__list-item-location">
                  <MapPin size={10} className="map-widget__list-item-location-icon" />
                  <span className="map-widget__list-item-location-text">{venue.distance}</span>
                </div>
                <div className="map-widget__list-item-stats">
                  <div className="map-widget__list-item-rating">
                    <Star size={10} className="map-widget__list-item-rating-star" />
                    <span className="map-widget__list-item-rating-text">{venue.rating}</span>
                  </div>
                  <div className="map-widget__list-item-price">
                    {(venue.price / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="map-widget__actions">
        <div className="map-widget__actions-grid">
          <button className="map-widget__action-button">
            <Zap size={12} className="map-widget__action-button-icon--nearest" />
            <span className="map-widget__action-button-text">Gần nhất</span>
          </button>
          <button className="map-widget__action-button">
            <Clock size={12} className="map-widget__action-button-icon--available" />
            <span className="map-widget__action-button-text">Có sẵn</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
