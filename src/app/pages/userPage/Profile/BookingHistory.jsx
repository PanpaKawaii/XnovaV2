// BookingHistory.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Filter, MapPin, Clock, DollarSign } from 'lucide-react';
import { useTheme } from '../../../hooks/ThemeContext.jsx';
import { useAuth } from '../../../hooks/AuthContext/AuthContext.jsx';
import { fetchData } from '../../../../mocks/CallingAPI.js';
import './BookingHistory.css';

const BookingHistory = () => {
  const { theme } = useTheme();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const { user } = useAuth();

  const FakeBookings = [
    {
      id: '1',
      fieldName: 'Central Park Field',
      date: '2025-07-10',
      time: '14:00',
      duration: '2h',
      price: 80,
      status: 'completed'
    },
    {
      id: '2',
      fieldName: 'Riverside Stadium',
      date: '2025-07-15',
      time: '18:00',
      duration: '1.5h',
      price: 60,
      status: 'upcoming'
    },
    {
      id: '3',
      fieldName: 'City Arena',
      date: '2025-06-20',
      time: '10:00',
      duration: '1h',
      price: 40,
      status: 'cancelled'
    },
    {
      id: '4',
      fieldName: 'Downtown Pitch',
      date: '2025-07-05',
      time: '16:00',
      duration: '2h',
      price: 75,
      status: 'completed'
    },
    {
      id: '5',
      fieldName: 'Alexandria Stadium',
      date: '2025-07-06',
      time: '12:00',
      duration: '2h',
      price: 75,
      status: 'completed'
    },
    {
      id: '6',
      fieldName: 'Mina Jetsica',
      date: '2025-07-06',
      time: '12:00',
      duration: '2h',
      price: 75,
      status: 'completed'
    },
    {
      id: '7',
      fieldName: 'Mina Jetsica',
      date: '2025-07-06',
      time: '12:00',
      duration: '2h',
      price: 75,
      status: 'completed'
    }
  ];

  const [BOOKINGs, setBOOKINGs] = useState(FakeBookings || []);
  const [SLOTs, setSLOTs] = useState([]);
  const [FIELDs, setFIELDs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = user?.token;
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const DataBookings = await fetchData('booking', token);
        console.log('DataBookings', DataBookings);
        const UserBookings = DataBookings?.filter(booking => booking.userId == user?.id);
        console.log('UserBookings', UserBookings);

        const DataSlots = await fetchData('slot', token);
        console.log('DataSlots', DataSlots);

        const DataFields = await fetchData('field', token);
        console.log('DataFields', DataFields);

        setBOOKINGs(UserBookings);
        setSLOTs(DataSlots);
        setFIELDs(DataFields);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user]);

  const filteredBookings = BOOKINGs
    .filter(booking => {
      return filter === 'all' || booking.status == filter;
    })
    .map(booking => {
      const updatedBookingSlots = booking.bookingSlots?.map(bs => {
        const slot = SLOTs.find(slot => slot.id == bs.slotId);
        return {
          ...bs,
          slot: slot || null,
        };
      }).sort((a, b) => {
        const aTime = a.slot?.startTime ?? '';
        const bTime = b.slot?.startTime ?? '';
        return aTime.localeCompare(bTime); // hoặc dùng Date.parse nếu là ISO string
      });

      const field = FIELDs.find(field => field.id == booking.fieldId);

      return {
        ...booking,
        bookingSlots: updatedBookingSlots || [],
        field: field || null,
      };
    });
  console.log('filteredBookings', filteredBookings);

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Mới nhất lên đầu
    } else if (sortBy === 'field') {
      return a.field.name.localeCompare(b.field.name); // Sắp xếp theo tên field (A -> Z)
    }
    return 0;
  });

  return (
    <div className={`booking-history ${theme}`}>
      <div className='header'>
        <Calendar className='header-icon' />
        <h3 className='title'>
          Booking History
        </h3>
      </div>

      {/* Filters */}
      <div className='filters'>
        <div className='filter-group'>
          <label className='label'>
            Filter by Status
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className='select'
          >
            <option value='all'>All Bookings</option>
            <option value={1}>Upcoming</option>
            <option value={2}>Pending</option>
            <option value={3}>Cancelled</option>
            <option value={4}>Completed</option>
          </select>
        </div>
        <div className='filter-group'>
          <label className='label'>
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='select'
          >
            <option value='date'>Date</option>
            <option value='field'>Field Name</option>
          </select>
        </div>
      </div>

      {/* Booking Cards */}
      <div className='booking-list-container'>
        <div className='booking-list'>
          {sortedBookings.map((booking) => (
            <div
              key={booking.id}
              className='booking-card'
            >
              <div className='card-content'>
                <div className='field-info'>
                  <div className='field-name'>
                    <MapPin className='map-icon' />
                    <h4 className='field-title'>
                      {booking.field?.name}
                    </h4>
                  </div>
                  <div className='details'>
                    <div className='date'>
                      <Calendar className='date-icon' />
                      <span>
                        {new Date(booking.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='time'>
                      <Clock className='time-icon' />
                      <span>
                        {booking.bookingSlots[0]?.slot?.startTime} ({booking.bookingSlots?.length * 30 / 60}h)
                      </span>
                    </div>
                  </div>
                </div>
                <div className='price-status'>
                  <div className='price'>
                    {/* <DollarSign className='dollar-icon' /> */}
                    <span className='price-amount'>
                      {booking.bookingSlots.reduce((sum, bs) => sum + (bs.slot?.price || 0), 0).toLocaleString()} VND
                    </span>
                  </div>
                  <span className={`status ${booking.status}`}>
                    {booking.status == 1 ? 'Upcoming' : (booking.status == 2 ? 'Pending' : (booking.status == 3 ? 'Cancelled' : 'Unsupported status'))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sortedBookings.length === 0 && (
        <div className='no-bookings'>
          <Calendar className='no-bookings-icon' />
          <p>No bookings found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;