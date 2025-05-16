import React, {useState, useEffect, useRef} from 'react';
import styles from '../../style/post/EditPage.module.css';
import Title from '../../components/common/Title';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditPage = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [posts, setPosts] = useState([]);
    const {id} = useParams();
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    // 데이터 불러오기
    useEffect(() => {
        
        const axiosPosts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/edit/${id}`, {

                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = response.data.posts;
                setTitle(data.title);
                setContent(data.content)
            } catch (error) {
                console.log(error);
                alert('불러오기 실패:', error);
            }    
        }

        axiosPosts();
    }, [id])


    // 데이터 저장하기
    const handleSaveEdit = async() => {
        
        if(!title) {
            alert('제목을 입력해주세요');
            titleRef.current.focus();
            return;
        }

        if(!content) {
            alert('내용을 입력해주세요');
            contentRef.current.focus();
            return;
        }

            try {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/edit/${id}`, {
                    title, content
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                alert('수정하였습니다.');
                navigate('/list');

            } catch (error) {
                console.log(error);
                alert('수정하기 실패:', error)
            }
    }

    return (
        <div>
            <Title text="수정페이지" />
            <div>
                <div className={styles.writeSection}>
                    <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.titleInp} 
                    placeholder='제목을 작성해주세요'/>
                    <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder='내용을 적어주세요'
                    className={styles.content} /> 
                </div>
                <div className={styles.buttonSection}>
                    <button onClick={handleSaveEdit} className={styles.saveBtn}>작성</button>
                    <button onClick={() => navigate(-1)} className={styles.cancelBtn}>취소</button>
                </div>
            </div>
        </div>
    )
}

export default EditPage;