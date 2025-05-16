const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config();
const connectDB = require('../config/database');
const { ObjectId } = require('mongodb')
const generateToken = require('../utils/jwtUtils')

exports.login = async (req, res) => {
    try {
        const db = await connectDB();

        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: '내용을 모두 적어주세요'});
        }
        const user = await db.collection('user').findOne({ email })
        if(!user) {
            return res.status(401).json({ message: '존재하는 회원이 없습니다.'})
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' })
        }

        // 아래 부분은 jwtUtils의 generateToken으로 선언한 키값 _id, email을 여기 login에 선언한 const user의 인자로 받음 및 연결
        const token = generateToken(user._id, user.email, user.name);

        res.status(200).json({ message: '로그인 성공', token, 
            user: {
                username: user.name,
                email: user.email,
                phone: user.phone || '010-6767-7903', // phone 아직 없음
                address: user.address,
                detailAddr: user.detailAddr || ''
            }
        })        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}

exports.register = async (req, res) => {
    try {
        const db = await connectDB();
        const {email, password, name, postcode, address, detailAddr} = req.body;
        if(!email || !password || !name || !postcode || !address || !detailAddr) {
            return res.status(400).json({ message: '내용을 모두 기입해주세요'})
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingEmail = await db.collection('user').findOne({ email })
        if(existingEmail) {
            return res.status(401).json({ message: '이미 가입된 이메일이 있습니다.' })
        }

        await db.collection('user').insertOne({
            email, password: hashedPassword, name, postcode, address, detailAddr, RegisterDate: new Date()
        })
        res.status(200).json({ message:'회원가입 성공'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}

exports.myPage = async (req, res) => {
    try {
        const db = await connectDB();
        // 장바구니에 데이터를 가지고 오기 위함
        const userId = new ObjectId(req.user._id);
        
        const user = await db.collection('user').findOne({ _id: new ObjectId(req.user._id) })
        if(!user) {
            return res.status(400).json({ message: '해당 유저를 찾을 수 없습니다.' })
        }

        // 장바구니 항목 가져오기
        const cartItems = await db.collection('cart').find({userId}).toArray();

        const detailedCartItems = await Promise.all(cartItems.map(async (item) => {
            const product = await db.collection('product').findOne({ _id: new ObjectId(item.productId) })
            return {
                ...item,
                productName: product?.productName,
                price: product?.price,
                imageURL: product?.imageURL
            };
        }));

        // 주문 이력 가져오기
        const orders = await db.collection('order').find({ userId }).sort({ createdAt: -1 }).toArray();

        const purchaseHistory = orders.flatMap(order => {
            return order.products.map(product => ({
                name: product.productName || product.name || '상품명 없음',
                price: product.price,
                date: order.createdAt
            }));
        });


        res.status(200).json({ user, cart: detailedCartItems, history: purchaseHistory })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '유저 데이터 불러오기 실패:', error })
    }
}

exports.changeImg = async (req, res) => {
    try {
        const db = await connectDB();
        const imageURL = req.file?.location || null;
        const imageKEY = req.file?.key || null;
        await db.collection('user').updateOne({ _id: new ObjectId(req.user._id )},
        { $set: { imageURL, imageKEY, updateImg: new Date() }}
    )
        res.status(200).json({ message: '이미지 변경 성공' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}