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

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.OAUTH_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ error: 'OAuth client ID not configured' });
  }

  const redirectUri = `https://${req.headers.host}/api/callback`;
  const { query } = require('url').parse(req.url, true);
  const state = query.state || Math.random().toString(36).substring(7);
  
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user&state=${state}`;
  
  res.writeHead(302, { Location: authUrl });
  res.end();
};