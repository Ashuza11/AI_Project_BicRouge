import { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ClipLoader } from 'react-spinners';
import { useToast } from '../context/ToastContext';
import { ClipboardList, Copy } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useCourse from '../hooks/useCourse';
import useAssignmentsStudent from '../hooks/useAssignmentsStudent';
import { Informatique, Langues, Maths, Sciences, Sociales } from '../assets/imgs/courseBg/imgs';
import UserProfile from './UserProfile';
import { useTranslation } from 'react-i18next';

const subjectImageMap = {
  'Informatique': Informatique,
  'Langues': Langues,
  'Maths': Maths,
  'Sciences': Sciences,
  'Sociales': Sociales,
};

const CourseStream = () => {
  const { userRole, userData } = useContext(UserContext);
  const params = useParams();
  const { showToast } = useToast();
  const { selectedCourse } = useCourse(params.course_id);
  const courseId = params.course_id;
  const { t } = useTranslation();



  const { assignmentsStudent, dataStudentAssignment, isLoadingAssignmentsStudent, isLoadingAssignments } = useAssignmentsStudent(courseId);

  console.log(assignmentsStudent);
  // Inform student about the upcoming assignment
  const handleClick = () => {
    showToast(t("dont_close_page"), 'info');
  };

  // Function to copy text to the clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text); 
      showToast(t('code_copied'), "success");
    } catch (err) {
      console.error("Failed to copy text: ", err); 
    }
  };

  
  // Helper function to get the upcoming assignment message
  const getCurrentWorkMessage = () => {
    if (assignmentsStudent && assignmentsStudent.length > 0) {
      // Find the nearest due date
      const upcomingAssignment = assignmentsStudent.reduce((nearest, assignment) => {
        const dueDate = new Date(assignment.due_date);
        if (!nearest || dueDate < new Date(nearest.due_date)) {
          return assignment;
        }
        return nearest;
      }, null);
  
      if (upcomingAssignment) {
        const now = new Date();
        const dueDate = new Date(upcomingAssignment.due_date);
        if (dueDate > now) {
          return `${t('due_on')} ${format(dueDate, 'dd-MM-yyyy')}` +`${t('published_at')}` + `${format(dueDate, 'hh:mm a')}`+ `- ${upcomingAssignment.title.length > 20 ? upcomingAssignment.title.substring(0, 17) + '...' : upcomingAssignment.title}`;
        }
      }
    }
    return userRole === "student" ? t('hooray') + t('nothing_due_soon') : t('nothing_due_soon');
  };

  // Determine the image based on the subject
  const courseImage = subjectImageMap[selectedCourse?.subject];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div>
        <div className="relative w-full max-w-5xl">
          <img
            src={courseImage}
            alt="Header"
            className="w-full h-64 object-cover rounded-lg"
          />

          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-xl font-bold">{selectedCourse?.name}</h1>
            <p className="text-sm">{selectedCourse?.teacher_name}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-6">
          <div className="flex flex-col gap-4 lg:w-1/3">
            {userRole === "teacher" && (
              <div className="border rounded-lg p-6 flex flex-col items-start bg-white">
                <h2 className="text-sm font-semibold mb-2">{t('course_code')}</h2>
                <div className="flex items-center justify-between w-full">
                  <p className="text-red-600 text-lg font-semibold">{selectedCourse?.code}</p>
                  <button
                    className="text-primary"
                    onClick={() => copyToClipboard(selectedCourse?.code || '')} 
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            )}
            {/* Current Work */}
            <div className="border rounded-lg p-4 flex flex-col items-start bg-white">
              <h2 className="text-xm font-bold mb-2">{t('upcoming')}</h2>
              <p className="text-gray-500 text-xs">{getCurrentWorkMessage()}</p>
              {userRole === 'student' ? (
                <Link to={`/student/course/${courseId}/notes`}> 
                  <button className="text-red-600 text-xs text-left font-semibold mt-2">{t('see_all')}</button>
                </Link>
              ) : (
                <Link to={`/teacher/course/${courseId}/tache`} > 
                  <button className="text-red-600 text-xs text-left font-semibold mt-2">{t('see_all')}</button>
                </Link>
              )}
            </div>
          </div>

          <div className='lg:w-2/3'>
            <div className="flex-grow border rounded-lg p-4 flex items-center bg-white shadow-md h-16">
              <UserProfile userData={userData} />
              <div className="flex-grow ml-3 text-gray-600 text-sm">
                {t('course_announcements')}
              </div>
            </div>

            <div>
              {/* Display assignment for the student if it exists */}
              {userRole === "student" ? (
                isLoadingAssignmentsStudent ? (
                  <ClipLoader color="#D32F2F" className="flex justify-center" size={50} />
                ) : (dataStudentAssignment && dataStudentAssignment.length > 0) ? (
                  dataStudentAssignment
                    .slice()
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((assignment) => (
                    <Link 
                      to={`/${userRole}/courses/${courseId}/assignments/${assignment.id}`}
                      key={assignment.id}
                      state={{
                        title: assignment.title,
                        instruction: assignment.instruction,
                        courseId: courseId,
                        assignmentId: assignment.id,
                        assignmentDueDate: assignment.due_date
                      }}
                      onClick={handleClick} 
                    >
                    {assignment?.composition == true && (
                      <div className="flex mt-4 border rounded-lg items-center bg-white gap-2">
                        <div className="flex-grow hover:border rounded-lg p-4 flex items-center cursor-pointer justify-between hover:bg-white h-16">
                          <div className="flex items-center space-x-2">
                            <div className="bg-accent p-2 rounded-full">
                              <ClipboardList size={24} className="text-primary" />
                            </div>
                            <h2 className="text-sm">{assignment?.title.length > 55 ? assignment?.title.substring(0, 50) + '...' : assignment?.title }</h2>
                          </div>

                            <div className="text-gray-600 text-sm">
                              {t('published_on')} {format(new Date(assignment?.updated_at), 'dd-MM-yyyy')} {t('published_at')} {format(new Date(assignment?.updated_at), 'HH:mm')}
                            </div>
                        </div>
                      </div>
                      )}
                    </Link>  
                  ))
                ) : null
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseStream;
