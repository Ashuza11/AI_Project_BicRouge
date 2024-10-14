import { useContext } from "react";
import { UserPlus } from "lucide-react";
import { UserContext } from '../context/UserContext';
import DashboardButton from '../components/DashboardButton';
import { useParams } from 'react-router-dom';
import { useCourseParticipants } from '../hooks/useCourseParticipants';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from "react-i18next";

const CourseStudents = () => {
  const { course_id } = useParams();
  const { userRole } = useContext(UserContext); 
  const { courseParticipants, isLoading } = useCourseParticipants(course_id);
  const { t } = useTranslation();


  // Student Profile pic 
  const getInitials = (name) => {
    if (!name) return '';
    const [firstName, lastName] = name.split(' ');
    const firstNameInitial = firstName?.charAt(0).toUpperCase();
    const lastNameInitial = lastName?.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  };

  if (isLoading) {
    return <ClipLoader color="#D32F2F" className="flex justify-center" size={50} />
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {/* Teachers Section */}
      <div className="mb-10">
        <h2 className="text-2xl mb-2">{t('teacher')}</h2>
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          {/* Teacher Info */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              {/* Display teacher initials */}
              <span className="text-sm font-semibold">
                {getInitials(courseParticipants?.teacher?.name)}
              </span>
            </div>
            <span className="text-sm font-semibold">
              {courseParticipants?.teacher?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Students Section */}
      <div>
        <h2 className="text-2xl mb-2">{t('students')}</h2>
        <div className="flex items-center justify-between py-1 border-b border-gray-200">
          <div></div>
          {/* Student Count and Add User */}
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">{courseParticipants?.students.length} {t('students')}</span>
            {userRole === 'teacher' && (
              <DashboardButton variant="ghost" size="icon">
                <UserPlus />
              </DashboardButton>
            )}
          </div>
        </div>

        {/* Student List */}
        {courseParticipants?.students.map((student) => (
          <div
            key={student.id}
            className={`transition-all duration-300 rounded-lg p-2 mb-3 mt-2 flex items-center justify-between ${
              userRole === 'teacher' ? 'hover:bg-white cursor-pointer hover:border' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              {userRole === 'teacher' && (
                <input type="checkbox" className="form-checkbox w-4 h-4 text-gray-600 rounded" />
              )}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {/* Display student initials */}
                <span className="text-sm font-semibold">
                  {getInitials(student.name)}
                </span>
              </div>
              <span className="text-sm font-semibold">{student.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseStudents;
