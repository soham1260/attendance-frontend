import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(''); // For signup
  const [isSigningUp, setIsSigningUp] = useState(false); // Toggle between login and signup
  const [message, setMessage] = useState('');

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isSigningUp ? '/signup' : '/login';
    const body = isSigningUp ? { name, email, department, phone, password } : { email, password };

    try {
      const response = await fetch(process.env.REACT_APP_API_BASE_URL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`${isSigningUp ? 'Signup' : 'Login'} successful!`);
        if (!isSigningUp) {
          localStorage.setItem('token', data.token);
          navigate('/');
        } else {
          setIsSigningUp(false); // Switch to login after successful signup
        }
      } else {
        setMessage(data.message || `${isSigningUp ? 'Signup' : 'Login'} failed`);
      }
    } catch (error) {
      console.error(error);
      setMessage(`An error occurred while ${isSigningUp ? 'signing up' : 'logging in'}`);
    }
  };

  return (
    <div className={styles.container}>
            <h2>{isSigningUp ? 'Teacher Signup' : 'Teacher Login'}</h2>
            <form onSubmit={handleSubmit}>
                {isSigningUp && (
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles['input-field']}
                        />
                    </div>
                )}
                <div className={styles['form-group']}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles['input-field']}
                    />
                </div>
                {isSigningUp && (
                    <div className={styles['form-group']}>
                        <input
                            type="text"
                            placeholder="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            required
                            className={styles['input-field']}
                        />
                    </div>
                )}
                {isSigningUp && (
                    <div className={styles['form-group']}>
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className={styles['input-field']}
                        />
                    </div>
                )}
                <div className={styles['form-group']}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles['input-field']}
                    />
                </div>
                <button type="submit" className={styles['submit-button']}>
                    {isSigningUp ? 'Signup' : 'Login'}
                </button>
            </form>
            {message && (
                <p className={`${styles.message} ${message.includes('successful') ? styles.success : styles.error}`}>
                    {message}
                </p>
            )}
            <p className={styles['switch-mode']}>
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                    onClick={() => {
                        setIsSigningUp(!isSigningUp);
                        setMessage('');
                    }}
                    className="no-cursor-hover"
                >
                    {isSigningUp ? 'Login here' : 'Signup here'}
                </button>
            </p>
            <button onClick={() => navigate('/student-login')} className={styles['student-login-button']}>
                Go to Student Login
            </button>
        </div>
  );
};

export default Auth;
