var express = require('express');
var router = express.Router();

const UserModel = require('../models/user')

router.get("/", (req, res) => {
    res.render("about");
});

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
    else if (addUser == 'otp') {
        req.session.email = email
        req.session.username = username
        res.redirect('otp')
    }
    else {
        res.render('signup', { error: addUser })
    }
})

router.get("/home", (req, res) => {
    res.render('home');
});


router.get("/almanac", (req, res) => {
    res.render("almanac");
});

router.get("/timetable", (req, res) => {
    res.render("timetable");
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

router.get('/forgotPassword', (req, res) => {
    res.render("forgotPassword", {'error': ''})
})

router.post('/forgotPassword', async function (req, res){
    const { email } = req.body;
    const check = await UserModel.checkEmail(email);
    if(check != "Exists"){
        res.render('forgotPassword', {error: check});
    }else{
        req.session.email = email
        res.redirect('otp')
    }
})

router.get('/updatePassword', (req, res) => {
    res.render("updatePassword")
})

module.exports = router;
