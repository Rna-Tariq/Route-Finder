import { useAuth } from '../../contexts/AuthContext';

const LoginButton = () => {
    const { signIn } = useAuth();

    return (
        <button
            onClick={signIn}
            style={{
                padding: '10px 20px',
                backgroundColor: '#4285F4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'block',
                margin: '20px auto',
                fontWeight: 'bold'
            }}
        >
            Sign In with Google
        </button>
    );
};

export default LoginButton;