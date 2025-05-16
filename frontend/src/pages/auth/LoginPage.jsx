import React, {useState, useEffect, useRef} from 'react';
import Title from '../../components/common/Title';
import Input from '../../components/common/Input';
import styles from '../../style/auth/LoginPage.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EmailVal, passwordVal } from '../../utils/validation';

const LoginPage = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // 로그인을 했는데 다시 로그인 페이지가 보이지 않도록 redirect
    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            navigate('/list')
        }
    })

    const handleSubmitLogin = async () => {

        if(!email) {
            alert('이메일을 적어주세요')
            emailRef.current.focus();
            return;
        }

        if(!password) {
            alert('비밀번호를 적어주세요');
            passwordRef.current.focus();
            return;
        }

        try { //http://localhost:8080/api/login
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
                email, password
            })
    
            const token = response.data.token;
            const serverEmail = response.data.user?.email;
            const serverName = response.data.user?.name;
            localStorage.setItem('token', token);
            localStorage.setItem('email', serverEmail);
            localStorage.setItem('name', serverName);

            // 로그인 성공하면 user정보 저장
            if(response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user))
            } else {
                console.warn('서버에서 user 데이터가 없어서 저장 안함');
            }

            alert(response.data.message);
            navigate('/list');

        } catch (error) {
            console.log(error);
            alert('서버 연결 실패 login실패:', error)
        }
        
    }

    return (
        <div style={{marginTop:'100px'}}>
            <Title text="로그인" />
            <div style={{display:'flex', alignItems:'center', gap:'10px', flexDirection:'column', justifyContent:'center'}}>
                <Input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                className={styles.emailInp}
                placeholder="이메일을 적어주세요" />
                <Input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={styles.passwordInp}
                placeholder="비밀번호를 적어주세요" />
            </div>
            <div style={{display:'flex', gap:'20px', justifyContent:'center', alignItems:'center'}}>
                <button 
                onClick={handleSubmitLogin}
                className={styles.loginBtn}>로그인하기</button>
                <button onClick={() => navigate('/register')} className={styles.registerBtn}>회원가입하기</button>
            </div>

            {/* <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <p>SNS로 로그인</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <a href="http://localhost:8080/api/auth/google">
                        <img src="/google-login-btn.png" alt="구글 로그인" width="180" />
                    </a>
                    <a href="http://localhost:8080/api/auth/kakao">
                        <img src="/kakao-login-btn.png" alt="카카오 로그인" width="180" />
                    </a>
                    <a href="http://localhost:8080/api/auth/naver">
                        <img src="/naver-login-btn.png" alt="네이버 로그인" width="180" />
                    </a>
                </div>
            </div> */}

        </div>
    )
}

export default LoginPage;