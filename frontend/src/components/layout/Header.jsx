import React, {useState, useEffect, useRef} from 'react';
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        const saveToken = localStorage.getItem('token');
        const saveEmail = localStorage.getItem('email');
        // 만약 이름을 갖고 무언가를 하려고 한다면? 
        const saveUser = localStorage.getItem('user');
        if(saveUser) {
            const parseUser = JSON.parse(saveUser)
            setName(parseUser.username)
        }

        if(saveToken) {
            setToken(saveToken)
        }
        if(saveEmail) {
            setEmail(saveEmail)
        }
    }, [])
    
    const handleLogout = () => {
        const confirmedLogout = window.confirm('정말 삭제하시겠습니까?');
        if(!confirmedLogout) {
            return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setToken('');
        setEmail('');
        alert('로그아웃 되었습니다.');
        navigate('/login')
    }

    

    return (
        <div className={styles.header}>
            <h1 style={{cursor:'pointer'}}>연습하기2</h1>
            <div className={styles.headerItems}>
                <h2 style={{cursor:'pointer'}} onClick={() => navigate('/list')}>게시판</h2>
                <h2 style={{cursor:'pointer'}} onClick={() => navigate('/write')}>글쓰기</h2>
                <h2 style={{cursor:'pointer'}} onClick={() => navigate('/shop')}>상품몰</h2>
                <h2 style={{cursor:'pointer'}} onClick={() => navigate('/chat')}>대화</h2>
                {
                    email === 'admin@example.com' && (
                        <button
                        className={styles.adminDashBoardBtn}  
                        
                        onClick={() => navigate('/adminPage')}>관리자 대시보드</button>
                    )
                }
            </div>
            <div>
                
                
                {
                    token ? (
                        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                            {
                                email === 'admin@example.com' ? (
                                    <div><strong>관리자</strong> 님 환영합니다.</div>
                                ) : (
                                    <div>{name}님 환영합니다.</div>
                                )
                            }
                            
                            <h2 style={{cursor:'pointer'}} onClick={handleLogout}>로그아웃</h2>
                            <h2 style={{cursor:'pointer'}} onClick={() => navigate('/cart')}>장바구니</h2>
                            <h2 style={{cursor:'pointer'}} onClick={() => navigate('/myPage')}>마이페이지</h2>
                        </div>
                    ) : (
                        <div style={{display:'flex', gap:'20px'}}>
                            
                            <h2 onClick={()=>navigate('/login')} style={{cursor:'pointer'}}>로그인</h2>
                            <h2 onClick={()=>navigate('/register')} style={{cursor:'pointer'}}>회원가입</h2>
                        </div>
                    )
                }

                
            </div>
        </div>
    )
}

export default Header;