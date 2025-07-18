// FavoriteFields.jsx
import React, { useState } from 'react';
import { useTheme } from '../../hooks/ThemeContext';
import { Heart, MapPin, Star, Grid, ChevronLeft, ChevronRight, List, Search, Clock, Trash2 } from 'lucide-react';
import './FavoriteFields.css';

const sampleFavorites = [
  {
    id: '1',
    name: 'Central Park Field',
    location: 'New York, NY',
    rating: 4.8,
    pricePerHour: 50,
    image: 'https://tse4.mm.bing.net/th/id/OIP.bsikEwakEnMDuwRLgUBUXwHaEJ?pid=ImgDet&w=184&h=103&c=7&dpr=1.4&o=7&rm=3',
    addedDate: new Date('2025-07-01')
  },
  {
    id: '2',
    name: 'Riverside Stadium',
    location: 'Los Angeles, CA',
    rating: 4.5,
    pricePerHour: 45,
    image: 'https://tse4.mm.bing.net/th/id/OIP.bsikEwakEnMDuwRLgUBUXwHaEJ?pid=ImgDet&w=184&h=103&c=7&dpr=1.4&o=7&rm=3',
    addedDate: new Date('2025-06-15')
  },
  {
    id: '3',
    name: 'City Arena',
    location: 'Chicago, IL',
    rating: 4.7,
    pricePerHour: 55,
    image: 'https://tse4.mm.bing.net/th/id/OIP.bsikEwakEnMDuwRLgUBUXwHaEJ?pid=ImgDet&w=184&h=103&c=7&dpr=1.4&o=7&rm=3',
    addedDate: new Date('2025-07-10')
  },
  {
    id: '4',
    name: 'Downtown Pitch',
    location: 'Miami, FL',
    rating: 4.6,
    pricePerHour: 60,
    image: 'https://tse4.mm.bing.net/th/id/OIP.bsikEwakEnMDuwRLgUBUXwHaEJ?pid=ImgDet&w=184&h=103&c=7&dpr=1.4&o=7&rm=3',
    addedDate: new Date('2025-05-20')
  }
];

const FavoriteFields = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'carousel'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc' by addedDate
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredFavorites = sampleFavorites
    .filter(field => 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      field.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.addedDate - b.addedDate;
      } else {
        return b.addedDate - a.addedDate;
      }
    });

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, filteredFavorites.length - 1));
  };

  return (
    <div className={`favorite-fields ${theme}`}>
      <div className="section-header">
        <Heart className="section-icon" />
        <h3 className="section-title">Favorite Fields</h3>
      </div>
      <div className="controls">
        <div className="search-bar">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or location" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="view-toggle">
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`} 
            onClick={() => setViewMode('list')}
          >
            <List className="view-icon" />
            List
          </button>
          <button 
            className={`view-button ${viewMode === 'carousel' ? 'active' : ''}`} 
            onClick={() => setViewMode('carousel')}
          >
            <Grid className="view-icon" />
            Carousel
          </button>
        </div>
        <div className="sort-filter">
          <Clock className="sort-icon" />
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      {viewMode === 'list' ? (
        <div className="fields-table-container">
          <table className="fields-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Price</th>
                <th>Added Date</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredFavorites.map(field => (
                <tr key={field.id}>
                  <td><img src={field.image} alt={field.name} className="table-image" /></td>
                  <td>{field.name}</td>
                  <td>{field.location}</td>
                  <td>{field.rating} / 5</td>
                  <td>${field.pricePerHour}/hour</td>
                  <td>{field.addedDate.toLocaleDateString()}</td>
                  <td><button className="remove-button"><Trash2 className="remove-icon" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="carousel">
          <button className="nav-button prev" onClick={handlePrev} disabled={currentIndex === 0}>
            <ChevronLeft />
          </button>
          <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {filteredFavorites.map(field => (
              <div key={field.id} className="carousel-item">
                <img src={field.image} alt={field.name} className="field-image" />
                <div className="field-info">
                  <h3 className="field-name">{field.name}</h3>
                  <div className="field-details">
                    <MapPin className="detail-icon" />
                    <span>{field.location}</span>
                  </div>
                  <div className="field-details">
                    <Star className="detail-icon" />
                    <span>{field.rating} / 5</span>
                  </div>
                  <p className="field-price">${field.pricePerHour}/hour</p>
                  <p className="added-date">Added: {field.addedDate.toLocaleDateString()}</p>
                </div>
                <button className="remove-button">Remove</button>
              </div>
            ))}
          </div>
          <button className="nav-button next" onClick={handleNext} disabled={currentIndex === filteredFavorites.length - 1}>
            <ChevronRight />
          </button>
        </div>
      )}
      {filteredFavorites.length === 0 && (
        <p className="empty-message">No favorite fields match your search.</p>
      )}
    </div>
  );
};

export default FavoriteFields;