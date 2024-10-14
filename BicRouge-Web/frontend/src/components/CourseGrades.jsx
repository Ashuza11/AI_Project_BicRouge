import { useContext, useState, useEffect, useCallback } from 'react';
import { ClipboardList } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import TaskPopup from './TaskPopup';
import { ClipLoader } from 'react-spinners';
import StudentGradeTable from './StudentGradeTable';
import { useAssignmentGrade, useStudentGradingForTeacher } from '../hooks/useAssignmentGrade';
import useAssignmentsStudent from '../hooks/useAssignmentsStudent';
import { FetchGradeInfoQuery } from '../query/GradeInfoQuery';
import useCourse from '../hooks/useCourse';
import { useTranslation } from 'react-i18next';



const CourseGrades = () => {
  const { userRole, idUser } = useContext(UserContext);
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const { course_id } = useParams();
  const { t } = useTranslation();



  const { selectedCourse } = useCourse(course_id);
  const {assignmentStudentInfo, isLoadingGradeInfo} = useStudentGradingForTeacher(course_id);
  
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

  const { assignmentsStudent, dataStudentAssignment, isLoadingAssignmentsStudent, isLoadingAssignments } = useAssignmentsStudent(course_id);

  // Get the notes for the student if assignment is graded
  const [assignmentWithNotes, setAWN] = useState([]);

  const getNotes = useCallback(async ()=> {
    const query = assignmentsStudent.map(async (assignment)=> {
        const note = await FetchGradeInfoQuery({queryKey:[idUser, assignment.id]})
                            .catch(()=>null)
        return {
          note, assignment
        }
    });

    let results = await Promise.all(query);
    results = results.filter((item)=> !!item.note);

    setAWN(results);
  }, [assignmentsStudent, idUser]);

  useEffect(()=> {
    getNotes();
  }, [getNotes]);


  const openTaskPopup = (title) => {
    setPopupTitle(title);
    setIsTaskPopupVisible(true);
  };

  const handleCardClick = (assignmentId) => {
    setExpandedAssignmentId(expandedAssignmentId === assignmentId ? null : assignmentId);
  };

  return (
    <div>
      {/* Display result for the teacher */}
      {userRole === 'teacher' && (
        <div>
          {assignmentStudentInfo && assignmentStudentInfo.length > 0 ? (
            <StudentGradeTable
              assignmentStudentInfo={assignmentStudentInfo}
              isLoading={isLoadingGradeInfo}  
              courseInfo={selectedCourse}
            />
          ) : (
            <p>{t('no_test_created')}</p>
          )}
        </div>
      )}

      {/* Display the result for the student */}
      {userRole === 'student' && (
        <div className="relative ml-20 mb-16">
          <h2>{t('see_your_grades')}</h2>
          {isLoadingAssignments ? (
            <ClipLoader color="#D32F2F" className="flex justify-center" size={50} />
          ) : assignmentWithNotes.length > 0 ? (
            assignmentWithNotes
              .slice()
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map(({note, assignment}) => (
              <div
                key={assignment.id}
                className={`mt-4 w-[65%] border-b rounded-t-lg ${expandedAssignmentId === assignment.id ? 'bg-white rounded-b-none border-b-0 shadow-md overflow-hidden' : 'hover:border hover:bg-white'} cursor-pointer transition-all duration-300`}
                onClick={() => handleCardClick(assignment.id)}
              >
                <div className="flex justify-between items-center p-4 h-16">
                  <div className="flex items-center space-x-2">
                    <div className="bg-accent p-2 rounded-full">
                      <ClipboardList size={24} className="text-primary" />
                    </div>
                    <h2 className="text-sm">{assignment.title}</h2>
                  </div>
                  <p className='text-sm text-green-500'>{t('submitted')}</p>
                </div>
                {expandedAssignmentId === assignment.id && (
                  <div className="p-4 border-t">
                    <div className="text-sm mb-20">
                      {`${t('published')} ${new Date(assignment.created_at).toLocaleTimeString({ hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t">
                      <Link 
                        to={`/${userRole}/courses/${course_id}/assignments/${assignment.id}/notes`}
                        state={{
                          title: assignment.title,
                          instruction: assignment.instruction,
                          cards,
                          courseId: course_id,
                          assignmentId: assignment.id
                        }}
                        className="text-primary cursor-pointer"
                      >
                        {t('view_results')}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="w-full h-full mt-8">{(t('no_tests_submitted_yet'))}</p>
          )}
          
          {isTaskPopupVisible && <TaskPopup title={popupTitle} onClose={() => setIsTaskPopupVisible(false)} />}
        </div>
      )}
    </div>
  );
};

export default CourseGrades;
