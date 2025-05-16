import React, {useState, useEffect} from 'react';

const VBank = () => {
    return (
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <p>입금은행</p>
                <select style={{width:'100px',height:'30px'}}>
                    <option default="선택">선택</option>
                    <option default="선택">농협은행</option>
                    <option default="선택">신한은행</option>
                    <option default="선택">국민은행</option>
                </select>
            </div>
    )
}

export default VBank;