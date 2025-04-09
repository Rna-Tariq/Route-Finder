export const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (minutes === 0) {
        return `${remainingSeconds} seconds`;
    } else if (remainingSeconds === 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes > 1 ? 's' : ''} and ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}`;
    }
};

export const formatDistance = (meters) => {
    if (meters < 1000) {
        return `${Math.round(meters)} meters`;
    } else {
        return `${(meters / 1000).toFixed(2)} kilometers`;
    }
};

export const getDirection = (bearing) => {
    if (bearing === undefined) return 'forward';

    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'north'];
    return directions[Math.round(bearing / 45) % 8];
};