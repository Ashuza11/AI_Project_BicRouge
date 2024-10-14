import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { FetchAllAssignmetsForStudent } from '../query/AssignmentQuery'


const useAssignmentsStudent = (courseId, studentID) => {
  const { idUser } = useContext(UserContext);


  const { data: dataStudentAssignment, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['assignmentStudent', { idUser:studentID??idUser }, { course_id: courseId }],
    queryFn: FetchAllAssignmetsForStudent,
  });

  const assignmentsStudent = useMemo(()=>dataStudentAssignment, [dataStudentAssignment]);
  const isLoadingAssignmentsStudent = useMemo(()=>isLoadingAssignments, [isLoadingAssignments]);

  return  { assignmentsStudent, dataStudentAssignment, isLoadingAssignmentsStudent, isLoadingAssignments }
}

export default useAssignmentsStudent
