import { useState, useEffect } from 'react';
import { BookOpen, ClipboardList, Edit3, FileText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import TaskPopup from './TaskPopup';
import useCourse from '../hooks/useCourse';
import { useQuery } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useStudentGradingForTeacher } from '../hooks/useAssignmentGrade';
import { useCourseParticipants } from '../hooks/useCourseParticipants';
import { FetchAllAssignmentsQuery } from '../query/AssignmentQuery';
import { useTranslation } from 'react-i18next';

const CourseTasks = () => {
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupStatus, setPopupStatus] = useState('');
  const [popupAssignmentId, setPopupAssignmentId] = useState(null);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const { course_id } = useParams();
  const { selectedCourse } = useCourse(course_id);
  const { courseParticipants } = useCourseParticipants(course_id);
  const [totalSubmissions, setTotalStudents] = useState(0);
  const [ SumOfUnroledStudents, setSumOfUnroledStudents] = useState(0);
  const {assignmentStudentInfo} = useStudentGradingForTeacher(course_id);
  const { t } = useTranslation();

  // Create Assignment pop-up card
  const handleButtonClick = () => {
    setIsCardVisible(!isCardVisible);
  };

  const openTaskPopup = (title, status, assignmentId) => {
    setPopupTitle(title);
    setPopupStatus(status);
    setPopupAssignmentId(assignmentId);
    setIsTaskPopupVisible(true);
  };

  const handleCardClick = (assignmentId) => {
    setExpandedAssignmentId(expandedAssignmentId === assignmentId ? null : assignmentId);
  };

  const closePopUp = () => {
    setIsTaskPopupVisible(false);
    refetch();
  }

  
   // Unroles students and student who's already submitted and graded
   useEffect(() => {
    if (assignmentStudentInfo && courseParticipants) {
      const total = assignmentStudentInfo.reduce((sum, assignment) => sum + assignment.studentInfo.length, 0);
      const numberOfStudents = courseParticipants.students.length;

      setTotalStudents(total);
      setSumOfUnroledStudents(numberOfStudents);
    }
  }, [assignmentStudentInfo, courseParticipants]);

  console.log(assignmentStudentInfo)

  // Managing cards state
  const [cards, setCards] = useState([]);

  // Load cards from local storage when the component mounts
  useEffect(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      if (parsedCards.length === 0) {
        parsedCards.push({ id: 1, questionInput: '', responseInput: '', questionMaxPoint: 0 });
      }
      setCards(parsedCards);
    } else {
      setCards([{ id: 1, questionInput: '', responseInput: '', questionMaxPoint: 0 }]);
    }
  }, [setCards]);
  
  // Save cards to localStorage whenever the cards state changes
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  // Data for Assignment 
  const { data: assignments, isLoading, refetch } = useQuery({
    queryKey: ['getAssignments', { course_id }],
    queryFn: FetchAllAssignmentsQuery,
  });

  return (
    <div className="relative ml-20 mb-16">
      <button
        onClick={handleButtonClick}
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full mb-2 flex items-center space-x-2 shadow-md"
      >
        <span className="text-2xl">+</span>
        <span>{t('create')}</span>
      </button>

      {isCardVisible && (
        <div className="absolute left-0 mt-2 bg-white rounded-lg shadow-lg w-48 z-50">
          <ul className="py-2">
            <li onClick={() => {
              openTaskPopup(t('exam'), t('create_new_task'));
              setIsCardVisible(false);
              }} className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center">
              <BookOpen className="mr-2" />
                {t('exam')}
            </li>
            <li onClick={() => {
              openTaskPopup(t('quiz'), t('create_new_task'));
              setIsCardVisible(false);
              }} className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center">
              <ClipboardList className="mr-2" />
              {t('quiz')}
            </li>
            <li onClick={() => {
              openTaskPopup(t('assignment'), t('create_new_task'));
              setIsCardVisible(false);
              }} className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center">
              <Edit3 className="mr-2" />
              {t('assignment')}
            </li>
            <li onClick={() =>{
              openTaskPopup(t('exercise'), t('create_new_task'));
              setIsCardVisible(false);
              }} className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex items-center">
              <FileText className="mr-2" />
              {t('exercise')}
            </li>
          </ul>
        </div>
      )}

      {isLoading ? (
        <ClipLoader color="#D32F2F" className="flex justify-center" size={50} />
      ) : assignments && assignments.length > 0 ? (
        assignments
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((assignment) => (
          <div
            key={assignment.id}
            className={`mt-8 w-[65%] border-b rounded-t-lg ${expandedAssignmentId === assignment.id ? 'bg-white rounded-b-none border-b-0 shadow-md overflow-hidden' : 'hover:border hover:bg-white'} cursor-pointer transition-all duration-300`}
            onClick={() => handleCardClick(assignment.id)}
          >
            <div className="flex justify-between items-center p-4 h-16">
              <div className="flex items-center space-x-2">
                <div className="bg-accent p-2 rounded-full">
                  <ClipboardList size={24} className="text-primary" />
                </div>
                <h2 className="text-sm">{assignment.title}</h2>
              </div>
              <div className="text-gray-600 text-sm">
                {`${t('published')} ${new Date(assignment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </div>
            </div>
            {expandedAssignmentId === assignment.id && (
              <div className="p-4 border-t">
                <p className='text-sm pb-2'>
                  {assignment.due_date 
                    ? t('due_date') + `${format(new Date(assignment.due_date), ' dd-MM-yyyy')}` + t('published_at') + `${format(new Date(assignment.due_date), 'HH:mm')}` 
                    : t('no_due_date')}
                </p>
                <p className='text-sm italic'>{assignment.instruction}</p>
                <div className="flex justify-end mt-4 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl">{totalSubmissions}</div>
                    <div className="text-secondary text-sm">{t('submitted')}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl">{SumOfUnroledStudents}</div>
                    <div className="text-secondary text-sm">{t('assigned')}</div>
                  </div>
                </div>
                  <div className="flex justify-between mt-2 pt-2 border-t">
                  {assignment.composition ? (
                    <>
                      {/* Display 'Modifier' when composition is true */}
                      <div 
                        className="text-primary cursor-pointer"
                        onClick={() => openTaskPopup(`${assignment.title}`, t('edit_task'), assignment.id)}
                      >
                        {t('edit')}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Display 'Composer' when composition is false */}
                      <Link
                        to={`/teacher/courses/${course_id}/assignments/${assignment.id}`}
                        state={{
                          title: assignment.title,
                          instruction: assignment.instruction,
                          cards,
                          courseId: course_id,
                          assignmentId: assignment.id,
                        }}
                        className="text-primary cursor-pointer"
                      >
                        {t('take_exam')}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="w-full h-full mt-8">{t('no_exams_created')}</p>
      )}
      
      {isTaskPopupVisible && <TaskPopup title={popupTitle} status={popupStatus} assignmentId={popupAssignmentId} courseName={selectedCourse?.name} onClose={() => closePopUp()} />}
    </div>
  );
};

export default CourseTasks;
