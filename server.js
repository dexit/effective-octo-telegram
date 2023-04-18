const express = require('express');
const fs = require('fs');
// For generating unique IDs is unnecessary, will use Title, title needs to be unique
// base init
const app = express();
const PORT = process.env.PORT || 3000;
//for parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve static resources
app.use(express.static('public'));  // serve static resources
// Routes

// API route for New entry, check for title if it is unique, if not unique, send error message
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            const notes = JSON.parse(data);
            const title = req.body.title;
            if (notes.some(note => note.title === title)) {
                res.sendStatus(409);
            } else {
                notes.push(req.body);
                fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
            }
            }
    });
});
// API route to delete a note by title
app.delete('/api/notes/:title', (req, res) => {
    
});
// Route notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
});
// Route to serve the index.html file a all other routes
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});