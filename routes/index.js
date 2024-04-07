var express = require('express');
var router = express.Router();

const UserModel = require('../models/user')
/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

router.get('/login', function (req, res) {
    res.render('login', { 'error': '' });
})

router.post('/login', async function (req, res) {
    const { username, password } = req.body;
    const isValidCredentials = await UserModel.checkCredentials(username, password)
    if (isValidCredentials == 'true') {
        res.redirect('home')
    }
    else {
        res.render('login', { error: isValidCredentials })
    }
})

router.get("/signup", (req, res) => {
    res.render('signup', { 'error': '' });
});

router.post('/signup', async function (req, res) {
    const { email, username, password, confirmPassword } = req.body;
    const addUser = await UserModel.addUser(email, username, password, confirmPassword)
    if (addUser == 'true') {
        res.redirect('home')
    }
    else if (addUser == 'OTP') {
        res.session.email = email
        res.session.username = username
        res.redirect('OTP')
    }
    else {
        res.render('signup', { error: addUser })
    }
})

router.get("/home", (req, res) => {
    res.render('home');
});


router.get("/almanacPDF", (req, res) => {
    res.render("/almanac.pdf");
});

router.get("/timeTablePDF", (req, res) => {
    res.render("/TimeTableS2024.pdf");
});

router.get("/otp", (req, res) => {
    res.render("otp");
});

router.get("/settings", (req, res) => {
    res.render("settings");
});

router.get('/courses', (req, res) => {
    res.render("course")
})

router.get('/coursesCSE', (req, res) => {
    res.render("course1")
})

router.get('/coursesECE', (req, res) => {
    res.render("course2")
})

router.get('/almanac', (req, res) => {
    res.render("almanac")
})

router.get('/timeTable', (req, res) => {
    res.render("timetable")
})

router.get('/forgotPassword', (req, res) => {
    res.render("forgotPassword")
})

router.get('/updatePassword', (req, res) => {
    res.render("updatePassword")
})

module.exports = router;
