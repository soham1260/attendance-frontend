import React, { useEffect, useState } from 'react';
import styles from './StudentHome.module.css';
import { useNavigate } from 'react-router-dom'

const StudentHome = () => {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'token': localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student data.');
        }

        const data = await response.json();
        setStudent(data.student);
        setCourses(data.courses);
      } catch (err) {
        console.error(err);
        setError('An error occurred while fetching data.');
      }
    };

    fetchStudentData();
  }, []);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!student) {
    return <p style={{ textAlign: 'center' }}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles['logout-button']} onClick={() => { localStorage.clear(); navigate("/student-login") }}>
                    Logout
                </button>
            </div>
            <h2>Student Dashboard</h2>
            <div className={styles.section}>
                <h3>Personal Details</h3>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Roll Number:</strong> {student.rollNo}</p>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year:</strong> {student.year}</p>
            </div>
            <div className={styles.section}>
                <h3>Courses Taken</h3>
                {courses.length > 0 ? (
                    <ul>
                        {courses.map((course) => (
                            <li key={course._id}>
                                <strong>{course.name}</strong> ({course.code}) - Taught by {course.teacher.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No courses found.</p>
                )}
                <button className={styles['register-button']} onClick={() => { navigate("/student-course-register") }}>
                    Register to New Course.
                </button>
            </div>
        </div>
  );
};

export default StudentHome;
