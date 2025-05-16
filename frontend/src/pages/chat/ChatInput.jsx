import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatInput.module.css'
import socket from '../../socket/socket';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ko';

dayjs.extend(localizedFormat);
dayjs.locale('ko');

const ChatInput = ({ sender }) => {

    const [input, setInput] = useState('');
    const handleSend = () => {
        if(input.trim() === '') return;

        // const now = new Date();
        // const hours = now.getHours();
        // const minutes = now.getMinutes();
        // const period = hours < 12 ? '오전' : '오후';
        // const formattedHour = hours % 12 || 12;
        const formattedTime = dayjs().format('A h:mm')

        const data = {
            sender, // 로그인한 유저의 닉네임임
            text: input, // 입력한 내용
            // time: new Date().toLocaleDateString(),
            time: formattedTime,
        };

        socket.emit('sendMessage', data) // 클라이언트 -> 서버로 메시지 전송
        setInput(''); // 글을 쓴 후 input창 비움
    }

    return (
        <div className={styles.chatInput}>
            <div className={styles.section}>
                <input 
                className={styles.input} 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') { handleSend(); }}}
                placeholder='Type in here...' />
                <button 
                className={styles.sendBtn}
                onClick={handleSend}
                
                >전송</button>
            </div>
            
        </div>
    )
}

export default ChatInput;