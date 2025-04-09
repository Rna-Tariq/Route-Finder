import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserLocation, setError } from '../redux/slices/routeSlice';
import { geocodeService } from '../services/geocodeService';

export const useUserLocation = () => {
    const dispatch = useDispatch();

    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    dispatch(setUserLocation({ lat: latitude, lng: longitude }));

                    try {
                        const address = await geocodeService.reverseGeocode(latitude, longitude);
                        dispatch(setOrigin(address));
                    } catch (error) {
                        console.error('Error getting address from coordinates:', error);
                        dispatch(setOrigin(`${latitude}, ${longitude}`));
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    dispatch(setError('Unable to get your current location.'));
                }
            );
        } else {
            dispatch(setError('Geolocation is not supported by your browser.'));
        }
    }, [dispatch]);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    return { getCurrentLocation };
};