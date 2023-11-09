const myschema = require('../../db/myschema');
const { model } = require('mongoose');

const User = model('User', myschema.userSchema);

const getLogin = (req, res) => {
    if (req.session.user) {
        res.redirect('/example.html'); // 예시로
    } else {
        res.redirect('/login.html');
    }
};
const postLogin = async (req, res) => {
    console.log('로그인 함수가 실행됩니다.');
    const { id, password } = req.body;
    if (req.session.user) {
        console.log('이미 로그인 돼있습니다~');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
        res.write('<h1> already Login</h1>');
        res.write(`[ID] : ${id} [PW] : ${password}`);
        res.write('<a href="/example.html">Moved</a>');
        res.end();
    } else {
        const user = await User.findOne({ login_id: id });
        if (!user) {
            res.send('User not found.');
            return;
        }
        // const match = await bcrypt.compare(password, user.password);
        if (password === user.password) {
            req.session.user = user; // 세션에 사용자 정보 저장
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf8' });
            res.write('<h1>Login Success</h1>');
            res.write(`[ID] : ${id} [PW] : ${password}`);
            res.write('<a href="/example.html">Moved</a>');
            res.end();
        } else {
            res.send('Incorrect password.');
        }
    }
};
const postRegister = async (req, res) => {
    const data = req.body;

    // 비밀번호 해싱
    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        login_id: data['loginID'],
        name: data['name'],
        password: data['password'],
        phone: data['phone'],
        email: data['email'],
        created_date: new Date().getTime(),
    });

    await user.save();

    res.redirect('/api/user/login');
};
const getLogout = (req, res) => {
    console.log('로그아웃');

    if (req.session.user) {
        console.log('로그아웃중입니다!');
        req.session.destroy((err) => {
            if (err) {
                console.log('세션 삭제시에 에러가 발생했습니다.');
                return;
            }
            console.log('세션이 삭제됐습니다.');
            res.redirect('/login.html');
        });
    } else {
        console.log('로그인이 안돼있으시네요?');
        res.redirect('/login.html');
    }
};
const updateUser = async (req, res) => {
    const data = req.body;
    let id = req.param;
    const user = await User.findOneAndUpdate(
        { login_id: id },
        {
            name: data['name'],
            password: data['password'],
            phone: data['phone'],
            email: data['email'],
        },
        { new: true },
    );

    if (!user) {
        res.send('User not found.');
    }
};

module.exports = { getLogin, postLogin, getLogout, postRegister, updateUser };
