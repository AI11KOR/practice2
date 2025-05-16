import React, {useEffect, useState, useRef} from 'react';
import Title from '../../components/common/Title';
import styles from '../../style/mall/Shop.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
// useSelector: Redux에 저장된 전역 상태를 읽어오는 React hook
// useDispatch: Redux에 액션을 보내는 함수
import { setProducts } from '../../slices/productSlice';

const ShopPage = () => {

    // 가나다순, 가격순
    const [sortType, setSortType] = useState('');

    // 검색관련
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('')


    // 데이터 정렬하기
    const fetchPosts = async (sort = sortType) => {
        try {
            console.log('📤 서버에 보내는 정렬 기준:', sort);
            const response = await axios.get(`http://localhost:8080/api/shop?sort=${sort}`);
            dispatch(setProducts(response.data)); // ✅ 리덕스에 저장
        } catch (error) {
            console.log('상품 정렬 데이터 요청 실패:', error);
        }
    }

    useEffect(() => {
        fetchPosts(); // 가나다순, 가격순
        console.log('🧪 정렬 타입:', sortType);
    }, [sortType]);

    // 검색관련 데이터(키워드)
    const handleSearch = async () => {
        try {
            if(!keyword.trim()) {
                alert('검색어를 입력하세요');
                return;
            }
            console.log('🔍 검색 요청:', searchType, keyword);
            const response = await axios.get(`http://localhost:8080/api/shop/search?type=${searchType}&keyword=${keyword}`)
            dispatch(setProducts(response.data.products));
        } catch (error) {
            console.log(error);
        }
    }


    // const [products, setProducts] = useState([])
    const navigate = useNavigate();

    const dispatch = useDispatch() // 상태 변경용

    // Redux에서 상품 리스트 가져오기
    const products = useSelector(state => state.product.items);
    // state.product.items → store에 있는 productSlice의 items 배열을 가져온다

    // 리덕스로 데이터 불러오는 방식식
    // useEffect(() => {
    //     axios.get('http://localhost:8080/api/shop')
    //     // "Redux 상태에 저장"
    //     .then((res) => dispatch(setProducts(res.data)))  // ✅ 슬라이스 액션으로 상태 설정
    //     .catch((error) => console.error('상품 데이터 불러오기 실패:', error));
    // }, [dispatch])


    // 리덕스가 아닌 데이터 불러오는 방식
    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:8080/api/shop');
    //             setProducts(response.data)
    //         } catch (error) {
    //             console.log('상품 데이터 불러오기 실패:', error);
    
    //         }
    //     };
    //     fetchPosts();
    // }, [])


    return (
        <div>
            <Title text="상품몰" />
            <div className={styles.shop}>
                <div style={{display:'flex', justifyContent:'center', width:'100%', marginBottom:'20px'}}>
                    <div style={{marginRight:'30px'}}>
                        <button onClick={() => setSortType('productName')}>가나다순</button>
                        <button onClick={() => setSortType('price')}>가격순</button>
                    </div>
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'5px'}}>
                        <select 
                        value={searchType} onChange={(e) => setSearchType(e.target.value)}
                        style={{width:'100px',height:'40px',fontSize:'16px'}}>
                            <option value="productName">title</option>
                            <option value="price">price</option>
                            <option value="content">content</option>
                        </select>
                        <input 
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={{width:'200px', height:'40px', borderRadius:'8px', fontSize:'18px'}} 
                        placeholder='검색어를 입력하세요' />
                        <button 
                        onClick={handleSearch}
                        style={{width:'80px', height:'40px'}}>검색</button>
                    </div>
                    
                </div>
                <div className={styles.shopCard}>
                    {
                        products.map((item, i) => (
                        <div key={item._id} onClick={() => navigate(`/shop/productDetail/${item._id}`)}>
                            <img 
                            src={item.imageURL}
                            alt=""
                            style={{width:'300px',height:'300px',}}
                            />
                            <div value="productName">{item.productName}</div>
                            <div value="content">{item.content}</div>
                            <div value="price">{item.price}</div>
                        </div>
                        ))
                    }
                    
                </div>
            </div>
        </div>
    )
}


export default ShopPage;
