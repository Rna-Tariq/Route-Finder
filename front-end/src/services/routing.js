import axios from 'axios';

// Speed factors by transport mode (in meters per second)
const SPEED_FACTORS = {
    walking: 1.4,      // ~5 km/h
    cycling: 4.2,      // ~15 km/h
    driving: 13.9,     // ~50 km/h
};

export const fetchRoute = async (originData, destinationData, transportMode) => {
    const originCoords = `${originData.lng},${originData.lat}`;
    const destinationCoords = `${destinationData.lng},${destinationData.lat}`;

    try {
        const response = await axios.get(
            `https://router.project-osrm.org/route/v1/${transportMode}/${originCoords};${destinationCoords}?overview=full&steps=true&annotations=true&geometries=geojson`
        );

        if (!response.data.routes.length) {
            throw new Error('No route found between these locations.');
        }

        // Adjust duration based on transport mode
        const route = { ...response.data };
        const speedFactor = SPEED_FACTORS[transportMode];

        // Adjust durations for the whole route and each step
        route.routes.forEach(routeItem => {
            if (routeItem.duration) {
                // OSRM already provides estimated duration, but we can adjust based on our factors
                // This is just a simple adjustment, in reality it would be more complex
                if (transportMode === 'driving') {
                    // Add traffic factor (20% more time on average)
                    routeItem.duration *= 1.2;
                }
            }

            // Adjust leg and step durations
            routeItem.legs.forEach(leg => {
                leg.steps.forEach(step => {
                    if (step.duration) {
                        if (transportMode === 'driving') {
                            // Add traffic factor
                            step.duration *= 1.2;
                        }
                    }
                });
            });
        });

        return route;
    } catch (error) {
        console.error('Error fetching route from OSRM:', error);
        throw error;
    }
};