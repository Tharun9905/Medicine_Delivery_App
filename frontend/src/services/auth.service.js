import api from '../utils/api';

class AuthService {
  async sendOTP(phoneNumber) {
    return await api.post('/auth/send-otp', { phoneNumber });
  }

  async verifyOTP(phoneNumber, otp) {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
    if (response.success && response.token) {
      this.setAuthData(response.token, response.user);
    }
    return response;
  }

  async register(userData) {
    return await api.post('/auth/register', userData);
  }

  async login(phoneNumber) {
    return await api.post('/auth/login', { phoneNumber });
  }

  async getProfile() {
    return await api.get('/auth/me');
  }

  async updateProfile(userData) {
    const response = await api.put('/auth/update-profile', userData);
    if (response.success && response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  async changePhoneNumber(newPhoneNumber) {
    return await api.post('/auth/change-phone', { newPhoneNumber });
  }

  async verifyPhoneChange(otp) {
    const response = await api.post('/auth/verify-phone-change', { otp });
    if (response.success && response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  }

  setAuthData(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();