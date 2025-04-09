import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = () => {
    const {
        originCoords,
        destinationCoords,
        routeGeometry,
        transportMode
    } = useSelector(state => state.route);

    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current && mapContainerRef.current) {
            const instance = L.map(mapContainerRef.current).setView([30.0444, 31.2357], 13); // Default to Cairo

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(instance);

            mapRef.current = instance;
            setMap(instance);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!map || !originCoords || !destinationCoords) return;

        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                map.removeLayer(layer);
            }
        });

        const originMarker = L.marker([originCoords.lat, originCoords.lng])
            .addTo(map)
            .bindPopup('Origin')
            .openPopup();

        const destMarker = L.marker([destinationCoords.lat, destinationCoords.lng])
            .addTo(map)
            .bindPopup('Destination');

        const bounds = L.latLngBounds([
            [originCoords.lat, originCoords.lng],
            [destinationCoords.lat, destinationCoords.lng]
        ]);

        if (routeGeometry && routeGeometry.coordinates) {
            const coordinates = routeGeometry.coordinates.map(coord => [coord[1], coord[0]]);

            let lineColor;
            switch (transportMode) {
                case 'walking':
                    lineColor = '#1976d2'; // Blue
                    break;
                case 'cycling':
                    lineColor = '#388e3c'; // Green
                    break;
                case 'driving':
                    lineColor = '#d32f2f'; // Red
                    break;
                default:
                    lineColor = '#000000';
            }

            const routeLine = L.polyline(coordinates, {
                color: lineColor,
                weight: 5,
                opacity: 0.7
            }).addTo(map);

            routeLine.getLatLngs().forEach(point => {
                bounds.extend([point.lat, point.lng]);
            });
        }

        map.fitBounds(bounds, { padding: [50, 50] });

    }, [map, originCoords, destinationCoords, routeGeometry, transportMode]);

    if (!originCoords || !destinationCoords) {
        return (
            <div
                style={{
                    height: '400px',
                    backgroundColor: '#e5e5e5',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '16px',
                    color: '#666'
                }}
            >
                Enter origin and destination to see the map
            </div>
        );
    }

    return (
        <div
            ref={mapContainerRef}
            style={{
                height: '400px',
                borderRadius: '4px',
                marginBottom: '20px'
            }}
        />
    );
};

export default MapView;