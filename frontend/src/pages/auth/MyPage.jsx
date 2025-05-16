import React, { useState, useEffect, useRef } from 'react';
import Title from '../../components/common/Title';
import styles from '../../style/auth/MyPage.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);


    const [showImg, setShowImg] = useState('');

    // 유저 데이터 받아오기
    useEffect(() => {
        const axiosPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/myPage`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(response.data.user);
                setCart(response.data.cart);
                setHistory(response.data.history);
            } catch (error) {
                console.log(error);
                alert('프론트 데이터 불러오기 실패:', error)
            }  
        }
        axiosPosts()
        console.log('구매이력:', history)
    }, [])

    // 이미지 변경하기
    const changeImage = async (e) => {
        const file =   e.target.files[0]
        if(!file) return;

        const formData = new FormData();
        formData.append('img', file); // ← 이 name="img" 중요함!

        const reader = new FileReader();
        reader.onload = () => {
            setShowImg(reader.result)
        }

       reader.readAsDataURL(file)

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/changeImg`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('이미지 업로드 성공');

            // ✅ 여기! 업로드 성공 후 유저 정보 다시 요청
            const refreshUser = await axios.get(`${process.env.REACT_APP_API_URL}/api/myPage`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(refreshUser.data.user);

        } catch (error) {
            console.log('이미지 업로드 실패:', error);
            alert('이미지 업로드 실패')
        }
    }

    return (
        <div>
            <Title text="마이페이지" />
            <div style={{display:'flex', gap:'50px', justifyContent:'center', marginTop:'50px'}}>
                <section className={styles.section1}>
                    <div className={styles.userCard}>
                        <h2>유저 카드</h2>
                        {
                            user.imageURL ? (
                                <img className={styles.img} src={user.imageURL} alt="" />
                            ) : (
                                <div className={styles.image}></div>
                            )
                        }
                        
                        <input onChange={changeImage} type="file" />
                        <div>
                            <h4>{user.email}</h4>
                            <div>{user.name}</div>
                            <div>{user.address}</div>
                            <div>{user.detailAddr}</div>
                        </div>
                        
                    </div>
                </section>
                <section className={styles.section2}>
                    <h2>장바구니</h2>
                    {cart.length === 0 ? (
                        <p>장바구니가 비어 있습니다.</p>
                    ) : (
                        cart.map((item, i) => (
                            <div key={i} className={styles.cartItem}>
                                <img src={item.imageURL} alt="" className={styles.smallImg} />
                                <div className={styles.cartText}>
                                    <div>{item.productName}</div>
                                    <div>{Number(item.price).toLocaleString()}원</div>
                                    <div>{item.count}개</div>
                                </div>  
                            </div>
                        ))
                    )}
                </section>
                <section className={styles.section3}>
                    <h2>구매 이력</h2>
                    {history.length === 0 ? (
                        <p>구매한 이력이 없습니다.</p>
                    ) : (
                        history.map((item, index) => (
                        <div key={index} className={styles.historyItem}>
                            <div>{item.name}</div>
                            <div>{Number(item.price).toLocaleString()}원</div>
                            <div>{new Date(item.date).toLocaleDateString()}</div>
                        </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    )
}

export default MyPage;