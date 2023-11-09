const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

require('dotenv').config({ path: '../.env' });
const app = express();
let schema = require('schema');
const { menuSchema } = require('./myschema');

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const xlsx = require('xlsx');
const { resolve } = require('path');
const workbook = xlsx.readFile('menu.xlsx');
const sheetNames = [
    '팔달관',
    '다산관',
    '만권화밥',
    '행복돈까스',
    '바켓버거',
    '감탄떡볶이',
    '옥미관',
];

// sheetNames.forEach((sheetName) => {
//     let Upload = mongoose.model(sheetName, menuSchema);
//
//     let worksheet = workbook.Sheets[sheetName];
//     let excelData = xlsx.utils.sheet_to_json(worksheet);
//     saveData(excelData, Upload);
// });

function saveMenu(data, Upload) {
    let newData = new Upload({
        name: data['메뉴명'],
        price: data['가격'],
    });

    return newData;
}
function saveData(excelData, Upload) {
    excelData.forEach((data) => {
        // DataModel을 사용하여 MongoDB에 데이터 저장

        let newData = saveMenu(data, Upload);

        newData
            .save()
            .then(() => {
                console.log('데이터가 성공적으로 저장되었습니다.');
            })
            .catch((error) => {
                console.error('데이터 저장 중 오류 발생: ', error);
            });
    });
}

// 서버 시작 전 초기 데이터 추가
const initializeData = async () => {
    try {
        // 이미 존재하는 데이터가 있는지 확인
        const existingData = await Upload.findOne({ name: 'Test Monogo' });

        // 이미 데이터가 있는 경우 초기화하지 않음
        if (!existingData) {
            const task = new Upload({ name: 'Test Monogo' });
            await task.save();
            console.log('저장됨');
        } else {
            console.log('이미있음');
        }
    } catch (error) {
        console.error(error);
    }
};

// 서버 시작
// const port = process.env.PORT || 5001;
// app.listen(port, () => {
//     console.log(`Server is listening on port ${port}...`);
//
//     // 서버 시작 시 초기 데이터 추가
//     initializeData();
// });
