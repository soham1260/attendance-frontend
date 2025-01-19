import React, { useState, useEffect } from "react";
import styles from './MarkAttendance.module.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const MarkAttendance = () => {
  const location = useLocation();
  const { subjectName, subjectCode, selectedSubject } = location.state || {};

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!subjectName) return;

    // Fetch the list of students enrolled in the course
    const fetchStudents = async () => {
      try {
        //console.log(subjectCode);
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/getEnrolledStudents`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ subject: subjectCode }),
        });

        const data = await response.json();
        if (response.ok) {
          setStudents(data.students || []);
        } else {
          setMessage(data.error || "Failed to fetch students.");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setMessage("An error occurred while fetching students.");
      }
    };

    fetchStudents();
  }, [subjectName]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) // Remove if already selected
        : [...prev, studentId] // Add if not already selected
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (selectedStudents.length === 0) {
      setMessage("Please select at least one student.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/markAttendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subjectName,
          enroll_no: selectedStudents,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Attendance marked successfully!");
        navigate("/subject-details", { state: { 
          subject: selectedSubject, 
          successMessage: "Attendance was successfully marked!" 
        } });
      } else {
        setMessage(data.error || "Failed to mark attendance.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      setMessage("An error occurred while marking attendance.");
    }
  };

  if (!subjectName) {
    return <p>No subject selected for marking attendance</p>;
  }

  return (
    <div>
      <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"20px"}}>
        <p style={{fontSize:"40px"}}>Mark Attendance</p>
        <p style={{fontSize:"30px"}}>Subject: {subjectCode} {subjectName}</p>
      </div>
      
      <div className={styles.container}>
            <div className={styles['attendance']}>
              {students.length > 0 ? (
                  <form onSubmit={handleSubmit}>
                      <div className={styles['student-list']}>
                          {students.map((student) => (
                              <label key={student.rollNo} className={styles['student-label']}>
                                  <p style={{margin:"0px"}}>
                                    {student.rollNo}
                                  </p>
                                  <p style={{margin:"0px"}}>
                                    {student.name}
                                  </p>
                                  <input
                                      type="checkbox"
                                      value={student.rollNo}
                                      onChange={() => handleCheckboxChange(student.rollNo)}
                                      checked={selectedStudents.includes(student.rollNo)}
                                  />
                              </label>
                          ))}
                      </div>
                      <button type="submit" className={styles['submit-button']}>
                          Mark Attendance
                      </button>
                  </form>
              ) : (
                  <p>No students found for this course.</p>
              )}
              {message && (
                  <p
                      className={`${styles.message} ${
                          message.includes("successfully") ? styles['message-success'] : styles['message-error']
                      }`}
                  >
                      {message}
                  </p>
              )}
              <button
                  className={styles['back-button']}
                  onClick={() => navigate("/subject-details", { state: { subject: selectedSubject } })}
              >
                  Back
              </button>
            </div>
        </div>
    </div>
  );
};

export default MarkAttendance;
