import React, { useState, useEffect, useRef } from 'react';
import styles from '../../style/post/ListPage.module.css'
import Title from '../../components/common/Title';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ListPage = () => {
    const navigate = useNavigate();
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [ name, setName ] = useState('');
    const [ imageURL, setImageURL ] = useState('');
    const [ likes, setLikes ] = useState('');
    const [ comments, setComments ] = useState('');
    const [posts, setPosts] = useState([]); // 데이터 가져올 useState

    // 최신순, 인기순 관련 정렬
    const [sortType, setSortType] = useState('date');

    // 검색관련련
    const [keyword, setKeyword] = useState('');
    const [searchType, setSearchType] = useState('title');

    // 대망의 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);


    // 데이터 받아오기
    useEffect(() => {
        const axiosPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/list?page=${currentPage}`)
                setPosts(response.data.posts); // posts로 연결하였기 때문 controller의 키 만약 posting이라고 적었으면 posting
            } catch (error) {
                console.log(error);
            }
        }
        axiosPosts();
    }, [currentPage])


    // 데이터 정렬하기
    const fetchPosts = async (page = 1, sort = sortType) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/list?page=${page}&sort=${sort}`);
            setPosts(response.data.posts);
            setTotalPage(response.data.totalPage);
            setCurrentPage(page)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPosts(1, sortType); // 최신순, 인기순 눌렀을 때만 작동
    }, []);
    
    // 글 삭제하기
   const handleClickDelete = async (postId) => {
        const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
        if(!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/delete/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
            });// post._id: 원래 목록에 있는 각 게시물의 id, postId: 내가 지금 삭제한 게시물의 id
            
            alert('삭제되었습니다')
            setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId)) // 이 조건은 "삭제한 게시물은 제외하고 나머지만 남겨" 라는 의미
        } catch (error) {
            console.log(error);
            alert('삭제 요청 실패')
        }
   }

    // 데이터 검색기능(키워드를 통한)
    const handleSearch = async () => {
        try {
            const response = await axios.get
            (`http://localhost:8080/api/list/search?type=${searchType}&keyword=${keyword}`);
            setPosts(response.data.posts);

        } catch (error) {
            console.log(error);
        }
    }

    // pagination
    const renderPagination = () => {
        const pages = [];
        const pageGroup = Math.ceil(currentPage / 5);
        const startPage = (pageGroup - 1) * 5 + 1;
        let endPage = startPage + 4;
        if(endPage > totalPage) endPage = totalPage;

        // 항상 이전 버튼
        pages.push(
            <button
                key="prev"
                onClick={() => fetchPosts(currentPage > 1 ? currentPage - 1 : 1)}
                disabled = {currentPage === 1}
                style={{
                    margin: '0 5px',
                    padding: '6px 12px',
                    backgroundColor: '#eee',
                    border: '1px solid #eee',
                    cursor: currentPage === 1 ? 'default' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1
                }}
            >
                이전
            </button>
        )

        // 페이지 번호
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => fetchPosts(i)}
                    style={{
                        margin: '0 5px',
                        padding: '6px 12px',
                        backgroundColor: currentPage === i ? '#333' : '#fff',
                        color: currentPage === i ? '#fff' : '#000',
                        border: '1px solid #ccc',
                        fontWeight: currentPage === i ? 'bold' : 'normal',
                        cursor: 'pointer',
                    }}
                >
                    {i}
                </button>
            );
        }

        // 다음 버튼 표시
        pages.push(
            <button
                key="next"
                onClick={() => fetchPosts(currentPage < totalPage ? currentPage + 1 : totalPage)}
                disabled={currentPage === totalPage}
                style={{
                    margin: '0 5px',
                    padding: '6px 12px',
                    backgroundColor: '#eee',
                    border: '1px solid #ccc',
                    cursor: currentPage === totalPage ? 'default' : 'pointer',
                    opacity: currentPage === totalPage ? 0.5 : 1,
                }}
            >
                다음
            </button>
        )
        return pages;
    }

    return (
        <div>
            <Title text="게시판" />
            <div className={styles.list}>
                <div style={{display:'flex', gap:'30px'}}>
                    <div>
                        <button onClick={() => setSortType('date')}>
                            최신순
                        </button>
                        <button onClick={() => setSortType('likes')}>
                            인기순
                        </button>
                    </div>
                    <div style={{display:'flex', gap:'20px'}}>
                        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                            <option value="title">제목</option>
                            <option value="content">내용</option>
                            <option value="name">이름</option>
                        </select>
                        <input 
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder='검색어를 입력해주세요'/>
                        <button onClick={handleSearch}>검색</button>
                    </div>
                    
                </div>
                {
                    posts.map((item, i) => (
                        <div className={styles.listSection} key={item._id}>
                            <div style={{display:'flex', flexDirection:'column'}}>
                                <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'30px'}}>
                                    <h2 
                                    onClick={() => navigate(`/detail/${item._id}`)}
                                    style={{cursor:'pointer'}}>
                                        {/* 관리자가 글을 쓴경우 다르게 나타나도록 표시 */}
                                        {item.isAdmin ? (
                                            <span style={{ backgroundColor:'#f8e8e8', color:'red', fontWeight:'bold' }}>
                                            📌 관리자 공지: {item.title}
                                            </span>
                                        ) : (
                                            item.title
                                        )}
                                    </h2>
                                    {
                                        item.isAdmin ? (
                                            <div><strong>관리자</strong></div>
                                        ) : (
                                            <div>{item.name}</div>
                                        )
                                    }
                                    
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <p>
                                        {item.content.length > 20 ? item.content.slice(0, 20) + '...' : item.content}
                                    </p>
                                </div>
                                <div style={{display:'flex', gap:'30px'}}>
                                    <h4 
                                    onClick={() => navigate(`/edit/${item._id}`)} 
                                    className={styles.editBtn}>수정하기</h4>
                                    <h4 
                                    onClick={() => handleClickDelete(item._id)}
                                    className={styles.deleteBtn}>삭제하기</h4>
                                    <div>{item.likes} ❤️</div>
                                    <div>댓글 수 {item.comments?.length || 0}</div>
                                </div>
                                
                            </div>
                            <div>
                                <img src={item.imageURL} className={styles.imageURL} alt="" />
                            </div>
                        </div>
                    ))
                }
                
                
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {renderPagination()}
            </div>
        </div>
    )
}

export default ListPage;