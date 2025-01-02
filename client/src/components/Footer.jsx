import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm text-gray-400 sm:text-center">
          © 2023 <a href="https://flowbite.com/" className="hover:underline">Flowbite™</a>. All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
          <li className="mr-4 md:mr-6">
            <a href="#" className="hover:underline">About</a>
          </li>
          <li className="mr-4 md:mr-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
          </li>
          <li className="mr-4 md:mr-6">
            <a href="#" className="hover:underline">Licensing</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;