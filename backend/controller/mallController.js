const express = require('express');
const connectDB = require('../config/database');
const { ObjectId } = require('mongodb');

exports.shopPage = async (req, res) => {
    try {
        const db = await connectDB();
        const sortType = req.query.sort;

        let sortOption = {};

        if (sortType === 'productName') {
        sortOption = { productName: 1 }; // 오름차순
        } else if (sortType === 'price') {
        sortOption = { price: 1 }; // 가격 오름차순
        } else {
        sortOption = { writeDate: -1 }; // 기본값
        }

        const products = await db.collection('product')
        .find()
        .sort(sortOption)
        // .sort({ ...sortOption })
        .toArray();
        res.status(200).json(products); // 배열로 보냄

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}

exports.productSearch = async (req, res) => {
    try {
        const db = await connectDB();
        const {type, keyword} = req.query;

        const fieldMap = {
            productName: 'productName',
            price: 'price',
            content: 'content'
          };

            // 현재 검색 요청은 type=productName으로 동작하고 있고
            // 백엔드도 query.productName = ... 이므로
            // MongoDB에도 productName이라는 필드가 있어야만 검색됨
            
          const dbField = fieldMap[type];
          if (!dbField) {
            return res.status(400).json({ message: '잘못된 검색 타입입니다.' });
          }
          
          const query = {};
          if (dbField === 'price') {
            query[dbField] = parseInt(keyword);
          } else {
            query[dbField] = { $regex: keyword, $options: 'i' };
          }
        const result = await db.collection('product').find(query).toArray();
        res.status(200).json({ products: result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '데이터를 불러올 수 없습니다.:', error })
    }
}

exports.productDetail = async (req, res) => {
    try {
        const db = await connectDB();
        const productId = req.params.id;

        let query;
        if(ObjectId.isValid(productId)) {
            query = { _id: new ObjectId(productId) };
        } else {
            query = { _id: productId }
        }

        const product = await db.collection('product').findOne(query);
        if(!product) {
            return res.status(400).json({ message: '상품을 찾을 수 없습니다.' })
        }

        res.status(200).json(product); // 배열로 처리
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '상세페이지 db연결 실패:', error })
    }
}

exports.addToCart = async (req, res) => {
    try {
        const db = await connectDB();
        const userId = req.user._id; // jwt 인증으로 로그인된 유저
        const { productId, count } = req.body;

        const filter = { // 현재 유저가 해당 상품을 이미 담았는지 찾기 위한 조건
            userId: new ObjectId(userId),
            productId: new ObjectId(productId)
        };

        const existingCart = await db.collection('cart').findOne(filter);

        if(existingCart) {
            // 이미 담겨 있다면 -> count 증가
            const result = await db.collection('cart').updateOne(
                filter,
                { $inc: { count: count || 1 } } // $inc: 같은 상품을 또 담으면 수량을 올림
            );
            return res.status(200).json({ message: '이미 담긴 상품. 수량증가 완료:', result })
        } else { // 이때는 담겨있는 상품이 아니기때문에 새로운 상품에 대한 정보를 보낸다
            const cartItem = {
                userId: new ObjectId(userId),
                productId: new ObjectId(productId),
                count: count || 1,
                selected: true,
                createdAt: new Date()
        };
        const result = await db.collection('cart').insertOne(cartItem); // 그 상품을 새로 result값에 넣음
        res.status(200).json({ message: '장바구니에 담겼습니다.', result: result })
        };
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '장바구니 담기 실패:', error })
    }
}

exports.cartPage = async (req, res) => {
    try {
        const db = await connectDB();
        const userId = req.user._id;
        // 장바구니 DB는 productId만 저장돼 있음
        // 그래서 **상품 상세 정보(product 컬렉션)**와 조합해 출력함
        const cartItem = await db.collection('cart')
        .find({ userId: new ObjectId(userId) })
        .toArray();

        const detailedCartItems = await Promise.all( // 여러 개의 비동기 작업(상품 정보 조회)을 병렬로 한꺼번에 처리하기 위한 방법
            cartItem.map(async (item) => {
                // 실제 product 컬렉션에서 해당 productId의 상품 정보를 찾는 부분.
                const product = await db.collection('product').findOne({ _id: new ObjectId(item.productId) })
                return {
                    ...item,
                    productName: product?.productName,
                    price: product?.price,
                    imageURL: product?.imageURL,
                    content: product?.content
                }
            })
        )
        res.status(200).json({ result: detailedCartItems })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '장바구니 페이지 불러오기 실패:', error })
    }
}

exports.updateCartCount = async (req, res) => {
    try {
        const db = await connectDB();
        const userId = req.user._id;
        const { cartId, count } = req.body;

        if(count < 1) return res.status(400).json({ message: '수량은 1 이상이어야 합니다.' });

        const result = await db.collection('cart').updateOne(
            { _id: new ObjectId(cartId), userId: new ObjectId(userId) },
            { $set: {count} }
        );
        res.status(200).json({ message: '수량 업데이트 완료:', result })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '수량 변경 실패:', error })
    }
}

exports.deleteCartItem = async (req, res) => {
    try {
        const db = await connectDB();
        const userId = req.user._id;
        const cartId = req.params.cartId;

        const result = await db.collection('cart').deleteOne({
            _id: new ObjectId(cartId),
            userId: new ObjectId(userId)
        });
        res.status(200).json({ message: '장바구니 항목 삭제 완료:', result });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '장바구니 항목 삭제 실패:', error })
    }
}

exports.paymentPage = async (req, res) => {
    try {
        const db = await connectDB();
        const userId = req.user._id;

        const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
        const cartItems = await db.collection('cart').find({ userId: new ObjectId(userId) }).toArray();

        const detailedCart = await Promise.all( // 비동기로 여러 DB 조회
            cartItems.map(async (item) => {
                const product = await db.collection('product').findOne({ _id: new ObjectId(item.productId) });
                return {
                    ...item,
                    productName: product?.productName,
                    price: product?.price,
                    imageURL: product?.imageURL
                };
            })
        )

        res.status(200).json({ result: user, detailedCart })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버오류 에러:', error })
    }
}

exports.paymentSuccess = async (req, res) => {
    try {
      const db = await connectDB();
      const userId = req.user._id;
  
      const {
        imp_uid,
        merchant_uid,
        paid_amount,
        buyer_email,
        buyer_name,
        buyer_tel,
        buyer_addr,
        pay_method,
        pg_provider,
        products
      } = req.body;

      // ✅ name 필드 보완
        const fixedProducts = products.map(p => ({
        ...p,
        productName: p.name || p.productName || '상품명 없음'
      }));
  
      // 1. 주문 저장
      const order = {
        userId: new ObjectId(userId),
        imp_uid,
        merchant_uid,
        paid_amount,
        buyer_email,
        buyer_name,
        buyer_tel,
        buyer_addr,
        pay_method,
        pg_provider,
        products: fixedProducts, // 이렇게 하면 해당 상품을 마이페이지 구매이력에서 볼수 있다
        createdAt: new Date()
      };
  
      const result = await db.collection('order').insertOne(order);
  
      // 2. 장바구니 비우기
      await db.collection('cart').deleteMany({ userId: new ObjectId(userId) });
  
      res.status(200).json({ message: '결제 정보 저장 및 장바구니 비움 완료', result });
  
    } catch (error) {
      console.error('paymentSuccess 에러:', error);
      res.status(500).json({ message: '서버 오류 에러', error });
    }
  };
  