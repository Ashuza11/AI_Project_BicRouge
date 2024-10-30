import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { useToast } from '../context/ToastContext'; 
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

const StudentGradeTable = ({ assignmentStudentInfo, isLoading, courseInfo }) => {
  const { course_id } = useParams();
  const { showToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();


  // Restructure data using useMemo
  const studentsAssignmentsWithGrades = useMemo(() => {
    if (!assignmentStudentInfo) return null;

    const studentMap = {};

    assignmentStudentInfo.forEach(({ assignmentInfo, studentInfo }, assIndex) => {
      studentInfo.forEach((student) => {
        const { id, name, postname, email, total_grade } = student;

        if (!studentMap[id]) {
          studentMap[id] = {
            id,
            name,
            postname,
            email,
            assignments: Array(assignmentStudentInfo.length).fill(null),
            total_grade: 0,
          };
        }

        studentMap[id].assignments[assIndex] = {
          assignmentId: assignmentInfo.id,
          title: assignmentInfo.title.split(" ")[0], 
          due_date: assignmentInfo.due_date,
          points: assignmentInfo.points,
          grade: total_grade,
        };

        studentMap[id].total_grade += total_grade;
      });
    });

    return Object.values(studentMap);
  }, [assignmentStudentInfo]);

  const navigate = useNavigate();

  const handleRowClick = (student, assignmentId) => {
    const query = new URLSearchParams();
    query.set("title", assignmentStudentInfo?.find(ass => ass.assignmentInfo.id == assignmentId)?.assignmentInfo?.title);
    query.set("assignmentId", assignmentId);
    query.set("studentId", student.id);

    navigate(`/teacher/course/${course_id}/notes/${student.id}/assignments/${assignmentId}?${query.toString()}`, {
      state: { assignmentId, studentId: student.id }
    });
  };

  if (isLoading) {
    return <ClipLoader color="#D32F2F" className="flex justify-center" size={50} />;
  }

  if (!assignmentStudentInfo || assignmentStudentInfo.length === 0) {
    return <p>{t('no_data_available')}</p>;
  }

  const calculateClassAverage = (studentInfoArray) => {
    const totalGrades = studentInfoArray.reduce((acc, student) => {
      return acc + (student.total_grade || 0);
    }, 0);

    const numberOfStudentsWithGrades = studentInfoArray.filter(student => student.total_grade !== null && student.total_grade !== undefined).length;

    return numberOfStudentsWithGrades > 0
      ? (totalGrades / numberOfStudentsWithGrades).toFixed(2)
      : null;
  };

  const getInitials = (name, postname) => {
    if (!name || !postname) return '';
    const firstNameInitial = name.charAt(0).toUpperCase();
    const lastNameInitial = postname.charAt(0).toUpperCase();
    return `${firstNameInitial}${lastNameInitial}`;
  };

  // Function to export the data to Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const workbook = XLSX.utils.book_new();

      const worksheetData = [
        [`${courseInfo.name}`],
        ["№", t('name'), ...assignmentStudentInfo.map(ass => ass.assignmentInfo.title.split(" ")[0]), "Total"]
      ];

      studentsAssignmentsWithGrades.forEach((student, index) => {
        worksheetData.push([
          index + 1,
          `${student.name} ${student.postname}`,
          ...student.assignments.map(ass => ass ? ass.grade : t('no_tests_submitted')),
          student.total_grade
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");

      XLSX.writeFile(workbook, `${courseInfo.name}_grades.xlsx`);
      showToast(t('file_export_success'), { type: "success" });
    } catch (error) {
      showToast(t('file_export_failure'), { type: "error" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full bg-white border border-gray-200 overflow-x-auto whitespace-nowrap">
        {/* Add the Export to Excel button */}
        <div className="flex justify-between items-center p-4">
          <span className="text-lg font-semibold">{courseInfo.name}</span>
          <button
            onClick={exportToExcel}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center"
            disabled={isExporting}
          >
            {isExporting && <ClipLoader color="#fff" size={22} className="mr-2" />}
            {t('export_excel')}
          </button>
        </div>
        
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="text-gray-700">
              <th className="py-2 px-4 text-left">{t('student')}</th>
              {assignmentStudentInfo.map((assignmentData, index) => (
                <th key={index} className="py-2 px-4 text-left">
                  <span className="block text-xs text-gray-500">
                    {assignmentData.assignmentInfo.due_date
                      ? new Date(assignmentData.assignmentInfo.due_date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })
                      : t('no_due_date')}
                  </span>
                  <span className="text-primary hover:underline text-sm py-2 border-b">
                    {assignmentData.assignmentInfo.title.split(" ")[0]} 
                  </span>
                  <span className="block mt-2 text-xs text-gray-500">
                    {t('about')} {assignmentData.assignmentInfo.points || 'N/A'}
                  </span>
                </th>
              ))}
              <th className="py-2 px-4 text-left">
                <span className="text-primary text-sm">{t('course_total')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50">
              <td className="py-2 px-4 flex items-center">
                <span className="text-gray-600">{t('test_average')}</span>
              </td>
              {assignmentStudentInfo.map((assignmentData, index) => {
                const classAverage = calculateClassAverage(assignmentData.studentInfo);
                return (
                  <td key={index} className="py-2 px-4 text-left">
                    <span>{classAverage !== null ? classAverage : ''}</span>
                  </td>
                );
              })}
              <td className="py-2 px-4 text-left font-bold"></td>
            </tr>

            {studentsAssignmentsWithGrades.map((student, studentIndex) => (
              <tr key={studentIndex} className="border-t">
                <td className="py-2 px-4 flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full bg-gray-300 text-secondary flex items-center justify-center"
                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                  >
                    {getInitials(student.name, student.postname)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{student.name} {student.postname}</p>
                    <p className="text-gray-500 text-sm">{student.email}</p>
                  </div>
                </td>

                {student.assignments.map((assignment, index) => (
                  assignment ? (
                    <td
                      key={index}
                      className="py-2 px-4 text-left hover:bg-background cursor-pointer"
                      onClick={() => handleRowClick(student, assignment?.assignmentId)}
                    >
                      <span className="text-green-600">
                        {assignment?.grade}
                      </span>
                    </td>
                  ) : <td key={index} className="py-2 px-4 text-left">{t('no_tests_submitted_repeat')}</td>
                ))}

                <td className="py-2 px-4 text-left font-bold">
                  {student?.total_grade}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentGradeTable;