import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchAdminPosts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/dashboard', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPosts(response.data);
                console.log(posts)
            } catch (error) {
                console.log('관리자 글 가져오기 실패:', error);
            }
        }
        fetchAdminPosts();
    }, [])

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm('이 글을 삭제할까요?');
        if(!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/api/admin/delete/${postId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            alert('삭제되었습니다.');
            setPosts((prev) => prev.filter((post) => post._id !== postId));

        } catch (error) {
            console.log(error);
            alert('삭제 실패:', error)
        }
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>📌 관리자 대시보드</h2>
            <div style={{ display: 'flex', justifyContent:'center', flexWrap: 'wrap', gap: '20px' }}>
                {posts.map((post) => (
                    <div
                        key={post._id}
                        onClick={() => navigate(`/detail/${post._id}`)} // ✅ 카드 클릭시 상세페이지로 이동
                        style={{
                            width: '300px',
                            padding: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            backgroundColor: '#f9f9f9',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        <div><strong>제목:</strong> {post.title}</div>
                        <div><strong>작성자:</strong> {post.email}</div>
                        <div><strong>작성일:</strong> {new Date(post.writeDate).toLocaleString()}</div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // ✅ 카드 클릭 이벤트 막음
                                handleDelete(post._id);
                            }}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '5px'
                            }}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}


export default AdminPage;