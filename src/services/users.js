import ApiClient from './core/ApiClient';

export const userService = {
    /**
     * 获取用户列表。
     * @param {object} params - 查询参数，如 skip, limit, search, is_active, is_superuser。
     * @returns {Promise<object>} - 包含用户列表的响应。
     */
    async getUsers(params = {}) {
        const response = await ApiClient.get('/users/', { params });
        return response.data;
    },

    /**
     * 获取单个用户详情。
     * @param {number} userId - 用户ID。
     * @returns {Promise<object>} - 单个用户的详细信息。
     */
    async getUser(userId) {
        const response = await ApiClient.get(`/users/${userId}`);
        return response.data;
    },

    /**
     * 获取当前用户信息（/users/me）。
     * @returns {Promise<object>} - 当前用户的详细信息。
     */
    async getMe() {
        const response = await ApiClient.get('/users/me');
        return response.data;
    },

    /**
     * 创建新用户。
     * @param {object} userData - 用户数据。
     * @returns {Promise<object>} - 创建成功的用户数据。
     */
    async createUser(userData) {
        const response = await ApiClient.post('/users/', userData);
        return response.data;
    },

    /**
     * 更新用户信息。
     * @param {number} userId - 用户ID。
     * @param {object} userData - 要更新的用户数据。
     * @returns {Promise<object>} - 更新后的用户数据。
     */
    async updateUser(userId, userData) {
        const response = await ApiClient.put(`/users/${userId}`, userData);
        return response.data;
    },

    /**
     * 删除用户。
     * @param {number} userId - 用户ID。
     * @returns {Promise<void>}
     */
    async deleteUser(userId) {
        await ApiClient.delete(`/users/${userId}`);
    },

    // 更多用户相关服务，如修改密码、禁用/启用用户等
};

