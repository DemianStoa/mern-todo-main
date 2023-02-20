import React, { useContext, useState, useRef, useEffect } from 'react';
import loginRequest from '../api/loginRequest';
import { useNavigate } from 'react-router-dom';
import { TokenContext } from '../App';
import { Link } from "react-router-dom"

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [token, setToken] = useContext(TokenContext);
  const emailRef = useRef()
  const errRef = useRef()

  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current.focus()
}, [])

useEffect(() => {
    setErrMsg('');
}, [email, password])



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginRequest({email, password})
  
      const accessToken = await res.accessToken
      setToken(res.accessToken);

      navigate('/');
    
    } catch(err) {
        console.log(err)
        if (!err.status) {
          setErrMsg('No Server Response');
      } else if (err.status === 400) {
          setErrMsg('Missing Username or Password');
      } else if (err.status === 401) {
          setErrMsg('Unauthorized');
      } else {
          setErrMsg(err.data?.message);
      }
      errRef.current.focus();
      };
  };

  return (
    <div className='login'>
      <h1>Login</h1>
      <div  ref={errRef}  style={{ color: 'red' }} aria-live="assertive">{errMsg}</div>
      <form onSubmit={handleLogin}>
        <div className='input'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className='input'>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div className='forget'>forget your password?  <Link className="link" to="/forget">Reset</Link></div> 
        
        <button>Submit</button>
        <div  className="persist">
        <label htmlFor="persist">Remember me</label><input id='persist'
                           type="checkbox"/>
        </div>
         <div>don't have an account?  <Link className="link" to="/register">Register</Link></div> 
         
      </form>
    </div>
  );
};
