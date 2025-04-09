const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{
            background: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            color: '#c62828'
        }}>
            {message}
        </div>
    );
};

export default ErrorMessage;