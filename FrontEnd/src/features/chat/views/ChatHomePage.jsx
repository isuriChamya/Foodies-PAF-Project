import React, { useState, useEffect } from "react";
import chatApi from "../api/chatApi";
import userApi from "../../auth/api/userApi";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";

const ChatHomePage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.filter((user)=>user.id!=localStorage.getItem("userId")));
      } catch (err) {
        setError("Failed to load users");
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // When a user is selected, load conversation and messages
  useEffect(() => {
    if (!selectedUser) return;

    const loadConversation = async () => {
      try {
        setLoading(true);
        // Get current user ID from your auth context or local storage
        const currentUserId = localStorage.getItem("userId");

        // Check if conversation exists between users
        const convResponse = await chatApi.getConversationBetweenUsers(
          currentUserId,
          selectedUser.id
        );

        if (convResponse.data) {
          setConversation(convResponse.data);
          // Load messages for this conversation
          const messagesResponse = await chatApi.getConversationMessages(
            convResponse.data.id
          );
          setMessages(messagesResponse.data);
        } else {
          setConversation(null);
          setMessages([]);
        }
      } catch (err) {
        setError("Failed to load conversation");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [selectedUser]);

  const handleSendMessage = async (content) => {
    try {
      const currentUserId = localStorage.getItem("userId");

      // If no conversation exists, create one first
      if (!conversation) {
        const convResponse = await chatApi.createConversation(
          currentUserId,
          selectedUser.id
        );
        setConversation(convResponse.data);
        const messageResponse = await chatApi.sendMessage(
            currentUserId,
            selectedUser.id,
            content,
            convResponse.data.id
          );
          // Add the new message to our state
          setMessages([...messages, messageResponse.data]);
      }
      // Send the message
      else {
        const messageResponse = await chatApi.sendMessage(
          currentUserId,
          selectedUser.id,
          content,
          conversation.id
        );
        // Add the new message to our state
        setMessages([...messages, messageResponse.data]);
      }
    } catch (err) {
      setError("Failed to send message");
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await chatApi.deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg.id !== messageId));
    } catch (err) {
      setError("Failed to delete message");
      console.error(err);
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await chatApi.updateMessage(messageId, newContent);
      setMessages(
        messages.map((msg) => (msg.id === messageId ? response.data : msg))
      );
    } catch (err) {
      setError("Failed to edit message");
      console.error(err);
    }
  };

  return (
    <div className="flex h-[80vh] bg-gray-100 mt-6">
      {/* Left sidebar - User list */}
      <div className="w-1/3 border-r border-gray-300 bg-white">
        <UserList
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      {/* Right side - Chat area */}
      <div className="flex flex-col w-2/3">
        {selectedUser ? (
          <>
            <ChatWindow
              messages={messages}
              selectedUser={selectedUser}
              onDeleteMessage={handleDeleteMessage}
              onEditMessage={handleEditMessage}
              loading={loading}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHomePage;
