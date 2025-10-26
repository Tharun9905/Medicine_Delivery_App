const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('addresses')
      .populate('defaultAddress')
      .select('-otp');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.updatePreferences = async (req, res) => {
  try {
    const { elderMode, darkMode, notifications, language } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (elderMode !== undefined) user.preferences.elderMode = elderMode;
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (language !== undefined) user.preferences.language = language;
    if (notifications) user.preferences.notifications = { ...user.preferences.notifications, ...notifications };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update Preferences Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getRewardPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('rewardPoints');

    res.status(200).json({
      success: true,
      rewardPoints: user.rewardPoints
    });
  } catch (error) {
    console.error('Get Reward Points Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reward points',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const query = { isActive: true };
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get users', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isActive: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get user', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    // Prevent direct password set here; use dedicated change-password flow
    const { password, ...rest } = req.body;
    const updated = await User.findOneAndUpdate({ _id: req.params.id }, rest, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User updated', user: updated });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({ _id: req.params.id }, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};