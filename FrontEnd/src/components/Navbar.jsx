import { Bell, MessageCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-red-700 via-yellow-400 to-green-500 px-8 py-4 rounded-b-2xl shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to={"/"}>
          <div className="text-white text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform">
            FOODIE
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-6 text-white font-medium">
          <Link
            to={"/"}
            className="relative group transition-all"
          >
            Posts
            <span className="block absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to={"/plans"}
            className="relative group transition-all"
          >
            Plans
            <span className="block absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to={"/progress"}
            className="relative group transition-all"
          >
            Progresses
            <span className="block absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            to={"/notifications"}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 text-white" />
          </Link>

          <Link
            to={"/chat"}
            className="hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </Link>

          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            className="ml-2 bg-white text-red-700 font-semibold px-5 py-2 rounded-full hover:bg-yellow-50 shadow-md transition-all"
          >
            {isLoggedIn ? "Profile" : "Login"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
