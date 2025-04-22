import { useSelector } from 'react-redux';
import { formatDistance, formatDuration } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

const RouteSummary = () => {
    const {
        totalDistance,
        totalDuration,
        origin,
        destination,
        transportMode
    } = useSelector(state => state.route);
    const { t } = useTranslation();

    if (!totalDistance && !totalDuration) return null;

    return (
        <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#e0f2f1',
            borderRadius: '4px'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00796b' }}>{t('routeDetails.tripSummary')}</h3>
            <p><strong>{t('routeDetails.from')}:</strong> {origin}</p>
            <p><strong>{t('routeDetails.to')}:</strong> {destination}</p>
            <p><strong>{t('routeDetails.totalDistance')}:</strong> {formatDistance(totalDistance)}</p>
            <p><strong>{t('routeDetails.estimatedTime')}:</strong> {formatDuration(totalDuration)}</p>
            <p><strong>{t('form.transportMode')}:</strong> {t(`transportModes.${transportMode}`)}</p>
        </div>
    );
};

export default RouteSummary;