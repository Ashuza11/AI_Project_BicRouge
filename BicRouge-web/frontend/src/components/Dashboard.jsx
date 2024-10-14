import { useContext, useEffect } from 'react';
import DashboardHeader from '../layout/DashboardHeader';
import DashboardSideBar from '../layout/DashboardSideBar';
import SidebarProvider from '../context/SideBarContext';
import { getCoursUser } from '../query/coursesQuery';
import { getCoursStudent } from '../query/coursesQuery';
import { CourseCard } from './CourseCard';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from '../context/UserContext';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { userRole, idUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();


  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') || 'fr'; 
    i18n.changeLanguage(storedLanguage); 
  }, [i18n]);

  // for teacher
  const { data : cours, isLoading } = useQuery({
    queryKey: ['cours'],
    queryFn: getCoursUser,
  });


  // for student
  const { data: coursStudent, isLoading: isLoadingCoursStudent } = useQuery({
    queryKey: ['coursStudent', { idUser }],
    queryFn: getCoursStudent,
  });


  const handleCourseClick = (course) => {
    navigate(`/${userRole}/course/${course.id}/flux`);
  };

  return (
    <SidebarProvider>
      <div className='max-h-screen flex flex-col'>
        <DashboardHeader />

        <div className='grid grid-cols-[auto,1fr] h-[calc(100vh-65px)] '>
          <div className='bg-white border-r overflow-auto'>
            <DashboardSideBar />  
          </div>

          {/* display all courses for a teacher*/}
          <div className='p-8 flex flex-wrap justify-start overflow-auto gap-4'>
            { 
              (userRole === "teacher") ? (
                isLoading ? (
                  <ClipLoader color="#D32F2F" className="flex justify-center" size={22} />
                ) : (cours && cours.length > 0) ? (
                  cours
                  .slice()
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((cour) => (
                    <div 
                      key = {cour.id} 
                      onClick={()=> handleCourseClick(cour)}
                     >
                      <CourseCard 
                        course_id = {cour.id}
                        name = {cour.name}
                        section = {cour.section}
                        teacher_name = {cour.teacher_name}
                      />
                    </div>
                  ))
                ) : (
                  <p className='w-full h-full'>{t('noCourses')}</p>
                )
              ) : (
                isLoadingCoursStudent ? (
                  <ClipLoader color="#D32F2F" className="flex justify-center" size={22} />
                ) : (coursStudent && coursStudent.length > 0) ? (
                  coursStudent
                    .slice()
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((cour) => (
                    <div 
                      key = {cour.id} 
                      onClick={()=> handleCourseClick(cour)}
                    >
                      
                      <CourseCard 
                        course_id = {cour.id}
                        name = {cour.name}
                        section = {cour.section}
                        teacher_name = {cour.teacher_name}
                      />
                      
                    </div>
                  ))
                ) : (
                  <p className='w-full h-full'>{t('noCourses')}</p>
                )
              )
            }
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Dashboard;