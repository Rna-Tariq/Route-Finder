import axios from 'axios';

const SPEED_FACTORS = {
    walking: 1.4,      // ~5 km/h
    cycling: 4.2,      // ~15 km/h
    driving: 13.9,     // ~50 km/h
    bus: 8.3,          // ~30 km/h with stops
};

export const fetchRoute = async (originData, destinationData, transportMode) => {
    const originCoords = `${originData.lng},${originData.lat}`;
    const destinationCoords = `${destinationData.lng},${destinationData.lat}`;

    try {
        if (transportMode === 'bus') {
            // use bus routing API here
            // For demonstration, we'll use OSRM's driving mode with bus-specific adjustments
            const response = await axios.get(
                `https://router.project-osrm.org/route/v1/driving/${originCoords};${destinationCoords}?overview=full&steps=true&annotations=true&geometries=geojson`
            );

            if (!response.data.routes.length) {
                throw new Error('No bus route found between these locations.');
            }

            const route = { ...response.data };
            const busSpeedFactor = SPEED_FACTORS['bus'] / SPEED_FACTORS['driving'];

            route.routes.forEach(routeItem => {
                routeItem.duration *= (1.5 / busSpeedFactor);

                routeItem.legs.forEach(leg => {
                    let accumulatedDistance = 0;
                    leg.steps = leg.steps.flatMap(step => {
                        if (step.distance > 400) {
                            accumulatedDistance += step.distance;
                            if (accumulatedDistance > 500) {
                                accumulatedDistance = 0;
                                const busStopStep = {
                                    ...step,
                                    name: "Bus Stop",
                                    distance: 0,
                                    duration: 20,
                                    maneuver: {
                                        ...step.maneuver,
                                        type: "bus_stop",
                                        modifier: "stop"
                                    }
                                };
                                return [step, busStopStep];
                            }
                        }
                        return [step];
                    });
                });
            });

            return route;
        }
        else {
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
        }
    } catch (error) {
        console.error('Error fetching route:', error);
        throw error;
    }
};