import  { useState, useContext } from 'react';
import CustomInput from './CustomInput';
import { UserContext } from '../context/UserContext';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { joinCourseQuery } from '../query/coursesQuery';
import { createCourseQuery } from '../query/coursesQuery';
import { ClipLoader } from 'react-spinners';
import CustomSelect from './CustomSelect';
import { t } from 'i18next';

export const CreateClassForm = ({ onClose }) => {
  const [courseName, setCourseName] = useState('');
  const [section, setSection] = useState('');
  const [codeCourse, setCodeCourse] = useState('');
  const {userRole, idUser, refetchCourses} = useContext(UserContext);
  const { showToast } = useToast();
  const [selectedValue, setSelectedValue] = useState('');



  const options = [
    { value: 'Sciences', label: t('sciences') },
    { value: 'Sociales', label: t('humanities_and_social_sciences') },
    { value: 'Langues', label: t('languages') },
    { value: 'Maths', label: t('mathematics') },
    { value: 'Informatique', label: t('computer_science') },
  ];



  const mutationCreateCourse = useMutation ({
    mutationFn : createCourseQuery,

    onSuccess : (data) => {
      showToast(t('course_created_successfully'), "success");
      refetchCourses();
    },

    onError : (error) => {
      showToast(t('course_creation_error'), "destructive");
    }
  });

  const mutationJoinCourse = useMutation ({
    mutationFn : joinCourseQuery,

    onSuccess : (data) => {
      showToast(t('course_enrollment_success'), "success");
      refetchCourses();
    },

    onError : (error) => {
      showToast(t('course_enrollment_failed'), "destructive");
    }
  });

  const handleSubmitCreateCourse = (e) => {
    e.preventDefault();
    mutationCreateCourse.mutate({courseName,section, selectedValue, idUser});

    onClose();
  };

  const handleSubmitJoinCourse = (e) => {
    e.preventDefault();
    mutationJoinCourse.mutate({idUser, codeCourse});

    onClose();
  };

  return (
    (userRole === "student" ) ? (
      <form onSubmit={handleSubmitJoinCourse} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{t('join_course')}</h2>
      </div>

      <CustomInput 
        label={t('course_code')} 
        value={codeCourse} 
        onChange={(e) => setCodeCourse(e.target.value)} 
      />

      <div className="flex justify-end space-x-2">
          <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700 text-white"
                onClick={onClose}
              >
              {t('cancel')}
          </button>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          disabled={mutationJoinCourse.isLoading}
        >
          {mutationJoinCourse.isLoading ? <ClipLoader color="#fff" size={22} /> : t('join')} 
        </button>
      </div>
      </form>
    ) : (
      <form onSubmit={handleSubmitCreateCourse} className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{t('create_course')}</h2>
        </div>

        <CustomInput 
          label={t('course_title_required')}
          value={courseName} 
          onChange={(e) => setCourseName(e.target.value)} 
        />
        <CustomInput 
          label={t('section')}
          value={section} 
          onChange={(e) => setSection(e.target.value)} 
        />
        <CustomSelect 
          label={t('select_option')} 
          value={selectedValue} 
          onChange={(e) => setSelectedValue(e.target.value)}
          options={options}
        />

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-gray-600 hover:bg-gray-700 text-white"
            onClick={onClose}
          >
            {t('cancel')}
          </button>

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            {t('create')}
          </button>
        </div>
      </form> 
    )
  );
};