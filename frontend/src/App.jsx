import './App.css';
import {Routes, Route} from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MyPage from './pages/auth/MyPage';

import ListPage from './pages/post/ListPage';
import DetailPage from './pages/post/DetailPage';
import WritePage from './pages/post/WritePage';
import EditPage from './pages/post/EditPage';
import ChatRoom from './pages/chat/ChatRoom';
import ChatField from './pages/chat/ChatField';

import Cart from './pages/mall/Cart';
import ShopPage from './pages/mall/ShopPage';
import PaymentPage from './pages/mall/PaymentPage';
import ProductDetail from './pages/mall/ProductDetail';
import PaymentComplete from './pages/mall/PaymentComplete';

import AdminPage from './pages/post/AdminPage';

import React, { useState, useEffect } from 'react';

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="App">
      <button onClick={() => setDarkMode(prev => !prev)}>
        {darkMode ? '라이트모드' : '다크모드'} 전환
      </button>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/list" element={<ListPage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/edit/:id" element={<EditPage />} />

            <Route path="/chat" element={<ChatField />} />
            {/* <Route path="/chatroom" element={<ChatRoom />} /> */}

            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/productDetail/:id" element={<ProductDetail />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/paymentComplete" element={<PaymentComplete />} />

            <Route path="/adminPage" element={<AdminPage />} />
          </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

      </Routes>
    </div>
  );
}

export default App;
