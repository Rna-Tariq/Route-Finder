const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccount = require('./firebase-adminsdk.json');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.post('/api/directions', async (req, res) => {
    const { origin, destination, userId } = req.body;
    try {
        const response = await axios.get(
            'https://maps.googleapis.com/maps/api/directions/json',
            {
                params: {
                    origin,
                    destination,
                    key: GOOGLE_MAPS_API_KEY,
                },
            }
        );

        if (userId) {
            await db.collection('routes').add({
                userId,
                origin,
                destination,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
        }

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching directions:', error);
        res.status(500).json({ error: 'Failed to fetch directions' });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
