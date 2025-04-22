import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux';
import TransportMarker from './TransportMarker';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIconRetina,
    iconUrl: markerIcon,
    shadowUrl: markerShadow
});

const MapView = () => {
    const { originCoords, destinationCoords, routeGeometry, transportMode } = useSelector(state => state.route);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [currentHeading, setCurrentHeading] = useState(0);
    const [animationFrame, setAnimationFrame] = useState(null);

    const mapCenter = routeGeometry?.coordinates?.[0]
        ? [routeGeometry.coordinates[0][1], routeGeometry.coordinates[0][0]]
        : originCoords ? [originCoords.lat, originCoords.lng]
            : [51.505, -0.09];

    const mapZoom = routeGeometry ? 13 : 15;

    const routePath = routeGeometry?.coordinates
        ? routeGeometry.coordinates.map(coord => [coord[1], coord[0]])
        : [];

    useEffect(() => {
        if (!routePath.length) return;

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }

        let step = 0;
        const totalSteps = routePath.length;
        const animationSpeed = transportMode === 'walking' ? 100 :
            transportMode === 'cycling' ? 70 :
                transportMode === 'bus' ? 50 : 30;

        let lastTimestamp = 0;

        const animate = (timestamp) => {
            if (!lastTimestamp) lastTimestamp = timestamp;

            const elapsed = timestamp - lastTimestamp;

            if (elapsed > animationSpeed) {
                if (step < totalSteps - 1) {
                    setCurrentPosition(routePath[step]);

                    if (step < totalSteps - 3) {
                        const dx = routePath[step + 2][1] - routePath[step][1];
                        const dy = routePath[step + 2][0] - routePath[step][0];
                        setCurrentHeading(Math.atan2(dx, dy) * 180 / Math.PI);
                    }

                    step++;
                    lastTimestamp = timestamp;
                }
            }

            if (step < totalSteps - 1) {
                const frame = requestAnimationFrame(animate);
                setAnimationFrame(frame);
            }
        };

        setCurrentPosition(routePath[0]);
        const frame = requestAnimationFrame(animate);
        setAnimationFrame(frame);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [routePath, transportMode]);

    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {originCoords && (
                <Marker position={[originCoords.lat, originCoords.lng]}>
                    <Popup>Starting Point: {originCoords.formatted}</Popup>
                </Marker>
            )}

            {destinationCoords && (
                <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
                    <Popup>Destination: {destinationCoords.formatted}</Popup>
                </Marker>
            )}

            {routePath.length > 0 && (
                <Polyline
                    positions={routePath}
                    color={
                        transportMode === 'walking' ? 'green' :
                            transportMode === 'cycling' ? 'blue' :
                                transportMode === 'bus' ? 'purple' : 'red'
                    }
                    weight={5}
                    opacity={0.7}
                />
            )}

            {currentPosition && (
                <TransportMarker
                    position={currentPosition}
                    transportMode={transportMode}
                    heading={currentHeading}
                />
            )}
        </MapContainer>
    );
};

export default MapView;