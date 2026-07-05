module.exports = async (req, res) => {
  // CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://klikdev.my.id',
    'https://klikdev.pages.dev',
    'http://localhost:4321'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check endpoint
  return res.status(200).json({
    status: 'ok',
    message: 'KlikDev OAuth Proxy Server',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      callback: '/api/callback'
    }
  });
};