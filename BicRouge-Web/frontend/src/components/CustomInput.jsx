import { useState } from 'react';

const CustomInput = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value} // Controlled component value
        onChange={(e) => {
          onChange(e); // Update parent state on change
          setIsFocused(e.target.value !== ''); // Set focus state based on input value
        }}
        className={`block w-full appearance-none bg-background border-0 border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:ring-0 focus:border-primary
          ${isFocused || value ? 'pt-2' : 'pt-6'}`} // Adjust padding based on focus or value
        onFocus={() => setIsFocused(true)} // Set focus state to true
        onBlur={() => setIsFocused(value !== '')} // Remove focus if the input is empty
        required
      />
      <label
        className={`absolute left-4 transition-all duration-200 ease-in-out text-gray-500
          ${isFocused || value ? 'opacity-0' : 'top-2 text-base opacity-100'}`} // Hide label when focused or having a value
      >
        {label}
      </label>
    </div>
  );
};

export default CustomInput;
