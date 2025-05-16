import React, {useEffect, useState, useRef} from 'react';
import Title from '../../components/common/Title';
import styles from '../../style/mall/Payment.module.css'
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from './howToPay/Card';
import Phone from './howToPay/Phone';
import VBank from './howToPay/Vbank';

const PaymentPage = () => {
    const [products, setProducts] = useState([]);
    const [ user, setUser] = useState([]);

    const [selectPayment, setSelectPayment] = useState(false);
    const [userInfo, setUserInfo] = useState(null)

    const navigate = useNavigate();
    const location = useLocation();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };

    // 구매방식 설정
    const handleChangePay = (e) => {
        setSelectPayment(e.target.value)
    }


    // 데이터 가져오기
    useEffect(() => {
        const fetchPosts = async() => {
            try {
                const response = await axios.get('http://localhost:8080/api/payment', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                })
                setUser(response.data.result); // 유저 정보
                setUserInfo(response.data.result)
                setProducts(response.data.detailedCart); // 장바구니 상품 정보
            } catch(error) {
                console.log('결제페이지 데이터 로드 실패:', error);
            }
        }
        fetchPosts();
    }, [])

    // 결제하기 버튼 클릭시 아임포트 연결하기
    const handlePayment = () => {
        if(!selectPayment) {
            alert('결제수단을 선택해 주세요');
            return;
        }

        const { IMP } = window;
        IMP.init('imp63438585');

        // selectPayment에 따라 달리 보내기
        let pgProvider = ''; // pg 기본값

        if(selectPayment === 'card') {
            pgProvider = 'kakaopay';
        } else if (selectPayment === 'phone') {
            pgProvider = 'kcp';
        } if(selectPayment === 'vbank') {
            pgProvider = 'uplus';
        }


        IMP.request_pay({
            pg:pgProvider,
            pay_method: selectPayment,
            merchant_uid: `mid_${new Date().getTime()}`,
            name: '상품 결제',
            amount: totalAmount,
            buyer_email: userInfo?.email || '',
            buyer_name: userInfo?.name || '',
            buyer_tel: userInfo?.phone || '',
            buyer_addr: `${userInfo?.address || ''} ${userInfo?.detailAddr || ''}`,
            // m_redirect_url: 'http://localhost:3001/paymentComplete',
        }, async (rsp) => {
            if(rsp.success) {
                alert('결제완료');
                console.log('결제 성공 정보:', rsp);
                console.log('userInfo:', userInfo);

                try {
                    await axios.post('http://localhost:8080/api/payment/success', {
                        imp_uid: rsp.imp_uid,
                        merchant_uid: rsp.merchant_uid,
                        paid_amount: rsp.paid_amount, // 결제 금액
                        buyer_email: rsp.buyer_email,
                        buyer_name: rsp.buyer_name,
                        buyer_tel: rsp.buyer_tel,
                        buyer_addr: rsp.buyer_addr,
                        pay_method: rsp.pay_method,
                        pg_provider: rsp.pg_provider,
                        products: selectedItems.map(item => ({
                            productId: item._id,
                            name: item.productName,
                            price: item.price
                        }))
                        
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });

                    // 결제 완료 후 장바구니에서 구매한 상품 제거
                
                    navigate('/paymentComplete')
                    
                } catch (error) {
                    console.log(error);
                    alert('결제정보 저장 실패')
                }
            } else {
                alert(`결제 실패: ${rsp.error_msg}`);
            }
            
        },
        
    )
    }

    return (
        <div>
            <Title text="결제페이지" />
            <div className={styles.payment}>
                <section className={styles.section1}>
                    <h3>구매자 정보</h3>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoLeft}>
                            <div>이름</div>
                            <div>이메일</div>
                            <div>핸드폰</div>
                        </div>
                        <div className={styles.userInfoRight}>
                            <div>{user.name}</div>
                            <div>{user.email}</div>
                            <div>{user.phone || '010-6767-7903'}</div>
                        </div>
                    </div>
                </section>
                <section className={styles.section1}>
                    <h3>받는사람 정보</h3>
                    <div className={styles.userInfo}>
                        <div className={styles.userInfoLeft}>
                            <div>이름</div>
                            <div>배송주소</div>
                            <div>연락처</div>
                        </div>
                        <div className={styles.userInfoRight}>
                            <div>{user.name || ''}</div>
                            <div>{user.address + user.detailAddr}</div>
                            <div>{user.phone || '010-6767-7903'}</div>
                        </div>
                    </div>
                </section>
                <section className={styles.section1}>
                    <h3>결제 정보</h3>
                    <div className={styles.paymentInfo}>
                        <div className={styles.paymentLeft}>
                            <div>총 상품가격</div>
                            <div>결제방법</div>
                        </div>
                        <div  className={styles.paymentRight}>
                            <div>{Number(totalAmount).toLocaleString()}원</div>
                            <div className={styles.checkBoxSection}>
                                <input onChange={handleChangePay} name="payment" value="card" type="radio" />신용/체크카드
                                <input onChange={handleChangePay} name="payment" value="phone" type="radio" />휴대폰
                                <input onChange={handleChangePay} name="payment" value="vbank" type="radio" />무통장입금(가상계좌)
                            </div>
                            {selectPayment === 'card' ? <Card /> :
                             selectPayment === 'phone' ? <Phone /> :
                             selectPayment === 'vbank' ? <VBank /> :
                             null
                            }

                        </div>
                    </div>
                </section>
                <section className={styles.btnSection}>
                    <button onClick={handlePayment} className={styles.btn}>결제하기</button>
                </section>
            </div>
        </div>
    )
}


export default PaymentPage;
