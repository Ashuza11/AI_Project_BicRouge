import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/imgs/loginBg.png'; 
import Button from '../components/Button';
import Login from '../components/Login';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';


const LoginPage = () => {
  const { userRole, setUserRole } = useContext(UserContext);
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('language', selectedLanguage);
  };

  useEffect(() => {
    setUserRole('student');
  }
  , [setUserRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <select
          onChange={handleLanguageChange} defaultValue={i18n.language}
          className="bg-gray-100 text-gray-800 font-poppins p-1 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left side with the logo and background image */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gray-100 p-6">
          <img src={backgroundImage} alt="Background" className="w-full h-auto object-cover rounded-lg" />
          
          <p className="mt-4 text-center text-sm text-secondary">
            {t('background_description')}
          </p>
        </div>

        {/* Right side with the login form */}
        <div className="flex flex-col justify-center p-6 space-y-6">
          <h2 className="text-2xl font-poppins font-bold text-center text-secondary">
            {t('welcome_back')}
          </h2>

          <p className="text-center text-sm text-secondary">
            {t('join_for_free')}
          </p>

          <div className="flex border">
            <Button 
              primary={userRole === 'student'} 
              onClick={() => setUserRole('student')}
            > 
              {t('student')}
            </Button>
            <Button 
              primary={userRole === 'teacher'} 
              onClick={() => setUserRole('teacher')}
            >
              {t('teacher')}
            </Button>
          </div>

          {/* Lgin user  */}
          <Login role={userRole} t={t} />

          <p className="text-center text-sm text-secondary">
            {t('no_account')}{' '}
            <Link to={`/signup?role=${userRole}`} className="text-primary">
              {t('create_account')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;