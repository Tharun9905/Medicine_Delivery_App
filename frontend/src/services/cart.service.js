import api from '../utils/api';

class CartService {
  async getCart() {
    return await api.get('/cart');
  }

  async addToCart(medicineId, quantity = 1) {
    return await api.post('/cart/add', { medicineId, quantity });
  }

  async updateCartItem(itemId, quantity) {
    return await api.put(`/cart/update/${itemId}`, { quantity });
  }

  async removeFromCart(itemId) {
    return await api.delete(`/cart/remove/${itemId}`);
  }

  async clearCart() {
    return await api.delete('/cart/clear');
  }

  async applyCoupon(couponCode) {
    return await api.post('/cart/apply-coupon', { couponCode });
  }
}

export default new CartService();