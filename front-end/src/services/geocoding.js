// src/services/geocoding.js
import axios from 'axios';
import { getDirection, formatDistance, formatDuration } from '../utils/formatters';

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

export const getCoordinates = async (location) => {
    try {
        // Check if the input is already coordinates (from "Use my location" button)
        if (/^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location)) {
            const [lat, lng] = location.split(',').map(coord => parseFloat(coord));

            // Reverse geocode to get address
            const response = await axios.get(
                'https://api.opencagedata.com/geocode/v1/json',
                { params: { q: `${lat}+${lng}`, key: OPENCAGE_API_KEY } }
            );

            if (!response.data.results.length) {
                throw new Error(`No address found for these coordinates`);
            }

            return {
                lat,
                lng,
                formatted: response.data.results[0].formatted
            };
        }

        // Forward geocode address to coordinates
        const response = await axios.get(
            'https://api.opencagedata.com/geocode/v1/json',
            { params: { q: location, key: OPENCAGE_API_KEY } }
        );

        if (!response.data.results.length) {
            throw new Error(`No coordinates found for ${location}`);
        }

        const { lat, lng } = response.data.results[0].geometry;
        return {
            lat,
            lng,
            formatted: response.data.results[0].formatted
        };
    } catch (error) {
        console.error(`Error getting coordinates for ${location}:`, error);
        throw new Error(`Could not find location: ${location}`);
    }
};

export const createInstruction = (step) => {
    const direction = step.maneuver?.type || '';
    const modifier = step.maneuver?.modifier || '';
    const name = step.name || 'the road';
    const distance = step.distance || 0;
    const bearing = step.maneuver?.bearing_after;

    let instruction = '';

    switch (direction) {
        case 'depart':
            instruction = `Start by heading ${getDirection(bearing)} on ${name}`;
            break;
        case 'arrive':
            instruction = 'You have arrived at your destination';
            break;
        case 'turn':
            instruction = `Turn ${modifier} onto ${name}`;
            break;
        case 'continue':
            instruction = `Continue ${modifier ? modifier + ' ' : ''}on ${name}`;
            break;
        case 'new name':
            instruction = `Continue onto ${name}`;
            break;
        case 'roundabout':
            instruction = `At the roundabout, take the exit onto ${name}`;
            break;
        default:
            if (name !== 'Unnamed road') {
                instruction = `Follow ${name}`;
            } else {
                instruction = `Continue ${getDirection(bearing)}`;
            }
    }

    if (distance > 0 && direction !== 'arrive') {
        instruction += ` for ${formatDistance(distance)}`;
    }

    return instruction;
};

export const formatDirections = (routeData) => {
    const route = routeData.routes[0];
    const legs = route.legs;

    // Calculate totals
    const totalDistance = route.distance || 0;
    const totalDuration = route.duration || 0;

    // Process steps
    const processedSteps = [];

    legs.forEach((leg) => {
        leg.steps.forEach((step) => {
            const processedStep = {
                ...step,
                instruction: createInstruction(step),
                formattedDistance: formatDistance(step.distance || 0),
                formattedDuration: formatDuration(step.duration || 0)
            };

            processedSteps.push(processedStep);
        });
    });

    return {
        steps: processedSteps,
        totalDistance,
        totalDuration,
        geometry: route.geometry // For map rendering
    };
};

// src/services/routing.js
