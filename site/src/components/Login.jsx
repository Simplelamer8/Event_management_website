import React from 'react'
import styles from "./Login.module.css";
import { useState } from 'react';
import axios from 'axios'

export default function Login({navigate}) {
  const [logReg, setLogReg] = useState("login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  async function handleUserLogReg(e)
  {
    e.preventDefault();
    if (confirm != password && logReg === 'register')
    {
      alert("Пароли не совпадают");
      return;
    }

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email))
    {
      alert("Uh-oh! Формат электронной почты неправильный");
      return;
    }

    if (logReg === 'register')
    {
      await axios.post("http://localhost:3000/register", 
      {
        email,
        password
      })
      .then ((response) => 
      {
        if (response.data === 'Already exists')
        {
          alert("Данный пользователь уже существует")
          return;
        }
        else
        {
          alert("Вы успешно зарегистрированы");
          navigate('/');
        }
      })
      .catch((error) => 
      {
        alert("Что то пошло не так :(");
        console.log(error);
      })
    }
    else 
    {
      axios.post("http://localhost:3000/login", 
      {
        email,
        password
      })
      .then((response) => 
      {
        console.log(response);
        if (response.data === "Success")
        {
          alert("Вы вошли в аккаунт");
          localStorage.setItem("user", email);
          navigate('/');
        }
        else if (response.data === "Wrong password")
        {
          alert("Неправильный пароль");
          return;
        }
        else 
        {
          alert("Данный пользователь не существует");
          return;
        }
      })
      .catch((error) => 
      {
        console.log(error);
        alert("Что то пошло не так :(");
      })
    }

  }

  return (
    <div className={styles.background}>
      <div className={styles.card}>
        <div>
          <button className={logReg === 'login' ? styles.active : ""} onClick={() => setLogReg('login')}>Login</button>
          <button className={logReg === 'register' ? styles.active : ""} onClick={() => setLogReg("register")}>Register</button>
        </div>
        <input className={styles.email} type="text" placeholder='Email...' value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={styles.password} type="password" placeholder='Password...' value={password} onChange={(e) => setPassword(e.target.value)} />   
        {
          logReg === "register" 
          &&
          <input className={styles.confirm} type='password' placeholder='Repeat password...' value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        }   
        <button onClick={handleUserLogReg}>{logReg}!</button>  
      </div>
      <button className={styles.closeWindow} onClick={() => 
      {
        navigate('/');
      }}> &#10060; </button>
    </div>
  )
}
