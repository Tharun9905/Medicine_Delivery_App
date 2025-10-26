const mongoose = require('mongoose');

// Order item sub-schema
const orderItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
  name: String,
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    default: 0
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  image: String,
  sku: String,
  batchNumber: String,
  expiryDate: Date
}, { _id: true });

// Main order schema
const orderSchema = new mongoose.Schema({
  // Order Identification
  orderNumber: {
    type: String,
    unique: true,
    required: [true, 'Order number is required']
  },

  // Customer / User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },

  // Order Items
  items: [orderItemSchema],

  // Prescription Information
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  requiresPrescription: {
    type: Boolean,
    default: false
  },
  prescriptionVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  verificationNotes: String,

  // Delivery Address
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: [true, 'Delivery address is required']
  },
  addressSnapshot: {
    label: String,
    addressLine1: String,
    addressLine2: String,
    landmark: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: [Number] // [longitude, latitude]
  },

  // Payment Information
  payment: {
    method: {
      type: String,
      enum: ['UPI', 'Card', 'NetBanking', 'Wallet', 'COD', 'PayLater'],
      required: [true, 'Payment method is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'Partially Refunded'],
      default: 'Pending'
    },
    transactionId: String,
    paymentGateway: String,
    gatewayTransactionId: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
    failureReason: String
  },

  // Pricing Breakdown
  pricing: {
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required']
    },
    totalMRP: Number,
    itemDiscount: Number,
    couponDiscount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    rewardPointsUsed: {
      type: Number,
      default: 0
    },
    deliveryCharges: {
      type: Number,
      default: 0
    },
    platformFee: {
      type: Number,
      default: 0
    },
    gst: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required']
    },
    paidAmount: {
      type: Number,
      default: 0
    }
  },

  // Order Status and Tracking
  status: {
    type: String,
    enum: [
      'Placed', 'Confirmed', 'Prescription Pending', 'Prescription Verified',
      'Processing', 'Packed', 'Ready for Pickup', 'Out for Delivery',
      'Delivered', 'Cancelled', 'Returned', 'Refunded'
    ],
    default: 'Placed'
  },

  // Detailed Status Tracking
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    remarks: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  }],

  // Delivery Information
  delivery: {
    type: {
      type: String,
      enum: ['standard', 'express', 'scheduled'],
      default: 'standard'
    },
    partner: {
      name: String,
      phone: String,
      vehicleNumber: String,
      partnerId: String
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    deliveryInstructions: String,
    deliveryAttempts: [{
      attemptedAt: Date,
      status: String,
      reason: String,
      nextAttemptAt: Date
    }],
    deliveryOTP: String,
    deliveredBy: String,
    receivedBy: String,
    deliveryImages: [String]
  },

  // Customer Communication
  customerNotes: String,
  internalNotes: String,
  customerRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  },

  // Order Metadata
  source: {
    type: String,
    enum: ['web', 'mobile', 'call', 'whatsapp'],
    default: 'web'
  },
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Cancellation Information
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', 'system']
    },
    cancelledAt: Date,
    refundProcessed: {
      type: Boolean,
      default: false
    },
    refundAmount: Number
  },

  // Return Information
  returns: [{
    items: [{
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
      },
      quantity: Number,
      reason: String
    }],
    reason: String,
    returnDate: Date,
    returnStatus: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'picked-up', 'processed']
    },
    refundAmount: Number
  }],

  // Promotional Information
  offers: [{
    offerCode: String,
    offerName: String,
    discountAmount: Number,
    appliedAt: Date
  }],

  // Invoice Information
  invoice: {
    invoiceNumber: String,
    invoiceDate: Date,
    invoiceUrl: String,
    gstDetails: {
      gstNumber: String,
      cgst: Number,
      sgst: Number,
      igst: Number
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'delivery.estimatedDeliveryTime': 1 });

// Virtuals
orderSchema.virtual('totalItems').get(function() {
  return (this.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
});

orderSchema.virtual('currentStatus').get(function() {
  if (!this.statusHistory || this.statusHistory.length === 0) return this.status;
  return this.statusHistory[this.statusHistory.length - 1].status;
});

orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'Delivered';
});

orderSchema.virtual('isCancelled').get(function() {
  return this.status === 'Cancelled';
});

orderSchema.virtual('canBeCancelled').get(function() {
  return ['Placed', 'Confirmed', 'Prescription Pending'].includes(this.status);
});

orderSchema.virtual('canBeReturned').get(function() {
  if (!this.isDelivered) return false;
  const deliveryDate = this.delivery && this.delivery.actualDeliveryTime ? this.delivery.actualDeliveryTime : this.updatedAt;
  if (!deliveryDate) return false;
  const daysSinceDelivery = (new Date() - deliveryDate) / (1000 * 60 * 60 * 24);
  return daysSinceDelivery <= 7;
});

