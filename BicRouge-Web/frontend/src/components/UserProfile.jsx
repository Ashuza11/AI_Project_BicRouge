import React from 'react';
import DashboardButton from './DashboardButton';

// Function to generate initials from a name
const generateInitials = (name, postname) => {
  const firstInitial = name?.charAt(0).toUpperCase() || '';
  const postInitial = postname?.charAt(0).toUpperCase() || '';
  return `${firstInitial}${postInitial}`;
};

// Function to determine the background color based on a string input
const generateBackgroundColor = (input) => {
  const colors = [
    'bg-red-500', 
    'bg-green-500', 
    'bg-blue-500', 
    'bg-pink-500', 
    'bg-orange-500', 
    'bg-purple-500', 
    'bg-teal-500', 
    'bg-yellow-500'
  ];
  
  // Generate a consistent hash from the input string to pick a color
  const hash = [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

// Function to determine the text color for better contrast
const getTextColor = (bgColor) => {
  return ['bg-yellow-500', 'bg-green-500'].includes(bgColor) ? 'text-black' : 'text-white';
};

const UserProfile = ({ userData, selectedCourse, size = 'small' }) => {
  // Determine if we should display the teacher's initials/profile or the current user
  const isCourseCard = !!selectedCourse;
  const displayData = isCourseCard 
    ? { 
        name: selectedCourse?.teacher_name?.split(' ')[0] || '', 
        postname: selectedCourse?.teacher_name?.split(' ')[1] || '' 
      }
    : userData || {}; 

  // Generate initials and background color for the profile, ensuring fallback values
  const initials = generateInitials(displayData.name || '', displayData.postname || '');
  const bgColor = generateBackgroundColor(`${displayData.name || ''}${displayData.postname || ''}`);
  const textColor = getTextColor(bgColor);

  // Determine size based on the prop
  const sizeClass = size === 'large' ? 'w-12 h-12 md:w-16 md:h-16' : 'w-8 h-8 md:w-10 md:h-10';

  return (
    <DashboardButton
      variant="ghost"
      size="icon"
      className={`${sizeClass} ${bgColor} ${textColor} rounded-full flex items-center justify-center font-bold text-sm md:text-base`}
    >
      {initials || '?'} 
    </DashboardButton>
  );
};

export default UserProfile;
