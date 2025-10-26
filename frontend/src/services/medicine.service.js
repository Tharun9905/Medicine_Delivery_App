import api from '../utils/api';

class MedicineService {
  async searchMedicines(params = {}) {
    const queryParams = new URLSearchParams();
    
    // Handle search parameter
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.q) {
      queryParams.append('q', params.q);
    }
    
    // Handle other parameters
    Object.keys(params).forEach(key => {
      if (key !== 'search' && key !== 'q' && params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/medicines/search?${queryString}` : '/medicines/search';
    return await api.get(endpoint);
  }

  async getMedicines(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return await api.get(`/medicines?${params}`);
  }

  async getPopularMedicines() {
    return await api.get('/medicines/popular');
  }

  async getFeaturedMedicines() {
    return await api.get('/medicines/featured');
  }

  async getNewArrivals() {
    return await api.get('/medicines/new-arrivals');
  }

  async getRecommendations() {
    return await api.get('/medicines/recommendations');
  }

  async getCategories() {
    return await api.get('/medicines/categories');
  }

  async getBrands(category) {
    const params = category ? `?category=${category}` : '';
    return await api.get(`/medicines/brands${params}`);
  }

  async getMedicineById(id) {
    return await api.get(`/medicines/${id}`);
  }

  async checkAvailability(id, quantity = 1) {
    return await api.get(`/medicines/${id}/availability?quantity=${quantity}`);
  }
}

export default new MedicineService();