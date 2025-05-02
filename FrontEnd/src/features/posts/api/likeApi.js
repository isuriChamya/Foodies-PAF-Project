import apiClient from "../../../configs/axiosConfig";

export default {
  // Toggle like status (like or unlike)
  async toggleLike(userId, likeData) {
    try {
      const response = await apiClient.post('/likes/toggle', likeData, {
        headers: {
          'User-ID': userId
        }
      });
      // Return the response data if status is 201 (Created - post was liked)
      // Return null if status is 204 (No Content - post was unliked)
      return response.status === 204 ? null : response.data;
    } catch (error) {
      let errorMessage = "Failed to toggle like";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Unlike a post directly
  async unlikePost(userId, postId) {
    try {
      await apiClient.delete(`/likes/${postId}`, {
        headers: {
          'User-ID': userId
        }
      });
      return true;
    } catch (error) {
      let errorMessage = "Failed to unlike post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get likes by post ID
  async getLikesByPostId(postId) {
    try {
      const response = await apiClient.get(`/likes/post/${postId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch likes for this post";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get likes by user ID
  async getLikesByUserId(userId) {
    try {
      const response = await apiClient.get(`/likes/user/${userId}`);
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch user's likes";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get like summary for a post
  async getLikeSummaryForPost(postId, userId = null) {
    try {
      const headers = userId ? { 'User-ID': userId } : {};
      const response = await apiClient.get(`/likes/summary/${postId}`, { headers });
      return response.data;
    } catch (error) {
      let errorMessage = "Failed to fetch like summary";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Check if user liked a post
  async checkIfUserLikedPost(userId, postId) {
    try {
      const response = await apiClient.get(`/likes/check/${postId}`, {
        headers: {
          'User-ID': userId
        }
      });
      return response.data.liked;
    } catch (error) {
      let errorMessage = "Failed to check like status";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  },

  // Get like count for a post
  async getLikeCountForPost(postId) {
    try {
      const response = await apiClient.get(`/likes/count/${postId}`);
      return response.data.count;
    } catch (error) {
      let errorMessage = "Failed to fetch like count";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  }
};