const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const fetch = require('node-fetch');

// Calendly token exchange proxy function
exports.calendlyTokenExchange = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Only allow POST requests
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      // Get request body
      const { grant_type, client_id, code, redirect_uri, code_verifier } = req.body;

      // Validate required parameters
      if (!grant_type || !client_id || !code || !redirect_uri || !code_verifier) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Make request to Calendly token endpoint
      const response = await fetch('https://auth.calendly.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type,
          client_id,
          code,
          redirect_uri,
          code_verifier
        })
      });

      // Get response data
      const data = await response.json();

      // If response is not ok, return error
      if (!response.ok) {
        console.error('Calendly token exchange error:', data);
        return res.status(response.status).json(data);
      }

      // Return token data
      return res.json(data);
    } catch (error) {
      console.error('Error in calendlyTokenExchange:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Add more Firebase Cloud Functions as needed