import { useCallback, useContext, useState } from 'react';
import { Home, GraduationCap, FileCheck, Settings, LogOut, Archive, Plus, BookOpen, ClipboardCheck, ChevronDown } from 'lucide-react';
import { buttonStyles } from '../components/DashboardButton';
import { twMerge } from 'tailwind-merge';
import { useSidebarContext } from '../context/SideBarContext';
import PageHeaderFirstSection from '../layout/DashboardHeader';
import { UserContext } from '../context/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCoursStudent, getCoursUser } from '../query/coursesQuery';
import { ClipLoader } from 'react-spinners';
import Modal from '../components/Modal';
import { CreateClassForm } from '../components/CreateClassForm';
import { useTranslation } from 'react-i18next';

const DashboardSideBar = () => {
  const { isLargeOpen, isSmallOpen, close, toggle } = useSidebarContext ();
  const { userRole, idUser, setToken } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();



  const openModal = (choice) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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


  const isActiveCourse = useCallback((courseId) => {
    const regex = new RegExp(`^/${userRole}/course/${courseId}`);
    return regex.test(location.pathname);
  },[userRole, location.pathname]);

  const isActiveSection = useCallback((section) => {
    const regex = new RegExp(`^/${userRole}/${section}`);
    return regex.test(location.pathname);
  },[userRole, location.pathname]);

  return (
    <>
      <aside 
        className={`sticky top-0 overflow-y-auto scrollbar-hidden pt-2 px-4 flex flex-col gap-2 
        ${ isLargeOpen ? 'lg:hidden' : 'lg:flex' }`}
      >
          <SmallSideBarItem IsActive Icon={Home} onClick={toggle} />
            <hr className='border-t' />
          <SmallSideBarItem Icon={GraduationCap} onClick={toggle} />
            <hr className='border-t' />
          <SmallSideBarItem Icon={Archive} onClick={toggle} />
          <SmallSideBarItem Icon={Settings} onClick={toggle} />
          <SmallSideBarItem Icon={LogOut}  onClick={toggle} />
      </aside>

      {isSmallOpen && (
        <div onClick={close} className='lg:hidden fixed inset-0 z-[999] bg-dashboardSecondary-dark opacity-50' />
      )}
      <aside 
        className={`w-56 lg:sticky absolute top-0 overflow-y-auto pt-2 pb-4 flex-col gap-2 px-2 
          ${ isLargeOpen ? 'lg:flex' : 'lg:hidden'} 
          ${isSmallOpen ? 'flex z-[999] bg-white max-h-screen pt-0 overflow-x-hidden' : 'hidden'}
        `}
      >
        <div className='lg:hidden sticky top-0 bg-white'>
          <PageHeaderFirstSection />
        </div>
        
        <LargeSidebarSection>
          <LargeSideBarItem
            IsActive={location.pathname == `/${userRole}/dashboard`}
            Icon={Home}
            title={t('home')}
            url={`/${userRole}/dashboard`}
          />
        </LargeSidebarSection>

        <hr className='border-t' />

        <LargeSidebarSection>
          {
            (userRole === "student") ? (
              <>
                <LargeSidebarSectionItem
                  title={t('course')}
                  Icon={GraduationCap}
                  defaultOpen={isActiveSection("course")}
                >
                  <LargeSideBarItem 
                    Icon={Plus} 
                    title={t('join_course')} 
                    onClick={openModal} 
                  />
                  {isLoadingCoursStudent ? (
                    <ClipLoader color="#D32F2F" className="flex justify-center" size={22} />
                  ) : (coursStudent && coursStudent.length > 0) ? (
                    coursStudent
                      .slice()
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))  
                      .map((course) => (
                      <LargeSideBarItem
                        key={course.id}
                        Icon={BookOpen}
                        title={course.name}
                        url={`/student/course/${course.id}/flux`}
                        IsActive={isActiveCourse(course.id)}
                      />
                    ))
                  ) : (
                    <p className='w-full h-full overflow-hidden text-ellipsis'>{t('noCourses')}</p>
                  )}
                </LargeSidebarSectionItem>
              </>
            ) : (
              <>
                <LargeSidebarSectionItem 
                  title={t('course')} 
                  Icon={GraduationCap}
                  defaultOpen={isActiveSection("course")}
                >
                  <LargeSideBarItem 
                    Icon={Plus} 
                    title={t('create_course')} 
                    onClick={openModal} 
                  />
                  {isLoading ? (
                    <ClipLoader color="#D32F2F" className="flex justify-center" size={22} />
                  ) : (cours && cours.length > 0) ? (
                    cours
                      .slice()
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((course) => (
                      <LargeSideBarItem
                        key={course.id}
                        Icon={BookOpen}
                        title={course.name}
                        url={`/teacher/course/${course.id}/flux`}
                        IsActive={isActiveCourse(course.id)}
                      />
                    ))
                  ) : (
                    <p className='w-full h-full overflow-hidden text-ellipsis'>{t('noCourses')}</p>
                  )}
                </LargeSidebarSectionItem>
              </>
            )
          }
        </LargeSidebarSection>

        <hr className='border-t' />

        <LargeSidebarSection>
          <LargeSideBarItem 
            Icon={Archive} 
            title={t('archived_courses')}
            url="/ArchivedCourses" 
          />
          <LargeSideBarItem 
            Icon={Settings} 
            title={t('settings')} 
            url="/parametres" 
          />
          <LargeSideBarItem
              Icon={LogOut}
              title={t('logout')}
              onClick={()=>{
              setToken(null); 
              localStorage.removeItem('awesomeToken');
            }}
          />
        </LargeSidebarSection>
      </aside>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
            <CreateClassForm onClose={closeModal}/>
      </Modal> 
    </>
  );
};

