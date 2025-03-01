import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-6 text-center text-sm">
      <div className="container mx-auto flex flex-col justify-center items-center px-6 text-center">
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;