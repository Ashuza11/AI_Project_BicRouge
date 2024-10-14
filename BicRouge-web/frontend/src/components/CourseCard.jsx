import { useContext, useState } from 'react';
import { MoreVertical, FileCheck } from 'lucide-react';
import TeacherImage from '../assets/imgs/userprofilepic.png';
import useCourse from '../hooks/useCourse';
import { Informatique, Langues, Maths, Sciences, Sociales } from '../assets/imgs/courseBg/imgs';
import UserProfile from './UserProfile';
import { UserContext } from '../context/UserContext';


const subjectImageMap = {
  'Informatique': Informatique,
  'Langues': Langues,
  'Maths': Maths,
  'Sciences': Sciences,
  'Sociales': Sociales,
};

export const CourseCard = ({ course_id, name, section, teacher_name }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const {userData} = useContext(UserContext);
  const { selectedCourse } = useCourse(course_id);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Determine the image based on the subject
  const courseImage = subjectImageMap[selectedCourse?.subject];

  return (
    <div className="relative cursor-pointer bg-white shadow-md rounded-lg max-w-sm w-[300px] h-[300px] flex flex-col justify-between">
      <div className="">
        <div 
          className="flex justify-between items-start p-4 h-[105px] rounded-t-lg"
          style={{
            backgroundImage: `url(${courseImage})`,
            backgroundSize: 'cover',  
            backgroundPosition: 'center',  
            backgroundRepeat: 'no-repeat'  
          }}
        >
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-white truncate">
              {name.length > 15 ? `${name.substring(0, 25)}...` : name}
            </h3>
            <p className="text-xs text-white pb-[10px] truncate">{section}</p>
            <p className="text-xs text-white truncate">{teacher_name}</p>
          </div>

          <div className="relative">
            <button onClick={togglePopup} className="inline-flex justify-center w-full text-sm font-medium text-white">
              <MoreVertical className="w-5 h-5" aria-hidden="true" />
            </button>
            {/* {isPopupOpen && (
              // <div className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              //   <div className="py-1">
              //     <button
              //       className="text-gray-700 group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              //       onClick={() => alert('Move clicked')}
              //     >
              //       Déplacer
              //     </button>
              //     <button
              //       className="text-gray-700 group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
              //       onClick={() => alert('Unenroll clicked')}
              //     >
              //       Se désinscrire
              //     </button>
              //   </div>
              // </div>
            )} */}
          </div>
        </div>

        <div className="absolute top-[20%] right-[20%] transform translate-x-4 translate-y-4">
          <UserProfile userData={userData} selectedCourse={selectedCourse} size="large" />
        </div>
      </div>

      <div className="flex justify-end px-4 py-4">
        <button className="flex items-center justify-center w-8 h-8 bg-background rounded-full shadow-md">
          <FileCheck className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
