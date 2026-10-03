const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'text field is required'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // CONCEPT: optional field - har note me image zaroori nahi, bas uska PATH save karte hain
  // (poori file database me nahi daalte, wo bahut bada ho jaata, sirf raasta save karte hain)
  imagePath: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

module.exports = mongoose.model('Note', noteSchema);
