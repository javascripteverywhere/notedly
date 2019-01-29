const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Note {
    id: ID!
    content: String!
    htmlContent: String!
    author: User!
    favoriteCount: Int!
    favoritedBy: [User!]
    createdAt: Date!
    updatedAt: Date!
  }

  type User {
    id: ID!
    name: String
    avatar: String
    notes: [Note!]!
    favorites: [Note!]!
  }

  type Query {
    singleNote(id: ID!): Note
    allNotes: [Note!]!
    myNotes: [Note!]
  }

  type Mutation {
    newNote(content: String!): Note
    updateNote(id: ID!, content: String!): Note!
    deleteNote(id: ID!): Boolean!
    toggleReaction(noteID: ID!): Note
  }
`;

module.exports = typeDefs;
