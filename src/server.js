const express = require('express');
const path = require('path');
const fs = require('fs');
const { parse } = require('path');
const moment = require('moment');

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
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        if (data.length) {
            // Sends back the data from the file
        return res.json(JSON.parse(data));
        }
        
        // Return an empty array if the file is empty
        return [];
    });
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    
    if (!text || !title) {
        // If there is an error, return status of 500
        return res.status(500).json("Error in saving Note!");
    }
    
    fs.readFile('./db/db.json', (err, data) => {
        let parsedNotes = [];
        
        if (data.length) parsedNotes = JSON.parse(data);
        
        let time = moment().format('DDMMYYYYhhmmss');
        
        // Create a new note with id
        let newNote = {
            id: time + '-' + title,
            title,
            text
        }
        
        parsedNotes.push(newNote);
        
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Successfully saved note!");
            }
        });
        
        return res.status(201).json(parsedNotes);
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const idParam = req.params.id;
    
    fs.readFile('./db/db.json', (err, data) => {
        let parsedNotes = JSON.parse(data);
        
        parsedNotes = parsedNotes.filter(({id}) => id != idParam);
        
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes), (err) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Successfully deleted note!");
            }
        });
        
        return res.status(200).json(parsedNotes);
    });
});

// Listen on the PORT number
app.listen(PORT, () => {
    console.log(`Note taker app listening at http://localhost:${PORT}`);
});