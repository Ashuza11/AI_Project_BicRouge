import { useState } from 'react';

const CustomSelect = ({ label, value, onChange, options }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4">
      <select
        value={value}
        onChange={(e) => {
          onChange(e); // Update parent state on change
          setIsFocused(e.target.value !== ''); // Set focus state based on select value
        }}
        className={`block w-full appearance-none bg-background border-0 border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:ring-0 focus:border-primary
          ${isFocused || value ? 'pt-2' : 'pt-6'}`} // Adjust padding based on focus or value
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value !== '')}
        required
      >
        <option value="" disabled hidden>{label}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      <label
        className={`absolute left-4 transition-all duration-200 ease-in-out text-gray-500
          ${isFocused || value ? 'opacity-0' : 'opacity-0'} top-2 text-xs`} // Hide label when focused or when a value is selected
      >
        {label}
      </label>
    </div>
  );
};

export default CustomSelect;
