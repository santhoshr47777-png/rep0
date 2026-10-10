const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'notes.json');
app.use(express.json());
app.use(express.static('public'));
const readNotes = () => {
    if (!fs.existsSync(FILE_PATH)) return [];
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return data ? JSON.parse(data) : [];
};
const writeNotes = (notes) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(notes, null, 2));
};
app.get('/notes', (req, res) => { res.json(readNotes()); });
app.post('/notes', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Note content cannot be empty' });
    const notes = readNotes();
    const newNote = { id: Date.now().toString(), text };
    notes.push(newNote);
    writeNotes(notes);
    res.status(201).json(newNote);
});
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    let notes = readNotes();
    notes = notes.filter(note => note.id !== id);
    writeNotes(notes);
    res.json({ message: 'Note deleted successfully' });
});
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
