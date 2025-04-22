import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import { useMap } from 'react-leaflet';

import walkingIcon from '../../assets/icons/walking.svg';
import drivingIcon from '../../assets/icons/car.svg';
import cyclingIcon from '../../assets/icons/bicycle.svg';
import busIcon from '../../assets/icons/bus.svg';

const TransportMarker = ({ position, transportMode, heading }) => {
    const markerRef = useRef(null);
    const prevPositionRef = useRef(null);
    const map = useMap();

    useEffect(() => {
        if (!position) return;

        if (prevPositionRef.current) {
            const [prevLat, prevLng] = prevPositionRef.current;
            const [newLat, newLng] = position;

            const distance = Math.sqrt(
                Math.pow(newLat - prevLat, 2) + Math.pow(newLng - prevLng, 2)
            );

            if (distance < 0.00005) {
                return;
            }
        }

        prevPositionRef.current = position;

        const iconSize = [32, 32];
        let selectedIconUrl;

        switch (transportMode) {
            case 'walking':
                selectedIconUrl = walkingIcon;
                break;
            case 'driving':
                selectedIconUrl = drivingIcon;
                break;
            case 'cycling':
                selectedIconUrl = cyclingIcon;
                break;
            case 'bus':
                selectedIconUrl = busIcon;
                break;
            default:
                selectedIconUrl = walkingIcon;
        }

        const transportIcon = L.icon({
            iconUrl: selectedIconUrl,
            iconSize,
            iconAnchor: [16, 16],
        });

        if (markerRef.current) {
            markerRef.current.setLatLng(position);

            if (typeof heading === 'number') {
                const currentAngle = markerRef.current.options.rotationAngle || 0;
                const angleDiff = heading - currentAngle;

                const normalizedAngleDiff = ((angleDiff + 180) % 360) - 180;

                const newAngle = currentAngle + (normalizedAngleDiff * 0.2);
                markerRef.current.setRotationAngle(newAngle);
            }
        } else {
            markerRef.current = L.marker(position, {
                icon: transportIcon,
                rotationAngle: heading || 0,
                rotationOrigin: 'center center'
            }).addTo(map);
        }

        return () => {
            if (markerRef.current) {
                map.removeLayer(markerRef.current);
                markerRef.current = null;
            }
        };
    }, [map, position, transportMode, heading]);

    return null;
};

export default TransportMarker;