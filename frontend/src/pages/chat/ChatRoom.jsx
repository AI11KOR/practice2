import React, {useState, useEffect, useRef} from 'react';
import Title from '../../components/common/Title';
import axios from 'axios';
import styles from './ChatRoom.module.css';
import { useNavigate } from 'react-router-dom';

const ChatRoom = () => {
    return (
        <div>
            <Title text="채팅방" />
        </div>
    )
}

export default ChatRoom;