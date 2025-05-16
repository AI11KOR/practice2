import React, {useState, useEffect, useRef} from 'react';
import Title from '../../components/common/Title';
import styles from '../../style/auth/RegisterPage.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TimeBox from '../../utils/timer';
import { EmailVal, passwordVal, nameVal } from '../../utils/validation';
import { sendCodeBtn, verifyCodeBtn } from '../../utils/registerHandler';

import DaumPostcodeModal from '../../components/modal/DaumPostcodeModal';

const RegisterPage = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [password, setPassword] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [RePassword, setRePassword] = useState('');
    const [RePasswordErr, setRePasswordErr] = useState('');
    const [name, setName] = useState('');
    const [nameErr, setNameErr] = useState('');
    const [postcode, setPostcode] = useState('');
    const [address, setAddress] = useState('');
    const [detailAddr, setDetailAddr] = useState('');

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const rePasswordRef = useRef(null);
    const nameRef = useRef(null);
    const addressRef = useRef(null);
    const detailAddrRef = useRef(null);

    const [showCodeBox, setShowCodeBox] = useState(false);
    const [code, setCode] = useState('');
    const [isCounting, setIsCounting] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // 이메일 유효성 검사
    const handleChangeEmail = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        if(emailValue === '') {
            setEmailErr('')
            return;
        }

        if(!EmailVal(emailValue)) {
            setEmailErr('이메일이 정확하지 않습니다.');
            return;
        } else {
            setEmailErr('');
            return;
        }
    }

    // 비밀번호 유효성 검사
    const handleChangePassword = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);

        if(passwordValue === '') {
            setPasswordErr('');
            return;
        }

        if(!passwordVal(passwordValue)) {
            setPasswordErr('비밀번호는 특수문자플 포함한 8글자 이상으로 적어야 합니다.')
            return;
        } else {
            setPasswordErr('');
            return;
        }
    }

    // 재 설정 비밀번호 유효성 검사
    const handleChangeRePassword = (e) => {
        const RePasswordValue = e.target.value;
        setRePassword(RePasswordValue);

        if(RePasswordValue === '') {
            setRePasswordErr('');
            return;
        }

        if(RePasswordValue !== password) {
            setRePasswordErr('비밀번호가 일치하지 않습니다.');
            return;
        } else {
            setRePasswordErr('');
            return;
        }
    }

    // 이름 유효성 검사
    const handleChangeName = (e) => {
        const nameValue = e.target.value;
        setName(nameValue)

        if(nameValue === '') {
            setNameErr('');
            return;
        }

        if(!nameVal(nameValue)) {
            setNameErr('이름은 3글자 이상 적어주세요');
            return;
        } else {
            setNameErr('');
            return;
        }
    }

    // 타이머 함수 시작 이벤트
    const handleSendCodeSuccess = () => {
        // alert('인증번호 이메일 전송성공, 3분내 입력해주세요');
        setIsCounting(true);
        setShowCodeBox(true);
        setShowTimer(true);
        setIsEmailVerified(true);
    }

    // 인증번호 전송 클릭 이벤트
    const handleSendCodeClick = sendCodeBtn({
        email: email, onSuccess: handleSendCodeSuccess
    })
    
    // 타이머 함수 종료 이벤트
    const handleVerifyCodeSuccess = () => {
        setShowCodeBox(false);
        setShowTimer(false);
        setIsCounting(false);
        setIsEmailVerified(false);
    }

    // 시간 만료 이벤트
    const handleTimeout = () => {
        alert('인증시간이 만료되었습니다.');
        setIsCounting(false);
        setShowTimer(false);
    }

    // 인증번호 확인 클릭 이벤트
    const handleVerifyCodeClick = verifyCodeBtn({
        email: email, code: code, onSuccess: handleVerifyCodeSuccess
    })


    // 우편번호 검색
    const handleAddressComplete = (data) => {
        setPostcode(data.zonecode);
        setAddress(data.address);
    }

    // 회원가입 버튼 클릭시 이벤트
    const handleSubmit = async () => {
        if(!email) {
            alert('이메일을 적어주세요')
            emailRef.current.focus();
            return;
        }

        if(!password) {
            alert('비밀번호를 적어주세요')
            passwordRef.current.focus();
            return;
        }

        if(!RePassword) {
            alert('재 배밀번호를 적어주세요')
            rePasswordRef.current.focus();
            return;
        }

        if(!name) {
            alert('이름을 적어주세요')
            nameRef.current.focus();
            return;
        }

        if(!address) {
            alert('주소를 적어주세요')
            addressRef.current.focus();
            return;
        }

        if(!detailAddr) {
            alert('상세주소를 적어주세요')
            detailAddrRef.current.focus();
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/register', {
                email, name, password, postcode, address, detailAddr
            })
            alert('회원가입 완료!! 로그인페이지로 전환합니다.');
            navigate('/login');
        } catch (error) {
            console.log(error);
            alert('회원가입 완료 연결 오류 실패:', error)
        }

    }

    

    return (
        <div style={{marginTop:'100px'}}>
            <Title text="회원가입" />
            <div>
                <section className={styles.section1}>
                    <div>
                        <input 
                        value={email}
                        onChange={handleChangeEmail}
                        type="email"
                        className={styles.longInp}
                        placeholder='이메일을 작성해주세요'
                        />
                        <div className={styles.err}>{emailErr}</div>
                    </div>
                    <div>
                        <button 
                        email={email} 
                        onClick={handleSendCodeClick} 
                        className={styles.longBtn}>인증번호 전송</button>
                    </div>
                    {
                        showCodeBox && (
                            <div className={styles.shortSection}>
                                <input
                                value={code}
                                type="text"
                                onChange={(e) => setCode(e.target.value)}
                                className={styles.shortInp} placeholder='인증번호 6자리'/>
                                <button 
                                code={code}
                                email={email}
                                onClick={handleVerifyCodeClick} 
                                className={styles.shortBtn}>인증번호 확인</button>
                            </div>
                        )
                    }
                    
                    {
                        showTimer && (
                            <TimeBox isCounting={isCounting} onTimeout={handleTimeout}/>
                        )
                    }
                    
                    <div>
                        <input 
                        value={name}
                        onChange={handleChangeName}
                        type="text"
                        className={styles.longInp}
                        placeholder='이름을 작성해주세요'
                        />
                        <div className={styles.err}>{nameErr}</div>
                    </div>
                    <div>
                        <input 
                        value={password}
                        onChange={handleChangePassword}
                        type="password"
                        className={styles.longInp}
                        placeholder='비밀번호를 작성해주세요'
                        />
                        <div className={styles.err}>{passwordErr}</div>
                    </div>
                    <div>
                        <input 
                        value={RePassword}
                        onChange={handleChangeRePassword}
                        type="password"
                        className={styles.longInp}
                        placeholder='다시한번 비밀번호를 작성해주세요'
                        />
                        <div className={styles.err}>{RePasswordErr}</div>
                    </div>
                    <div className={styles.shortSection}>
                        <input 
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
                        className={styles.shortInp} placeholder='우편번호' readOnly />
                        <button 
                        onClick={() => setModalOpen(true)}
                        className={styles.shortBtn}>주소검색</button>
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center',flexDirection:'column'}}>
                        <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={styles.longInp} placeholder='주소' readOnly />
                        <input 
                        value={detailAddr}
                        onChange={(e) => setDetailAddr(e.target.value)}
                        className={styles.longInp} placeholder='상세주소'/>
                    </div>
                </section>
                <section style={{marginTop:'50px'}}>
                        <button onClick={handleSubmit} className={styles.submitBtn}>회원가입</button>
                </section>
            </div>
            {
                modalOpen && (
                    <DaumPostcodeModal 
                    onClose={() => setModalOpen(false)}
                    onComplete={handleAddressComplete}
                    />
                )
            }
        </div>
    )
}

export default RegisterPage;