const Prescription = require('../models/Prescription');
const Medicine = require('../models/Medicine');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'prescriptions',
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    const prescription = new Prescription({
      user: req.user.id,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      type: req.body.type || 'Handwritten'
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      prescription
    });
  } catch (error) {
    console.error('Upload Prescription Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload prescription',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const data = { ...req.body, user: req.user.id };
    const prescription = new Prescription(data);
    await prescription.save();
    const populated = await Prescription.findById(prescription._id).populate('medicines.medicine', 'name manufacturer price');
    res.status(201).json({ success: true, message: 'Prescription created', prescription: populated });
  } catch (error) {
    console.error('Create Prescription Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create prescription', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.getPrescriptions = async (req, res) => {
  try {
    const query = { isActive: true };
    if (!req.user.isAdmin) {
      query.user = req.user.id;
    }
    const prescriptions = await Prescription.find(query).populate('medicines.medicine', 'name price').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) {
    console.error('Get Prescriptions Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get prescriptions', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOne({ _id: req.params.id, isActive: true }).populate('medicines.medicine', 'name price');
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    if (!req.user.isAdmin && prescription.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.status(200).json({ success: true, prescription });
  } catch (error) {
    console.error('Get Prescription Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get prescription', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.updatePrescription = async (req, res) => {
  try {
    const update = req.body;
    const prescription = await Prescription.findOneAndUpdate({ _id: req.params.id }, update, { new: true, runValidators: true }).populate('medicines.medicine', 'name price');
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.status(200).json({ success: true, message: 'Prescription updated', prescription });
  } catch (error) {
    console.error('Update Prescription Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update prescription', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};

exports.deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate({ _id: req.params.id }, { isActive: false }, { new: true });
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.status(200).json({ success: true, message: 'Prescription deleted' });
  } catch (error) {
    console.error('Delete Prescription Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete prescription', error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' });
  }
};