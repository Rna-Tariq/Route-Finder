import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const { user, logOut } = useAuth();

  if (!user) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    }}>
      <div className="user-info">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              marginRight: '10px'
            }}
          />
        )}
        <span>Welcome, {user.displayName}</span>
      </div>
      <button
        onClick={logOut}
        style={{
          padding: '8px 16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Log Out
      </button>
    </div>
  );
};

export default UserProfile;