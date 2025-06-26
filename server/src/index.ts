import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const WES_API_KEY = process.env.WES_API_KEY;
const WES_API_BASE_URL = process.env.WES_API_BASE_URL || 'https://api.harrisjazzlines.com';

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!WES_API_KEY,
    apiBaseUrl: WES_API_BASE_URL,
  });
});

app.post('/api/lines', async (req, res) => {
  if (!WES_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch(`${WES_API_BASE_URL}/lines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WES_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API request failed: ${errorText}`,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.all('/api/*', async (req, res) => {
  if (!WES_API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const apiPath = req.path.replace('/api', '');
  const queryString = req.url.split('?')[1] || '';

  try {
    const response = await fetch(
      `${WES_API_BASE_URL}${apiPath}${queryString ? `?${queryString}` : ''}`,
      {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${WES_API_KEY}`,
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `API request failed: ${errorText}`,
      });
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      res.json(data);
    } else {
      const text = await response.text();
      res.json({ message: text });
    }
  } catch (error) {
    console.error('Error proxying request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`API Key configured: ${!!WES_API_KEY}`);
  console.log(`API Base URL: ${WES_API_BASE_URL}`);
});
