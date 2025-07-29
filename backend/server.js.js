// server.js - Express backend for Eclipse Guild Website
const express = require('express');
const axios = require('axios');
const zlib = require('zlib');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

app.get('/api/rankings', async (req, res) => {
  const { server = 'europe-green', date = '2025-07-28' } = req.query;
  const url = `https://files.kakele.io/rankings/${server}-${date}.zlib`;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);
    zlib.unzip(buffer, (err, decompressed) => {
      if (err) return res.status(500).json({ error: 'Decompression failed' });
      try {
        const json = JSON.parse(decompressed.toString());
        return res.json(json);
      } catch (parseErr) {
        return res.status(500).json({ error: 'Failed to parse JSON from rankings' });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch rankings zlib file' });
  }
});

app.listen(PORT, () => console.log(`Eclipse Guild API server running on port ${PORT}`));
