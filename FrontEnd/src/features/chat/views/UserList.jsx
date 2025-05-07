import React from 'react';

const UserList = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white">
        <h1 className="text-xl font-bold">Chats</h1>
      </div>
      
      <div className="divide-y divide-gray-200">
        {users.map(user => (
          <div
            key={user.id}
            className={`p-4 hover:bg-gray-100 cursor-pointer flex items-center ${
              selectedUser?.id === user.id ? 'bg-gray-200' : ''
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;