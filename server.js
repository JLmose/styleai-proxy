const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Proxy POST - créer une prédiction
app.post('/proxy/*', async (req, res) => {
  const path = req.params[0];
  const authHeader = req.headers['authorization'];

  try {
    const response = await fetch(`https://api.replicate.com/v1/${path}`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Prefer': req.headers['prefer'] || '',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Proxy GET - récupérer le résultat
app.get('/proxy/*', async (req, res) => {
  const path = req.params[0];
  const authHeader = req.headers['authorization'];

  try {
    const response = await fetch(`https://api.replicate.com/v1/${path}`, {
      headers: { 'Authorization': authHeader },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
