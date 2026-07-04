const https = require('https');
const { parse } = require('url');

// Helper untuk membuat POST request
function httpsPost(hostname, path, data) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(data).toString();
    const options = {
      hostname,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

module.exports = async (req, res) => {
  // CORS headers
  const origin = req.headers.origin;
  const allowedOrigins = ['https://klikdev.my.id', 'http://localhost:4321'];
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname, query } = parse(req.url, true);

  // Health check endpoint
  if (pathname === '/' || pathname === '/api' || pathname === '/api/') {
    return res.status(200).json({
      status: 'ok',
      message: 'KlikDev OAuth Proxy Server',
      timestamp: new Date().toISOString(),
      endpoints: {
        auth: '/api/auth',
        callback: '/api/callback'
      }
    });
  }

  // Auth endpoint - redirect to GitHub
  if (pathname === '/api/auth') {
    const clientId = process.env.OAUTH_CLIENT_ID;
    const redirectUri = `https://${req.headers.host}/api/callback`;
    const state = query.state || 'random_state';
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user&state=${state}`;
    
    res.writeHead(302, { Location: authUrl });
    return res.end();
  }

  // Callback endpoint - exchange code for token
  if (pathname === '/api/callback') {
    const { code } = query;

    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    try {
      const tokenData = await httpsPost('github.com', '/login/oauth/access_token', {
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code: code,
        redirect_uri: `https://${req.headers.host}/api/callback`
      });

      if (!tokenData.access_token) {
        throw new Error('No access token received');
      }

      // Return HTML with postMessage to CMS
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <style>
    body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f5f5f5; }
    .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .spinner { border: 3px solid #f3f3f3; border-top: 3px solid #f97316; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h2>Authorization Successful!</h2>
    <p>Redirecting back to CMS...</p>
  </div>
  <script>
    (function() {
      const data = { token: "${tokenData.access_token}", provider: "github" };
      function receiveMessage(e) {
        window.opener.postMessage("authorization:github:success:" + JSON.stringify(data), e.origin);
        window.removeEventListener("message", receiveMessage, false);
        setTimeout(() => window.close(), 1000);
      }
      window.addEventListener("message", receiveMessage, false);
      if (window.opener) {
        window.opener.postMessage("authorizing:github", "*");
      }
    })();
  </script>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);

    } catch (error) {
      console.error('OAuth error:', error);
      const errorHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Auth Failed</title></head>
<body style="font-family: system-ui; text-align: center; padding: 2rem;">
  <h2>❌ Authentication Failed</h2>
  <p>Please close this window and try again.</p>
  <p style="color: #666; font-size: 0.9rem;">Error: ${error.message}</p>
</body>
</html>`;
      return res.status(500).send(errorHtml);
    }
  }

  // 404 for unknown routes
  return res.status(404).json({ error: 'Not found', path: pathname });
};