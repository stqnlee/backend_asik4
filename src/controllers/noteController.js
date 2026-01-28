const Note = require('../models/Note');
const Category = require('../models/Category');

function parseTags(tagsRaw) {
  if (!tagsRaw) return [];
  return String(tagsRaw)
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 20);
}
exports.getAll = async (req, res) => {
  const { search, priority, status, sort, categoryId } = req.query;

  const filter = {};

  if (['low', 'medium', 'high'].includes(priority)) filter.priority = priority;
  if (status === 'done') filter.isDone = true;
  if (status === 'todo') filter.isDone = false;
  if (categoryId) filter.category = categoryId;

  if (search && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { content: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } }
    ];
  }

  let query = Note.find(filter).populate('category', 'name');

  if (sort === 'oldest') query = query.sort({ createdAt: 1 });
  else if (sort === 'dueSoon') query = query.sort({ dueDate: 1, createdAt: -1 });
  else query = query.sort({ createdAt: -1 });

  const notes = await query.exec();
  res.json(notes);
};

exports.getOne = async (req, res) => {
  const note = await Note.findById(req.params.id).populate('category', 'name');
  if (!note) return res.status(404).json({ message: 'Note not found' });
  res.json(note);
};

exports.create = async (req, res) => {
  const { title, content, priority, tags, dueDate, categoryId } = req.body;

  if (!title || !content || !categoryId) {
    return res.status(400).json({ message: 'title, content, categoryId are required' });
  }

  const category = await Category.findById(categoryId);
  if (!category) return res.status(400).json({ message: 'Invalid categoryId' });

  const note = await Note.create({
    title,
    content,
    priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
    tags: Array.isArray(tags) ? tags : parseTags(tags),
    dueDate: dueDate ? new Date(dueDate) : null,
    category: categoryId
  });

  const populated = await Note.findById(note._id).populate('category', 'name');
  res.status(201).json(populated);
};

exports.update = async (req, res) => {
  const { title, content, priority, tags, dueDate, isDone, categoryId } = req.body;

  const update = {};
  if (title !== undefined) update.title = title;
  if (content !== undefined) update.content = content;
  if (['low', 'medium', 'high'].includes(priority)) update.priority = priority;
  if (tags !== undefined) update.tags = Array.isArray(tags) ? tags : parseTags(tags);
  if (dueDate === '' || dueDate === null) update.dueDate = null;
  else if (dueDate) update.dueDate = new Date(dueDate);
  if (typeof isDone === 'boolean') update.isDone = isDone;

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: 'Invalid categoryId' });
    update.category = categoryId;
  }

  const updated = await Note.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true
  }).populate('category', 'name');

  if (!updated) return res.status(404).json({ message: 'Note not found' });
  res.json(updated);
};

exports.toggleDone = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ message: 'Note not found' });

  note.isDone = !note.isDone;
  await note.save();

  const populated = await Note.findById(note._id).populate('category', 'name');
  res.json(populated);
};

exports.remove = async (req, res) => {
  const deleted = await Note.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Note not found' });
  res.json({ message: 'Note deleted' });
};