const { protect, authorize } = require('../../src/middleware/auth.middleware');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('Auth Middleware', () => {
  describe('protect middleware', () => {
    let req, res, next, user;

    beforeEach(async () => {
      // Create test user
      user = await new User({
        phoneNumber: '+1234567890',
        name: 'Test User',
        isVerified: true
      }).save();

      req = {
        headers: {},
        cookies: {}
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };

      next = jest.fn();
    });

    test('should authenticate user with valid Bearer token', async () => {
      const token = user.generateToken();
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(req.user.phoneNumber).toBe(user.phoneNumber);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should authenticate user with valid cookie token', async () => {
      const token = user.generateToken();
      req.cookies.token = token;

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject request without token', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route'
      });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    test('should reject request with invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token is invalid or expired'
      });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    test('should reject request with expired token', async () => {
      const expiredToken = jwt.sign(
        { id: user._id, phoneNumber: user.phoneNumber },
        process.env.JWT_SECRET,
        { expiresIn: '-1s' }
      );
      req.headers.authorization = `Bearer ${expiredToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token is invalid or expired'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request for non-existent user', async () => {
      const fakeToken = jwt.sign(
        { id: '64a7c9e5f123456789abcdef', phoneNumber: '+9999999999' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      req.headers.authorization = `Bearer ${fakeToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request for suspended user', async () => {
      user.status = 'suspended';
      await user.save();

      const token = user.generateToken();
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Account is suspended'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request for blocked user', async () => {
      user.status = 'blocked';
      await user.save();

      const token = user.generateToken();
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Account is suspended'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should prefer Authorization header over cookie', async () => {
      const validToken = user.generateToken();
      const invalidToken = 'invalid-token';

      req.headers.authorization = `Bearer ${validToken}`;
      req.cookies.token = invalidToken;

      await protect(req, res, next);

      expect(req.user).toBeDefined();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should handle malformed Authorization header', async () => {
      req.headers.authorization = 'InvalidHeader';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should exclude sensitive data from user object', async () => {
      user.generateOTP();
      await user.save();

      const token = user.generateToken();
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(req.user.otp).toBeUndefined();
      expect(req.user.__v).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorize middleware', () => {
    let req, res, next, user;

    beforeEach(async () => {
      req = {
        user: {
          role: 'user'
        }
      };

      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
      };

      next = jest.fn();
    });

    test('should authorize user with correct role', () => {
      req.user.role = 'admin';
      const middleware = authorize('admin', 'user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should authorize user with default role', () => {
      // User with no explicit role should default to 'user'
      delete req.user.role;
      const middleware = authorize('user', 'admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should reject user with incorrect role', () => {
      req.user.role = 'user';
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User role not authorized'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request without user', () => {
      req.user = null;
      const middleware = authorize('user');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject request with undefined user', () => {
      delete req.user;
      const middleware = authorize('user');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should work with multiple allowed roles', () => {
      req.user.role = 'moderator';
      const middleware = authorize('admin', 'moderator', 'user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should be case sensitive for roles', () => {
      req.user.role = 'Admin'; // Capital A
      const middleware = authorize('admin'); // lowercase a

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User role not authorized'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});