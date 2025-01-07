import React, { useState, useEffect } from 'react';
import styles from './EditAttendance.module.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const EditAttendance = () => {

  const location = useLocation();
  const { subjectName, subjectCode, subject } = location.state || {};
  const navigate = useNavigate();

  const [dates, setDates] = useState([]); // Stores available attendance dates
  const [selectedDate, setSelectedDate] = useState(''); // Selected date for attendance
  const [students, setStudents] = useState([]); // Students and attendance status
  const [message, setMessage] = useState(''); // Success/Error messages

  //console.log(subjectCode);

  // Fetch attendance records for the course
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/attendance/dates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ course: subjectCode }),
        });
        const data = await response.json();
        if (response.ok) {
          setDates(data.dates);
        } else {
          console.error('Error fetching dates:', data.error);
        }
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
    };

    fetchDates();
  }, [subjectCode]);

  // Fetch attendance data for the selected date
  const fetchAttendance = async (date) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course: subjectCode, date }),
      });
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students); // Array of { rollNo, name, present }
      } else {
        console.error('Error fetching attendance:', data.error);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchAttendance(e.target.value);
  };

  // Toggle attendance status for a student
  const toggleAttendance = (rollNo) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.rollNo === rollNo ? { ...student, present: !student.present } : student
      )
    );
  };

  // Save updated attendance
  const saveAttendance = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/attendance/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: subjectCode,
          date: selectedDate,
          students,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Attendance updated successfully!');
      } else {
        setMessage(`Failed to update attendance: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving attendance:', error);
      setMessage('Failed to update attendance.');
    }
  };

  // Delete selected attendance record
  const deleteAttendance = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/attendance/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: subjectCode,
          date: selectedDate,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Attendance record deleted successfully!');
        setDates((prevDates) => prevDates.filter((d) => d !== selectedDate));
        setSelectedDate('');
        setStudents([]);
      } else {
        setMessage(`Failed to delete attendance: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting attendance:', error);
      setMessage('Failed to delete attendance.');
    }
  };

  return (
    <div className={styles.container}>
            <h1>Edit Attendance</h1>
            <button
                className={styles['back-button']}
                onClick={() => navigate("/subject-details", { state: { subject: subject } })}
            >
                Back
            </button>
            <div className={styles['select-container']}>
                <label htmlFor="date-select">Select a Date:</label>
                <select
                    id="date-select"
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    <option value="" disabled>Select a date</option>
                    {dates.map((date) => (
                        <option key={date} value={date}>{date}</option>
                    ))}
                </select>
            </div>
            {selectedDate && (
                <div>
                    <h2>Attendance for {selectedDate}</h2>
                    <table className={styles['attendance-table']}>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Present</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.rollNo}>
                                    <td>{student.rollNo}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleAttendance(student.rollNo)}
                                            className={`${styles['attendance-button']} ${
                                                student.present ? styles.present : styles.absent
                                            }`}
                                        >
                                            {student.present ? 'Present' : 'Absent'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className={styles['save-button']} onClick={saveAttendance}>
                        Save Changes
                    </button>
                    <button className={styles['delete-button']} onClick={deleteAttendance}>
                      Delete Attendance
                    </button>
                </div>
            )}
            {message && <p className={styles.message}>{message}</p>}
        </div>
  );
};

export default EditAttendance;
