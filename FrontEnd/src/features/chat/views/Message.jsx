import React, { useState } from 'react';

const Message = ({ 
  message, 
  isEditing, 
  onStartEdit, 
  onCancelEdit, 
  onSubmitEdit, 
  onDelete 
}) => {
    console.dir(message)
  const [editContent, setEditContent] = useState(message.content);
  const currentUserId = localStorage.getItem('userId');
  const isCurrentUser = message.sender.id === currentUserId;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editContent.trim() && editContent !== message.content) {
      onSubmitEdit(message.id, editContent);
    } else {
      onCancelEdit();
    }
  };

  return (
    <div className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser 
            ? 'bg-green-100 rounded-tr-none' 
            : 'bg-white rounded-tl-none'
        }`}
      >
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex flex-col">
            <input
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="border p-2 mb-2 rounded"
              autoFocus
            />
            <div className="flex space-x-2">
              <button 
                type="submit" 
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
              >
                Save
              </button>
              <button 
                type="button" 
                onClick={onCancelEdit}
                className="bg-gray-300 px-3 py-1 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-gray-800">{message.content}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {message.isEdited && ' (edited)'}
              </span>
              {isCurrentUser && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onStartEdit(message.id)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete(message.id)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Message;