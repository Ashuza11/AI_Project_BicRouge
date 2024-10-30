import { useState, useContext, useEffect, useRef, forwardRef, useMemo } from 'react';
import { UserContext } from '../context/UserContext';
import { ClipLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext'; 
import { useMutation } from '@tanstack/react-query';
import { useAssignmentGrade } from '../hooks/useAssignmentGrade';
import { FetchAllQuestions } from '../query/AssignmentQuery';
import { UpdateGradeInfoQuery, ValidateGradeInfoQuery } from '../query/GradeInfoQuery';
import { GripHorizontal, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DueDateTimer from '../components/DueDateTimer';
import { useTranslation } from 'react-i18next';

export const AssignmentContent = ({ title, cards, courseId, assignmentId, studentId }) => {
  const { userRole, idUser } = useContext(UserContext); 
  const [cardsState, setCardsState] = useState(cards);
  const { showToast } = useToast();
  const navigateTo = useNavigate()
  const location = useLocation()
  const { t } = useTranslation();



  // Store modified grades
  const [modifiedGrades, setModifiedGrades] = useState({});
  
  // Handle grade updates from QuestionCard
  const handleGradeChange = (questionId, newGrade) => {
    setModifiedGrades(prevGrades => ({
      ...prevGrades,
      [questionId]: newGrade
    }));
  };

  // For teacher, pass `studentId` to fetch the correct grading info
  const { gradingInfo, isLoading } = useAssignmentGrade(userRole === 'teacher' ? studentId : idUser, assignmentId);


  const { data: questions, isLoading: isLoadingQuestions, isError } = useQuery({
    queryKey: ['assignmentQuestion', { assignment_id: assignmentId }],
    queryFn: FetchAllQuestions,
  }); 


  const gradingMap = useMemo(() => {
    const map = {};
    if (gradingInfo?.gradingFeedback) {
      gradingInfo.gradingFeedback.forEach((feedback) => {
        map[feedback.question_id] = feedback;
      });
    }
    return map;
  }, [gradingInfo]);


  const totalPoints = useMemo(() => {
    return questions?.reduce((total, question) => total + question.max_points, 0) || 0;
  }, [questions]);

  const totalGrade = useMemo(() => {
    return gradingInfo?.gradingFeedback?.reduce((total, current) => total + current.grade, 0) || 0;
  }, [gradingInfo]);

 // Update and Validate grades
  const hasModified = useMemo(()=> {
    return !!gradingInfo?.gradingFeedback?.find(item => item.grades != null);
  }, [gradingInfo]);

  const hasValidatedGrades = useMemo(()=> {
    return !!gradingInfo?.state == true;
  }, [gradingInfo]);


  const mutationValidateGrades = useMutation({
    mutationFn: async (data) => {
      // Consuming the ValidateGradeInfoQuery function
      return await ValidateGradeInfoQuery({
        queryKey: [data.student_id, data.assignment_id],
        data,
      });
    },
  
    onSuccess: () => {
      showToast(t('exam_successfully_validated'), "success");
      navigateTo(`/teacher/course/${courseId}/notes`);
    },
  
    onError: (error) => {
      showToast(t('exam_validation_failed'), "destructive");
    },
  });
  
  const mutationSubmitGrades = useMutation({
    mutationFn: async (data) => {
      // Consuming the UpdateGradeInfoQuery function
      return await UpdateGradeInfoQuery({
        queryKey: [idUser, assignmentId],
        data,
      });
    },
  
    onSuccess: () => {
      showToast(t('grades_updated_and_validated_successfully'), "success");
      navigateTo(`/teacher/course/${courseId}/notes`);
    },
  
    onError: (error) => {
      console.error(t('grades_update_failed'), error);
      showToast(t('grades_update_failed'), "destructive");
    },
  });
  
  // Function to handle submitting of all modified grades or just validation
  const handleSubmitGrades = async () => {
    try {
      let gradesChanged = false;
  
      // Check if there are any modified grades
      for (const questionId in modifiedGrades) {
        const newGrade = modifiedGrades[questionId];
        const data = {
          grade: newGrade,
          student_id: studentId,
          question_id: questionId,
        };
  
        // Trigger mutation for each modified grade
        await mutationSubmitGrades.mutateAsync(data);
        gradesChanged = true;
      }
  
      // If no grades were changed, just validate the assignment
      if (!gradesChanged) {
        await mutationValidateGrades.mutateAsync({
          student_id: studentId,
          assignment_id: assignmentId,
        });
      } else {
        // After submitting all grades, we still need to validate the assignment
        await mutationValidateGrades.mutateAsync({
          student_id: studentId,
          assignment_id: assignmentId,
        });
      }
    } catch (error) {
      console.error("Error during grade submission/validation:", error);
    }
  };
  
  useEffect(() => {
    if (questions) {
      const initialCardsState = questions.map(question => ({
        questionId: question.id,
      }));
      setCardsState(initialCardsState);
    }
  }, [questions]);

  return (
    <div className="flex flex-col items-center pt-4 px-16">
      <div className='flex flex-row gap-4 w-full justify-center'>
        <div className='flex flex-col items-start basis-1/2 grow'>
          <div className="bg-white shadow-lg p-4 rounded-l-lg w-full mb-5 text-left border-t-8 border-red-600">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="mt-2 border-t-2">
              <span className="block text-sm font-semibold my-2">{t('advice')}</span>
              <span className='italic'>
                {gradingInfo?.advice} 
              </span> 
            </div>
          </div>
    
          {isLoadingQuestions ? (
            <ClipLoader color="#D32F2F" className="flex justify-center" size={22} />
          ) : isError ? (
            <div>{t('no_exam_submitted_yet')}</div>
          ) : (
            questions.map((question, index) => {
              const adjustedIndex = index + 1;
              const feedback = gradingMap[question.reassigned_id];
              return (
                <QuestionCard
                  key={adjustedIndex}
                  questionId={adjustedIndex}
                  question={question}
                  feedback={feedback}
                  userRole={userRole}
                  onGradeChange={handleGradeChange}  // Pass the callback to QuestionCard
                  hasModified={hasModified}
                  t={t}
                />
              );
            })
          )}
        </div>
    
        <div className="bg-white min-w-[14rem] shadow-lg p-4 rounded-r-lg mb-5 h-full flex flex-col justify-between text-left border-t-8 border-red-600">
          <div>
            <span className="block text-sm font-semibold">{t('deadline')}</span>
            <p className="text-sm text-gray-600 mt-2">
              <DueDateTimer
                assignmentId={assignmentId}
                courseId={courseId}
                showTiming={[
                  new RegExp(`^/${userRole}/courses/[0-9]+/assignments/[0-9]+$`),
                  new RegExp(`^/${userRole}/course/[0-9]+/notes/[0-9]+/assignments/[0-9]+$`),
                ].some(regex=>  regex.test(location.pathname))}
              />
            </p>
            <div className='mt-2 text-sm'>
              <div className='my-2'>
                <span className='font-semibold'>{hasValidatedGrades ? t('final_grade') : t('provisional_grade')}: </span>
                <span className='text-primary'>{totalGrade}/{totalPoints}</span>
              </div>
            </div>
          </div>
    
          {/* Conditionally render the button if the user is a teacher */}
          {userRole === 'teacher' && (
           <> 
              <button
                type="submit"
                onClick={handleSubmitGrades} 
                title={hasValidatedGrades ? t('grades_already_validated') : t('validate_grades')}
                className={`px-4 py-2 rounded text-white mt-auto ${hasValidatedGrades ? 'bg-primary-isActive text-neutral-300 cursor-not-allowed' : 'bg-primary'}`}
                disabled={hasValidatedGrades}
              >
                {t('validate')}
              </button>


              <div className='py-2'/>
            
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center justify-center space-x-2"
                onClick={() => navigateTo(-1)}
              >
                <ArrowLeft size={24} />
                <span >{t('back')}</span>
              </button>
            </>
          )}
        </div>
      </div>
  </div>
  );
}


const QuestionCard = forwardRef(function QuestionCard({ question, questionId, feedback, t, userRole, onGradeChange, hasModified }, ref) {
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef(null);
  const { question_text: questionText, max_points: maxPoints } = question;
  const [grade, setGrade] = useState(feedback?.grade || 0);

  const [response_text, setStudentResponse] = useState("");
  const comment = feedback?.comment || "";

 
  // Only allow editing if the user is a teacher
  const handleGradeChange = (e) => {
    const newGrade = e.target.value;
    setGrade(newGrade);

    // Notify the parent component about the grade change
    onGradeChange(questionId, newGrade);
  };

  
  const handleCardClick = () => {
    setIsClicked(true);
  };
  useEffect(()=> {
    setStudentResponse(feedback?.response_text);
    setGrade(feedback?.grade || 0);
  }, [feedback]);
  
  return (
    <div
      ref={cardRef}
      className={`bg-white shadow-lg p-4 rounded-lg w-full mb-5 transform transition-all duration-500 ease-in-out ${
        isClicked ? 'border-l-8 border-red-600 scale-y-105' : 'scale-100'
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <GripHorizontal size={24} />
        </div>
        <div className="flex items-center space-x-2">
          {userRole === 'teacher' && !hasModified ? (
            <div>
              <input
                type="number"
                value={grade}
                onChange={handleGradeChange}
                className="border w-12 text-center"
              />/{maxPoints}
            </div>
          ) : (
            <span className='text-primary'>
              { grade }/{maxPoints} 
            </span>
          )}
        </div>
      </div>
      <div className='flex flex-col space-y-1 gap-2'>
        <div>
          <span className="font-bold">{`${t('question')} ${questionId}`}</span> <br/>
          <span className="font-bold">{questionText}</span>
        </div>
        <div>
          <span className="font-bold">{t('answer')}</span> <br/>
          <span 
            className="block text-gray-400 w-full pb-2 mb-2 border-b-2"
          >
            {response_text}
          </span>
          <span className='font-bold '>{t('comment')}</span> <br/>
          <span className='italic'>
            {comment}
          </span>
        </div>
      </div>
    </div>
  );
});


export const AssignmentContentHOC = ()=> {
  const {student_id, course_id, assignmentId} = useParams();
  const [searchParams] = useSearchParams();

  console.log(assignmentId);
  return (
    <AssignmentContent
      assignmentId={assignmentId}
      cards={[]}
      courseId={course_id}
      studentId={student_id}
      title={searchParams.get('title')}
    />
  )
}