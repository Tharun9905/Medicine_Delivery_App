const Address = require('../models/Address');

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id, isActive: true })
      .sort({ isDefault: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses
    });
  } catch (error) {
    console.error('Get Addresses Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get addresses',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const addressData = { ...req.body, user: req.user.id };
    let address = new Address(addressData);
    address = await address.save();

    if (address.isDefault && typeof address.setAsDefault === 'function') {
      // setAsDefault may adjust other addresses; re-fetch to return latest state
      await address.setAsDefault();
      address = await Address.findById(address._id);
    }

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address
    });
  } catch (error) {
    console.error('Add Address Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add address',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    let address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (req.body.isDefault && typeof address.setAsDefault === 'function') {
      await address.setAsDefault();
      address = await Address.findById(address._id);
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    console.error('Update Address Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update address',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { isActive: false },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete Address Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete address',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (typeof address.setAsDefault === 'function') {
      await address.setAsDefault();
    }

    // re-fetch the address to return the up-to-date document
    const updated = await Address.findById(address._id);

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      address: updated
    });
  } catch (error) {
    console.error('Set Default Address Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to set default address',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};