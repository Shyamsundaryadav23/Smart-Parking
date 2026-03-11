const userModel = require('../models/userModel');

// get profile by id
async function getProfile(req, res) {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // omit password
    delete user.password;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// update own profile (name/phone)
async function updateProfile(req, res) {
  try {
    const { id } = req.params;
    // optional: allow only if req.user.user_id === id or admin
    if (req.user.user_id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const { name, phone } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const updated = await userModel.updateUser(id, updates);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    delete updated.password;
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
};