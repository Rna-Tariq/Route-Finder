import { useSelector } from 'react-redux';

const RouteDetails = () => {
    const { route } = useSelector(state => state.route);

    if (!route.length) return null;

    return (
        <div>
            <h3 style={{ color: '#00796b' }}>Directions:</h3>
            <ol style={{ paddingLeft: '20px' }}>
                {route.map((step, index) => (
                    <li key={index} style={{ marginBottom: '15px', lineHeight: '1.5' }}>
                        <div>
                            <span style={{ fontWeight: step.maneuver?.type === 'turn' ? 'bold' : 'normal' }}>
                                {step.instruction}
                            </span>
                        </div>
                        {(step.duration > 0 && step.maneuver?.type !== 'arrive') && (
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '3px' }}>
                                Takes about {step.formattedDuration}
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default RouteDetails;