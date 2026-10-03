const Note = require('../models/Note');
const logger = require('../config/logger');

exports.getAllNotes = async (req, res) => {
  const notes = await Note.find({ user: req.userId });
  res.status(200).json(notes);
};

exports.getNoteById = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.userId });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.status(200).json(note);
};

exports.createNote = async (req, res) => {
  const note = await Note.create({ text: req.body.text, user: req.userId });
  logger.info(`Note created by user ${req.userId}`);
  res.status(201).json(note);
};

exports.updateNote = async (req, res) => {
  const updated = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { text: req.body.text, updatedAt: new Date() },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: 'Note not found' });
  res.status(200).json(updated);
};

exports.deleteNote = async (req, res) => {
  const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!deleted) return res.status(404).json({ error: 'Note not found' });
  logger.info(`Note deleted by user ${req.userId}`);
  res.status(200).json({ message: 'Deleted successfully' });
};

// CONCEPT: UPLOAD CONTROLLER - req.file (multer ne populate kiya) se file ki
// info milti hai. Hum sirf uska PATH note document me save karte hain.
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { imagePath: req.file.path },
    { new: true }
  );

  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }

  res.status(200).json({
    message: 'Image uploaded successfully',
    note,
    imageUrl: `/uploads/${req.file.filename}`, // isse browser/frontend image access kar sakta hai
  });
};
