import React,{ useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css';
import Chart from './Chart'
import Statistics from './Statistics'
import CourseRegister from './CourseRegister'

//import { TextField, Button, Typography, Box } from '@mui/material';

export default function Home() {

  const [data, setData] = useState({})
  const [subject, setSubject] = useState([])
  const [teacher, setTeacher] = useState([])

  let navigate = useNavigate();

  const handleSubjectSelect = (selectedSubject) => {
    setSubject(selectedSubject.name);
    navigate(`/subject-details`, { state: { subject: selectedSubject } }); // Pass subject data via state
  };

  const goToCourseRegister = () => {
    navigate('/course-register');
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/getNameAndSubjects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json','token' : localStorage.getItem('token') }
        });

        if (response.status === 404) {
          const json = await response.json();
          console.error('No subjects found for this teacher');
          setData(null);
          setTeacher(json.teacher); 
          setSubject(''); 
          return; 
        }
  
        if (!response.ok) {
          // Handle other non-200 responses
          console.error('Failed to fetch data:', response.statusText);
          navigate('/login'); // Redirect to login for authentication issues
          return;
        }

        const json = await response.json();
        setData(json);
        setSubject(json.subjects[0].name);
        setTeacher(json.teacher)

        if (json.success) {
          localStorage.setItem('token', json.authtoken);
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
          navigate('/login')
      }
    };

    fetchData();
  },[navigate]);

  return (
    <div className={styles.container}>
            <div className={styles.header}>
                <h1>Welcome, {teacher}</h1>
                <button
                    className={styles['logout-button']}
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                >
                    Logout
                </button>
            </div>
            <div className={styles.dropdown}>
                <span
                    className={`${styles['courses-text']}`}
                >
                    Courses
                </span>
                <ul className={styles['dropdown-menu']}>
                    {data?.subjects?.length > 0 ? (
                        data.subjects.map((subject) => (
                            <li key={subject.code}>
                                <button
                                    className={styles['dropdown-item']}
                                    onClick={() => handleSubjectSelect(subject)}
                                >
                                    {subject.code} {subject.name}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className={styles['no-subjects']}>No subjects available</li>
                    )}
                </ul>
            </div>
            <button
                onClick={goToCourseRegister}
                className={styles['course-register-button']}
            >
                Go to Course Register
            </button>
        </div>
  )
}
