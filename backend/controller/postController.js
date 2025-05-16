const express = require('express');
const {ObjectId} = require('mongodb');
const connectDB = require('../config/database');

exports.writePage = async (req, res) => {
    try {
        const db = await connectDB();
        const { title, content } = req.body;
        if(!title || !content) {
            return res.status(400).json({ message: '글 내용을 작성해주세요' })
        }
        const isAdmin = req.user?.email === 'admin@example.com'

        await db.collection('post').insertOne({
            title, content, 
            userId: req.user._id, email: req.user.email, name: req.user.name,
            isAdmin: isAdmin,
            WriteDate: new Date(),
            likes: 0,
            likesUsers: [],
            comments: []
        })
        res.status(200).json({ message: '글쓰기 저장 완료' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '글쓰기 작성 저장 실패:', error })
    }
}

exports.listPage = async (req, res) => {
    try {
        const db = await connectDB();
        const perPage = 5; // 한 페이지에 보여줄 게시글 수
        const currentPage = parseInt(req.query.page) || 1; // 클라이언트에서 전달한 page 값을 정수로 변환해서 현재 페이지로 저장

        const sortType = req.query.sort;

        const sortOption = sortType === 'likes' 
        ? { likes: -1 } 
        : { WriteDate: -1 };

        const totalCount = await db.collection('post').countDocuments(); // 전체 게시글 수를 가져옴 (페이지 수 계산에 필요)
        const totalPage = Math.ceil(totalCount / perPage); // 총 페이지 수 계산 (예: 총 23개 글이면 5개씩 → 5페이지)

        let result = await db.collection('post')
        .find()
        .sort({ isAdmin: -1, ...sortOption })
        .skip((currentPage - 1) * perPage) // → 앞의 페이지에서 이미 보여준 글을 건너뜀
        // 예: page = 2면 1페이지의 5개를 건너뜀 → 6번째부터 보여줌
        .limit(perPage) // → 그다음 5개만 가져옴
        .toArray();

        // 댓글 개수 추가
        // result = result.map(post => ({
        //     ...post,
        //     commentCount: post.comments ? post.comments.length : 0
        // }))
        // 원래는 이렇게 백엔드에서 적어야 프론트에서 {item.comments}로 적어야 했으나
        // {item.comments?.length || 0} 이렇게 백엔드 대신 적어서 생략해도 된다

        res.status(200).json({ posts: result, totalPage: totalPage })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '리스트 데이터 불러오기 실패:', error })
    }
}

exports.detailPage = async (req, res) => {
    try {
        const db = await connectDB();
        const postId = req.params.id;
        let result = await db.collection('post').findOne({ _id: new ObjectId(postId) });
        if(!result) {
            return res.status(404).json({ message: '게시글이 없습니다.' })
        }

        // 누락 방지 기본값 설정
        result.likes = result.likes || 0;
        result.likesUsers = result.likesUsers || [];
        result.comments = result.comments || [];

        res.status(200).json({ posts: result });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '상세 페이지 불러오기 실패:', error })
    }
}

exports.editPage = async (req, res) => {
    try {
        const db = await connectDB();
        const postId = req.params.id;
        if(!ObjectId.isValid(postId)) {
            return res.status(401).json({ message: '데이터가 없습니다.:', error })
        }
        let result = await db.collection('post').findOne({ _id: new ObjectId(postId) })
        res.status(200).json({ posts: result })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: '데이터를 불러올 수 없습니다.' })
    }
}

exports.edit = async (req, res) => {
    try {
        const db = await connectDB();
        const { title, content } = req.body;
        const postId = req.params.id;

        const updateData = {title, content, updateDate: new Date() };

        await db.collection('post').updateOne({ _id: new ObjectId(postId) }, 
        {$set: updateData })
        res.status(200).json({ message: '업데이트 완료' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '수정 저장 실패:', error })
    }
}

exports.delete = async (req, res) => {
    try {
        const db = await connectDB();
        const postId = req.params.id;
        if(!postId) {
            return res.status(400).json({ message: '삭제할 내용이 없습니다.' })
        }
        await db.collection('post').deleteOne({ _id: new ObjectId(postId) });

        res.status(200).json({ message: '삭제되었습니다.' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '삭제하기 실패:', error })
    }
}

exports.likePost = async (req, res) => {
    try {
        const db = await connectDB();
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await db.collection('post').findOne({ _id: new ObjectId(postId) })

        if(!post) {
            return res.status(400).json({message: '게시글이 없습니다.' })
        }

        if(post.likesUsers.includes(userId)) {
            return res.status(400).json({ message: '이미 좋아요를 눌렀어요' });
        }

        await db.collection('post').updateOne({ _id: new ObjectId(postId) },
        // $inc: 숫자 증가 또는 감소 => 좋아요 수, 조회수, 재고 수량 같은 숫자 필드 업데이트에 적합
        // $push: 배열에 값 추가 => 좋아요 누른 유저 목록, 댓글 목록, 장바구니 상품 목록 등에 적합
        { $inc: { likes: 1 }, $push: { likesUsers: userId } })
        
        res.status(200).json({ message: '좋아요' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}

// 댓글 기능
exports.commentPost = async (req, res) => {
    try {
        const db = await connectDB();
        const postId = req.params.id;
        const {commentText} = req.body;
        const userId = req.user._id;
        const name = req.user.name;
        console.log(req.user)
        const comment = { _id: new ObjectId(), userId, name, commentText, createdAt: new Date(),
            isAdmin: req.user?.email === 'admin@example.com'
         };

        await db.collection('post').updateOne({ _id: new ObjectId(postId) }, 
        { $push: { comments: comment }} // comments는 writePage에 있는 것
    )
        res.status(200).json({ message: '댓글 작성 완료' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '댓글 서버 오류:', error })
    }
}

exports.commentDelete = async (req, res) => {
    try {
        const db = await connectDB();
        const {postId, commentId} = req.params; // postId: 게시글 찾는 용도, commentId: 해당 게시글 안에서 삭제할 댓글 찾는 용도
        await db.collection('post').updateOne({ _id: new ObjectId(postId) }, 
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
    )

    res.status(200).json({ message: '댓글 삭제 완료' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '댓글 삭제 실패:', error })
    }
}

// 키워드 검색 백엔드 코드
exports.searchPosts = async (req, res) => {
    try {
        const db = await connectDB();
        const {type, keyword} = req.query;

        const query = {}
        if( type && keyword) {
            query[type] = { $regex: keyword, $options: 'i' }; // 대소문자 무시
            console.log('검색 조건:', query);
        }
        const result = await db.collection('post').find(query).toArray();
        res.status(200).json({ posts: result })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: '서버 오류 에러:', error })
    }
}