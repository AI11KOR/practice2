// 관리자 계정을 db에 저장하기 위한 코드
// node create

const bcrypt = require('bcrypt');
const connectDB = require('./config/database');

const createAdminUser = async () => {
    const db = await connectDB();

    const email = 'admin@example.com';
    const password = 'rladn523@@';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        email,
        password: hashedPassword,
        userName: '관리자',
        createdAt: new Date()
    };

    try {
        await db.collection('user').insertOne(user);
        console.log('관리자 계정 생성 완료!!!');
    } catch (error) {
        console.error('관리자 계정 생성 실패:', error);
    }
}

createAdminUser();