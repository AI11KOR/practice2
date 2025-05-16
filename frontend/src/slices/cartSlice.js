import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // 장바구니 상품들
};
// 상태의 초기값 설정. 여기선 items라는 배열이 장바구니 역할을 해.
// 페이지 새로고침 전까진 여기에 담겨있는 값으로 렌더링돼.

const cartSlice = createSlice({ // 이 슬라이스의 이름. 보통 전역 상태 key 이름이 됨 (state.cart.items).
    name: 'cart',
    initialState, // 위에서 정의한 초기값을 지정.
    reducers: { // 이 안에 상태를 변경할 "액션 함수들" 정의
        addToCart(state, action) { // action.payload = 우리가 보낸 데이터 (상품 객체).
            state.items.push(action.payload); // 기존 상태 items에 그 상품을 추가
        },
        removeFromCart(state, action) { // action.payload는 상품의 _id
            state.items = state.items.filter(item => item._id !== action.payload);
            // 해당 상품 _id와 다른 것들만 남겨서 새 배열 만듦 = 삭제 효과
        },
        clearCart(state) {
            state.items = []; // 장바구니 비우기. 배열을 통째로 비움.
        },
    },
});


// 위에서 만든 액션들을 꺼내서 컴포넌트에서 사용할 수 있게 export.
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; // 이걸 store.js에 등록해야 전역에서 쓸 수 있음