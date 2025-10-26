const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Core identifiers
  phoneNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    validate: {
      validator: v => !v || /^[\+]?[0-9]{7,15}$/.test(v),
      message: 'Please enter a valid phone number'
    }
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Please enter a valid email address'
    }
  },

  // Basic profile
  name: { type: String, trim: true, maxlength: 100 },

  // Auth
  password: { type: String }, // hashed when present (for email auth)
  authProvider: { type: String, enum: ['phone','email','google'], default: 'phone' },
  isVerified: { type: Boolean, default: false },

  // Minimal address refs
  addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
  defaultAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },

  // OTP (simple)
  otp: {
    code: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 }
  },

  status: { type: String, enum: ['active','suspended','blocked'], default: 'active' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/* Note: Indexes are already created via unique: true in schema definition */

/* Password hashing */
userSchema.pre('save', async function(next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

/* Instance helpers */
userSchema.methods.comparePassword = function(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000), attempts: 0 };
  return otp;
};

userSchema.methods.verifyOTP = function(code) {
  if (!this.otp || !this.otp.code) return { success: false, message: 'No OTP' };
  if (new Date() > this.otp.expiresAt) return { success: false, message: 'OTP expired' };
  if (this.otp.attempts >= 3) return { success: false, message: 'Too many attempts' };
  if (this.otp.code !== code) {
    this.otp.attempts += 1;
    return { success: false, message: 'Invalid OTP' };
  }
  this.isVerified = true;
  this.otp = undefined;
  return { success: true, message: 'Verified' };
};

userSchema.methods.generateToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'changeme', { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

/* Remove sensitive fields from JSON */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);