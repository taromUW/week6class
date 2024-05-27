/*
- createNote(userId, noteObj) - should create a note for the given user
- getNote(userId, noteId) - should get note for userId and noteId (\_id)
- getUserNotes(userId) - should get all notes for userId 
*/
const Note = require('../models/note');
module.exports = {};

/* module.exports.createNote = (userId, noteObj) => {
  return Note.create({userId:userId, text:noteObj});
}
 */

/* module.exports.createNote = (userId, noteObj, categoryId) => {
  return Note.create({userId:userId, text:noteObj, categoryId: categoryId});
}
 */

module.exports.createNote = (noteData) => {
    return Note.create(noteData);
  }
  
module.exports.getNote = (userId, noteId) => {
  return Note.findOne({ userId: userId, _id:noteId })
}

module.exports.getUserNotes = (userId) => {
  return Note.find({ userId: userId });
}