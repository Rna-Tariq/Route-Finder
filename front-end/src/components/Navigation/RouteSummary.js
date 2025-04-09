import { useSelector } from 'react-redux';
import { formatDistance, formatDuration } from '../../utils/formatters';

const RouteSummary = () => {
    const {
        totalDistance,
        totalDuration,
        origin,
        destination,
        transportMode
    } = useSelector(state => state.route);

    if (!totalDistance && !totalDuration) return null;

    return (
        <div style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#e0f2f1',
            borderRadius: '4px'
        }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00796b' }}>Trip Summary</h3>
            <p><strong>From:</strong> {origin}</p>
            <p><strong>To:</strong> {destination}</p>
            <p><strong>Total Distance:</strong> {formatDistance(totalDistance)}</p>
            <p><strong>Estimated Time:</strong> {formatDuration(totalDuration)}</p>
            <p><strong>Mode:</strong> {transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}</p>
        </div>
    );
};

export default RouteSummary;