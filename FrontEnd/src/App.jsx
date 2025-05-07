import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./features/auth/views/Login";
import OAuth2RedirectHandler from "./features/auth/views/OAuth2RedirectHandler";
import RegisterPage from "./features/auth/views/RegisterPage";
import PostPage from "./features/posts/views/PostPage";
import { ToastContainer } from "react-toastify";
import CurrentUserProfilePage from "./features/user/views/CurrentUserProfilePage";
import FollowUserProfile from "./features/user/views/FollowUserProfile";
import NotificationsPage from "./features/notifications/views/NotificationsPage";
import PlansPage from "./features/plans/views/PlansPage";
import CreatePlanModal from "./features/plans/views/CreatePlanModal";
import UpdatePlanModal from "./features/plans/views/UpdatePlanModal";
import SinglePlanView from "./features/plans/views/SinglePlanView";
import ProgressPage from "./features/progress/views/ProgressPage";
import CreateProgressPage from "./features/progress/views/CreateProgressPage";
import EditProgressPage from "./features/progress/views/EditProgressPage";
import SingleProgressPage from "./features/progress/views/SingleProgressPage";
import ChatHomePage from "./features/chat/views/ChatHomePage";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50  text-gray-800">
      <BrowserRouter>
        {/* NAVBAR */}
        <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 lg:px-32 py-4 bg-white shadow-md">
          <Navbar />
        </div>

        {/* MAIN CONTENT */}
        <div className="pt-24 px-6 md:px-16 lg:px-32 pb-16">
          <Routes>
            {/* AUTH ROUTES */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="/login/oauth2/code/google" element={<OAuth2RedirectHandler />} />

            {/* POST ROUTES */}
            <Route path="/" element={<PostPage />} />

            {/* USER ROUTES */}
            <Route path="/profile" element={<CurrentUserProfilePage />} />
            <Route path="/profile/:id" element={<FollowUserProfile />} />

            {/* NOTIFICATIONS */}
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* PLANS */}
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/create-plan" element={<CreatePlanModal />} />
            <Route path="/edit-plan/:id" element={<UpdatePlanModal />} />
            <Route path="/plans/:planId" element={<SinglePlanView />} />

            {/* PROGRESS */}
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/create-progress" element={<CreateProgressPage />} />
            <Route path="/edit-progress/:id" element={<EditProgressPage />} />
            <Route path="/progress/:progressId" element={<SingleProgressPage />} />
            {/* CHAT */}
            <Route path="/chat" element={<ChatHomePage />} />
          </Routes>
        </div>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
};

export default App;
