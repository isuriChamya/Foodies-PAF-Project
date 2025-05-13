import React, { useState } from "react";
import Modal from "react-modal";
import { uploadFile } from "../../../services/uploadFileService";
import postApi from "../api/postApi";

Modal.setAppElement("#root");

const CreatePostModal = ({ onRefresh }) => {
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    medias: [],
  });

  const validateFile = (file) => {
    if (file.type.startsWith("image/")) return true;

    if (file.type.startsWith("video/")) {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          resolve(video.duration <= 30);
        };
        video.src = URL.createObjectURL(file);
      });
    }

    return false;
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (formData.medias.length + files.length > 3) {
      setError("Maximum 3 files allowed");
      return;
    }

    for (const file of files) {
      const isValid = await validateFile(file);
      if (!isValid) {
        setError("Invalid file type or video duration exceeds 30 seconds");
        return;
      }
    }

    setError("");
    setIsLoading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const url = await uploadFile(file);
        return {
          url,
          type: file.type.startsWith("image/") ? "image" : "video",
        };
      });

      const uploadedMedias = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        medias: [...prev.medias, ...uploadedMedias],
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Failed to upload files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }
    if (formData.medias.length === 0) {
      setError("At least one media file is required");
      return;
    }

    setIsLoading(true);
    try {
      await postApi.createPost(userId, formData);
      await onRefresh();
      setFormData({ title: "", description: "", medias: [] });
      setIsOpen(false);
    } catch (error) {
      setError(error.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  const removeMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      medias: prev.medias.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 mb-12 w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create New Post
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Create Post Modal"
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 mx-4 lg:mx-auto mt-20 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Create New Post</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows="3"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Media Files ({formData.medias.length}/3)
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
              disabled={formData.medias.length >= 3}
              className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {formData.medias.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.medias.map((media, index) => (
                <div key={index} className="relative group">
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={`Media ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                  ) : (
                    <video src={media.url} className="w-full h-24 object-cover rounded-md" />
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default CreatePostModal;
