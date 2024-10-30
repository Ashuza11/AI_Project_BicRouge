import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { getCoursStudent, getCoursUser } from "../query/coursesQuery";

/**
 * 
 * @param {string|undefined} courseId
 * @returns 
 */
const useCourse = (courseId) => {
  const { idUser, userRole } = useContext(UserContext);

  const queryFn = userRole === "teacher" ? getCoursUser : getCoursStudent;
  const queryKey = userRole === "teacher" ? ['cours'] : ['coursStudent', { idUser }];


  const { data : cours, isLoadingCours } = useQuery({
    queryKey: userRole ? queryKey : null,
    queryFn: userRole ? queryFn : null,
  });

  const coursStudent = useMemo(()=>cours, [cours]);
  const isLoadingCoursStudent = useMemo(()=>isLoadingCours, [isLoadingCours]);

  const  selectedCourse  = useMemo(()=>{
    const result = userRole === "teacher" ? cours : coursStudent;
    return courseId && result
      ? result.find((c) => c.id == courseId) 
      : null;
  },[courseId,cours, coursStudent, userRole]) 
  
  return  { selectedCourse, cours, isLoadingCoursStudent, isLoadingCours, coursStudent }
}

export default useCourse