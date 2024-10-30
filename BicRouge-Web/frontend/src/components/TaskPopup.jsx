import { useState, useContext } from 'react';
import CustomInput from './CustomInput';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { useMutation } from '@tanstack/react-query';
import { ClipLoader } from 'react-spinners';
import { CreateAssignmentQuery, UpdateAssignmentQuery } from '../query/AssignmentQuery';
import CustomTextarea from './CustomTextarea';
import { X, Bold, Italic, Underline, List, Strikethrough, Plus, Upload, Link, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const TaskPopup = ({ title, courseName, onClose, status, assignmentId }) => {
  const [titleInput, setTitleInput] = useState('');
  const [instruction, setInstruction] = useState('');
  const [points, setPoints] = useState('100');
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userRole } = useContext(UserContext);
  const { course_id } = useParams(); 
  const { showToast } = useToast();
  const [dueDate, setDueDate] = useState('');
  const [customDate, setCustomDate] = useState('');

  console.log(status);

  // Create Assignment 
  const mutationCreateAssignment = useMutation({
    mutationFn: CreateAssignmentQuery,

    onSuccess: (data) => {
      showToast(t('success_created_exam'), "success");
      navigate(`/${userRole}/course/${course_id}/tache`);
      onClose();
    },

    onError: (error) => {
      showToast(t('error_creating_exam'), "destructive");
      console.log("L'erreur est : ", error);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validDueDate = dueDate=="custom" ? customDate : null;

    mutationCreateAssignment.mutate({ titleInput, instruction, points, dueDate: validDueDate, course_id });
 
  };

  // Update Assignment
  const mutationUpdateAssignment = useMutation({
    mutationFn: UpdateAssignmentQuery,

    onSuccess: (data) => {
      showToast(t('success_updated_exam'), "success");
      navigate(`/${userRole}/course/${course_id}/tache`);
      onClose();
    },

    onError: (error) => {
      showToast(t('error_updating_exam'), "destructive");
      console.log("L'erreur est : ", error);
    },

  });

  const handleUpdate = (e) => {
    e.preventDefault();
    const validDueDate = dueDate=="custom" ? customDate : null;
    mutationUpdateAssignment.mutate({ titleInput, instruction, points, dueDate: validDueDate, course_id, assignment_id: assignmentId });
  };

  

  

  return (
    <form onSubmit={status === t('edit_task') ? handleUpdate : handleSubmit}>
      <div className="fixed inset-0 bg-background flex flex-col z-50">
        <div className="flex items-center bg-white justify-between p-4 border-b border-gray-300">
          <div className="flex gap-4">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
              <X size={24} />
            </button>

            <div className="flex items-center space-x-2">
              <div className="bg-accent p-2 rounded-full">
                <ClipboardList size={24} className="text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{status}</h2>
            </div>

          </div>

          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${titleInput || instruction ? 'bg-primary' : 'bg-accent'}`}
            disabled={!titleInput && !instruction && mutationCreateAssignment.isLoading}
          >
            {mutationCreateAssignment.isLoading ? <ClipLoader color="#fff" size={22} /> : t('assign')}
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <div className='p-6 bg-white border border-gray-300 rounded-md'>
                <CustomInput
                  label={t('title')}
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                />

                <CustomTextarea
                  label={t('instructions_optional')}
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                />
                <div className="flex justify-start space-x-4 text-gray-600">
                  <button type="button" className="w-5 h-5 cursor-pointer">
                    <Bold size={16} />
                  </button>

                  <button type="button" className="w-5 h-5 cursor-pointer">
                    <Italic size={16} />
                  </button>

                  <button type="button" className="w-5 h-5 cursor-pointer">
                    <Underline size={16} />
                  </button>

                  <button type="button" className="w-5 h-5 cursor-pointer">
                    <List size={16} />
                  </button>

                  <button type="button" className="w-5 h-5 cursor-pointer">
                    <Strikethrough size={16} />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-300 bg-white mt-4 border rounded-lg shadow-sm ">
                <h3 className="text-lg mb-2 p-4">{t('attach')}</h3>

                <div className="flex justify-center gap-10 p-4 ">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center border rounded-full">
                      <Plus className="w-5 h-5" />
                    </div>
                   
                    <span className="mt-2 text-sm">{t('compose')}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center border rounded-full">
                      <Link className="w-5 h-5" />
                    </div>

                    <span className="mt-2 text-sm">{t('link')}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 flex items-center justify-center border rounded-full">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="mt-2 text-sm">{t('download')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-1 bg-white border-gray-300 p-3 border rounded-lg shadow-sm">
              <div className="mb-4">
                <label className="block text-gray-700">{t('for')}</label>
                <select className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" disabled>
                  <option>{courseName}</option>
                  <option>{t('all_students')}</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">{t('points')}</label>
                
                <select
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                >
                  <option>100</option>
                  <option>50</option>
                  <option>20</option>
                  <option>10</option>
                  <option>5</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">{t('deadline')}</label>
                <select
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                >
                  <option value="">{t('no_deadline')}</option>
                  <option value="custom">{t('select_date')}</option>
                </select>
                {dueDate === 'custom' && (
                  <input
                     type="datetime-local"
                    className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary mt-2"
                    onChange={(e) => setCustomDate(e.target.value)}
                  />
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  {status === t('edit_task') ? t('title') : 'Type' }
                </label>
                <select
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled
                  value={{title}}
                >
                  <option>{title}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TaskPopup;
