const safeRequire = (p) => { try { return require(p); } catch (e) { return null; } };
const Cart = safeRequire('../models/Cart');
const Medicine = safeRequire('../models/Medicine');

const getUserId = (req) => {
  if (!req) return null;
  if (req.user) return req.user.id || req.user._id || null;
  if (req.headers && req.headers['x-user-id']) return req.headers['x-user-id'];
  return null;
};

exports.getCart = async (req, res) => {
  if (!Cart) return res.status(501).json({ success: false, message: 'Cart model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.medicine', 'name price mrp images');
    if (!cart) return res.status(200).json({ success: true, cart: { user: userId, items: [], subtotal: 0 } });
    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error('Get Cart Error:', err);
    res.status(500).json({ success: false, message: 'Failed to get cart', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.addItem = async (req, res) => {
  if (!Cart) return res.status(501).json({ success: false, message: 'Cart model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { medicineId, quantity = 1 } = req.body;
  if (!medicineId) return res.status(400).json({ success: false, message: 'medicineId is required' });

  try {
    // Optionally fetch medicine to snapshot price/name
    let med = null;
    if (Medicine) med = await Medicine.findById(medicineId).select('name price mrp images');

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existing = cart.items.find(i => i.medicine && i.medicine.toString() === medicineId.toString());
    if (existing) {
      existing.quantity = (existing.quantity || 0) + parseInt(quantity, 10);
      // update price snapshot if med exists
      if (med) { existing.price = med.price; existing.name = med.name; existing.mrp = med.mrp; existing.image = med.images && med.images[0]; }
    } else {
      cart.items.push({
        medicine: medicineId,
        name: med ? med.name : undefined,
        quantity: parseInt(quantity, 10),
        price: med ? med.price : 0,
        mrp: med ? med.mrp : undefined,
        image: med && med.images ? med.images[0] : undefined
      });
    }

    // recalc subtotal if Cart model doesn't do it
    if (typeof cart.calculateTotals === 'function') {
      await cart.calculateTotals();
    } else {
      cart.subtotal = cart.items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0);
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.medicine', 'name price mrp images');
    res.status(200).json({ success: true, message: 'Item added to cart', cart: populated });
  } catch (err) {
    console.error('Add Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to add item to cart', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.updateItem = async (req, res) => {
  if (!Cart) return res.status(501).json({ success: false, message: 'Cart model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { id: itemId } = req.params;
  const { quantity } = req.body;
  if (quantity === undefined) return res.status(400).json({ success: false, message: 'quantity is required' });

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (parseInt(quantity, 10) <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = parseInt(quantity, 10);
    }

    if (typeof cart.calculateTotals === 'function') {
      await cart.calculateTotals();
    } else {
      cart.subtotal = cart.items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0);
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.medicine', 'name price mrp images');
    res.status(200).json({ success: true, message: 'Cart updated', cart: populated });
  } catch (err) {
    console.error('Update Cart Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to update cart item', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.removeItem = async (req, res) => {
  if (!Cart) return res.status(501).json({ success: false, message: 'Cart model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const { id: itemId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    cart.items.pull(itemId);

    if (typeof cart.calculateTotals === 'function') {
      await cart.calculateTotals();
    } else {
      cart.subtotal = cart.items.reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0);
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Item removed', cart });
  } catch (err) {
    console.error('Remove Cart Item Error:', err);
    res.status(500).json({ success: false, message: 'Failed to remove item', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};

exports.clearCart = async (req, res) => {
  if (!Cart) return res.status(501).json({ success: false, message: 'Cart model not implemented' });
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const cart = await Cart.findOneAndUpdate({ user: userId }, { items: [], subtotal: 0 }, { new: true, upsert: true });
    res.status(200).json({ success: true, message: 'Cart cleared', cart });
  } catch (err) {
    console.error('Clear Cart Error:', err);
    res.status(500).json({ success: false, message: 'Failed to clear cart', error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
  }
};