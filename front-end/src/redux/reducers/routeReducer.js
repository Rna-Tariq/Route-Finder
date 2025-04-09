import {
    SET_ORIGIN,
    SET_DESTINATION,
    SET_TRANSPORT_MODE,
    FETCH_ROUTE_START,
    FETCH_ROUTE_SUCCESS,
    FETCH_ROUTE_FAILURE,
    CLEAR_ROUTE
} from '../actions/types';

const initialState = {
    origin: '',
    destination: '',
    transportMode: 'walking',
    route: [],
    loading: false,
    error: null,
    totalDistance: 0,
    totalDuration: 0,
    originAddress: '',
    destinationAddress: '',
    originCoords: null,
    destinationCoords: null,
    routeGeometry: null
};

const routeReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ORIGIN:
            return {
                ...state,
                origin: action.payload,
                originCoords: action.meta ? { lat: action.meta.lat, lng: action.meta.lng } : null
            };
        case SET_DESTINATION:
            return {
                ...state,
                destination: action.payload
            };
        case SET_TRANSPORT_MODE:
            return {
                ...state,
                transportMode: action.payload
            };
        case FETCH_ROUTE_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_ROUTE_SUCCESS:
            return {
                ...state,
                loading: false,
                route: action.payload.route,
                totalDistance: action.payload.totalDistance,
                totalDuration: action.payload.totalDuration,
                originAddress: action.payload.originAddress,
                destinationAddress: action.payload.destinationAddress,
                originCoords: action.payload.originCoords,
                destinationCoords: action.payload.destinationCoords,
                routeGeometry: action.payload.routeGeometry
            };
        case FETCH_ROUTE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                route: []
            };
        case CLEAR_ROUTE:
            return {
                ...state,
                route: [],
                error: null,
                totalDistance: 0,
                totalDuration: 0,
                routeGeometry: null,
            };
        default:
            return state;
    }
};

export default routeReducer;