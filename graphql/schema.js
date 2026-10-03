// CONCEPT: SCHEMA - GraphQL me pehle define karte hain "kaunsa data kaisa dikhta hai"
// aur "kaunse queries/mutations allowed hain". REST me ye implicit hota hai,
// GraphQL me explicit likhna padta hai.

const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Note {
    id: ID!
    text: String!
    createdAt: String
    updatedAt: String
  }

  type Query {
    notes: [Note]         # saare notes ki list
    note(id: ID!): Note   # ek specific note
  }

  type Mutation {
    createNote(text: String!): Note   # naya note banana
    deleteNote(id: ID!): String       # note delete karna
  }
`);

module.exports = schema;
