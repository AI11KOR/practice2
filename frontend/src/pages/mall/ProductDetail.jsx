import React, { useState, useEffect, useRef } from 'react';
import styles from '../../style/mall/ProductDetail.module.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Title from '../../components/common/Title';

import { useSelector, useDispatch } from 'react-redux';
import { setProducts } from '../../slices/productSlice';

const ProductDetail = () => {
    const [product, setProduct] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const dispatch = useDispatch();

    
    // 하나의 데이터를 가져오는것은 상태관리 리덕스를 사용하지 않는게 좋다
    // const products = useSelector(state => state.product.items);
    // // redux로 데이터 불러오기
    // useEffect(() => {
    //     axios.get(`http://localhost:8080/api/shop/productDetail/${id}`)
    //     .then((res) => dispatch(setProducts(res.data)))
    //     .catch((error) => console.error('해당 상품 데이터 가져오기 실패:', error))
    // }, [id])
    

    // 데이터 불러오기
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/shop/productDetail/${id}`)
                setProduct(response.data);
            }catch (error) {
                console.log(error);
            }   
        }
        fetchPosts();  
    }, [])

    // 장바구니 담기
    // const handleAddCart = () => {
    //     if(!product) return; // 제품 정보가 없으면 실행 안 하도록 막아둔 방어 코드

    //     const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    //     cartItems.push({ ...product, count: 1, selected: true })
    //     localStorage.setItem('cart', JSON.stringify(cartItems));
    //     alert('장바구니에 저장되었습니다.');
    //     navigate('/cart')
    // }
    const handleAddCart = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/addToCart`, {
                productId: product._id,
                count: 1
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('장바구니에 저장되었습니다.');
            navigate('/cart');

        } catch (error) {
            console.log('장바구니 추가 실패:', error)
        }
    }

    // 구매하기
    const handlePayment = async () => {
        // if(!product) return;

        // try {
        //     const response = await axios.post(`http://localhost:8080/api/payment`, {
        //         headers: {
        //             Authorization: `Bearer ${localStorage.getItem('token')}`
        //         }
        //     })
        //     setProducts(response.data);
        //     navigate('/payment')
        // } catch (error) {
        //     console.log(error);
        //     alert('구매하기 불러오기 실패:', error )
        // }
    }

    if(!product) {
        return <div>Loading...</div>;  // 👈 로딩 처리 추가
    }

    return (
        <div>
            <Title text="상품상세페이지" />
            <div className={styles.productCard}>
                <img src={product.imageURL} alt="" 
                style={{width:'500px',height:'500px', objectFit:'cover'}} />
                
                <div>
                    <h2>{product.productName}</h2>
                    <div>{product.content}</div>
                    <div>{product.price}</div>
                </div>
                
            </div>
            <div>
                <button onClick={handleAddCart} className={styles.cartBtn}>장바구니 담기</button>
                <button onClick={handlePayment} className={styles.paymentBtn}>바로구매</button>
            </div>
            
        </div>
    )
}


export default ProductDetail;
