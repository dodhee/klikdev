const express = require('express');
const session = require('express-session');
const simpleOauth2 = require('simple-oauth2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow CMS origin
app.use(cors({
  origin: ['https://klikdev.my.id', 'http://localhost:4321'],
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'klikdev-cms-secret-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000 // 1 hour
  }
}));

app.use(express.json());

// OAuth2 client configuration
const oauth2 = simpleOauth2.create({
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'KlikDev OAuth Proxy Server',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoint - initiate OAuth flow
app.get('/auth', (req, res) => {
  try {
    const authorizationUri = oauth2.authorizationCode.authorizeURL({
      redirect_uri: `${req.protocol}://${req.get('host')}/callback`,
      scope: 'repo,user',
      state: req.query.state || 'random_state_string'
    });
    
    res.redirect(authorizationUri);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Failed to initiate OAuth flow' });
  }
});

// Callback endpoint - handle GitHub OAuth callback
app.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    // Exchange code for access token
    const result = await oauth2.authorizationCode.getToken({
      code,
      redirect_uri: `${req.protocol}://${req.get('host')}/callback`
    });

    const token = oauth2.accessToken.create(result);
    
    // Build the callback script for Decap CMS
    const script = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Authorizing...</title>
        </head>
        <body>
          <p>Authorization successful! Redirecting...</p>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("Received message:", e);
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify({
                    token: token.token.access_token,
                    provider: 'github'
                  })}',
                  e.origin
                );
                window.removeEventListener("message", receiveMessage, false);
              }
              window.addEventListener("message", receiveMessage, false);
              console.log("Posting message to opener");
              window.opener.postMessage("authorizing:github", "*");
            })();
          </script>
        </body>
      </html>
    `;
    
    res.send(script);
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).send('Authentication failed. Please try again.');
  }
});

// Success endpoint - for debugging
app.get('/success', (req, res) => {
  res.send('<h1>Authentication successful!</h1><p>You can close this window.</p>');
});

// Start server
app.listen(PORT, () => {
  console.log(`OAuth proxy server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for Vercel serverless
module.exports = app;