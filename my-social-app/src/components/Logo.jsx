import React from "react";

const Logo = ({ className = "" }) => {
  return (
    <svg
      className={`h-8 w-8 text-amber-600 dark:text-amber-400 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RealEcho Logo"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c-2.5 0-4.5 2-4.5 4.5 0 1.5.8 2.8 2 3.7-.8 1.2-1.5 2.5-1.5 4 0 3.5 3 6.3 6.5 6.3s6.5-2.8 6.5-6.3c0-1.5-.7-2.8-1.5-4 1.2-.9 2-2.2 2-3.7C16.5 5 14.5 3 12 3zm0 2c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5S10.6 5 12 5zm-2 8c0-1.5 1.2-2.7 2.7-2.7s2.7 1.2 2.7 2.7"
      />
    </svg>
  );
};

export default Logo;
