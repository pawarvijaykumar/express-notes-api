const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { noteSchema } = require('../validation/schemas');
const noteController = require('../controllers/noteController');

router.use(auth);

router.get('/', asyncHandler(noteController.getAllNotes));
router.get('/:id', asyncHandler(noteController.getNoteById));
router.post('/', validate(noteSchema), asyncHandler(noteController.createNote));
router.put('/:id', validate(noteSchema), asyncHandler(noteController.updateNote));
router.delete('/:id', asyncHandler(noteController.deleteNote));

// CONCEPT: upload.single('image') middleware yahan sirf is ek route par lagta hai,
// baaki routes (jo JSON leते hain) is se untouched rehte hain.
router.post('/:id/image', upload.single('image'), asyncHandler(noteController.uploadImage));

module.exports = router;
