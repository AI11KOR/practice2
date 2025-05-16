const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const session = require('express-session');
const http = require('http')
require('dotenv').config();
const { Server } = require('socket.io')
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const authRouter = require('./routes/authRouter');
const postRouter = require('./routes/postRouter');
const adminRouter = require('./routes/adminRouter.js');
const shopRouter = require('./routes/mallRouter.js');
const chatRouter = require('./routes/chatRouter.js')


const server = http.createServer(app);


// ✅ socket.io 서버 객체 먼저 생성
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3001',
      credentials: true,
    },
});

app.use(cors({
    origin:'http://localhost:3001',
    credentials: true, // 키, 세션 정보를 같이 보내겠다는 의미
}))


// socket 로직을 분리한 파일에서 불러옴
require('./utils/socketHandler')(io);

app.use(session({ // 사용자 로그인 세션을 관리하기 위해 (ex: 로그인하면 쿠키로 인증 유지)
    secret:'secret-key', // 쿠키를 암호화할 때 쓰는 키
    resave:false, // 요청마다 세션을 다시 저장하지 않겠다 (불필요한 저장 방지)
    saveUninitialized:false, //  로그인하지 않은 세션은 저장하지 않겠다 (빈 세션 생성을 막음)
}))

app.use(express.json()); // 프론트가 fetch, axios로 JSON을 보내면 req.body에 접근할 수 있게 변환 Content-Type: application/json을 읽어서 JavaScript 객체로 변환
app.use(express.urlencoded({ extended: true })); // form에서 POST 방식으로 보내는 데이터 받으려면 이거 필요 즉 form안쓰면 삭제 허용

app.use('/api', authRouter);
app.use('/api', postRouter);
app.use('/api/admin', adminRouter);
app.use('/api', shopRouter);
app.use('/api', chatRouter);

app.use((req, res, next) => {
    res.locals.user = req.user || null; // 로그인하지 않은 경우 null로 처리
    next();
})

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})

// socket을 연결한 순간 app => server로 변경해줘야 함 http.createServer를 하였기 때문
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`)
// })