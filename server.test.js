const fs = require('fs');
const app = require('./server'); // Assuming the Express app is exported from server.js

describe('API endpoints', () => {
  // Load test data
  const testNotes = [
    {
      title: 'Test Title 1',
      text: 'Test Text 1'
    },
    {
      title: 'Test Title 2',
      text: 'Test Text 2'
    }
  ];
/*
  // Write test data to db.json before each test
  beforeEach(() => {
    fs.writeFileSync('db.json', JSON.stringify(testNotes));
  });

  // Delete db.json after each test
  afterEach(() => {
    fs.unlinkSync('db.json');
  });
*/
  describe('GET /api/notes', () => {
    it('should return all notes', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      app.handleGetNotes(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(testNotes);
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note', () => {
      const req = {
        body: {
          title: 'New Title',
          text: 'New Text'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      app.handleCreateNote(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining(req.body));
      const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
      expect(notes.length).toBe(testNotes.length + 1);
      expect(notes.find(note => note.title === req.body.title)).toBeTruthy();
    });

    it('should return 400 error if note with same title already exists', () => {
      const req = {
        body: {
          title: 'Test Title 1',
          text: 'New Text'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      app.handleCreateNote(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Note with same title already exists' });
    });
  });
});