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
    <div className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 rounded-xl px-6 py-3 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <div className="text-white text-2xl font-bold tracking-wider hover:scale-105 transition-transform">
            FOODIE
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-8">
          <Link 
            to={"/"} 
            className="text-black hover:text-orange-100 transition-colors relative group"
          >
            <span className="relative">
              Posts
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </span>
          </Link>
          
          <Link 
            to={"/plans"} 
            className="text-white hover:text-orange-100 transition-colors relative group"
          >
            <span className="relative">
              Plans
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </span>
          </Link>
          
          <Link 
            to={"/progress"} 
            className="text-white hover:text-orange-100 transition-colors relative group"
          >
            <span className="relative">
              Progresses
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
            </span>
          </Link>
          
          <Link 
            to={"/notifications"} 
            className="text-white hover:text-orange-100 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <Bell className="w-5 h-5" />
          </Link>
          <Link 
            to={"/chat"} 
            className="text-white hover:text-orange-100 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <MessageCircle className="w-5 h-5" />
          </Link>
          
          <Link
            to={isLoggedIn ? "/profile" : "/login"}
            className="bg-white text-rose-500 font-medium px-6 py-2 rounded-full hover:bg-orange-50 transition-all hover:shadow-md"
          >
            {isLoggedIn ? "Profile" : "Login"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