function SmallSideBarItem({ Icon, url, IsActive, onClick }) {
  const navigateTo = useNavigate()

  const handleClick = () => {
    if(url !== undefined) {
      navigateTo(url); // Navigate to the specified URL
    }
    if (onClick !== undefined) {
      onClick()
    }
  };

  return (
    <button
      onClick={handleClick}
      className={twMerge(buttonStyles({ variant: "ghost" }),
        `py-4 px-2 flex flex-col items-center rounded-lg gap-1 ${IsActive ? 'font-bold bg-primary-isActive hover:bg-primary-isActive' : undefined}`
      )}
    >
      <Icon className='w-6 h-6' />
    </button>
  );
}


function LargeSidebarSection({ children }) {
  return (
    <div className='flex flex-col gap-2'>
      {children}
    </div>
  )
}

function LargeSideBarItem({ Icon, title, url, IsActive, onClick  }) { 
  const navigateTo = useNavigate()

  const handleClick = () => {
    if(url !== undefined) {
      navigateTo(url); // Navigate to the specified URL
    }
    if (onClick !== undefined) {
      onClick()
    }
  };

  return (
    <button
      onClick={handleClick}
      className={twMerge(buttonStyles({ variant: "ghost" }),
        `w-full p-3 flex items-center rounded-lg gap-4 ${IsActive ? 'font-bold bg-primary-isActive hover:bg-primary-isActive' : undefined}`
      )}
    >
      <Icon className='w-6 h-6 shrink-0' />
      <span className='whitespace-nowrap overflow-hidden text-ellipsis'>{title}</span>
    </button>
  );
}

function LargeSidebarSectionItem({ title, Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="flex flex-col">
      <div
        onClick={toggleOpen}
        
        className={twMerge(buttonStyles({ variant: "ghost" }),
          "w-full p-3 flex items-center justify-between rounded-lg gap-4 cursor-pointer"
        )}
      >
        <div className="flex items-center gap-4">
          <Icon className='w-6 h-6' />

          <span className='whitespace-nowrap overflow-hidden text-ellipsis '>{title}</span>
        </div>

        <ChevronDown className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </div>

      {isOpen && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          {children}
        </div>
      )}
    </div>
  );
}


export default DashboardSideBar;