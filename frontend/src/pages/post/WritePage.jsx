import React, {useState, useEffect, useRef} from 'react';
import styles from '../../style/post/WritePage.module.css'
import Title from '../../components/common/Title';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WritePage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    const navigate = useNavigate();

    const handleSubmitWrite = async (e) => {
        if(!title) {
            alert('제목을 입력하세요');
            titleRef.current.focus();
            return;
        }

        if(!content) {
            alert('내용을 입력하세요');
            contentRef.current.focus();
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/write', {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            alert('저장 완료');
            navigate('/list')

        } catch (error) {
            console.error(error)
            alert('글 저장에 실패하였습니다.')
        }
    }

    return (
        <div>
            <Title text="글작성" />
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
                <button onClick={handleSubmitWrite} className={styles.saveBtn}>작성</button>
                <button onClick={() => navigate('/list')} className={styles.cancelBtn}>취소</button>
            </div>
        </div>
    )
}

export default WritePage;