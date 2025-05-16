// A simple JSON server to handle the API requests
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'db.json');

// CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

// Read the database file
async function readDb() {
  try {
    const data = await readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { eventInfo: {}, registrations: [] };
  }
}

// Write to the database file
async function writeDb(data) {
  try {
    await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing to database:', err);
    return false;
  }
}

// Create the server
const server = createServer(async (req, res) => {
  // Set CORS headers for all requests
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  // GET /eventInfo - Return event information
  if (path === '/eventInfo' && req.method === 'GET') {
    const db = await readDb();
    res.statusCode = 200;
    res.end(JSON.stringify(db.eventInfo));
    return;
  }

  // GET /registrations - Return all registrations
  if (path === '/registrations' && req.method === 'GET') {
    const db = await readDb();
    res.statusCode = 200;
    res.end(JSON.stringify(db.registrations));
    return;
  }

  // POST /registrations - Create a new registration
  if (path === '/registrations' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const registration = JSON.parse(body);
        const db = await readDb();
        
        // Add timestamp and ID
        registration.id = Date.now().toString();
        registration.createdAt = new Date().toISOString();
        
        db.registrations.push(registration);
        await writeDb(db);
        
        res.statusCode = 201;
        res.end(JSON.stringify(registration));
      } catch (err) {
        console.error('Error processing registration:', err);
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid registration data' }));
      }
    });
    return;
  }

  // Not found
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});