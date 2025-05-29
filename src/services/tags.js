import ApiClient from './core/ApiClient';

export const tagService = {
    /**
     * 获取标签列表。
     * @param {object} params - 查询参数。
     * @returns {Promise<object>} - 包含标签列表的响应。
     */
    async getTags(params = {}) {
        const response = await ApiClient.get('/tags/', { params });
        return response.data;
    },

    /**
     * 获取单个标签详情。
     * @param {number|string} tagIdOrSlug - 标签ID或slug。
     * @returns {Promise<object>} - 单个标签的详细信息。
     */
    async getTag(tagIdOrSlug) {
        const response = await ApiClient.get(`/tags/${tagIdOrSlug}`);
        return response.data;
    },

    /**
     * 创建标签。
     * @param {object} tagData - 标签数据。
     * @returns {Promise<object>} - 创建成功的标签数据。
     */
    async createTag(tagData) {
        const response = await ApiClient.post('/tags/', tagData);
        return response.data;
    },

    /**
     * 更新标签。
     * @param {number|string} tagIdOrSlug - 标签ID或slug。
     * @param {object} tagData - 要更新的标签数据。
     * @returns {Promise<object>} - 更新后的标签数据。
     */
    async updateTag(tagIdOrSlug, tagData) {
        const response = await ApiClient.put(`/tags/${tagIdOrSlug}`, tagData);
        return response.data;
    },

    /**
     * 删除标签。
     * @param {number|string} tagIdOrSlug - 标签ID或slug。
     * @returns {Promise<void>}
     */
    async deleteTag(tagIdOrSlug) {
        await ApiClient.delete(`/tags/${tagIdOrSlug}`);
    },

    /**
     * 获取某个标签下的新闻列表。
     * @param {number|string} tagIdOrSlug - 标签ID或slug。
     * @param {object} params - 查询参数，如 skip, limit。
     * @returns {Promise<object>} - 包含新闻列表的响应。
     */
    async getNewsByTag(tagIdOrSlug, params = {}) {
        const response = await ApiClient.get(`/tags/${tagIdOrSlug}/news`, { params });
        return response.data;
    },
};

