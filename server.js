const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
// Serve your CSS and Images from the current directory
app.use(express.static(path.join(__dirname)));

// --- ROUTES ---

// Serve the landing page (SuperXeno)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'SuperXeno.html'));
});

// Serve the Login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'));
});

// Serve the Updates page
app.get('/updates', (req, res) => {
    res.sendFile(path.join(__dirname, 'Updates.html'));
});

// --- API ENDPOINTS ---

// The Auth Handshake your Login.html is looking for
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // For now, using basic logic. Swap this with a DB check later!
    if (username === 'admin' && password === 'xeno_secure_2026') {
        console.log(`Access Granted to: ${username}`);
        return res.status(200).json({ message: "ACCESS_GRANTED" });
    } else {
        console.log(`Failed login attempt: ${username}`);
        return res.status(401).json({ message: "AUTHENTICATION_FAILED" });
    }
});

// VERCEL EXPORT
module.exports = app;
