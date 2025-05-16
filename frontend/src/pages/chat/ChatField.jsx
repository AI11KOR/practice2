import React, { useState, useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import Message from './Message';
import Title from '../../components/common/Title';
import styles from './ChatField.module.css'
import axios from 'axios'
import socket from '../../socket/socket';

const ChatField = () => {

    const [user, setUser] = useState({ name: '' });
    // const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);


    // ✅ DB에서 이전 메시지 불러오기 (roomId 없이 전체라 가정)
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/me', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })

                // setMessageList(response.data.name);  // [{sender, text, time}, ...]
                setUser({ name: response.data.name }); // 사용자 정보 저장
            } catch (error) {
                console.log(error);
    
            }
        }
        fetchPosts();
    }, [])


    // 메시지 전송 socket 수신 처리
    useEffect(() => {
        if(!user.name) return;

        socket.emit('join', { name: user.name }); // 클라이언트 -> 서버로 '입장'

        socket.on('system', (msg) => {
            setMessageList((prev) => [...prev, msg]); // 시스템 메시지 수신
        })

        socket.on('receiveMessage', (data) => {
            setMessageList((prev) => [...prev, data]); // 수신 메시지 추가
        })

        return () => {
            socket.off('system')
            socket.off('receiveMessage');
            socket.disconnect(); // ✅ 다른 페이지로 가면 퇴장 이벤트 발생함
        }
    }, [user.name]);

    // db에 저장된 메시지 불러오기
    useEffect(() => {
        const fetchMessages = async () => {
          try {
            const res = await axios.get('http://localhost:8080/api/chat', {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            setMessageList(res.data);
          } catch (err) {
            console.error('메시지 불러오기 실패', err);
          }
        };
    
        fetchMessages();
      }, []);


    return (
        <div>
            <Title text="채팅방" />
            <div className={styles.chatField}>
                <Message messages={messageList} currentUser={user.name} />
                <ChatInput sender={user.name} />
            </div>
            
        </div>
    )
}

export default ChatField;