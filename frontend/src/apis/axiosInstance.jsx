import axios from "axios";

const API = axios.create({
    baseURL:'http://localhost:8080',
    withCredentials:true,
})

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config; // 요청 전에 config를 가공하거나 토큰을 넣거나 반드시 config를 반환
},
    (error) => Promise.reject(error)
)

export default API;