import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchGradeInfoForTeacherQuery } from "../query/CourseParticipantsQuery";

export const useCourseParticipants = (courseId) => {
  const { data: dataCourseParticipants, isLoading: isLoadingCourseParticipants, refetch } = useQuery({
    queryKey: ['course participants', courseId],  
    queryFn: () => FetchGradeInfoForTeacherQuery({ queryKey: [courseId] }),  
  });

  const selectedCourseParticipants = useMemo(() => {
    if (!dataCourseParticipants) return null;

    const { teacher, students } = dataCourseParticipants;

    return {
      teacher,
      students,
    };
  }, [dataCourseParticipants]);

  return {
    courseParticipants: selectedCourseParticipants,
    isLoading: isLoadingCourseParticipants,
    refetch,
  };
};
