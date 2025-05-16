import React, {useState, useEffect} from 'react';

const Phone = () => {
    return (
        <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <p>통신사 선택</p>
                <select style={{width:'100px',height:'30px'}}>
                    <option default="선택">선택</option>
                    <option default="선택">KT</option>
                    <option default="선택">LG</option>
                    <option default="선택">SKT</option>
                </select>
            </div>
            <div>

            </div>
        </div>
    )
}

export default Phone;