// Instance methods
orderSchema.methods.updateStatus = function(newStatus, remarks, location, updatedBy) {
  this.status = newStatus;
  this.statusHistory = this.statusHistory || [];
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    location: location || undefined,
    remarks: remarks || '',
    updatedBy: updatedBy || undefined
  });

  if (global.io) {
    global.io.to(`order_${this._id}`).emit('statusUpdate', {
      orderId: this._id,
      status: newStatus,
      timestamp: new Date(),
      remarks
    });

    global.io.to(`user_${this.user}`).emit('orderUpdate', {
      orderId: this._id,
      orderNumber: this.orderNumber,
      status: newStatus,
      timestamp: new Date()
    });
  }

  return this.save();
};

orderSchema.methods.assignDeliveryPartner = function(partnerInfo) {
  this.delivery = this.delivery || {};
  this.delivery.partner = partnerInfo;
  this.delivery.deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString();
  return this.save();
};

orderSchema.methods.markAsDelivered = function(deliveredBy, receivedBy, images) {
  this.status = 'Delivered';
  this.delivery = this.delivery || {};
  this.delivery.actualDeliveryTime = new Date();
  this.delivery.deliveredBy = deliveredBy;
  this.delivery.receivedBy = receivedBy;
  if (images) this.delivery.deliveryImages = images;

  this.statusHistory = this.statusHistory || [];
  this.statusHistory.push({
    status: 'Delivered',
    timestamp: new Date(),
    remarks: `Delivered by ${deliveredBy}, received by ${receivedBy}`
  });

  return this.save();
};

orderSchema.methods.cancelOrder = function(reason, cancelledBy, refundAmount) {
  this.status = 'Cancelled';
  this.cancellation = {
    reason,
    cancelledBy,
    cancelledAt: new Date(),
    refundAmount: refundAmount || (this.pricing && this.pricing.paidAmount ? this.pricing.paidAmount : 0)
  };

  this.statusHistory = this.statusHistory || [];
  this.statusHistory.push({
    status: 'Cancelled',
    timestamp: new Date(),
    remarks: reason
  });

  return this.save();
};

orderSchema.methods.processRefund = function(refundAmount) {
  this.payment = this.payment || {};
  this.pricing = this.pricing || {};
  this.payment.status = refundAmount >= (this.pricing.paidAmount || 0) ? 'Refunded' : 'Partially Refunded';
  this.payment.refundedAt = new Date();
  this.payment.refundAmount = (this.payment.refundAmount || 0) + refundAmount;

  if (this.cancellation) {
    this.cancellation.refundProcessed = true;
    this.cancellation.refundAmount = refundAmount;
  }

  return this.save();
};

orderSchema.methods.addCustomerRating = function(rating, review) {
  this.customerRating = {
    rating,
    review,
    ratedAt: new Date()
  };
  return this.save();
};

// Pre-save middleware
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `MQ${timestamp}${randomNum}`;
  }

  if (this.status === 'Out for Delivery' && (!this.delivery || !this.delivery.deliveryOTP)) {
    this.delivery = this.delivery || {};
    this.delivery.deliveryOTP = Math.floor(1000 + Math.random() * 9000).toString();
  }

  next();
});

// Static methods
orderSchema.statics.getOrdersByStatus = function(status) {
  return this.find({ status })
    .populate('user', 'name phoneNumber')
    .populate('deliveryAddress')
    .sort({ createdAt: -1 });
};

orderSchema.statics.getOrdersByUser = function(userId, limit = 20) {
  return this.find({ user: userId })
    .populate('items.medicine', 'name brand images')
    .populate('deliveryAddress')
    .sort({ createdAt: -1 })
    .limit(limit);
};

orderSchema.statics.getOrdersRequiringPrescription = function() {
  return this.find({
    requiresPrescription: true,
    prescriptionVerified: false,
    status: { $in: ['Placed', 'Confirmed', 'Prescription Pending'] }
  })
    .populate('user', 'name phoneNumber')
    .populate('prescriptions');
};

orderSchema.statics.getTodaysOrders = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.find({
    createdAt: { $gte: today, $lt: tomorrow }
  }).sort({ createdAt: -1 });
};

orderSchema.statics.getOrderStats = function(startDate, endDate) {
  const matchStage = {};
  if (startDate && endDate) {
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.totalAmount' },
        averageOrderValue: { $avg: '$pricing.totalAmount' },
        deliveredOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);