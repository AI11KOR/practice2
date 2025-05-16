import React, {useEffect, useState, useRef} from 'react';
import Title from '../../components/common/Title';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../../style/mall/Cart.module.css'
import { useDispatch, useSelector} from 'react-redux'



const Cart = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    // const [count, setCount] = useState(1);
    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
                    
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    },
                });
                console.log(response.data.result)
                // const withSelected = response.data.map(item => ({
                //     ...item,
                //     selected: item.selected ?? false,
                // }))
                setProducts(response.data.result);

            } catch (error) {
                console.log(error);
            }
        }
        fetchPosts();
    }, [])

    // useEffect(() => {
    //     // productDetail에 setItem있음 localStorage.setItem('cart', JSON.stringify(cartItems));
    //     const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

    //     // selected가 없다면 false로 명시적으로 초기화
    //     const withSelected = storedCart.map(item => ({
    //         ...item,
    //         selected: item.selected ?? false, // undefined이면 false처리리
    //     }))

    //     setProducts(withSelected)
    // }, [])

    // const handleMinusCount = () => {
    //     if(count > 1) {
    //         setCount(count - 1)
    //     }   
    // }

    const clickIncrease = async (i) => {
        const item = products[i];
        const newCount = item.count + 1;

        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/cart/updateCount`, {
                cartId: item._id,
                count: newCount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const updatedItems = [...products];
            updatedItems[i].count = newCount;
            setProducts(updatedItems); // 상태만 바꿔줌줌
        } catch (error) {
            console.log(error);
            alert('수량 변경 중 오류 발생하였습니다.');
        }
    }


    const clickDecrease = async (i) => {
        const item = products[i];
        const newCount = item.count - 1;
        if(newCount < 1) return;

        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/cart/updateCount`, {
                cartId: item._id,
                count: newCount
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const updatedItems = [...products];
            updatedItems[i].count = newCount;
            setProducts(updatedItems)
        } catch (error) {
            console.log(error);
            alert('수량 변경 중 오류 발생하였습니다.');
        }
    }

    // 체크박스 클릭 이벤트 해당 내용만 전달하도록
    const handleSelect = (index) => {
        // 의미: products 배열을 복사(clone) 하는 것
        // 이유: React는 "불변성"을 지켜야 상태 변경으로 인식하고 리렌더링함
        // 직접 products[index].selected = ... 하면 기존 배열을 직접 수정하게 돼서
        // React가 변경 사항을 감지하지 못할 수 있다 그래서 복사후 배열수정후에 리랜더링 함
        const updatedItems = [...products]; // 기존 장바구니를 복사
        // 체크박스를 클릭할 때마다 선택 상태를 반대로 바꾸기 위해 !을 사용
        updatedItems[index].selected = !updatedItems[index].selected; // 클릭한 항목의 선택 여부 토글
        setProducts(updatedItems);  // 상태 업데이트 → 화면 다시 그림
        localStorage.setItem('cart', JSON.stringify(updatedItems)); // 로컬스토리지에도 반영 (새로고침 대비)
    }

    // 전체 금액 측정
    const calculateTotal = () => {
        return products
            .filter((item) => item.selected)
            .reduce((acc, item) => acc + (item.price * item.count), 0);
    }

    // 장바구니에 담긴 상품 삭제하기
    const handleDeleteBtn = async (index) => {
        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if(!confirmDelete) return;

        const item = products[index];

        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const updatedItems = [...products];
            updatedItems.splice(index, 1);
            setProducts(updatedItems);
        } catch (error) {
            console.log('삭제 실패:', error)
        }
    }

    // 구매하기
    const handlePurchase = () => {
        // filter로 체크박스 선택된 상품만 추림
        const selectedItems = products.filter((item) => item.selected); // products는 장바구니 상품 배열, filter()는 조건에 맞는 것만 걸러주는 함수
        // item.selected가 true인 애들만 남겨. 즉, 체크박스가 체크된 상품만 골라냄, 구매하기 눌렀을 때, 체크된 상품만 구매 요청
        const totalAmount = selectedItems.reduce((acc, item) => acc + (item.price * item.count), 0) // item.price * item.count: 상품의 단가 × 수량
        // 총 금액을 계산 = reduce()는 배열의 값을 누적해서 하나로 만드는 함수, acc: 누적된 값 (초기값은 0), item: 현재 순회 중인 상품
        // , 0 이건 초기값이야. 누적 시작값이 없으면 undefined가 생길 수 있어서 명확하게 0부터 시작
        navigate('/payment', {state: {selectedItems, totalAmount } }) // state: 리액트 라우터에서 페이지 간 데이터 전달용
        // 다음 페이지에서는 이렇게 받을 수 있어:
        //    const location = useLocation();
        //    const { selectedItems, totalAmount } = location.state;
    }

    return (
        <div>
            <Title text="장바구니" />
            <div style={{display:'flex', justifyContent:'center', gap:'50px'}}>
                <div className={styles.cart}>
                    {/* 여기에 map함수를 쓰면 될것 같다 */}
                    { products.length === 0 ? (
                        <div style={{width:'500px',height:'300px', border:'1px solid black'}}>장바구니가 비었습니다.</div>
                    ) : (
                        products.map((item, i) => (
                            <section key={item._id || i} className={styles.section1}>
                                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                    <input
                                    checked={item.selected} // ✅ 현재 상태에 따라 체크 여부 반영
                                    onChange={() => handleSelect(i)} 
                                    type="checkbox" 
                                    style={{width:'20px',height:'20px'}}
                                    />
                                    <img className={styles.productImg} src={item.imageURL} alt="" />
                                </div>
                                <div>
                                    <div>{item.productName}</div>
                                    <div>{item.content}</div>
                                    <div>{item.price}</div>
                                    <div className={styles.countBtn}>
                                        <button 
                                        onClick={() => clickDecrease(i)}
                                        className={`${styles.clickDecrease} ${item.count === 1 ? styles.disabled : ''}`}>
                                            -</button>
                                        <div>{item.count}</div>
                                        <button 
                                        onClick={() => clickIncrease(i)}
                                        className={styles.clickIncrease}>+</button>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => handleDeleteBtn(i)}>삭제</button>
                                </div>
                            </section>
                        ))
                    )}
                    

                </div>
                <section className={styles.section2}>
                    <div>
                        <h3>주문예상 금액</h3>
                        <div className={styles.rightCard}>
                            <section style={{display:'flex', flexDirection:'column', justifyContent:'flex-start', gap:'5px'}}>
                                <div style={{fontSize:'18px'}}>총 상품 가격</div>
                                <div style={{fontSize:'18px'}}>총 할인</div>
                                <div style={{fontSize:'18px'}}>총 배송비</div>
                            </section>
                            <section style={{display:'flex', textAlign:'end', flexDirection:'column', justifyContent:'flex-start', gap:'5px'}}>
                                <div style={{fontSize:'20px',fontWeight:'bold'}}>{calculateTotal().toLocaleString()}원</div>
                                <div style={{color:'red', fontSize:'20px',fontWeight:'bold'}}>0원</div>
                                <div style={{fontSize:'20px',fontWeight:'bold'}}>0원</div>
                            </section>
                        </div>
                        <div className={styles.sumPayment}>{calculateTotal().toLocaleString()}원</div>
                    </div>
                    
                    <div className={styles.buttonSection}>
                        <button onClick={handlePurchase} className={styles.button}>구매하기</button>
                    </div>
                </section>
                
            </div>
            
        </div>
    )
}


export default Cart;
