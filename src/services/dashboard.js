import apiClient from './core/ApiClient';

export default {
  getDashboardData() {
    return apiClient.get('/dashboard');
  }
};