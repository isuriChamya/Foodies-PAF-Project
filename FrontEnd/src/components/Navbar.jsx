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
    <div className="w-full shadow-md">
      {/* Top Blue Strip */}
      <div className="bg-blue-900 text-white text-sm py-2 px-6 flex justify-between items-center w-full">
        <div>
          <span className="mr-4">📞 01122562378</span>
          <span>✉️ demo.mail@info.com</span>
        </div>
        <div>
          <span>🌐 English</span>
        </div>
      </div>

      {/* Full-Width Gradient Navbar */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 text-white py-4 w-full shadow-sm">
        <div className="flex items-center justify-between flex-wrap px-6 w-full">
          {/* Logo */}
          <Link to={"/"}>
            <div className="text-white text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform">
              FOODIE
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center flex-wrap gap-x-6 gap-y-4 text-sm font-medium">
            <Link to={"/"} className="hover:underline hover:text-blue-100 transition">
              Posts
            </Link>
            <Link to={"/plans"} className="hover:underline hover:text-blue-100 transition">
              Plans
            </Link>
            <Link to={"/progress"} className="hover:underline hover:text-blue-100 transition">
              Progresses
            </Link>

            <Link to={"/notifications"} className="hover:text-blue-200 transition">
              <Bell className="w-5 h-5" />
            </Link>

            <Link to={"/chat"} className="hover:text-blue-200 transition">
              <MessageCircle className="w-5 h-5" />
            </Link>

            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="ml-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded-full hover:bg-blue-100 transition"
            >
              {isLoggedIn ? "Profile" : "Login"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
