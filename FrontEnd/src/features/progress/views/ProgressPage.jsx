import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressUpdateApi from "../api/progressApi";
import { PencilIcon, TrashIcon,ClockIcon,StarIcon, Workflow,CheckCircleIcon } from "lucide-react";

const ProgressPage = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId");
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch progress updates on component mount
  useEffect(() => {
    const fetchProgressUpdates = async () => {
      try {
        const updates = await ProgressUpdateApi.getAllProgressUpdates();
        setProgressUpdates(updates);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load progress updates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressUpdates();
  }, [currentUserId]);

  // Handle delete progress update
  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this progress update?")
    ) {
      try {
        await ProgressUpdateApi.deleteProgressUpdate(id);
        setProgressUpdates(
          progressUpdates.filter((update) => update.id !== id)
        );
        toast.success("Progress update deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete progress update");
      }
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-orange-700">Progress Updates</h1>
        <button
          onClick={() => navigate("/create-progress")}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
        >
          + New Update
        </button>
      </div>

      {progressUpdates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            You haven't created any progress updates yet.
          </p>
          <button
            onClick={() => navigate("/create-progress")}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Create Your First Update
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {progressUpdates.map((update) => (
           <div
           key={update.id}
           className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition hover:shadow-md"
         >
           {/* Header */}
           <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
             <Link
               to={
                 currentUserId === update.user.id
                   ? "/profile"
                   : `/profile/${update.user.id}`
               }
             >
               <div className="flex items-center gap-3">
                 <img
                   src={update.user.profileImageUrl || "https://via.placeholder.com/40"}
                   alt={update.user.username}
                   className="w-10 h-10 rounded-full object-cover"
                 />
                 <div>
                   <p className="font-semibold text-gray-900">{update.user.username}</p>
                   <p className="text-sm text-gray-500">{formatDate(update.createdAt)}</p>
                 </div>
               </div>
             </Link>
         
             {update.user.id === currentUserId && (
               <div className="flex items-center gap-2">
                 <button
                   onClick={() => navigate(`/edit-progress/${update.id}`)}
                   className="text-orange-600 hover:text-orange-800"
                   title="Edit"
                 >
                   <PencilIcon className="w-5 h-5" />
                 </button>
                 <button
                   onClick={() => handleDelete(update.id)}
                   className="text-red-600 hover:text-red-800"
                   title="Delete"
                 >
                   <TrashIcon className="w-5 h-5" />
                 </button>
               </div>
             )}
           </div>
         
           {/* Content */}
           <div className="px-6 py-4 space-y-4">
             <div className="flex justify-between items-start">
               <h2 className="text-lg font-semibold text-gray-800">{update.title}</h2>
               <span
                 className={`text-xs font-medium px-2 py-1 rounded-full ${
                   update.type === "MILESTONE"
                     ? "bg-purple-100 text-purple-700"
                     : update.type === "DAILY_UPDATE"
                     ? "bg-blue-100 text-blue-700"
                     : update.type === "CHALLENGE"
                     ? "bg-orange-100 text-orange-700"
                     : "bg-gray-100 text-gray-700"
                 }`}
               >
                 {update.type.toLowerCase().replace("_", " ")}
               </span>
             </div>
         
             <p className="text-gray-700 whitespace-pre-line">{update.content}</p>
         
             {/* Metadata */}
             <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
               <span className="flex items-center gap-1">
                 <ClockIcon className="w-4 h-4" />
                 {update.hoursSpent} hours spent
               </span>
               {update.rating && (
                 <span className="flex items-center gap-1">
                   <StarIcon className="w-4 h-4 text-yellow-400" />
                   Rating: {update.rating}/5
                 </span>
               )}
              
             </div>
         
             {/* Challenges and Achievements */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {update.challenges.length > 0 && (
                 <div className="bg-red-50 p-4 rounded-lg">
                   <h3 className="text-red-700 font-medium mb-2 flex items-center gap-1">
                     <Workflow className="w-4 h-4" />
                     Challenges
                   </h3>
                   <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                     {update.challenges.map((challenge, i) => (
                       <li key={i}>{challenge}</li>
                     ))}
                   </ul>
                 </div>
               )}
               {update.achievements.length > 0 && (
                 <div className="bg-green-50 p-4 rounded-lg">
                   <h3 className="text-green-700 font-medium mb-2 flex items-center gap-1">
                     <CheckCircleIcon className="w-4 h-4" />
                     Achievements
                   </h3>
                   <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                     {update.achievements.map((achievement, i) => (
                       <li key={i}>{achievement}</li>
                     ))}
                   </ul>
                 </div>
               )}
             </div>
           </div>
         </div>
         
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgressPage;
