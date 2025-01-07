import React, { useState, useEffect } from 'react';
import styles from './StudentCourseRegister.module.css';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const StudentCourseRegister = () => {
  const [availableCourses, setAvailableCourses] = useState([]); // To store available courses
  const [selectedCourse, setSelectedCourse] = useState(''); // To track selected course
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch available courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/getCourses');
        const result = await response.json();
        if (response.ok) {
          setAvailableCourses(result.courses); // Assuming the response has a `courses` field
        } else {
          setMessage('Failed to fetch courses.');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setMessage('An error occurred while fetching courses.');
      }
    };
    fetchCourses();
  }, []);

  // Check if the student is logged in (optional)
  useEffect(() => {
    const studentId = localStorage.getItem('token'); // Assuming token is stored in local storage
    if (!studentId) {
      setMessage('You must be logged in to register for a course.');
      setTimeout(() => navigate('/student-login'), 2000); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleRegisterCourse = async (e) => {
    e.preventDefault();

    const studentId = localStorage.getItem('token'); // Retrieve student ID from storage or context
    if (!studentId) {
      setMessage('Student ID is missing. Please log in again.');
      return;
    }

    if (!selectedCourse) {
      setMessage('Please select a course to register for.');
      return;
    }

    const courseData = {
      courseCode: selectedCourse,
      studentId: studentId,
    };

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + '/registerStudent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${studentId}`,
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Successfully registered for the course: ${result.course.name}`);
        setSelectedCourse('');
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error registering for course:', error);
      setMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
            <h2>Register for a Course</h2>
            <form onSubmit={handleRegisterCourse}>
                <div className={styles['form-group']}>
                    <label>Select Course:</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                    >
                        <option value="">--Select a Course--</option>
                        {availableCourses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.name} - {course.code}
                            </option>
                        ))}
                    </select>
                </div>

                <button className={styles['home-button']} onClick={() => { navigate("/student-home") }}>
                    Home
                </button>
                <button type="submit">
                    Register for Course
                </button>
            </form>

            {message && <p className={styles.message}>{message}</p>}
        </div>
  );
};

export default StudentCourseRegister;
