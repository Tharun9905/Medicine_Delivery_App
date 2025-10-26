const safeRequire = (p) => {
  try { return require(p); } catch (e) { return null; }
};

const Medicine = safeRequire('../models/Medicine');

exports.getMedicines = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const { search, category, limit = 20, page = 1 } = req.query;
    const q = { isActive: true };

    if (category) q.category = category;
    if (search) q.$text = { $search: search };

    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.max(1, parseInt(limit, 10));
    const medicines = await Medicine.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    const count = await Medicine.countDocuments(q);
    res.status(200).json({ success: true, count, medicines });
  } catch (err) {
    console.error('Get Medicines Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get medicines', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const categories = await Medicine.distinct('category', { isActive: true });
    res.status(200).json({ success: true, categories });
  } catch (err) {
    console.error('Get Medicine Categories Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get categories', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getPopular = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    // Sort by soldCount (if present) then fallback to createdAt
    const limit = parseInt(req.query.limit, 10) || 10;
    const popular = await Medicine.find({ isActive: true })
      .sort({ soldCount: -1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, medicines: popular });
  } catch (err) {
    console.error('Get Popular Medicines Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get popular medicines', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const featured = await Medicine.find({ isActive: true, isFeatured: true })
      .sort({ updatedAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, medicines: featured });
  } catch (err) {
    console.error('Get Featured Medicines Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get featured medicines', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getMedicine = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const medicine = await Medicine.findOne({ _id: req.params.id, isActive: true });
    if (!medicine) return res.status(404).json({ success: false, message: 'Medicine not found' });
    res.status(200).json({ success: true, medicine });
  } catch (err) {
    console.error('Get Medicine Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get medicine', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.searchMedicines = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const { search, q } = req.query;
    const searchTerm = search || q;
    
    if (!searchTerm) {
      return res.status(400).json({ success: false, message: 'Search term is required' });
    }

    const searchRegex = new RegExp(searchTerm, 'i');
    const medicines = await Medicine.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { manufacturer: searchRegex },
        { category: searchRegex }
      ]
    }).limit(20);

    res.status(200).json({ success: true, medicines });
  } catch (err) {
    console.error('Search Medicines Error:', err);
    res.status(500).json({ success: false, message: 'Failed to search medicines', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getBrands = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const { category } = req.query;
    const matchCondition = { isActive: true };
    if (category) {
      matchCondition.category = new RegExp(category, 'i');
    }

    const brands = await Medicine.distinct('manufacturer', matchCondition);
    res.status(200).json({ success: true, brands: brands.filter(brand => brand) });
  } catch (err) {
    console.error('Get Brands Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get brands', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getNewArrivals = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const newArrivals = await Medicine.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, medicines: newArrivals });
  } catch (err) {
    console.error('Get New Arrivals Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get new arrivals', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const recommendations = await Medicine.find({ isActive: true })
      .sort({ soldCount: -1, createdAt: -1 })
      .limit(limit);

    res.status(200).json({ success: true, medicines: recommendations });
  } catch (err) {
    console.error('Get Recommendations Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get recommendations', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.checkAvailability = async (req, res) => {
  try {
    if (!Medicine) {
      return res.status(501).json({ success: false, message: 'Medicine model not implemented' });
    }

    const { id } = req.params;
    const { quantity = 1 } = req.query;

    const medicine = await Medicine.findOne({ _id: id, isActive: true });
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    const requestedQuantity = parseInt(quantity, 10);
    const available = medicine.stock >= requestedQuantity;

    res.status(200).json({
      success: true,
      available,
      stock: medicine.stock,
      requested: requestedQuantity
    });
  } catch (err) {
    console.error('Check Availability Error:', err);
    res.status(500).json({ success: false, message: 'Failed to check availability', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};
