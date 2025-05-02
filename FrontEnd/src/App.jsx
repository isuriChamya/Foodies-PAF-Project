import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import PostPage from "./features/posts/views/PostPage";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 via-rose-50 to-white text-gray-800">
      <BrowserRouter>
        {/* NAVBAR */}
        <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 lg:px-32 py-4 bg-white shadow-md">
          <Navbar />
        </div>

        {/* MAIN CONTENT */}
        <div className="pt-24 px-6 md:px-16 lg:px-32 pb-16">
          <Routes>
            {/* POST ROUTES */}
            <Route path="/" element={<PostPage />} />
          </Routes>
        </div>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
};

export default App;
