import { useAuth } from './contexts/AuthContext';
import { useSelector } from 'react-redux';

import UserProfile from './components/Auth/UserProfile';
import LoginButton from './components/Auth/LoginButton';
import RouteForm from './components/Navigation/RouteForm.js';
import RouteSummary from './components/Navigation/RouteSummary';
import RouteDetails from './components/Navigation/RouteDetails';
import MapView from './components/Map/MapView';
import ErrorMessage from './components/UI/ErrorMessage';
import LoadingSpinner from './components/UI/LoadingSpinner';

function App() {
  const { user, error: authError } = useAuth();
  const { loading, error: routeError, route } = useSelector(state => state.route);
  
  return (
    <div className="app-container" style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Route Finder</h1>
      
      <ErrorMessage message={authError || routeError} />
      
      {!user ? (
        <LoginButton />
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '20px',
          '@media (min-width: 768px)': {
            gridTemplateColumns: '350px 1fr'
          }
        }}>
          <div className="controls-panel">
            <UserProfile />
            <RouteForm />
            <RouteSummary />
          </div>
          
          <div className="content-panel">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <MapView />
                {route.length > 0 && (
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '20px', 
                    borderRadius: '8px',
                    marginTop: '20px' 
                  }}>
                    <RouteDetails />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;