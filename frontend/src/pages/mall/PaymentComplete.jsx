import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/common/Title.jsx'
import styles from '../../style/mall/PaymentComplete.module.css'
import axios from 'axios';

const PaymentComplete = () => {
  const navigate =  useNavigate();

  

    return (
        <div>
            <Title text="결제 완료" />
            <div className={styles.completeContent}>
                <h2>🎉 결제가 정상적으로 완료되었습니다!</h2>
                <p>마이페이지에서 주문내역을 확인할 수 있습니다.</p>
                <button onClick={() => navigate('/shop')} className={styles.button}>
                쇼핑 계속하기
                </button>
            </div>
        </div>
    )
}

export default PaymentComplete;