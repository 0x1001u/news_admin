import ApiClient from './core/ApiClient';

export const newsService = {
    /**
     * 获取新闻列表。
     * @param {object} params - 查询参数，如 skip, limit, category_id, tag_id, status, search。
     * @returns {Promise<object>} - 包含新闻列表的响应。
     */
    async getNews(params = {}) {
        const response = await ApiClient.get('/news/', { params });
        return response.data;
    },

    /**
     * 获取单条新闻详情。
     * @param {number|string} newsIdOrSlug - 新闻ID或slug。
     * @returns {Promise<object>} - 单条新闻的详细信息。
     */
    async getNewsDetail(newsIdOrSlug) {
        const response = await ApiClient.get(`/news/${newsIdOrSlug}`);
        return response.data;
    },

    /**
     * 创建新闻。
     * @param {object} newsData - 新闻数据。
     * @returns {Promise<object>} - 创建成功的新闻数据。
     */
    async createNews(newsData) {
        const response = await ApiClient.post('/news/', newsData);
        return response.data;
    },

    /**
     * 更新新闻。
     * @param {number|string} newsIdOrSlug - 新闻ID或slug。
     * @param {object} newsData - 要更新的新闻数据。
     * @returns {Promise<object>} - 更新后的新闻数据。
     */
    async updateNews(newsIdOrSlug, newsData) {
        const response = await ApiClient.put(`/news/${newsIdOrSlug}`, newsData);
        return response.data;
    },

    /**
     * 删除新闻。
     * @param {number|string} newsIdOrSlug - 新闻ID或slug。
     * @returns {Promise<void>}
     */
    async deleteNews(newsIdOrSlug) {
        await ApiClient.delete(`/news/${newsIdOrSlug}`);
    },

    // 更多新闻相关服务，如上传图片等
};

