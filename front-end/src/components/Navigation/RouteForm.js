import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setOrigin,
    setDestination,
    setTransportMode,
    fetchDirections,
    setOriginFromCoords
} from '../../redux/actions/routeActions';

const RouteForm = () => {
    const dispatch = useDispatch();
    const { origin, destination, transportMode, loading } = useSelector(state => state.route);
    const [locationLoading, setLocationLoading] = useState(false);

    const handleOriginChange = (e) => {
        dispatch(setOrigin(e.target.value));
    };

    const handleDestinationChange = (e) => {
        dispatch(setDestination(e.target.value));
    };

    const handleTransportModeChange = (e) => {
        dispatch(setTransportMode(e.target.value));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchDirections());
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                dispatch(setOriginFromCoords(latitude, longitude));
                setLocationLoading(false);
            },
            (error) => {
                alert(`Error getting location: ${error.message}`);
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Starting Point:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        value={origin}
                        onChange={handleOriginChange}
                        placeholder="Enter origin (e.g., street address, landmark)"
                        style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        style={{
                            padding: '0 15px',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        title="Use my current location"
                    >
                        {locationLoading ? '...' : '📍'}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Destination:
                </label>
                <input
                    value={destination}
                    onChange={handleDestinationChange}
                    placeholder="Enter destination (e.g., street address, landmark)"
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Transportation Mode:
                </label>
                <select
                    value={transportMode}
                    onChange={handleTransportModeChange}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="walking">Walking</option>
                    <option value="driving">Driving</option>
                    <option value="cycling">Cycling</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading || !origin || !destination}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: (!origin || !destination) ? '#cccccc' : '#00796b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: (!origin || !destination) ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                }}
            >
                {loading ? 'Finding Route...' : 'Find Route'}
            </button>
        </form>
    );
};

export default RouteForm;