// server.js - Simple Express server with proxy
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

// API proxy endpoint
app.post('/api/voicemail', async (req, res) => {
  try {
    const { to, message, apiKey } = req.body;
    
    const response = await axios.post('https://vm.nabeelthotti.co/voicemail', 
      { to, message },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'X-API-Key': apiKey 
        } 
      }
    );
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Send all other requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});