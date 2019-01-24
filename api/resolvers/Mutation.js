const md = require('marked').setOptions({ headerIds: true, sanitize: true });

const NoteModel = require('../models/note');

module.exports = {
  newNote: (parent, args, { db, user }) => {
    // if no user context is passed, don't create a note
    if (!user) {
      return null;
    }
    let html = md(args.content);
    return NoteModel.insertNote(args, html, user.id, db);
  },

  updateNote: (parent, args, { db }) => {
    let html = md(args.content);
    return NoteModel.updateNote(args.id, args.content, html, db);
  },

  deleteNote: (parent, args, { db }) => {
    return NoteModel.deleteNote(args.id, db);
  }
};
