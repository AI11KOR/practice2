// SocialLoginRedirect.jsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SocialLoginRedirect = () => {
    const navigate = useNavigate();
    const hasHandled = useRef(false);

    useEffect(() => {
        if(hasHandled.current) return; // 이미 처리했으면 종료
        hasHandled.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        console.log('📌 전달된 token:', token);
        console.log('📌 전달된 email:', email);

        if (token && email && email !== '') {
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            alert('소셜 로그인 성공!');
            navigate('/list');
            return; // ✅ 여기서 더 이상 아래 코드 실행하지 않도록 막기
        } else {
            alert('소셜 로그인 실패');
            navigate('/login');
        }
    }, [navigate]);

    return null;
};

export default SocialLoginRedirect;
