require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const app = express();
const PORT = process.env.PORT || 3000;

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// --- USER MODEL ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

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

// Serve the Docs page
app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'Docs.html'));
});

// --- API ENDPOINTS ---

// REGISTER ENDPOINT
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: "MISSING_FIELDS" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "PASSWORD_TOO_SHORT" });
        }

        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "IDENTITY_ALREADY_EXISTS" });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();
        return res.status(201).json({ message: "IDENTITY_CREATED" });

    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
});

// LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log(`Failed login attempt: ${username}`);
            return res.status(401).json({ message: "AUTHENTICATION_FAILED" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Failed login attempt: ${username}`);
            return res.status(401).json({ message: "AUTHENTICATION_FAILED" });
        }

        console.log(`Access Granted to: ${username}`);
        return res.status(200).json({ message: "ACCESS_GRANTED" });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
});

// START SERVER FOR LOCAL DEVELOPMENT
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// VERCEL EXPORT
module.exports = app;
