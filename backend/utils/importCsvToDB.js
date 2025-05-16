const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const connectDB = require('../config/database');

console.log('현재경로:', __dirname);

const filePath = path.resolve('C:/Users/dngus/Downloads/product-data.csv');
// 또는 프론트를 사용할거라면
// const filePath = path.resolve(__dirname, '../frontend/public/data/product-data.csv');
// 또는 절대경로를 쓰면 됨
// const filePath = path.resolve('C:/Users/dngus/OneDrive/바탕 화면/PROEJCTREACT2/frontend/public/data/product-data.csv');

console.log('📄 파일 경로:', filePath);

(async () => {
    const db = await connectDB();
    const products = [];
  
    console.log('📂 CSV 파일 읽기 시작:', filePath);
  
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        console.log('📦 데이터 로딩:', row);
        products.push({
          category: row.category,
          productName: row.productName,
          price: Number(row.price),
          content: row.content,
          imageURL: row.imageURL,
        });
      })
      .on('error', (err) => {
        console.error('❌ CSV 파일 읽기 실패:', err);
      })
      .on('end', async () => {
        console.log('✅ CSV 파싱 완료. DB 저장 시작...');
        try {
          await db.collection('product').insertMany(products);
          console.log(`${products.length}개의 상품이 db에 저장되었습니다.`);
          process.exit();
        } catch (error) {
          console.error('DB삽입 실패:', error);
          process.exit(1);
        }
      });
  })();
  