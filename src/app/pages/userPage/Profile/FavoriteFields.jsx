// FavoriteFields.jsx
import { Heart, MapPin, Search, Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { deleteData, fetchData } from '../../../../mocks/CallingAPI';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import { useTheme } from '../../../hooks/ThemeContext';
import './FavoriteFields.css';

const FavoriteFields = () => {
  const { user } = useAuth();

  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const [favoriteFields, setFavoriteFields] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteFieldData = async () => {
      const token = user?.token || null;
      try {
        const fieldsResponse = await fetchData('Field', token);
        const venuesResponse = await fetchData('Venue', token);
        const favoriteFieldsResponse = await fetchData('FavoriteField', token);
        const imagesResponse = await fetchData('Image', token);

        // Map cho tra cứu nhanh
        const fieldMap = Object.fromEntries(fieldsResponse?.map(f => [f.id, f]));
        const venueMap = Object.fromEntries(venuesResponse?.map(v => [v.id, v]));

        // Gom images theo venueId
        const imagesByVenue = imagesResponse?.reduce((acc, img) => {
          if (!acc[img.venueId]) acc[img.venueId] = [];
          acc[img.venueId].push(img);
          return acc;
        }, {});

        // Gộp tất cả
        const newFavoriteField = favoriteFieldsResponse
          ?.filter(ff => ff.userId === user?.id)
          ?.map(ff => {
            const field = fieldMap[ff.fieldId];
            const venue = field ? venueMap[field.venueId] : null;
            const venueWithImages = venue
              ? { ...venue, images: imagesByVenue[venue.id] || [] }
              : null;

            return {
              ...ff,
              field: field
                ? { ...field, venue: venueWithImages }
                : null,
            };
          });

        setFavoriteFields(newFavoriteField);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching favorite field data:', JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteFieldData();
  }, [user?.token, refresh]);

  const deleteFavoriteField = async (favoriteFieldId) => {
    setLoading(true);
    console.log('delete');
    const token = user?.token || null;
    try {
      await deleteData(`FavoriteField/${favoriteFieldId}`, token);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting favorite field:', JSON.stringify(err));
    } finally {
      setLoading(false);
      setRefresh(p => p + 1);
    }
  }

  const filteredFavorites = favoriteFields
    ?.filter(f =>
      f.field?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      f.field?.venue?.address?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
    ?.sort((a, b) => {
      const dateA = new Date(a.setDate);
      const dateB = new Date(b.setDate);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

  return (
    <div className={`favorite-fields ${theme}`}>
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
              placeholder="Search by name or address"
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
                <th>Venue</th>
                <th>Name</th>
                <th>Address</th>
                {/* <th>Rating</th> */}
                {/* <th>Price</th> */}
                <th>Added Date</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredFavorites?.map(f => (
                <tr key={f.id}>
                  <td><img src={f.field?.venue?.images?.[0]?.link} alt={f.field?.venue?.name} className="table-image" /></td>
                  <td>{f.field?.venue?.name}</td>
                  <td>{f.field?.name}</td>
                  <td>{f.field?.venue?.address}</td>
                  {/* <td>{f.field?.rating} / 5</td> */}
                  {/* <td>${f.field?.pricePerHour}/hour</td> */}
                  <td>{(new Date(f.setDate))?.toLocaleDateString()}</td>
                  <td><button className="remove-button" onClick={() => deleteFavoriteField(f.id)}><Trash2 className="remove-icon" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid-view">
            {filteredFavorites?.map(f => (
              <div key={f.id} className="grid-card">
                <img src={f.field?.venue?.images?.[0]?.link} alt={f.field?.venue?.name} className="grid-image" />
                <div className="grid-info">
                  <h4 className="grid-name">{f.field?.venue?.name}</h4>
                  <h5 className="grid-name">{f.field?.name}</h5>
                  <div className="grid-details">
                    <MapPin className="detail-icon" />
                    <span>{f.field?.venue?.address}</span>
                  </div>
                  <div className="grid-details">
                    <Star className="detail-icon" />
                    {/* <span>{f.field?.rating} / 5</span> */}
                  </div>
                  {/* <p className="grid-price">${f.field?.pricePerHour}/hour</p> */}
                  <p className="grid-added">Added: {(new Date(f.setDate))?.toLocaleDateString()}</p>
                </div>
                <button className="remove-button" onClick={() => deleteFavoriteField(f.id)}><Trash2 className="remove-icon" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {filteredFavorites?.length === 0 && (
        <div className="no-favorites">
          <Heart className="no-favorites-icon" />
          <p>No favorite fields found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default FavoriteFields;