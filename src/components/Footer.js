import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full bg-black py-12">
      <div className="container mx-auto px-6">
        <footer className="bg-black p-8 rounded-lg shadow-lg text-white">
          <div className="flex flex-col sm:flex-row justify-between items-center text-white">
            <div className="flex items-center space-x-3 mb-6 sm:mb-0">
              <a 
                href="/" 
                className="text-4xl text-white no-underline font-semibold"
                aria-label="Food App Home"
              >
                <span role="img" aria-label="food">🍽️</span>
              </a>
              <span className="text-sm sm:text-lg opacity-80">
                © {currentYear} <i>Food App</i>, Inc. All rights reserved.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row text-center sm:text-left space-y-3 sm:space-y-0">
              <a 
                className="text-white hover:text-gray-300 mx-4 text-lg transition-all duration-200"
                href="/privacy-policy"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a 
                className="text-white hover:text-gray-300 mx-4 text-lg transition-all duration-200"
                href="/terms-and-conditions"
                aria-label="Terms & Conditions"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
