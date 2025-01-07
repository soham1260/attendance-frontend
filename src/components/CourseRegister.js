import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseRegister.css';

const CourseRegister = () => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [students, setStudents] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Check if the teacher is logged in (optional based on your auth flow)
  useEffect(() => {
    const teacherId = localStorage.getItem('token'); // Replace with your actual auth logic
    if (!teacherId) {
      setMessage('You must be logged in as a teacher to register a course.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleRegisterCourse = async (e) => {
    e.preventDefault();

    const teacherId = localStorage.getItem('token'); // Retrieve teacher ID from storage or context
    if (!teacherId) {
      setMessage('Teacher ID is missing. Please log in again.');
      return;
    }

    const courseData = {
      name: courseName,
      code: courseCode,
      teacherId,
      //students: students.split(',').map((student) => student.trim()), // Convert to array
    };

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/registerCourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${teacherId}`,
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Course registered successfully: ${result.subject.name}`);
        setCourseName('');
        setCourseCode('');
        setStudents('');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error registering course:', error);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="container">
  <h2>Register a New Course</h2>
  <form onSubmit={handleRegisterCourse}>
    <div>
      <label>Course Name:</label>
      <input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        required
      />
    </div>
    <div>
      <label>Course Code:</label>
      <input
        type="text"
        value={courseCode}
        onChange={(e) => setCourseCode(e.target.value)}
        required
      />
    </div>
    <button
      className="home-button"
      type="button"
      onClick={() => {
        navigate("/home");
      }}
    >
      Home
    </button>
    <button type="submit">Register Course</button>
  </form>
  {message && <p className="message">{message}</p>}
</div>

  );
};

export default CourseRegister;
