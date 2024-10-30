import React from 'react';

const Button = ({ children, primary, secondary, ...props }) => {
  let className = "w-full py-2 rounded ";

  if (primary) {
    className += "bg-primary text-white hover:bg-primary-dark transition-all transition-all duration-500 ease-in-out hover:shadow-lg";
  } else if (secondary) {
    className += "bg-secondary text-white hover:bg-secondary-dark transition-all duration-300 ease-in-out";
  } else {
    className += "bg-transparent text-primary hover:bg-background hover:text-red transition-all duration-500 ease-in-out";
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;