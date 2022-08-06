const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static files
app.use(express.static('public'));

// Routing
// Index route
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
// Notes route
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// API calls
app.get('/api/notes', (req, res) => res.json(noteData));
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    
    if (!text || !title) {
        // If there is an error, return status of 500
        return res.status(500).json("Error in saving Note!");
    }
    
    let newNote = {
        title,
        text
    }
    
    fs.readFile('./db/db.json', (err, data) => {
        let parsedNotes = JSON.parse(data);
        
        parsedNotes.push(newNote);
        
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Successfully saved note!");
            }
        });
    });
});

// Listen on the PORT number
app.listen(PORT, () => {
    console.log(`Note taker app listening at http://localhost:${PORT}`);
});