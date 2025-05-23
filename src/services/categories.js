import apiClient from './api';

export const categoryService = {
    /**
     * 获取分类列表。
     * @param {object} params - 查询参数。
     * @returns {Promise<object>} - 包含分类列表的响应。
     */
    async getCategories(params = {}) {
        const response = await apiClient.get('/categories/', { params });
        return response.data;
    },

    /**
     * 获取单个分类详情。
     * @param {number|string} categoryIdOrSlug - 分类ID或slug。
     * @returns {Promise<object>} - 单个分类的详细信息。
     */
    async getCategory(categoryIdOrSlug) {
        const response = await apiClient.get(`/categories/${categoryIdOrSlug}`);
        return response.data;
    },

    /**
     * 创建分类。
     * @param {object} categoryData - 分类数据。
     * @returns {Promise<object>} - 创建成功的分类数据。
     */
    async createCategory(categoryData) {
        const response = await apiClient.post('/categories/', categoryData);
        return response.data;
    },

    /**
     * 更新分类。
     * @param {number|string} categoryIdOrSlug - 分类ID或slug。
     * @param {object} categoryData - 要更新的分类数据。
     * @returns {Promise<object>} - 更新后的分类数据。
     */
    async updateCategory(categoryIdOrSlug, categoryData) {
        const response = await apiClient.put(`/categories/${categoryIdOrSlug}`, categoryData);
        return response.data;
    },

    /**
     * 删除分类。
     * @param {number|string} categoryIdOrSlug - 分类ID或slug。
     * @returns {Promise<void>}
     */
    async deleteCategory(categoryIdOrSlug) {
        await apiClient.delete(`/categories/${categoryIdOrSlug}`);
    },

    /**
     * 获取某个分类下的新闻列表。
     * @param {number|string} categoryIdOrSlug - 分类ID或slug。
     * @param {object} params - 查询参数，如 skip, limit。
     * @returns {Promise<object>} - 包含新闻列表的响应。
     */
    async getNewsByCategory(categoryIdOrSlug, params = {}) {
        const response = await apiClient.get(`/categories/${categoryIdOrSlug}/news`, { params });
        return response.data;
    },
};

