const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	try {
		const authHeader = req.headers.authorization || (req.cookies && req.cookies.token);
		if (!authHeader) {
			return res.status(401).json({ success: false, message: 'No token provided' });
		}

		const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
		if (!token) {
			return res.status(401).json({ success: false, message: 'Invalid token format' });
		}

		const secret = process.env.JWT_SECRET || 'secret';
		const decoded = jwt.verify(token, secret);

		// Try to attach user document if User model exists
		let UserModel = null;
		try {
			// eslint-disable-next-line global-require
			UserModel = require('../models/User');
		} catch (e) {
			UserModel = null;
		}

		if (UserModel && decoded && decoded.id) {
			try {
				const user = await UserModel.findById(decoded.id).select('-password');
				if (user) {
					req.user = user;
					return next();
				}
			} catch (e) {
				// fallback to decoded payload
			}
		}

		req.user = decoded;
		return next();
	} catch (err) {
		console.error('Auth middleware error:', err.message || err);
		return res.status(401).json({ success: false, message: 'Unauthorized' });
	}
};
