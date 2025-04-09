// src/redux/slices/routeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    origin: '',
    destination: '',
    transportMode: 'walking',
    route: [],
    totalDistance: 0,
    totalDuration: 0,
    isLoading: false,
    error: null,
    userLocation: null
};

const routeSlice = createSlice({
    name: 'route',
    initialState,
    reducers: {
        setOrigin: (state, action) => {
            state.origin = action.payload;
        },
        setDestination: (state, action) => {
            state.destination = action.payload;
        },
        setTransportMode: (state, action) => {
            state.transportMode = action.payload;
        },
        setRoute: (state, action) => {
            state.route = {
                steps: action.payload.steps,
                distance: action.payload.distance,
                duration: action.payload.duration,
                geometry: action.payload.geometry,
                origin: action.payload.origin,
                destination: action.payload.destination
            };
            state.totalDistance = action.payload.totalDistance;
            state.totalDuration = action.payload.totalDuration;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setUserLocation: (state, action) => {
            state.userLocation = action.payload;
        },
        clearRoute: (state) => {
            state.route = null;
            state.totalDistance = 0;
            state.totalDuration = 0;
            state.error = null;
        }
    }
});

export const {
    setOrigin,
    setDestination,
    setTransportMode,
    setRoute,
    setLoading,
    setError,
    setUserLocation,
    clearRoute
} = routeSlice.actions;

export default routeSlice.reducer;