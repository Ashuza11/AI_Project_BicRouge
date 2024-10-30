import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import DashboardHeader from '../layout/DashboardHeader';
import DashboardSideBar from '../layout/DashboardSideBar';
import SidebarProvider from '../context/SideBarContext';
import { UserContext } from "../context/UserContext";
import { useTranslation } from "react-i18next";

const CourseDetail = () => {
    const { pathname } = useLocation()
    const { userRole } = useContext(UserContext);
    const { t } = useTranslation();
    


    const tabs = (userRole === 'teacher') ? 
    [ {
        title: t('flux'), path:"flux"
     },  {
        title: t('task'), path:"tache"
     },  {
        title: t('learners'), path:"apprenants"
     },  {
        title: t('grades'), path:"notes"
     }] : 
    [{
        title: t('flux'), path:"flux"
     },  {
        title: t('grades'), path:"notes"
        },  {
        title: t('learners'), path:"apprenants"
     }];

    return (
        <SidebarProvider>
            <div className='max-h-screen flex flex-col'>
                <DashboardHeader />
                <div className='grid grid-cols-[auto,1fr] h-[calc(100vh-65px)]'>
                    <div className='bg-white border-r  overflow-auto'>
                        <DashboardSideBar />
                    </div>

                    <div className="overflow-auto">
                        <nav className="flex justify-between items-center pt-4 px-6 mb-6 bg-white border-b sticky top-0 z-30 border-gray-200">
                            <div className="flex space-x-8">
                                {tabs.map((tab) => (
                                    <Link to={tab.path} key={tab.path}>
                                        <button
                                            className={`${
                                                pathname.includes(tab.path)
                                                    ? "text-red-600 border-b-2 border-red-600"
                                                    : "text-secondary hover:text-secondary-dark"
                                            } pb-4`}
                                        >
                                            {tab.title}
                                        </button>
                                    </Link>
                                    
                                ))}
                            </div>
                        </nav>

                        <div className='mx-4'>
                            <Outlet/>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default CourseDetail;
