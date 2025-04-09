import {
    SET_ORIGIN,
    SET_DESTINATION,
    SET_TRANSPORT_MODE,
    FETCH_ROUTE_START,
    FETCH_ROUTE_SUCCESS,
    FETCH_ROUTE_FAILURE,
    CLEAR_ROUTE
} from './types';
import { getCoordinates, formatDirections } from '../../services/geocoding';
import { fetchRoute } from '../../services/routing';
import axios from 'axios';

export const setOrigin = (origin) => ({
    type: SET_ORIGIN,
    payload: origin
});

export const setDestination = (destination) => ({
    type: SET_DESTINATION,
    payload: destination
});

export const setTransportMode = (mode) => ({
    type: SET_TRANSPORT_MODE,
    payload: mode
});

export const clearRoute = () => ({
    type: CLEAR_ROUTE
});

export const setOriginFromCoords = (latitude, longitude) => async (dispatch) => {
    try {
        const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;
        const response = await axios.get(
            'https://api.opencagedata.com/geocode/v1/json',
            { params: { q: `${latitude}+${longitude}`, key: OPENCAGE_API_KEY } }
        );

        if (!response.data.results.length) {
            dispatch(setOrigin(`${latitude},${longitude}`));
            return;
        }

        const locationName = response.data.results[0].formatted;

        dispatch({
            type: SET_ORIGIN,
            payload: locationName,
            meta: { lat: latitude, lng: longitude }
        });

    } catch (error) {
        console.error('Error reverse geocoding coordinates:', error);
        dispatch(setOrigin(`${latitude},${longitude}`));
    }
};

export const fetchDirections = () => async (dispatch, getState) => {
    const { origin, destination, transportMode, originCoords } = getState().route;

    if (!origin || !destination) {
        return dispatch({
            type: FETCH_ROUTE_FAILURE,
            payload: 'Please enter both origin and destination.'
        });
    }

    dispatch({ type: FETCH_ROUTE_START });

    try {
        let originData;

        if (originCoords) {
            originData = {
                lat: originCoords.lat,
                lng: originCoords.lng,
                formatted: origin
            };
        } else {
            originData = await getCoordinates(origin);
        }

        const destinationData = await getCoordinates(destination);

        const routeData = await fetchRoute(
            originData,
            destinationData,
            transportMode
        );

        const processedRoute = formatDirections(routeData);

        dispatch({
            type: FETCH_ROUTE_SUCCESS,
            payload: {
                route: processedRoute.steps,
                originAddress: originData.formatted,
                destinationAddress: destinationData.formatted,
                totalDistance: processedRoute.totalDistance,
                totalDuration: processedRoute.totalDuration,
                originCoords: originData,
                destinationCoords: destinationData,
                routeGeometry: processedRoute.geometry
            }
        });
    } catch (error) {
        console.error('Error fetching directions:', error);
        dispatch({
            type: FETCH_ROUTE_FAILURE,
            payload: error.message || 'Failed to get directions. Please try again.'
        });
    }
};