import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import HomeImage from '../assets/imgs/backgroundImage.png';
import Logo from '../assets/imgs/Logo.svg';
import { UserContext } from '../context/UserContext';

const HomePage = ({message}) => {
  const { setUserRole } = useContext(UserContext);
  const { t, i18n } = useTranslation(); 

  const handleRoleSelection = (role) => {
    setUserRole(role);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      
      <div className="absolute top-4 right-4">
        <select
          onChange={handleLanguageChange} defaultValue={i18n.language}
          className="bg-gray-100 text-gray-800 font-poppins p-1 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side with the combined image */}
        <div className="flex justify-center items-center w-full order-2 lg:order-1">
          <img src={HomeImage} alt="Combined Image" className="w-auto" />
        </div>

        {/* Right side with text and buttons */}
        <div className="flex flex-col justify-center text-center lg:justify-center space-y-8 order-1 lg:order-2">
          <img src={Logo} alt="BicRouge Logo" className="mx-auto h-24" />
          <h1 className="text-3xl md:text-4xl font-poppins font-bold text-secondary py-3">
            {t('simplify_learning_teaching', { message })}
          </h1>
          <p className="text-lg text-secondary">
            {t('teachers_manage_courses')}
          </p>
          <p className="text-lg text-secondary">
            {t('students_access_learning')}
          </p>
          <div className="flex justify-center lg:justify-center space-x-6">
            <Link 
              to="/login" 
              className="bg-primary text-white font-roboto px-6 py-2 rounded hover:bg-primary-dark"
              onClick={() => handleRoleSelection('teacher')}
            >
              {t('welcome')} {/* Translated welcome text */}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
