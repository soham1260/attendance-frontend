import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Chart from './Chart';
import Statistics from './Statistics';
import { useNavigate } from 'react-router-dom'
import CourseRegister from './CourseRegister';
import styles from './SubjectDetails.module.css';

const SubjectDetails = () => {
  // Extract subject from location state
  const [attendanceExists, setAttendanceExists] = useState(false);
  const location = useLocation();
  const { subject,  } = location.state || {};
  const { successMessage } = location.state || {};
  const navigate = useNavigate();

  //console.log(subject);

  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/attendanceExistCheck?subjectCode=${subject.code}&date=${new Date().toDateString()}`);
        const result = await response.json();

        if (result.exists) {
          setAttendanceExists(true);
        } else {
          setAttendanceExists(false);
        }
      } catch (error) {
        console.error('Error checking attendance:', error);
      }
    };

    checkAttendance();
  }, [subject.code]);

  // Handle case where no subject is passed in location.state
  if (!subject) {
    return <p>No subject selected</p>;
  }

  return (
    <div className={styles.container}>
            {successMessage && (
                <p className={styles['success-message']}>
                    {successMessage}
                </p>
            )}
            <p style={{fontSize:"50px"}}>Subject Details</p>
            <p style={{fontSize:"20px"}}>Subject Name: {subject.name}</p>
            <p style={{fontSize:"20px"}}>Subject Code: {subject.code}</p>

            <div className={styles['buttons-container']}>
                <button
                    className={styles['home-button']}
                    onClick={() => navigate("/home")}
                >
                    Home
                </button>
                {!attendanceExists && (
                    <button
                      className={styles['home-button']}
                      onClick={() =>
                        navigate("/mark-attendance", {
                          state: {
                            subjectName: subject.name,
                            subjectCode: subject.code,
                            selectedSubject: subject,
                          },
                        })
                      }
                    >
                      Mark Attendance
                    </button>
                )}
                <button
                    className={styles['home-button']}
                    onClick={() =>
                        navigate("/edit-attendance", {
                            state: {
                                subjectName: subject.name,
                                subjectCode: subject.code,
                                subject: subject,
                            },
                        })
                    }
                >
                    Edit Attendance
                </button>
            </div>

            {/* Rendering the Chart and Statistics components */}
            <div className={styles.chart}>
                <Chart subjectProp={subject.name} />
            </div>
            <div className={styles.statistics}>
                <Statistics subjectProp={subject.name} />
            </div>
        </div>

  );
};

export default SubjectDetails;
