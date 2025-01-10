import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - directly in server folder
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(path.join(__dirname, 'pokemon.db'), (err) => {

    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Search Pokemon by sprite path
app.get('/api/pokemon/search/:spritepath', (req, res) => {
    const spritepath = req.params.spritepath.toLowerCase();    
    db.all("SELECT id, name FROM pokemon WHERE json_extract(sprites, ?) IS NOT NULL", [`$.${spritepath}`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get specific Pokemon by name
app.get('/api/pokemon/:id', (req, res) => {
    const id = req.params.id.toLowerCase();
    db.get('SELECT * FROM pokemon WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            row.sprites = JSON.parse(row.sprites);
            res.json(row);
        } else {
            res.status(404).json({ error: 'Pokemon not found' });
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});