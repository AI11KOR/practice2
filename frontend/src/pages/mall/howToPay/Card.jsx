import React, {useState, useEffect} from 'react';


const Card = () => {
    return (
        <div>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <p>카드선택</p>
                <select style={{width:'100px',height:'30px'}}>
                    <option>아임포트</option>
                </select>
            </div>
            <div>

            </div>
        </div>
    )
}

export default Card;