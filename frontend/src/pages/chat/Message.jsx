import React, { useState, useRef, useEffect } from 'react';
import styles from './Message.module.css'

const Message = ({ messages, currentUser }) => {
    

    return (
        <div className={styles.message}>
            <section className={styles.msgSection}>
            {messages.map((msg, i) => (
  <div key={msg._id || `${msg.text}-${msg.time}-${i}`}>
    {msg.system ? (
      <div className={styles.systemMsgContainer}>
        <p className={styles.systemMsg}>{msg.text}</p>
      </div>
    ) : msg.sender === currentUser ? (
      <div className={styles.myMsgContainer}>
        <div style={{ fontSize: '12px' }}>{msg.time}</div>
        <div className={styles.myMsg}>{msg.text}</div>
      </div>
    ) : (
      <div className={styles.yourMsgContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ fontSize: '12px' }}>{msg.sender}</div>
          <img src="" className={styles.profileImg} alt="" />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'5px', marginTop:'15px'}}>
          <div className={styles.yourMsg}>{msg.text}</div>
          <div style={{ fontSize: '12px' }}>{msg.time}</div>
        </div>
      </div>
    )}
  </div>
))}
                   
            </section>
        </div>
    )
}

export default Message;