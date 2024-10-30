import React from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import animationData from '../animationData/404.json';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{t('page_not_found')}</h1>
      <Lottie options={defaultOptions} height={300} width={400} />
      <p className="text-gray-600 mb-8">{t('page_not_found_description')}</p>
      <Link to="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300">
        {t('back_to_home')}
      </Link>
    </div>
  );
}

export default NotFoundPage;