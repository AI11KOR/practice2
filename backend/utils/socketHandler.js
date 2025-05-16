// 소켓 이벤트 처리기 서버에서 이벤트 처리

const userMap = {}

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`연결됨: ${socket.id}`); // 프론트에서 emit을 통해 전달하고 여기서 on으로 받는다 그렇게 connection 되면 연결됨

        // 입장 시 알림
        socket.on('join', (user) => {
            console.log(`${user.name} 입장`);
            // user = { name: '김우현' } ← 클라이언트가 보낸 데이터
            userMap[socket.id] = user.name; // socket.id에 해당 유저의 이름 저장
            io.emit('system', { text: `${user.name} 님이 입장하셨습니다.`, system: true }); // 모든 사용자에게 알림
        });


        // 메시지 송신
        socket.on('sendMessage', (data) => {
            io.emit('receiveMessage', data) // 모두에게 메시지 전달
        });


        // 연결 종료
        socket.on('disconnect', () => {
            console.log(`연결 해재: ${socket.id}`)
            const name = userMap[socket.id]; // 입장 시 저장해둔 이름
            if(name) {
                io.emit('system', { text: `${name} 님이 퇴장하였습니다.`, system: true })
                delete userMap[socket.id];
            } else {
                console.log(`이름 없는 유저가 퇴장함: ${socket.id}`);
            }
        });
    });
};