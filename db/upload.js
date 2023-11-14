const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config({ path: '../.env' });
const app = express();
let schema = require('schema');
const mySchema = require('./myschema');

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const xlsx = require('xlsx');
const workbook = xlsx.readFile('db.xlsx');
const sheetName = 'store';
const Upload = mongoose.model(sheetName, mySchema.storeSchema);

const worksheet = workbook.Sheets[sheetName];
const excelData = xlsx.utils.sheet_to_json(worksheet);

function saveOrder(data) {
    let newData = new Upload({
        userId: data['회원ID'],
        shopId: data['가게ID'],
        items: [],
        paymentMethod: data['결제수단'],
        waitingCount: data['대기번호'],
        takeout: data['포장여부'],
        totalPrice: data['통합가격'],
        createdTime: new Date(data['주문시간']),
    });

    let menujson = JSON.parse(data['메뉴ID']);

    if (Array.isArray(menujson)) {
        menujson.forEach((json) => {
            let key = Object.keys(json).join();
            newData['items'].push({
                menuId: key,
                quantity: json[key],
            });
        });
    } else {
        let key = Object.keys(menujson).join();
        newData['items'].push({
            menuId: key,
            quantity: menujson[key],
        });
    }
    return newData;
}
function saveStore(data) {
    let newData = new Upload({
        _id: data['가게ID'],
        name: data['가게이름'],
        waitingOrderCount: data['대기주문수'],
        location: data['위치'],
    });
    return newData;
}

function saveUser(data) {
    let newData = new Upload({
        loginId: data['로그인ID'],
        name: data['이름'],
        password: data['비밀번호'],
        phone: data['휴대폰번호'],
        email: data['이메일'],
        createdDate: new Date(data['생성일']),
    });
    return newData;
}

function saveData() {
    console.log(excelData);
    excelData.forEach((data) => {
        // DataModel을 사용하여 MongoDB에 데이터 저장

        let newData = saveStore(data);

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

saveData();

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