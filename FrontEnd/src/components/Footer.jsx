import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 text-white pt-16 pb-8">
      {/* Wave top */}
      <div className="absolute top-0 left-0 w-full h-20 bg-blue-900 rounded-b-[100%] z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-wrap justify-between text-sm">
        {/* Column 1 */}
        <div className="mb-8 min-w-[200px]">
          <h4 className="font-bold text-lg mb-4">LOGO</h4>
          <a href="#" className="block mb-2 hover:underline">Start</a>
          <a href="#" className="block mb-2 hover:underline">Documentation</a>
          <a href="#" className="block mb-2 hover:underline">Installation</a>
        </div>

        {/* Column 2 */}
        <div className="mb-8 min-w-[200px]">
          <h4 className="font-bold text-lg mb-4">COMPANY</h4>
          <a href="#" className="block mb-2 hover:underline">Contact</a>
          <a href="#" className="block mb-2 hover:underline">News</a>
          <a href="#" className="block mb-2 hover:underline">Careers</a>
          <h4 className="font-bold text-lg mt-4 mb-2">LEGAL</h4>
          <a href="#" className="block mb-2 hover:underline">Privacy Notice</a>
          <a href="#" className="block mb-2 hover:underline">Terms of Use</a>
        </div>

        {/* Column 3 */}
        <div className="mb-8 min-w-[200px]">
          <h4 className="font-bold text-lg mb-4">QUICK LINKS</h4>
          <a href="#" className="block mb-2 hover:underline">Support Center</a>
          <a href="#" className="block mb-2 hover:underline">Service Status</a>
          <a href="#" className="block mb-2 hover:underline">Security</a>
          <a href="#" className="block mb-2 hover:underline">Blog</a>
          <a href="#" className="block mb-2 hover:underline">Customers</a>
          <a href="#" className="block mb-2 hover:underline">Reviews</a>
        </div>

        {/* Column 4 */}
        <div className="mb-8 min-w-[200px]">
          <h4 className="font-bold text-lg mb-4">LET'S CHAT</h4>
          <p className="mb-2">Have a support question?</p>
          <button className="mt-2 bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition">
            GET IN TOUCH
          </button>
          <div className="mt-4 font-bold">YOU CALL US</div>
          <div>0124-64XXXX</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 mt-10 border-t border-white/20 pt-6 text-center text-sm">
        <div className="flex justify-center gap-4 mb-4">
          <img className="w-6 h-6 invert" src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg" alt="LinkedIn" />
          <img className="w-6 h-6 invert" src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg" alt="Twitter" />
          <img className="w-6 h-6 invert" src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg" alt="YouTube" />
          <img className="w-6 h-6 invert" src="https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/github.svg" alt="GitHub" />
        </div>
        <p>©{year} | Designed By: SMAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
