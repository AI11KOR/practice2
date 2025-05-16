import React from 'react'
import styles from './Title.module.css'

const Title = ({ marginBottom = '50px', text, fontSize = '35px', fontWeight = 'bold', cursor = 'default', className = '' }) => {
    return (
        <h1
        className={`${styles['custom-title']} ${className}`} // ✅ styles 안에서 접근
        style={{
        fontSize,
        fontWeight,
        cursor,
        marginBottom
    }}
        >
            {text}
        </h1>
    )
}

export default Title;