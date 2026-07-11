const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const usersFile = path.join(rootDir, 'users.json');
const port = process.env.PORT || 3000;
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const sessions = new Map();

function loadUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({}, null, 2));
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  } catch (error) {
    console.warn('Failed to parse users file, resetting it.', error);
    fs.writeFileSync(usersFile, JSON.stringify({}, null, 2));
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function createToken() {
  return crypto.randomBytes(24).toString('hex');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function authUser(req) {
  const token = req.headers['x-session-token'];
  if (!token) return null;
  return sessions.get(token) || null;
}

function serveStatic(req, res, pathname) {
  const safePath = path.normalize(pathname).replace(/^\.+/, '');
  const filePath = path.join(rootDir, safePath === '/' ? 'index.html' : safePath);
  if (!filePath.startsWith(rootDir)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname.startsWith('/api/')) {
    try {
      if (req.method === 'POST' && url.pathname === '/api/register') {
        const body = await readBody(req);
        const username = String(body.username || '').trim();
        const password = String(body.password || '').trim();
        if (!username || !password) {
          return sendJson(res, 400, { error: 'Username and password are required.' });
        }

        const users = loadUsers();
        if (users[username]) {
          return sendJson(res, 409, { error: 'That username is already taken.' });
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = hashPassword(password, salt);
        users[username] = {
          username,
          passwordHash,
          salt,
          data: {
            mangas: [],
            notifications: []
          }
        };
        saveUsers(users);

        const token = createToken();
        sessions.set(token, username);
        return sendJson(res, 200, { token, user: { username } });
      }

      if (req.method === 'POST' && url.pathname === '/api/login') {
        const body = await readBody(req);
        const username = String(body.username || '').trim();
        const password = String(body.password || '').trim();
        if (!username || !password) {
          return sendJson(res, 400, { error: 'Username and password are required.' });
        }

        const users = loadUsers();
        const user = users[username];
        if (!user) {
          return sendJson(res, 401, { error: 'Invalid username or password.' });
        }

        const passwordHash = hashPassword(password, user.salt);
        if (passwordHash !== user.passwordHash) {
          return sendJson(res, 401, { error: 'Invalid username or password.' });
        }

        const token = createToken();
        sessions.set(token, username);
        return sendJson(res, 200, { token, user: { username }, data: user.data });
      }

      if (req.method === 'GET' && url.pathname === '/api/me') {
        const username = authUser(req);
        if (!username) {
          return sendJson(res, 401, { error: 'Unauthorized' });
        }
        const users = loadUsers();
        const user = users[username];
        if (!user) {
          return sendJson(res, 401, { error: 'Unauthorized' });
        }
        return sendJson(res, 200, { user: { username }, data: user.data });
      }

      if (req.method === 'POST' && url.pathname === '/api/data') {
        const username = authUser(req);
        if (!username) {
          return sendJson(res, 401, { error: 'Unauthorized' });
        }
        const body = await readBody(req);
        const users = loadUsers();
        if (!users[username]) {
          return sendJson(res, 401, { error: 'Unauthorized' });
        }
        users[username].data = {
          mangas: Array.isArray(body.mangas) ? body.mangas : [],
          notifications: Array.isArray(body.notifications) ? body.notifications : []
        };
        saveUsers(users);
        return sendJson(res, 200, { ok: true });
      }

      if (req.method === 'POST' && url.pathname === '/api/logout') {
        const token = req.headers['x-session-token'];
        if (token) {
          sessions.delete(token);
        }
        return sendJson(res, 200, { ok: true });
      }
    } catch (error) {
      console.error(error);
      return sendJson(res, 500, { error: 'Server error' });
    }
  }

  serveStatic(req, res, url.pathname);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`MangaNotes server listening on http://0.0.0.0:${port}`);
});
