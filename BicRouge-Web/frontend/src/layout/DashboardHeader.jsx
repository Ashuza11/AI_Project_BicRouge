import { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Menu, Plus } from 'lucide-react'
import Logo from '../assets/imgs/Logo.svg'
import DashboardButton from '../components/DashboardButton'
import { useSidebarContext } from '../context/SideBarContext'
import Modal from '../components/Modal'
import { CreateClassForm } from '../components/CreateClassForm'
import { UserContext } from '../context/UserContext';
import UserProfile from '../components/UserProfile'
import { useTranslation } from 'react-i18next'

const DashboardHeader = () => {
  const {userRole, userData} = useContext(UserContext);
  const { t } = useTranslation();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const openModal = (choice) => {
    setIsModalOpen(true);
    togglePopup();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div className="bg-white sticky top-0 flex gap-10 lg:gap-20 justify-between pt-2 pb-2 px-4 border-b z-50">
        <PageHeaderFirstSection />    
        <div className='flex flex-shrink-0 md:gap-2'>
            <DashboardButton variant="ghost" size="icon" onClick={togglePopup}>
                <Plus />
            </DashboardButton>

            <DashboardButton variant="ghost" size="icon">
                <Bell />
            </DashboardButton>

            <UserProfile userData={userData} size="small" />

            {isPopupOpen && (
                <div className="absolute flex flex-col gap-2 top-10 right-20 bg-white text-black p-4 shadow z-50 rounded">
                    {
                        (userRole === "student") ? ( 
                            <DashboardButton
                              onClick={openModal}
                            >
                                {(t('join_course'))}
                            </DashboardButton>
                        ) :  (
                            <DashboardButton
                            onClick={openModal}
                            >
                                {(t('create_course'))}
                            </DashboardButton>
                        )
                    }
                </div>
            )}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <CreateClassForm onClose={closeModal}/>
        </Modal>    
    </div>
  )
}

export default DashboardHeader;

export function PageHeaderFirstSection() {
    const { toggle } = useSidebarContext()

    return <div 
        className='flex gap-4 items-center flex-shrink-0 overflow-x-hidden'>
        <DashboardButton onClick={toggle} variant="ghost" size="icon">
            <Menu />
        </DashboardButton>

        <Link 
            to="/Dashboard" 
        >
            <img src={Logo} alt="Logo" className="h-10 md:h-12" />
        </Link>
    </div>
}