import React, { useState, useContext, useEffect, useRef, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import CustomInput from '../components/CustomInput';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { useQuery } from '@tanstack/react-query';
import { FetchAllQuestions, SubmitAssignmentResponsesQuery } from '../query/AssignmentQuery';
import { X, GripHorizontal, ClipboardPenLine } from 'lucide-react';
import DueDateTimer from '../components/DueDateTimer';
import useAssignmentsStudent from '../hooks/useAssignmentsStudent';
import { useTranslation } from 'react-i18next';




const ResponseForm = () => {
  const navigate = useNavigate();
  const { userRole, idUser } = useContext(UserContext);
  const location = useLocation();
  const { showToast } = useToast();
  const [isFirstCardClicked, setIsFirstCardClicked] = useState(false);
  const { title = '', instruction = '', cards = [], courseId = '', assignmentId = '' } = location.state || {};
  const [cardsState, setCardsState] = useState(cards);
  const { assignmentsStudent, isLoadingAssignments } = useAssignmentsStudent(courseId);
  const currentAssignement = assignmentsStudent?.find(item => item.id == assignmentId);
  const { t } = useTranslation();
  const isTimeOver =  currentAssignement
                        ? new Date(currentAssignement.due_date) < new Date()
                        :false

  
  /**
   * @type [import('react').MutableRefObject<{getValue:()=>void}>[]]
   */
  const [allRef, setAllRef] = useState([]);



  const mutationSubmitResponse = useMutation({
    mutationFn: SubmitAssignmentResponsesQuery,
    onSuccess: (data) => {
      showToast(t('responses_sent_successfully'), "success");
      navigate(`/${userRole}/course/${courseId}/flux`);
    },
    onError: (error) => {
      showToast(t('error_sending_responses'), "destructive");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate if all fields are filled
    const allFieldsFilled = allRef.every(card => card.getValue() && card.getValue().trim() !== '');
    
    if (!allFieldsFilled) {
      showToast(t('please_answer_all_questions'), "destructive");
      return;
    }

    const questions = allRef.map((ref, index) => ({
      id: index+1,
      responseInput: ref.getValue()
    }))
    
    mutationSubmitResponse.mutate({
      assignmentId: assignmentId,
      questions: questions,
      studentId: idUser
    });
  };

 

  const handleFirstCardClick = () => {
    setIsFirstCardClicked(!isFirstCardClicked);
  };

  const handleCardChange = (questionId, field, value) => {
    setCardsState(prevState =>
      prevState.map(card => 
        card.questionId === questionId ? { ...card, [field]: value } : card
      )
    );
  };

  // Fetch all questions and points
  const { data: questions, isLoading: isLoadingQuestions,isError } = useQuery({
    queryKey: ['assignmentQuestion', { assignment_id: assignmentId }],
    queryFn: FetchAllQuestions,
  });

  useEffect(() => {
    if (questions) {
      const initialCardsState = questions.map(question => ({
        questionId: question.id,
        responseInput: '', 
      }));
      setCardsState(initialCardsState);
    }
  }, [questions]);




  return (
    <div className="bg-background h-screen overflow-auto">
      <form onSubmit={handleSubmit}>    
        <div className="flex items-center bg-white justify-between p-4 border-b border-gray-300 sticky top-0 z-50">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-accent p-2 rounded-full">
                <ClipboardPenLine size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{t('answer_the_questions')}</h2>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Link to={`/${userRole}/course/${courseId}/flux`}>
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              >
                <X size={24} />
                <span>{t('cancel')}</span>
              </button>
            </Link>
            <button
              type="submit"
              className='bg-primary hover:bg-primary-dark disabled:cursor-not-allowed text-white px-4 py-2 rounded flex items-center space-x-2'
              disabled={mutationSubmitResponse.isPending || isTimeOver}
            >
              {mutationSubmitResponse.isPending ? (
                <ClipLoader size={24} color="#fff" />
              ) : (
                <span>{t('submit')}</span>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center pt-4 px-24">
          <div className='flex flex-row gap-4 w-full justify-center'>

            <div className='flex flex-col items-start basis-1/2 grow'>
              <div 
                className="bg-white shadow-lg p-4 rounded-l-lg w-full mb-5 text-left border-t-8 border-red-600"
                onClick={handleFirstCardClick}
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2">{instruction}</p>
              </div>
              {isLoadingQuestions 
                ?<ClipLoader color="#D32F2F" className="flex justify-center" size={50} />
                :
                isError ?
                <div>{t('questions_not_available')}</div>
                :questions.map((question, index) => {
                const adjustedIndex = index + 1;
                return (
                  <QuestionCard
                    key={adjustedIndex}  
                    questionId={adjustedIndex}
                    isFirstCardClicked={isFirstCardClicked}
                    question={question}
                    ref={(ref) => {
                      setAllRef((current)=> { 
                        current[index] = ref;
                        return current;
                      })
                    }}
                    t={t}
                  />
                );
              })}
            </div>
            <div className="bg-white shadow-lg p-4 rounded-r-lg mb-5 h-1/2 text-left border-t-8 border-red-600">
              <div>
                <span className="text-sm font-semibold">{t('deadline')}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <DueDateTimer assignmentId={assignmentId} courseId={courseId} />
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


const QuestionCard = forwardRef(function QuestionCard({ question, t, questionId, isFirstCardClicked }, ref)  {
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef(null);
  const { question_text: questionText, max_points: maxPoints } = question;

  const [response, setResponse] = useState("");
  useImperativeHandle(ref, ()=>{
    return {
      getValue: ()=> response
    }
  },[response])


  const handleClickOutside = useCallback((event) => {
    if (cardRef.current && !cardRef.current.contains(event.target) && !isFirstCardClicked) {
      setIsClicked(false);
    }
  },[isFirstCardClicked]);

  useEffect(() => { 
    document.addEventListener('mousedown', handleClickOutside);
    return () => { 
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFirstCardClicked,handleClickOutside]);

  const handleCardClick = () => {
    setIsClicked(true);
  };

  return (
    <div
      ref={cardRef}
      className={`bg-white shadow-lg p-4 rounded-lg w-full mb-5 transform transition-all duration-300 ease-in-out ${
        isClicked ? 'border-l-8 border-red-600 scale-y-105' : 'scale-100'
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <GripHorizontal size={24} />
        </div>
        <div className="flex items-center space-x-2">
          <span className='text-xl'>
            /{maxPoints} 
          </span>
        </div>
      </div>
      <div className='flex flex-col space-y-2 gap-2'>
        <div>
          <span className="font-bold">{`${t('question')} ${questionId}`}</span> <br/>
          <span className="font-bold">{questionText}</span>
        </div>
        <div>
          <span className="font-bold">{t('answer')}</span> 
          <br/>
          <span className="font-italic text-secondary w-full inline-block pb-1 border-b-2 border-dashed">{response}</span>

        </div>
      </div>
      {isClicked && (
        <div className="mt-4">
          <CustomInput
            label="Response"
            type="text"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          />
        </div>
      )}
    </div>
  );
});

export default ResponseForm;

