import React, { useState, useEffect } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

  const Chart = ({ subjectProp }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data
  const fetchAttendanceData = async (currentSubject) => {
    try {
      const DATA_URL = `http://localhost:5000/getNoOfStudentsAttended/${currentSubject}`;
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();

      // Aggregate data by date
      const aggregatedData = result.attendanceData?.reduce((acc, { date, studentsPresent }) => {
        if (acc[date]) {
          acc[date] += studentsPresent;
        } else {
          acc[date] = studentsPresent;
        }
        return acc;
      }, {});

      // Convert aggregated data to array format
      const processedData = Object.entries(aggregatedData || {}).map(([date, studentsPresent]) => ({
        date,
        studentsPresent,
      }));

      setData(processedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectProp) {
      subjectProp.length && fetchAttendanceData(subjectProp);
    }
  }, [subjectProp]);

  return (
    <div>
      <h3 style={{display:"flex",justifyContent:"center"}}>Statistics</h3>
      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="studentsPresent" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No attendance data available.</p>
      )}
    </div>
  );
};

export default Chart;
