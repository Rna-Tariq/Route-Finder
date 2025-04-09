import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setError } from '../redux/slices/routeSlice';
import { geocodeService } from '../services/geocodeService';

export const useGeocode = () => {
    const dispatch = useDispatch();

    const getCoordinates = useCallback(async (location) => {
        try {
            return await geocodeService.getCoordinates(location);
        } catch (error) {
            console.error(`Error getting coordinates for ${location}:`, error);
            if (error.response && error.response.status === 401) {
                dispatch(setError('Invalid API key for geocoding. Please check your key.'));
            } else {
                dispatch(setError(error.message || 'Failed to fetch coordinates.'));
            }
            throw error;
        }
    }, [dispatch]);

    return { getCoordinates };
};