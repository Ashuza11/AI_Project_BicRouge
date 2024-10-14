import { useContext } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { AssignmentContent } from './AssignmentContent';
import { useTranslation } from 'react-i18next';

const AssignmentNotes = () => {
  const location = useLocation();
  const { title = '', cards = [], courseId = '', studentId } = location.state || {};
  const { userRole} = useContext(UserContext);
  const { assignmentId } = useParams();
  const { t } = useTranslation();



  return (
    <div className="bg-background h-screen overflow-auto">
        <div className="flex items-center bg-white justify-between p-4 border-b border-gray-300 sticky top-0 z-50">
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <div className="bg-accent p-2 rounded-full">
                <GraduationCap size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{t('myNotes')}</h2>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Link to={`/${userRole}/course/${courseId}/notes`}>
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
              >
                <ArrowLeft size={24} />
                <span>{t('back')}</span>
              </button>
            </Link>
          </div>
        </div>
        {/* Assignment contents  */}
        <AssignmentContent 
          title={title} 
          cards={cards} 
          courseId={courseId} 
          assignmentId={assignmentId} 
          studentId={studentId} 
        />
    </div>
  );
}

export default AssignmentNotes