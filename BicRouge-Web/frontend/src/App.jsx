import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AssignmentContentHOC } from './components/AssignmentContent';
import AssignmentNotes from './components/AssignmentNotes';
import CourseGrades from './components/CourseGrades';
import CourseStream from './components/CourseStream';
import CourseStudents from './components/CourseStudents';
import CourseTasks from './components/CourseTasks';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Compose from './pages/Compose';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ResponseForm from './pages/ResponseForm';
import SignupPage from './pages/SignupPage';

const App = () => {
  const [message, setMessage] = useState("");

  const getAppNameMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch("/api/home", requestOptions);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Not a JSON response");
      }      
      setMessage(data.message);
    } catch (error) {
      console.error("Failed to fetch app name message:", error.message);
    }
  }

  useEffect(() => {
    getAppNameMessage();
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="*" element={<NotFoundPage />}/>
          <Route path = "/" element = {<HomePage message={message} />} />
          <Route path="/login" element={<PublicRoute element={LoginPage} />} />
          <Route path="/signup" element={<PublicRoute element={SignupPage} />} />

          <Route path="/teacher/*" Component={ProtectedRoute} >
            <Route path='dashboard' Component={Dashboard} /> 
            <Route path='course/:course_id/*' Component={CourseDetail} >
              <Route path='tache' Component={CourseTasks}/>
              <Route path='flux' Component={CourseStream}/>
              <Route path='apprenants' Component={CourseStudents}/>
              <Route path='notes' Component={CourseGrades}/>
              <Route path='notes/:student_id/assignments/:assignmentId' Component={AssignmentContentHOC}/>
            </Route>
            <Route path='courses/:courseId/assignments/:assignmentId' Component={Compose} /> 
          </Route>
          
          <Route path="/student/*" Component={ProtectedRoute} >
            <Route path="dashboard" Component={Dashboard} />
            <Route path="course/:course_id/*" Component={CourseDetail} >
              <Route path='flux' Component={CourseStream}/>
              <Route path='notes' Component={CourseGrades}/>
              <Route path='apprenants' Component={CourseStudents}/>
            </Route>
            <Route path='courses/:courseId/assignments/:assignmentId' Component={ResponseForm} /> 
            <Route path='courses/:courseId/assignments/:assignmentId/notes' Component={AssignmentNotes} /> 
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;