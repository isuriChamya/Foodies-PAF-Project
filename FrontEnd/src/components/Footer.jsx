import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
      <div className="container mx-auto px-4">
        © {new Date().getFullYear()} YourCompany. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
