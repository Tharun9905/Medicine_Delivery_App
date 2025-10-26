const Wishlist = require('../models/Wishlist');
const Medicine = require('../models/Medicine');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id, isActive: true })
      .populate('medicines');

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: { medicines: [] }
      });
    }

    res.status(200).json({
      success: true,
      wishlist
    });
  } catch (err) {
    console.error('Get Wishlist Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { medicineId } = req.body;
    if (!medicineId) {
      return res.status(400).json({
        success: false,
        message: 'medicineId required'
      });
    }

    const med = await Medicine.findById(medicineId);
    if (!med) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user.id, isActive: true });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, medicines: [] });
    }

    if (!wishlist.medicines.find(m => m.toString() === medicineId.toString())) {
      wishlist.medicines.push(med._id);
      await wishlist.save();
    }

    const populated = await Wishlist.findById(wishlist._id).populate('medicines');
    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      wishlist: populated
    });
  } catch (err) {
    console.error('Add Wishlist Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove/:medicineId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user.id, isActive: true });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.medicines = wishlist.medicines.filter(m => m.toString() !== medicineId.toString());
    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate('medicines');
    res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
      wishlist: populated
    });
  } catch (err) {
    console.error('Remove Wishlist Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user.id },
      { medicines: [] },
      { new: true, upsert: true }
    ).populate('medicines');

    res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      wishlist
    });
  } catch (err) {
    console.error('Clear Wishlist Error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
};