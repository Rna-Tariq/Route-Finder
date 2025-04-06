import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth, provider } from './firebase';
import { 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

function App() {
  const [user, setUser] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState([]);
  const [transportMode, setTransportMode] = useState('walking');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  // Check for Auth State on Page Load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    
    // Handle redirect result if using redirect sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Error getting redirect result:', error);
      });
      
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Sign-In with Popup
  const signInWithPopupMethod = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Error during popup sign-in:', error);
      // If popup fails, fall back to redirect
      if (error.code === 'auth/cancelled-popup-request') {
        signInWithRedirectMethod();
      }
    }
  };

  // Sign-In with Redirect (more reliable)
  const signInWithRedirectMethod = async () => {
    try {
      await signInWithRedirect(auth, provider);
      // User state will be set by the useEffect that handles redirect results
    } catch (error) {
      console.error('Error during redirect sign-in:', error);
      setError('Authentication failed. Please try again later.');
    }
  };

  // Sign-Out
  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during sign-out:', error);
    }
  };

  // Convert City Name to Coordinates
  const getCoordinates = async (location) => {
    try {
      const response = await axios.get(
        'https://api.opencagedata.com/geocode/v1/json',
        { params: { q: location, key: OPENCAGE_API_KEY } }
      );
      
      if (!response.data.results.length) {
        throw new Error(`No coordinates found for ${location}`);
      }
      
      const { lat, lng } = response.data.results[0].geometry;
      return { lat, lng, formatted: response.data.results[0].formatted };
    } catch (error) {
      console.error(`Error getting coordinates for ${location}:`, error);
      throw error;
    }
  };

  // Format duration in minutes and seconds
  const formatDuration = (seconds) => {
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

  // Format distance in meters or kilometers
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} meters`;
    } else {
      return `${(meters / 1000).toFixed(2)} kilometers`;
    }
  };

  // Get cardinal direction from bearing
  const getDirection = (bearing) => {
    const directions = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest', 'north'];
    return directions[Math.round(bearing / 45) % 8];
  };

  // Create human-readable navigation instructions
  const createInstruction = (step) => {
    const direction = step.maneuver?.type || '';
    const modifier = step.maneuver?.modifier || '';
    const name = step.name || 'the road';
    const distance = step.distance || 0;
    const bearing = step.maneuver?.bearing_after;
    
    let instruction = '';
    
    switch (direction) {
      case 'depart':
        instruction = `Start by heading ${getDirection(bearing)} on ${name}`;
        break;
      case 'arrive':
        instruction = 'You have arrived at your destination';
        break;
      case 'turn':
        instruction = `Turn ${modifier} onto ${name}`;
        break;
      case 'continue':
        instruction = `Continue ${modifier ? modifier + ' ' : ''}on ${name}`;
        break;
      case 'new name':
        instruction = `Continue onto ${name}`;
        break;
      case 'roundabout':
        instruction = `At the roundabout, take the exit onto ${name}`;
        break;
      default:
        if (name !== 'Unnamed road') {
          instruction = `Follow ${name}`;
        } else {
          instruction = `Continue ${getDirection(bearing)}`;
        }
    }
    
    if (distance > 0 && direction !== 'arrive') {
      instruction += ` for ${formatDistance(distance)}`;
    }
    
    return instruction;
  };

  // Fetch Directions from OSRM
  const getDirections = async () => {
    setIsLoading(true);
    setError(null);
    setRoute([]);
    
    try {
      // Get coordinates for origin and destination
      const originData = await getCoordinates(origin);
      const destinationData = await getCoordinates(destination);
      
      const originCoords = `${originData.lng},${originData.lat}`;
      const destinationCoords = `${destinationData.lng},${destinationData.lat}`;
      
      // Request route from OSRM
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/${transportMode}/${originCoords};${destinationCoords}?overview=full&steps=true&annotations=true`
      );
      
      if (!response.data.routes.length) {
        throw new Error('No route found between these locations.');
      }
      
      const route = response.data.routes[0];
      const legs = route.legs;
      
      // Calculate total distance and duration
      const totalDistance = route.distance || 0;
      const totalDuration = route.duration || 0;
      
      setTotalDistance(totalDistance);
      setTotalDuration(totalDuration);
      
      // Process steps to create user-friendly instructions
      const processedSteps = [];
      
      legs.forEach((leg) => {
        leg.steps.forEach((step, index) => {
          const processedStep = {
            ...step,
            instruction: createInstruction(step),
            formattedDistance: formatDistance(step.distance || 0),
            formattedDuration: formatDuration(step.duration || 0)
          };
          
          processedSteps.push(processedStep);
        });
      });
      
      setRoute(processedSteps);
    } catch (error) {
      console.error('Error fetching directions:', error);
      setError(error.message || 'Failed to get directions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Route Finder</h1>
      
      {error && (
        <div style={{ background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px', color: '#c62828' }}>
          {error}
        </div>
      )}
      
      {user ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <p>Welcome, {user.displayName}</p>
          <button 
            onClick={logOut}
            style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Log Out
          </button>
        </div>
      ) : (
        <button 
          onClick={signInWithPopupMethod}
          style={{ padding: '10px 20px', backgroundColor: '#4285F4', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'block', margin: '20px auto' }}
        >
          Sign In with Google
        </button>
      )}
      
      {user && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Starting Point:</label>
            <input
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin (e.g., Cairo, Egypt)"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Destination:</label>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination (e.g., Alexandria, Egypt)"
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Transportation Mode:</label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="walking">Walking</option>
              <option value="driving">Driving</option>
              <option value="cycling">Cycling</option>
            </select>
          </div>
          
          <button 
            onClick={getDirections}
            disabled={isLoading || !origin || !destination}
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
            {isLoading ? 'Finding Route...' : 'Find Route'}
          </button>
        </div>
      )}
      
      {route.length > 0 && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0f2f1', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#00796b' }}>Trip Summary</h3>
            <p><strong>From:</strong> {origin}</p>
            <p><strong>To:</strong> {destination}</p>
            <p><strong>Total Distance:</strong> {formatDistance(totalDistance)}</p>
            <p><strong>Estimated Time:</strong> {formatDuration(totalDuration)}</p>
            <p><strong>Mode:</strong> {transportMode.charAt(0).toUpperCase() + transportMode.slice(1)}</p>
          </div>
          
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
      )}
    </div>
  );
}

export default App;