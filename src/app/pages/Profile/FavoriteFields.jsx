// FavoriteFields.jsx
import React, { useState } from 'react';
import { Heart, MapPin, Star, Search, Clock, Trash2 } from 'lucide-react';
import { useTheme } from '../../hooks/ThemeContext';
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
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredFavorites = sampleFavorites
    .filter(field => 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      field.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      return sortOrder === 'asc' ? a.addedDate - b.addedDate : b.addedDate - a.addedDate;
    });

  return (
    <div className={`favorite-fields${isDarkMode ? ' dark' : ''}`}>
      <div className="header">
        <Heart className="header-icon" />
        <h3 className="title">Favorite Fields</h3>
      </div>

      <div className="filters">
        <div className="filter-group search-group">
          <label className="label">Search</label>
          <div className="search-bar">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or location" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
        <div className="filter-group">
          <label className="label">View Mode</label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="select">
            <option value="list">List</option>
            <option value="grid">Grid</option>
          </select>
        </div>
        <div className="filter-group">
          <label className="label">Sort by Added Date</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="select">
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      <div className="favorite-list-container">
        {viewMode === 'list' ? (
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
        ) : (
          <div className="grid-view">
            {filteredFavorites.map(field => (
              <div key={field.id} className="grid-card">
                <img src={field.image} alt={field.name} className="grid-image" />
                <div className="grid-info">
                  <h4 className="grid-name">{field.name}</h4>
                  <div className="grid-details">
                    <MapPin className="detail-icon" />
                    <span>{field.location}</span>
                  </div>
                  <div className="grid-details">
                    <Star className="detail-icon" />
                    <span>{field.rating} / 5</span>
                  </div>
                  <p className="grid-price">${field.pricePerHour}/hour</p>
                  <p className="grid-added">Added: {field.addedDate.toLocaleDateString()}</p>
                </div>
                <button className="remove-button"><Trash2 className="remove-icon" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredFavorites.length === 0 && (
        <div className="no-favorites">
          <Heart className="no-favorites-icon" />
          <p>No favorite fields found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default FavoriteFields;