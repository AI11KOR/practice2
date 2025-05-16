import React, { forwardRef } from 'react'
import styles from './Input.module.css'

const Input = forwardRef(({ className, placeholder = '', width = '', height = '', borderRadius = '', value, onChange, readOnly = '', type= ''}, ref) => {
    return (
        <input
        ref={ref}
        className={`${styles['custom-input']} ${className}`}
        style={{
            width, height, borderRadius
        }}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        type={type}
        />
    )
})

export default Input;