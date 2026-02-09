#!/usr/bin/env node
// Simple local server for Tab Checklist data persistence
// This allows the browser app to save data that Übersicht can read

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_FILE = path.join(os.homedir(), '.tab-checklist-data.json');
const PORT = 17432; // Arbitrary high port

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '{}', 'utf8');
}

const server = http.createServer((req, res) => {
    // CORS headers for local file access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/data') {
        // Read data
        try {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        } catch (e) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{}');
        }
    } else if (req.method === 'POST' && req.url === '/data') {
        // Write data
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                // Validate JSON
                JSON.parse(body);
                fs.writeFileSync(DATA_FILE, body, 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end('{"success": true}');
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end('{"error": "Invalid JSON"}');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Tab Checklist server running on http://127.0.0.1:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down...');
    server.close();
    process.exit(0);
});
