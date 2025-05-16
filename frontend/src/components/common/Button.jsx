import React from 'react'
import styles from './Button.module.css'

const Button = ({ color, background, text, width ='', height='', borderRadius='', onClick, fontSize='', fontWeight ='', cursor='pointer', className='' }) => {
    return (
        <button
        className={`${styles['custom-button']} ${className}`}
        style={{
            cursor, fontSize, fontWeight, color, background, width, height, borderRadius
        }}
        onClick={onClick}
        >
            {text}
        </button>
    )
}

export default Button;