import { useState, useEffect } from "react";
import { Bell, Trash2, UserPlus, Heart, MessageSquare, Check } from "lucide-react";
import notificationApi from "../api/notificationApi";

const NotificationsPage = () => {
  const userId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationApi.getNotificationsForUser(userId);
        setNotifications(response || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const handleDeleteNotification = async () => {
    try {
      await notificationApi.deleteNotification(selectedNotificationId, userId);
      setNotifications(notifications.filter(notif => notif.id !== selectedNotificationId));
      setShowModal(false);
      setSelectedNotificationId(null);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead(userId);
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "LIKE": return <Heart className="text-red-500" size={20} />;
      case "COMMENT": return <MessageSquare className="text-blue-500" size={20} />;
      case "FOLLOW": return <UserPlus className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Bell className="mr-2" size={24} /> Notifications
        </h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded transition-colors"
          >
            <Check size={16} className="mr-1" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={notification.sender.profileImageUrl}
                  alt={notification.sender.username}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="ml-3 flex-grow">
                <div className="flex items-center">
                  <span className="mr-2">{getNotificationIcon(notification.type)}</span>
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{notification.sender.username}</span>
                    {" "}{notification.message.split(notification.sender.username)[1]}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedNotificationId(notification.id);
                  setShowModal(true);
                }}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                aria-label="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Bell className="mx-auto text-gray-300" size={48} />
          <p className="mt-4 text-gray-500">No notifications yet</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg text-center">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-sm text-gray-700">Are you sure you want to delete this notification?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteNotification}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedNotificationId(null);
                }}
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

export default NotificationsPage;
