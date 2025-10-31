import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoogleMap.css'

export default function GoogleMap({ venues }) {
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [error, setError] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: 0, lng: 0 },
            zoom: 3,
        });

        // Hàm thêm marker
        const addMarker = (location, map, title = 'Địa điểm đã chọn') => {
            return new window.google.maps.Marker({
                position: location,
                map: map,
                title,
            });
        };

        // Kiểm tra geolocation
        if (!navigator.geolocation) {
            setError('Trình duyệt không hỗ trợ xác định vị trí.');
            return;
        }

        // Lấy vị trí hiện tại
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });

                addMarker(userLocation, map, 'Vị trí của bạn');

                map.setCenter(userLocation);
                map.setZoom(14);
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError('Người dùng từ chối chia sẻ vị trí.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError('Không thể lấy thông tin vị trí.');
                        break;
                    case err.TIMEOUT:
                        setError('Yêu cầu lấy vị trí bị quá thời gian chờ.');
                        break;
                    default:
                        setError('Lỗi không xác định khi lấy vị trí.');
                }
            }
        );
    }, []);

    return (
        <div style={{ padding: '20px 0' }}>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {location.lat && location.lon ? (
                <p>
                    <strong>Latitude:</strong> {location.lat}
                    <br />
                    <strong>Longitude:</strong> {location.lon}
                </p>
            ) : !error ? (
                <p>Đang lấy vị trí...</p>
            ) : null}

            <div ref={mapRef} className='google-map'></div>
        </div>
    )
}
