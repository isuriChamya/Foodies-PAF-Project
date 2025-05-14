import React, { useState } from 'react';
import PostCard from './PostCard';
import postApi from '../api/postApi';

const PostsList = ({ posts, onUpdateClicked, onDeleteSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const confirmDelete = async () => {
    try {
      await postApi.deletePost(postToDelete);
      await onDeleteSuccess();
      setShowModal(false);
      setPostToDelete(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onUpdateClicked={onUpdateClicked}
          onDeleteClicked={() => handleDeleteClick(post.id)}
        />
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this post?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;
