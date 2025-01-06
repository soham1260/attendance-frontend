import React from 'react';
import { useLocation } from 'react-router-dom';
import Chart from './Chart';
import Statistics from './Statistics';
import { useNavigate } from 'react-router-dom'
import CourseRegister from './CourseRegister';
import styles from './SubjectDetails.module.css';

const SubjectDetails = () => {
  // Extract subject from location state
  const location = useLocation();
  const { subject } = location.state || {};
  const navigate = useNavigate();

  // Handle case where no subject is passed in location.state
  if (!subject) {
    return <p>No subject selected</p>;
  }

  return (
    <div className={styles.container}>
            <h1>Subject Details</h1>
            <p>Subject Name: {subject.name}</p>
            <p>Subject Code: {subject.code}</p>

            <div className={styles['buttons-container']}>
                <button
                    className={styles['home-button']}
                    onClick={() => navigate("/home")}
                >
                    Home
                </button>
                <button
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
                <button
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
