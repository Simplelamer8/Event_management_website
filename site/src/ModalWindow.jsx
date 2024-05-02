import React, { useState } from 'react'
import styles from "./ModalWindow.module.css";
import axios from "axios";

export default function ModalWindow({user, title, description, img, setModalCard, navigate}) 
{
  let [inputValue, setInputValue] = useState('');
  function handleInputChange (e)
  {
    setInputValue(e.target.value);
  }
  let [inputVisible, setInputVisible] = useState(false);
  let formattedDescription = [];
  let adress = "";
  description.forEach((text, index) => {
    if (index < description.length - 2)
    {
      formattedDescription.push(text);
    }
    else 
    {
      adress += text;
    }
  })
  formattedDescription.push(adress);

  function handleSubmitForm(e)
  {
    e.preventDefault();
    if (localStorage.getItem("user") !== null)
    {
      //google calendar 
      let user = localStorage.getItem("user");

      if (localStorage.getItem(user) === null)
      {
        localStorage.setItem(user, title);
        alert("Регистрация прошла успешно!");
      }
      else
      {
        if (localStorage.getItem(user).includes(title))
        {
          alert("Вы уже заригестрированы на данное событие");
          return;
        }
        else
        {
          let str = localStorage.getItem(user);
          str += '☺';
          str += title;
          localStorage.setItem(user, str);
          alert("Регистрация прошла успешно!");
        }
      }
      return;
    }
    if (inputVisible === false)
    {
      setInputValue('');
      setInputVisible((prev) => !prev);
      return;
    }
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(inputValue))
    {
      alert("Uh-oh! Формат электронной почты неправильный");
      return;
    }
    
    if (localStorage.getItem(inputValue) === null)
    {
      localStorage.setItem(inputValue, title);
      alert("Регистрация прошла успешно!");
    }
    else
    {
      if (localStorage.getItem(inputValue).includes(title))
      {
        alert("Вы уже заригестрированы на данное событие");
        return;
      }
      else
      {
        let str = localStorage.getItem(inputValue);
        str += '☺';
        str += title;
        localStorage.setItem(inputValue, str);
        alert("Регистрация прошла успешно!");
      }
    }
    
    setInputValue('');
    setInputVisible((prev) => !prev)
  }

  return (
    <div className={styles.background}>
      <div className={styles.card}>
        <h2>{title}</h2>
        <div className={styles.middlePart}>
          <img src={img} alt="" />
          <ul className={styles.descriptionList}>
            {formattedDescription.map((text) => {
              return <li>{text}</li>
            })}
          </ul>
        </div>
        <form className={styles.form}>
          {inputVisible && <input type='email' value={inputValue} onChange={handleInputChange} />}
          <button onClick={handleSubmitForm}>Register</button>
        </form>
      </div>
      <button className={styles.closeWindow} onClick={() => {
        setModalCard(-1);
        navigate('/');
      }}> &#10060; </button>
    </div>
  )
}
