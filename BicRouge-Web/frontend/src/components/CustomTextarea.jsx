import { useState } from 'react';

const CustomTextarea = ({ label, value, onChange  }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="relative mb-4">
            <textarea
                type="text"
                value={value} // Controlled component value
                onChange={onChange} // Update parent state on change
                className={`block w-full appearance-none bg-background border-0 border-b-2 border-gray-300 py-2 px-4 focus:outline-none focus:ring-0 focus:border-primary 
                ${isFocused || value ? 'pt-6' : 'pt-2'}`} // Adjust padding based on focus or value
                onFocus={() => setIsFocused(true)} // Set focus state to true
                onBlur={() => setIsFocused(value !== '')} // Remove focus if the input is empty
                required
            />
            <label
                className={`absolute left-4 top-2 transition-all duration-200 ease-in-out text-gray-500 
                    ${isFocused || value ? '-top-3.5 text-xs opacity-0' : 'text-base'}`}
            >
                {label}
            </label>
        </div>
    )
}

export default CustomTextarea