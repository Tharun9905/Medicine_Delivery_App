// Admin authorization middleware
const adminAuth = (req, res, next) => {
  try {
    // Check if user is authenticated (auth middleware should run first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication required.'
      });
    }

    // For now, check if user's phone number is admin phone number
    // In production, you should have a proper role-based system
    const adminPhones = (process.env.ADMIN_PHONE || '+919999999999').split(',');
    const adminEmails = (process.env.ADMIN_EMAIL || 'admin@mediquick.com').split(',');

    const isAdminByPhone = adminPhones.includes(req.user.phoneNumber);
    const isAdminByEmail = req.user.email && adminEmails.includes(req.user.email);
    
    // Check if user has admin role (if role system is implemented)
    const hasAdminRole = req.user.role === 'admin' || req.user.isAdmin === true;

    if (!isAdminByPhone && !isAdminByEmail && !hasAdminRole) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // User is admin, proceed to next middleware
    next();

  } catch (error) {
    console.error('Admin Auth Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin authorization',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = adminAuth;