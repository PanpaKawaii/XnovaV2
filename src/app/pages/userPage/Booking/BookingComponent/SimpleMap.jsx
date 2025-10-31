import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function SimpleMap({ venues = [] }) {
    // export default function VenueMap() {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    console.log('venues', venues);


    useEffect(() => {
        // Ngăn không khởi tạo lại map nhiều lần
        if (mapRef.current) return;

        // Tạo bản đồ mặc định (tạm đặt ở giữa Việt Nam)
        const map = L.map(mapContainerRef.current).setView([16.047079, 108.20623], 6);
        mapRef.current = map;

        // Thêm tile layer từ OpenStreetMap
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Biểu tượng marker cho vị trí người dùng (màu xanh)
        const userIcon = L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        // Biểu tượng marker cho các venues (màu đỏ)
        const venueIcon = L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        });

        // 🧭 Lấy vị trí hiện tại của người dùng
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Marker vị trí của người dùng
                    const userMarker = L.marker([userLat, userLng], { icon: userIcon })
                        .addTo(map)
                        .bindPopup("<b>Vị trí của bạn</b>")
                        .openPopup();

                    // Di chuyển map đến vị trí của người dùng
                    map.setView([userLat, userLng], 13);
                },
                (err) => {
                    console.error("Lỗi khi lấy vị trí người dùng:", err);
                }
            );
        }

        // 🏠 Hiển thị danh sách venues
        venues.forEach((venue) => {
            if (venue.latitude && venue.longitude) {
                const marker = L.marker([parseFloat(venue.latitude), parseFloat(venue.longitude)], { icon: venueIcon })
                    .addTo(map)
                    .bindPopup(`<b>${venue.name}</b>`);
            }
        });

        // Cleanup
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [venues]);

    return <div ref={mapContainerRef} style={{ height: "300px", width: "100%" }} />;
}
