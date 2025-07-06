import express from 'express';
import axios from 'axios';
const router = express.Router();

// Proxy route for video streams
router.get('/video-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    console.log('Proxy request for URL:', url);
    
    if (!url) {
      console.log('No URL provided');
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Prevent recursive proxy calls
    if (url.includes('/api/proxy/')) {
      console.log('Preventing recursive proxy call');
      return res.status(400).json({ error: 'Recursive proxy calls not allowed' });
    }

    // Fetch the video stream
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://megacloud.blog/',
        'Origin': 'https://megacloud.blog/'
      },
      timeout: 15000
    });

    console.log('Proxy response status:', response.status);
    console.log('Proxy response headers:', response.headers);

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');

    // Pipe the stream to response
    response.data.pipe(res);

  } catch (error) {
    console.error('Proxy error:', error.message);
    console.error('Proxy error details:', error.response?.status, error.response?.statusText);
    res.status(500).json({ error: 'Failed to proxy video stream', details: error.message });
  }
});

// Proxy route for subtitle files
router.get('/subtitle-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    console.log('Subtitle proxy request for URL:', url);
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Prevent recursive proxy calls
    if (url.includes('/api/proxy/')) {
      console.log('Preventing recursive subtitle proxy call');
      return res.status(400).json({ error: 'Recursive proxy calls not allowed' });
    }

    // Fetch the subtitle file
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 5000
    });

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/vtt');

    // Send the subtitle content
    res.send(response.data);

  } catch (error) {
    console.error('Subtitle proxy error:', error.message);
    res.status(500).json({ error: 'Failed to proxy subtitle file' });
  }
});

export default router; 