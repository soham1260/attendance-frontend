import React,{ useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Chart from './Chart'
import Statistics from './Statistics'
export default function Home() {

  const [data, setData] = useState({})
  const [subject, setSubject] = useState([])
  const [teacher, setTeacher] = useState([])

  let navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_BASE_URL+'/getNameAndSubjects', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json','token' : localStorage.getItem('token') }
        });
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
  },[]);
  

  return (
    <div className='container' style={{marginTop:"2%"}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ marginBottom: "1%" }}>Welcome, {teacher}</h1>
        <button style={{borderRadius:"5px"}} onClick={() => {localStorage.clear();navigate("/login")}}>Logout</button>
      </div>
      <div className="dropdown">
        <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          {subject}
        </a>

        <ul className="dropdown-menu">
          {data?.subjects?.length > 0 ? (
            data.subjects.map((subject) => (
              <li key={subject.code}>
                <a 
                  className="dropdown-item" 
                  href="#" 
                  onClick={() => setSubject(subject.name)}>
                  {subject.code} {subject.name}
                </a>
              </li>
            ))
          ) : (
            <li>No subjects available</li> // Optional fallback message
          )}
        </ul>
      </div>

      <Chart subjectProp={subject}/>
      <Statistics subjectProp={subject}/>
    </div>
  )
}
