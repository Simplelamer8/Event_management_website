import React from 'react'
import styles from "./Card.module.css"

export default function Card({img, description, title, showModalCard}) {
  return (
    <div className={styles.card} onClick={showModalCard}>
      <h3>{title}</h3>
      <img src={img} alt="" />
    </div>
  )
}
