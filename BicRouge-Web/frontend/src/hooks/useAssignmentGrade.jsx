import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchGradeInfoQuery, FetchGradeInfoForTeacherQuery } from "../query/GradeInfoQuery";


export const useAssignmentGrade = (idUser, assignmentId) => {
  const { data: dataStudentGradingInfo, isLoading: isLoadingStudentGradingInfo, refetch } = useQuery({
    queryKey: ['gradingInfo', idUser, assignmentId],  
    queryFn: () => FetchGradeInfoQuery({ queryKey: [idUser, assignmentId] }),  
  });

  
  const selectedGradingInfo = useMemo(() => {
    if (!dataStudentGradingInfo) return null;

    const { grading_feedback, total_grade, advice, state } = dataStudentGradingInfo;
    
    return {
      gradingFeedback: grading_feedback,
      totalGrade: total_grade,
      advice: advice,
      state : state
    };
  }, [dataStudentGradingInfo]);

  return {
    gradingInfo: selectedGradingInfo,
    isLoading: isLoadingStudentGradingInfo,
    refetch,
  };
}

export const useStudentGradingForTeacher = (course_id) => {

  const { data: dataStudentGradingInfo, isLoading: isLoadingStudentGradingInfo, refetch } = useQuery({
    queryKey: ['assignmentStudentInfo', course_id],
    queryFn: () => FetchGradeInfoForTeacherQuery({ queryKey: [course_id] }),
  });


  const selectedStudentGradingInfo = useMemo(() => {
    if (!dataStudentGradingInfo) return null;

    // Map through the list of assignments to format the data
    return dataStudentGradingInfo.map((assignmentData) => {
      const { assignment, students } = assignmentData;
      return {
        assignmentInfo: assignment,
        studentInfo: students,
      };
    });
  }, [dataStudentGradingInfo]);

  return {
    assignmentStudentInfo: selectedStudentGradingInfo,
    isLoadingGradeInfo: isLoadingStudentGradingInfo,
    refetch,
  };
};




