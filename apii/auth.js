const { MongoClient } = require('mongodb');

// PASTE YOUR MONGODB STRING BELOW
const uri = "mongodb+srv://xenobypasser_db_user:gxdctrgILoveShoes2@cluster0.6qjjnm9.mongodb.net/?appName=Cluster0"; 
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // 1. Handle CORS (So your frontend project can talk to this project)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 2. Only allow POST requests (sending data)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        // 3. HARDCODED ADMIN CHECK (Option B)
        // Put your admin details here exactly as you want them
        const ADMIN_USER = "gxdctrg"; 
        const ADMIN_PASS = "gxdctrgILoveShoes2";

        if (username === ADMIN_USER && password === ADMIN_PASS) {
            return res.status(200).json({ 
                success: true, 
                message: "Welcome, Boss!" 
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid Credentials" 
            });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};