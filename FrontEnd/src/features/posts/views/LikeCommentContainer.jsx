import { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Send, X, MoreVertical, Edit, Trash } from "lucide-react";
import Modal from "react-modal";
import commentApi from "../api/commentApi";
import likeApi from "../api/likeApi";

// For accessibility - bind modal to your app element
Modal.setAppElement("#root"); // Adjust this to match your app's root element ID

const LikeCommentContainer = ({ postId, postedUserId }) => {
  const userId = localStorage.getItem("userId");
  
  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [commentMenuOpen, setCommentMenuOpen] = useState(null);
  const [loading, setLoading] = useState({
    likes: true,
    comments: false,
    submitComment: false,
    toggleLike: false,
    editComment: false,
    deleteComment: false
  });
  const [error, setError] = useState({
    likes: null,
    comments: null,
    submitComment: null,
    toggleLike: null,
    editComment: null,
    deleteComment: null
  });

  // Modal custom styles
  const customModalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '80vh',
      padding: 0,
      borderRadius: '8px',
      overflow: 'hidden'
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1000
    }
  };

  // Fetch like count and status on mount
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        setLoading(prev => ({ ...prev, likes: true }));
        setError(prev => ({ ...prev, likes: null }));
        
        const summary = await likeApi.getLikeSummaryForPost(postId, userId);
        setLikeCount(summary.count);
        setIsLiked(summary.liked);
        
        const commentCountData = await commentApi.getCommentCountForPost(postId);
        setCommentCount(commentCountData);
      } catch (error) {
        console.error("Failed to fetch like data:", error);
        setError(prev => ({ ...prev, likes: error.message }));
      } finally {
        setLoading(prev => ({ ...prev, likes: false }));
      }
    };

    fetchLikeData();
  }, [postId, userId]);

  // Fetch comments when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchComments();
    } else {
      // Close any open comment menus when modal closes
      setCommentMenuOpen(null);
      setEditingCommentId(null);
    }
  }, [isModalOpen,]);

  // Click outside handler for comment menu
  useEffect(() => {
    const handleClickOutside = () => {
      setCommentMenuOpen(null);
    };

    if (commentMenuOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [commentMenuOpen]);

  const fetchComments = async () => {
    try {
      setLoading(prev => ({ ...prev, comments: true }));
      setError(prev => ({ ...prev, comments: null }));
      
      const fetchedComments = await commentApi.getCommentsByPostId(postId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setError(prev => ({ ...prev, comments: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, comments: false }));
    }
  };

  // Handle modal open/close
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (!userId) {
      alert("Please log in to like this post");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, toggleLike: true }));
      setError(prev => ({ ...prev, toggleLike: null }));
      
      await likeApi.toggleLike(userId, { postId });
      
      // Update UI optimistically
      const newLikedStatus = !isLiked;
      setIsLiked(newLikedStatus);
      setLikeCount(prev => newLikedStatus ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setError(prev => ({ ...prev, toggleLike: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, toggleLike: false }));
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) return;
    if (!userId) {
      alert("Please log in to comment");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, submitComment: true }));
      setError(prev => ({ ...prev, submitComment: null }));
      
      const newComment = await commentApi.createComment(userId, {
        content: commentContent,
        postId: postId
      });
      
      // Update UI with new comment
      setComments(prev => [newComment, ...prev]);
      setCommentContent("");
      setCommentCount(prev => prev + 1);
    } catch (error) {
      console.error("Failed to submit comment:", error);
      setError(prev => ({ ...prev, submitComment: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, submitComment: false }));
    }
  };

  // Handle comment edit start
  const handleEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
    setCommentMenuOpen(null);
  };

  // Handle comment update
  const handleUpdateComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    
    try {
      setLoading(prev => ({ ...prev, editComment: true }));
      setError(prev => ({ ...prev, editComment: null }));
      
      const updatedComment = await commentApi.updateComment(commentId, userId, {
        content: editCommentContent
      });
      
      // Update UI with edited comment
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId ? { ...comment, content: updatedComment.content } : comment
        )
      );
      
      // Reset edit state
      setEditingCommentId(null);
      setEditCommentContent("");
    } catch (error) {
      console.error("Failed to update comment:", error);
      setError(prev => ({ ...prev, editComment: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, editComment: false }));
    }
  };

  // Handle comment delete
  const handleDeleteComment = async (commentId) => {
    console.log(`Comment is going to delete ${commentId}`)
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, deleteComment: true }));
      setError(prev => ({ ...prev, deleteComment: null }));
      
      await commentApi.deleteComment(commentId, userId);
      
      // Update UI by removing the deleted comment
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setCommentCount(prev => prev - 1);
      setCommentMenuOpen(null);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      setError(prev => ({ ...prev, deleteComment: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, deleteComment: false }));
    }
  };

  // Check if user can edit or delete a comment
  const canEditComment = (commentUserId) => {
    return userId === commentUserId;
  };

  const canDeleteComment = (commentUserId) => {
    
    return userId === postedUserId || userId === commentUserId;
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Cancel comment edit
  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  return (
    <div className="flex flex-col">
      {/* Like and Comment Stats & Buttons */}
      <div className="flex items-center justify-between py-2 px-3 border-t border-gray-200">
        {/* Stats */}
        <div className="flex text-sm text-gray-500 space-x-4">
          <span className="flex items-center">
            <ThumbsUp size={14} className="mr-1" />
            {loading.likes ? "..." : likeCount}
          </span>
          <span className="flex items-center">
            <MessageCircle size={14} className="mr-1" />
            {commentCount} comments
          </span>
        </div>
        
        {/* Error Display */}
        {error.likes && (
          <div className="text-red-500 text-xs">{error.likes}</div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-around py-1 border-t border-gray-200">
        <button
          onClick={handleLikeToggle}
          disabled={loading.toggleLike}
          className={`flex items-center justify-center w-1/2 py-2 rounded-md transition ${
            isLiked ? "text-blue-500 font-medium" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <ThumbsUp size={18} className={`mr-2 ${isLiked ? "fill-current" : ""}`} />
          Like
        </button>
        
        <button
          onClick={openModal}
          className="flex items-center justify-center w-1/2 py-2 text-gray-500 rounded-md hover:bg-gray-100 transition"
        >
          <MessageCircle size={18} className="mr-2" />
          Comment
        </button>
      </div>
      
      {/* Comments Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Comments Modal"
      >
        <div className="flex flex-col h-full">
          {/* Modal Header */}
          <div className="flex justify-between items-center border-b px-4 py-3">
            <h3 className="text-lg font-medium">Comments</h3>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="p-4 border-b">
            <div className="flex">
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading.submitComment}
              />
              <button
                type="submit"
                disabled={!commentContent.trim() || loading.submitComment}
                className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
            {error.submitComment && (
              <p className="text-red-500 text-xs mt-1">{error.submitComment}</p>
            )}
          </form>
          
          {/* Comments List */}
          <div className="flex-grow overflow-y-auto p-4" style={{ maxHeight: "calc(80vh - 160px)" }}>
            {loading.comments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="mb-3 bg-gray-50 p-3 rounded-lg">
                  {editingCommentId === comment.id ? (
                    // Edit Comment Form
                    <div className="mt-1">
                      <textarea
                        value={editCommentContent}
                        onChange={(e) => setEditCommentContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        disabled={loading.editComment}
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={!editCommentContent.trim() || loading.editComment}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {loading.editComment ? "Saving..." : "Save"}
                        </button>
                      </div>
                      {error.editComment && (
                        <p className="text-red-500 text-xs mt-1">{error.editComment}</p>
                      )}
                    </div>
                  ) : (
                    // Regular Comment View
                    <div className="flex items-start">
                      {comment.user?.profileImageUrl ? (
                        <img
                          src={comment.user.profileImageUrl}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
                          {comment.user?.username?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <p className="font-medium">{comment.user?.username || "Unknown User"}</p>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-400 mr-2">
                              {formatDate(comment.createdAt)}
                            </span>
                            {/* Comment Menu Button - Only show if user can edit or delete */}
                           
                              <div className="relative">
                       
                                {canEditComment(comment.user?.id) && (
                                      <button
                                        onClick={() => handleEditStart(comment)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      >
                                        <Edit size={16} className="mr-2" />
                                        
                                      </button>
                                    )}
                                    {canDeleteComment(comment.user?.id) && (
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                      >
                                        <Trash size={16} className="mr-2" />
                                        
                                      </button>
                                    )}
                              </div>
                  
                            
                          </div>
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg mt-1">
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                     
                    
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
            
            {error.comments && (
              <div className="text-center py-4 text-red-500">
                {error.comments}
              </div>
            )}
            
            {error.deleteComment && (
              <div className="text-center py-2 text-red-500">
                {error.deleteComment}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LikeCommentContainer;