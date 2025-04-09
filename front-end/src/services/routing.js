import axios from 'axios';

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

        const route = { ...response.data };
        const speedFactor = SPEED_FACTORS[transportMode];

        route.routes.forEach(routeItem => {
            if (routeItem.duration) {
                if (transportMode === 'driving') {
                    routeItem.duration *= 1.2;
                }
            }

            routeItem.legs.forEach(leg => {
                leg.steps.forEach(step => {
                    if (step.duration) {
                        if (transportMode === 'driving') {
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