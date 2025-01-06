import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import SubjectDetails from './components/SubjectDetails';
import CourseRegister from './components/CourseRegister';
import StudentLogin from './components/StudentLogin';
import StudentHome from './components/StudentHome';
import StudentCourseRegister from './components/StudentCourseRegister';
import MarkAttendance from './components/MarkAttendence';
import EditAttendance from './components/EditAttendance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path="/subject-details" element={<SubjectDetails />} />
        <Route path="/course-register" element={<CourseRegister />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-home" element={<StudentHome />} />
        <Route path="/student-course-register" element={<StudentCourseRegister />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} />
        <Route path="/edit-attendance" element={<EditAttendance />} />
      </Routes>
    </Router>
  );
}

export default App;
