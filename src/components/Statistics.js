import React,{ useState,useEffect } from 'react'
import excel from "../assets/excel.png"

export default function Statistics({ subjectProp }) {
    const [subject, setSubject] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data
  const fetchAttendanceData = async (currentSubject) => {
    try {
      const DATA_URL = `${process.env.REACT_APP_API_BASE_URL}/getNoSubjectStatistics/${currentSubject}`;
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectProp) {
      setSubject(subjectProp);
      subjectProp.length && fetchAttendanceData(subjectProp);
    }
  }, [subjectProp]);
  return (
    <>
    {
        !loading && (
            <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                <h3>Average Attendace - {data.averageAttendancePercentage}%</h3>
                <h3>Classes Taken - {data.totalDays}</h3>
                <button style={{borderRadius:"5px",display:"flex",justifyContent:"space-between",backgroundColor:"#21D19F"}}
                    onClick={() => {
                        fetch(process.env.REACT_APP_API_BASE_URL+"/getAttendanceReport/" + subject)
                        .then((response) => {
                            if (!response.ok) {
                            throw new Error('Network response was not ok');
                            }
                            return response.blob();
                        })
                        .then((blob) => {
                            // Create a URL for the blob
                            const url = window.URL.createObjectURL(blob);

                            // Create a link element to download the file
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${subject}-Attendance-Report.xlsx`;
                            document.body.appendChild(a);
                            a.click();

                            // Clean up
                            a.remove();
                            window.URL.revokeObjectURL(url);
                        })
                        .catch((error) => {
                            console.error('Error downloading attendance report:', error);
                        });
                    }}
                    >
                    <p style={{padding:"0",margin:"0",color:"white",fontSize:"large",paddingRight:"10px"}}>Download Attendance</p>
                    <img style={{padding:"0",margin:"0"}} src={excel} alt="excel logo" />
                </button>
            </div>
        )
    }
    </>
  )
}
