import apiClient from './api';

export const commentService = {
    /**
     * 获取评论列表。
     * @param {object} params - 查询参数，如 skip, limit, news_id, user_id。
     * @returns {Promise<object>} - 包含评论列表的响应。
     */
    async getComments(params = {}) {
        const response = await apiClient.get('/comments/', { params });
        return response.data;
    },

    /**
     * 获取单个评论详情。
     * @param {number} commentId - 评论ID。
     * @returns {Promise<object>} - 单个评论的详细信息。
     */
    async getComment(commentId) {
        const response = await apiClient.get(`/comments/${commentId}`);
        return response.data;
    },

    /**
     * 在新闻下发表评论。
     * @param {number|string} newsIdOrSlug - 新闻ID或slug。
     * @param {object} commentData - 评论数据，包含 content。
     * @returns {Promise<object>} - 创建成功的评论数据。
     */
    async createCommentForNews(newsIdOrSlug, commentData) {
        const response = await apiClient.post(`/news/${newsIdOrSlug}/comments`, commentData);
        return response.data;
    },

    /**
     * 回复评论。
     * @param {number} parentCommentId - 父评论ID。
     * @param {object} replyData - 回复数据，包含 content。
     * @returns {Promise<object>} - 创建成功的回复评论数据。
     */
    async replyToComment(parentCommentId, replyData) {
        const response = await apiClient.post(`/comments/${parentCommentId}/reply`, replyData);
        return response.data;
    },

    /**
     * 更新评论。
     * @param {number} commentId - 评论ID。
     * @param {object} commentData - 要更新的评论数据。
     * @returns {Promise<object>} - 更新后的评论数据。
     */
    async updateComment(commentId, commentData) {
        const response = await apiClient.put(`/comments/${commentId}`, commentData);
        return response.data;
    },

    /**
     * 删除评论。
     * @param {number} commentId - 评论ID。
     * @returns {Promise<void>}
     */
    async deleteComment(commentId) {
        await apiClient.delete(`/comments/${commentId}`);
    },
};

