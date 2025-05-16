import React, { useState, useEffect } from 'react';
import styles from '../../style/post/DetailPage.module.css';
import Title from '../../components/common/Title';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DetailPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState({});
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState('');

  const { id } = useParams();
  const navigate = useNavigate();

  // 데이터 불러오기
  useEffect(() => {
    const axiosPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/detail/${id}`);
        setLike(response.data.posts.likes);
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error);
        alert('불러오기 실패');
      }
    };
    axiosPosts();
  }, [id]);

  // 좋아요 개수 이벤트
  const handleLike = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/like/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('좋아요를 눌렀어요');

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/detail/${id}`);
      setLike(response.data.posts.likes);
    } catch (error) {
      alert(error.response.data.message || '에러 발생');
    }
  };

  // 댓글 기능
  const handleCommentSubmit = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/comment/${id}`, {
        commentText: comment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('댓글 기능이 저장되었습니다.');

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/detail/${id}`);
      setPosts(response.data.posts);       // ✅ 전체 posts 갱신
      setComment('');                      // ✅ 입력창 비우기
    } catch (error) {
      console.log(error);
      alert('댓글 불러오기 실패:', error);
    }
  };

  // 댓글 삭제 기능
  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/comment/${id}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('댓글을 삭제했습니다.');

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/detail/${id}`);
      setPosts(response.data.posts);
    } catch (error) {
      console.log(error);
      alert('댓글 삭제 실패');
    }
  };

  return (
    <div>
      <Title text="상세페이지" />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className={styles.title}>{posts.title}</div>
        <div className={styles.content}>{posts.content}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
        <button className={styles.likeBtn} onClick={handleLike}>
          좋아요 ❤️ {like}
        </button>
        <button onClick={() => navigate(-1)} className={styles.button}>뒤로가기</button>
      </div>

      {/* 댓글 영역 */}
      <div>
        <div style={{ display: 'flex', margin: '0 auto', width: '800px' }}>
          <h4>댓글 {posts.comments?.length || 0}</h4>
        </div>

        <div className={styles.comment}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentArea}
            placeholder="댓글을 작성해보세요"
          />
          <button onClick={handleCommentSubmit} className={styles.commentBtn}>등록</button>
        </div>

        {posts.comments?.map((item, i) => (
          <div className={styles.commentContent} key={item._id}>
            <div>
              {
                item.isAdmin ? (
                  <div>관리자</div>
                ) : (
                  <div>{item.name}</div>
                )
              }
              
              <div>{item.commentText}</div>
            </div>
            <div>
              <button onClick={() => handleCommentDelete(item._id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailPage;
