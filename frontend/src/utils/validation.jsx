

export const EmailVal = (emailValue) => {
    const regex = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/;
    return regex.test(emailValue) 
}

export const passwordVal = (passwordVal) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
    return regex.test(passwordVal)
}

export const nameVal = (nameValue) => {
    const regex = /^.{3,}$/;
    return regex.test(nameValue)
}