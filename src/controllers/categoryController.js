const Category = require('../models/Category');

exports.getAll = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

exports.getOne = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

exports.create = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const exists = await Category.findOne({ name: name.trim() });
  if (exists) return res.status(409).json({ message: 'Category already exists' });

  const category = await Category.create({ name: name.trim() });
  res.status(201).json(category);
};

exports.update = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required' });

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    { name: name.trim() },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: 'Category not found' });
  res.json(updated);
};

exports.remove = async (req, res) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted' });
};