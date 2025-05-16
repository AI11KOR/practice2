// 프론트용 소켓 연결 파일
// 프론트 어디서든 socket.emit, socket.on을 쓰기 위해 export
// 백엔드 socketHandler.js에서 io.on("connection") 호출은 여기서 한다
// 여기 프론트에서 io()를 실행하는 순간 자동으로 emit이 되고 이를 받아내기 위해 백엔드에서 감지해서 handler로 잡는 것이다


import {io} from 'socket.io-client';

// const socket = io('http://localhost:8080');

const socket = io("https://practice2-backend.onrender.com", {
    transports: ["websocket"],
  });

export default socket;