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

module.exports.getNoteById = (noteId) => {
  return Note.findOne({ _id:noteId })
}
module.exports.getUserNotes = (userId) => {
  return Note.find({ userId: userId });
}

module.exports.updateById = async (noteId, newData) => {
  try {
    const newnote = await Note.findOneAndUpdate({ _id: noteId }, newData, { new: true }).lean();
    return newnote;
  } catch (e) {
    return null;
  }
};

module.exports.removeById = async (noteId) => {
    return Note.findByIdAndRemove({_id:noteId });
}

module.exports.getStats = () => {
  return Note.aggregate([
//    { $match: { userId }},
    { $group: { _id: '$userId', count: { $sum: 1},},},
  ]);
};

module.exports.search = (query) => {
  return Note.find(
  { $text: { $search: query}},
  { score: { $meta: "textScore"}}
  )
  .sort({ score: { $meta: "textScore" } });
}
