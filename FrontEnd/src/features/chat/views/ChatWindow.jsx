import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';

const ChatWindow = ({ messages,  onDeleteMessage, onEditMessage, loading }) => {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEditSubmit = (messageId, newContent) => {
    onEditMessage(messageId, newContent);
    setEditingMessageId(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading messages...</p>
        </div>
      ) : (
        <>
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map(message => (
              <Message
                key={message.id}
                message={message}
                isEditing={editingMessageId === message.id}
                onStartEdit={() => setEditingMessageId(message.id)}
                onCancelEdit={() => setEditingMessageId(null)}
                onSubmitEdit={handleEditSubmit}
                onDelete={onDeleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default ChatWindow;