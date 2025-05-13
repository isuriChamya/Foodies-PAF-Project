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
      <div className="bg-blue-600 text-white text-sm py-1 px-8 flex justify-between items-center">
        <div>
          <span className="mr-4">📞 +320 9254 021</span>
          <span>✉️ demo.mail@info.com</span>
        </div>
        <div>
          <span>🌐 English</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-blue-100 px-8 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to={"/"}>
            <div className="text-blue-600 text-3xl font-extrabold tracking-wide hover:scale-105 transition-transform">
              FOODIE
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8 text-gray-800 font-medium text-sm">
            <Link to={"/"} className="relative group transition-all">
              Posts
              <span className="block absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link to={"/plans"} className="relative group transition-all">
              Plans
              <span className="block absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link to={"/progress"} className="relative group transition-all">
              Progresses
              <span className="block absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to={"/notifications"}
              className="hover:text-blue-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <Link
              to={"/chat"}
              className="hover:text-blue-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>

            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all text-sm shadow"
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
