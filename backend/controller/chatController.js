const express = require('express');
const connectDB = require('../config/database');
const { ObjectId } = require('mongodb');

exports.getInfo = async (req, res) => {
    try {
        const db = await connectDB();
        const user = await db.collection('user').findOne({ _id: new ObjectId(req.user._id )});

        if(!user) {
            return res.status(500).json({ message: '사용자를 찾을 수 없습니다.' })
        }
        res.status(200).json({ name: user.name, email: user.email })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'server is error:', error })
    }
}

exports.getChatMsg = async (req, res) => {
    try {
        const db = await connectDB();
        const messages = await db.collection('messages').find().toArray();

        res.status(200).json(messages)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '메시지를 불러오지 못했습니다.:', error })
    }
}

exports.saveMessage = async (req, res) => {
    try {
        const db = await connectDB();
        const newMsg = {sender: req.body.sender, text: req.body.text, time: req.body.time };
        await db.collection('messages').insertOne(newMsg);
        res.status(200).json({ message: '메시지 저장 완료' });

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: '메시지 저장 실패:', error })
    }
}