import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ClipLoader } from 'react-spinners';
import useAssignmentsStudent from '../hooks/useAssignmentsStudent';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DueDateTimer = ({ assignmentId, courseId, showTiming=true }) => {
  const {student_id } =  useParams()
  const { assignmentsStudent, isLoadingAssignments } = useAssignmentsStudent(courseId, student_id); 
  const [timeRemaining, setTimeRemaining] = useState(null);
  const { t } = useTranslation();


  // Helper function to format remaining time
  const formatTime = (timeInMs) => {
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    const hours = Math.floor((timeInMs / (1000 * 60 * 60)) % 24);
    const Jours = Math.floor(timeInMs / (1000 * 60 * 60 * 24));

    return `${Jours}j ${hours}h ${minutes}m ${seconds}s`;
  };

  const dueDateStr = useMemo(() => {
    const assignment = assignmentsStudent?.find(a => a.id == assignmentId);
    if (assignment) {
      return t('le') + format(new Date(assignment.due_date), 'dd-MM-yyyy') + t('published_at') + format(new Date(assignment.due_date),' hh:mm a');
    }
    return t('no_deadline');
  }, [assignmentsStudent,assignmentId])

  useEffect(() => {
    if (!assignmentsStudent || isLoadingAssignments) return;

    // Find the specific assignment by ID
    const assignment = assignmentsStudent.find(a => a.id === assignmentId);
    if (!assignment) return;

    const dueDate = new Date(assignment.due_date);
    const intervalId = setInterval(() => {
      const now = new Date();
      const timeDifference = dueDate - now;

      if (timeDifference > 0) {
        setTimeRemaining(formatTime(timeDifference));
      } else {
        setTimeRemaining('00:00:00');
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [assignmentId, assignmentsStudent, isLoadingAssignments]);

  if (isLoadingAssignments || !assignmentsStudent) {
    return <ClipLoader color="#D32F2F" className="flex justify-center" size={22} />;
  }

  return (
    <div>
      <span className='block pb-2'>
          {dueDateStr}
      </span>
      {showTiming && timeRemaining ?
        <>
          <span className='text-sm font-semibold'>{t('time_left')} </span>
          <span >
              {timeRemaining}
          </span>
        </> :null
      }
    </div>
  );
};

export default DueDateTimer;
