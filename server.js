const express = require('express');
const fs = require('fs');
// For generating unique IDs is unnecessary, will use Title, title needs to be unique
// base init
const app = express();
const PORT = process.env.PORT || 3000;

// parsing request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JavaScript)
app.use(express.static('public'));

// API route to get all notes
app.get('/api/notes', (req, res) => {
  // Read notes from db.json
  const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  res.json(notes);
});
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
//  delete a note by title
  app.delete('/api/notes/:title', (req, res) => {
    // Read notes from db.json
    const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  
    // Find index of note with matching title
    const noteIndex = notes.findIndex(note => note.title === req.params.title);
  
    if (noteIndex !== -1) {
      // Remove note from notes array
      notes.splice(noteIndex, 1);
  
      // Write updated notes array to db.json
      fs.writeFileSync('db.json', JSON.stringify(notes));
  
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  });
// Route to serve the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
  });
  
  // Route to serve the index.html file for all other routes
  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });