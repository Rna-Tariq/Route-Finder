# Route Finder

A modern web application that helps users find optimal routes between locations with interactive maps and detailed directions.

## Features

- **Current Location Detection**: Easily use your current location as a starting point
- **Specific Location Routing**: Find routes between specific addresses, landmarks, or points of interest
- **Interactive Map**: Visualize your route on an interactive Leaflet map
- **Multiple Transportation Modes**: Choose between walking, cycling, or driving
- **Accurate Time Estimation**: Get estimated travel times based on transportation mode
- **Detailed Turn-by-Turn Directions**: Receive clear instructions for your journey
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js with Redux for state management
- **Maps**: Leaflet for interactive maps and route visualization
- **Routing**: OSRM (Open Source Routing Machine) API for route calculation
- **Geocoding**: OpenCage Geocoding API for address lookup and reverse geocoding
- **Backend**: Node.js with Express
- **Database**: Firebase Firestore for saving route history

## Installation

### Clone the repository:

```bash
git clone https://github.com/yourusername/route-finder.git
cd route-finder
```

## Install frontend dependencies
```bash
 npm install
```

## Install backend dependencies:
```bash
cd backend
npm install express axios cors dotenv firebase-admin
```

## Create a .env file in the root directory with your API keys:
REACT_APP_OPENCAGE_API_KEY=your_opencage_api_key

##Create a .env file in the backend directory:
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

## Place your Firebase Admin SDK JSON file in the backend directory as firebase-adminsdk.json

## Start the backend server:

```bash
cd backend
node server.js
```
## Start the frontend development server:

```bash
cd ..
npm start
```

## Open your browser and navigate to http://localhost:3000.

### Usage

- Enter Starting Point: Type an address or click the location pin icon to use your current location.
- Enter Destination: Type the address of your destination.
- Select Transportation Mode: Choose between walking, cycling, or driving.
- Find Route: Click the "Find Route" button to calculate and display your route.
- View Directions: Scroll down to see turn-by-turn directions and estimated travel time.

### API Integration

## OpenCage Geocoding API
- Used for:
- Converting addresses to coordinates
- Reverse geocoding current location to address
## OSRM (Open Source Routing Machine)
- Used for:
- Calculating optimal routes between points
- Generating turn-by-turn directions
- Estimating travel times and distances
## Google Maps Directions API (Backend)
- Used for:
- Alternative routing provider
- Saving route history to Firebase

### Contributing

- Fork the repository
- Create your feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add some amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request

### License

## This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Leaflet - Open-source JavaScript library for mobile-friendly interactive maps
- OpenCage Geocoding - Geocoding API
- OSRM - Open Source Routing Machine
- React - JavaScript library for building user interfaces
- Redux - State management for JavaScript applications
- Express - Web framework for Node.js
- Firebase - App development platform by Google