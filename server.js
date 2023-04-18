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
// API route to create a new note
app.post('/api/notes', (req, res) => {
    // Read notes from db.json
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    
    // Get note data from request body
    const newNote = {
      title: req.body.title,
      text: req.body.text
    };
    
    // Check if title already exists
    const titleExists = notes.some(note => note.title === newNote.title);
  
    if (titleExists) {
      res.status(400).json({ error: 'Note with this title already exists' });
    } else {
      // Add new note to notes array
      notes.push(newNote);
    
      // Write updated notes array to db.json
      fs.writeFileSync('db.json', JSON.stringify(notes));
    
      res.json(newNote);
    }
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