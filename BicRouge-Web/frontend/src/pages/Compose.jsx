import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import CustomInput from '../components/CustomInput';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { CreateQuestionsQuery } from '../query/AssignmentQuery';
import DashboardButton from '../components/DashboardButton';
import { X, MoreVertical, CirclePlus, Copy, Trash2, GripHorizontal, ClipboardPenLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const Compose = () => {
  const navigate = useNavigate();
  const { userRole } = useContext(UserContext);
  const location = useLocation();
  const { showToast } = useToast();
  const [isFirstCardClicked, setIsFirstCardClicked] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { title = '', instruction = '', cards = [], courseId = '', assignmentId = '' } = location.state || {};
  const [cardsState, setCardsState] = useState(cards);
  const { t } = useTranslation();


  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cardsState));
  }, [cardsState]);

  const onCardClick = (isClicked) => {
    setIsFirstCardClicked(isClicked);
  };

  const onAddCard = () => {
    setCardsState((prevCards) => [
      ...prevCards,
      { id: prevCards.length + 1, questionInput: '', responseInput: '', questionMaxPoint: 0 },
    ]);
  };

  const onDuplicateCard = (id) => {
    const cardToDuplicate = cardsState.find((card) => card.id === id);
    const duplicatedCard = { ...cardToDuplicate, id: cardsState.length + 1 };
    setCardsState((prevCards) => [...prevCards, duplicatedCard]);
  };

  const onDeleteCard = (id) => {
    setCardsState((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const onCardChange = (id, field, value) => {
    setCardsState((prevCards) =>
      prevCards.map((card) => (card.id === id ? { ...card, [field]: value } : card))

    );
    if (cards.length > 0) {
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  };

  const handleFirstCardClick = () => {
    setIsFirstCardClicked(!isFirstCardClicked);
  };

  const mutationCreateQuestion = useMutation({
    mutationFn: CreateQuestionsQuery,

    onSuccess: (data) => {
      showToast(t('success_exam'), "success");
      // Clear localStorage after successful form submission
      localStorage.removeItem('cards');
      navigate(`/${userRole}/course/${courseId}/tache`);
    },
    
    onError: (error) => {
      showToast(t('error_exam'), "destructive");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const questions = cardsState.map(card => ({
      question_text: card.questionInput,
      max_points: card.questionMaxPoint,
      teacher_answers: [
        { answer_text: card.responseInput }
      ]
    }));
    mutationCreateQuestion.mutate({
      assignmentId: assignmentId,
      questions: questions
    });
  };
  

  const handlePublish = () => {
    setIsPublished(true);
    handleSubmit();
  };

  return (
    <div className="bg-background h-screen overflow-auto">
      <form onSubmit={handleSubmit}>    
        <div className="flex items-center bg-white justify-between p-4 border-b border-gray-300 sticky top-0 z-50">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-accent p-2 rounded-full">
                <ClipboardPenLine size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{t('compose')}</h2>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Link to={`/${userRole}/course/${courseId}/tache`}>
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
              className={`${
                isPublished ? 'bg-green-600' : 'bg-primary hover:bg-primary-dark'
              } text-white px-4 py-2 rounded flex items-center space-x-2`}
              disabled={mutationCreateQuestion.isLoading}
            >
              {mutationCreateQuestion.isLoading ? (
                <ClipLoader size={24} color="#fff" />
              ) : (
                <span>{isPublished ? t('published_title') : t('save')}</span>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col items-center pt-4 px-24">
          <div className='flex flex-row gap-4 w-full justify-center'>
            <div className='flex flex-col items-start basis-1/2 grow'>
              <div 
                className="bg-white shadow-lg p-4 rounded-lg w-full mb-5 text-left border-t-8 border-red-600"
                onClick={handleFirstCardClick}
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-2">{instruction}</p>
              </div>
              
              {cardsState.map((card) => (
                <QuestionCard
                  key={card.id}
                  id={card.id}
                  questionInput={card.questionInput}
                  responseInput={card.responseInput}
                  questionMaxPoint={card.questionMaxPoint}
                  isFirstCardClicked={isFirstCardClicked}
                  onCardClick={onCardClick}
                  onAddCard={onAddCard}
                  onDuplicateCard={onDuplicateCard}
                  onDeleteCard={onDeleteCard}
                  onCardChange={onCardChange}
                  t={t}
                />
              ))}
              <button
                type="button"
                className="mt-4 mb-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-md"
                onClick={onAddCard}
              >
                <CirclePlus size={24} />
                <span>{t('add_question')}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Compose;


const QuestionCard = ({ id, questionInput, responseInput, questionMaxPoint, t, isFirstCardClicked, onCardClick, onAddCard, onDuplicateCard, onDeleteCard, onCardChange }) => {
  const [isClicked, setIsClicked] = useState(false);
  const cardRef = useRef(null);


  const handleClickOutside = useCallback((event) => {
    console.log(cardRef.current);
    console.log(event.target);
    if (cardRef.current && !cardRef.current.contains(event.target)) {
      console.log(`${cardRef.current} ${!cardRef.current.contains(event.target)}`)
      setIsClicked(false);
    }
  }, []);

  const handleCardClick = () => {
    console.log("handleCardClick");
    setIsClicked(true);
    // onCardClick(true);
  };

  const handleDeleteCardClick = (e) => {
    e.stopPropagation();
    if (id !== 1) {
      onDeleteCard(id);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      ref={cardRef}
      className={`bg-white shadow-lg p-4 rounded-lg w-full mb-5 transform transition-all duration-300 ease-in-out ${
        isClicked ? 'border-l-8 border-red-600 scale-y-105' : 'scale-100'
      }`}
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-center mb-2">
        <GripHorizontal size={24} />
        <div className="flex items-center space-x-2">
          <button
            className={`${
              id === 1 ? 'hidden' : 'bg-red-600 hover:bg-red-700'
            } text-white rounded-full p-2 focus:outline-none`}
            onClick={handleDeleteCardClick}
          >
            <Trash2 size={18} />
          </button>
          <DashboardButton variant="ghost" size="icon" onClick={() => onDuplicateCard(id)}>
            <Copy size={18} />
          </DashboardButton>
          <DashboardButton variant="ghost" size="icon">
            <MoreVertical size={18} />
          </DashboardButton>
        </div>
      </div>
      <div className='mt-2'>
          <span className="font-bold">{`Question ${id}`}</span> <br/>
          <span className="font-bold">{questionInput}</span>
      </div>
      {isClicked && (
        <div className="mt-4">
          <CustomInput
            label={t('question')}
            type="text"
            value={questionInput}
            onChange={(e) => onCardChange(id, 'questionInput', e.target.value)}
          />
          <CustomInput
            label={t('answer')}
            type="text"
            value={responseInput}
            onChange={(e) => onCardChange(id, 'responseInput', e.target.value)}
          />
          <CustomInput
            label={t('point')}
            type="number"
            value={questionMaxPoint}
            onChange={(e) => onCardChange(id, 'questionMaxPoint', e.target.value)}
          />
        </div>
      )}
    </div>
  );
};