import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    setOrigin,
    setDestination,
    setTransportMode,
    fetchDirections,
    setOriginFromCoords
} from '../../redux/actions/routeActions';
import { useTranslation } from 'react-i18next';

const RouteForm = () => {
    const dispatch = useDispatch();
    const { origin, destination, transportMode, loading } = useSelector(state => state.route);
    const [locationLoading, setLocationLoading] = useState(false);
    const [translationsReady, setTranslationsReady] = useState(false);
    const { t, i18n } = useTranslation();

    // Wait for translations to be ready
    useEffect(() => {
        if (i18n.isInitialized) {
            setTranslationsReady(true);
        } else {
            i18n.on('initialized', () => setTranslationsReady(true));
        }
    }, [i18n]);

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
            alert(t('errors.geolocationNotSupported', 'Geolocation is not supported by your browser'));
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
                alert(`${t('errors.locationError', 'Error getting location')}: ${error.message}`);
                setLocationLoading(false);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    if (!translationsReady) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="origin" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('form.startingPoint', 'Starting Point')}:
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        id="origin"
                        value={origin || ''}
                        onChange={handleOriginChange}
                        placeholder={t('form.enterOrigin', 'Enter origin (e.g., street address, landmark)')}
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
                        title={t('form.useMyLocation', 'Use my location')}
                    >
                        {locationLoading ? '...' : '📍'}
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="destination" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('form.destination', 'Destination')}:
                </label>
                <input
                    id="destination"
                    value={destination || ''}
                    onChange={handleDestinationChange}
                    placeholder={t('form.enterDestination', 'Enter destination (e.g., street address, landmark)')}
                    style={{ width: '94%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="transportMode" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    {t('form.transportMode', 'Transportation Mode')}:
                </label>
                <select
                    id="transportMode"
                    value={transportMode}
                    onChange={handleTransportModeChange}
                    style={{ width: '96%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="walking">{t('transportModes.walking', 'Walking')}</option>
                    <option value="driving">{t('transportModes.driving', 'Driving')}</option>
                    <option value="cycling">{t('transportModes.cycling', 'Cycling')}</option>
                    <option value="bus">{t('transportModes.bus', 'Bus')}</option>
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
                {loading ? t('form.findingRoute', 'Finding Route...') : t('form.findRoute', 'Find Route')}
            </button>
        </form>
    );
};

export default RouteForm;