const Note = require('../models/note');
module.exports = {};

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
