// CONCEPT: RESOLVERS - schema me jo Query/Mutation define kiye, unke liye
// ACTUAL function yahan likhte hain (kaise data laana/banana hai).
// Har resolver ko context milta hai jisme humne req daala hai (auth ke liye).

const Note = require('../models/Note');

// CONCEPT: REST ke auth middleware jaisa hi kaam, bas yahan har resolver
// ke andar manually check karna padta hai (GraphQL alag middleware system use karta hai).
function requireAuth(context) {
  if (!context.userId) {
    const err = new Error('Token missing or invalid. Please login.');
    err.status = 401;
    throw err;
  }
}

const root = {
  notes: async (args, context) => {
    requireAuth(context);
    return Note.find({ user: context.userId });
  },

  note: async ({ id }, context) => {
    requireAuth(context);
    return Note.findOne({ _id: id, user: context.userId });
  },

  createNote: async ({ text }, context) => {
    requireAuth(context);
    return Note.create({ text, user: context.userId });
  },

  deleteNote: async ({ id }, context) => {
    requireAuth(context);
    const deleted = await Note.findOneAndDelete({ _id: id, user: context.userId });
    return deleted ? 'Deleted successfully' : 'Note not found';
  },
};

module.exports = root;
