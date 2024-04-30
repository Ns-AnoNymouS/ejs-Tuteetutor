var express = require('express');
var router = express.Router();

const UserModel = require('../models/user')
const authMiddleware = require('../middlewares/authMiddleware')
const alreadyLoggedMiddleware = require('../middlewares/alreadyLoggedMiddleware')
const OtpModel = require('../models/sendOTP')
const encrypt = require('../models/encryption')
const AdminModel = require('../models/admin')

router.get("/", alreadyLoggedMiddleware, (req, res) => {
    res.render("about");
});


router.get("/addFaculty", async (req,res)=>{
    res.render('addFaculty', { 'username': req.session.username, 'email': req.session.email, 'error': ''});
});

router.get('/login', alreadyLoggedMiddleware, function (req, res) {
    res.render('login', { 'error': '' });
})

router.get('/logout', function (req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error destroying session');
        }
    });
})

router.post('/login', alreadyLoggedMiddleware, async function (req, res) {
    const { username, password } = req.body;
    const type = await UserModel.checkCredentials(username, password)
    if (type != "Incorrect Password" && type != "User doesnot exists") {
        const user = await UserModel.getUser(username, type)
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.type = type;
        res.redirect('home')
    }
    else {
        res.render('login', { error: type })
    }
})

router.get("/signup", alreadyLoggedMiddleware, (req, res) => {
    res.render('signup', { 'error': '' });
});

router.post('/signup', alreadyLoggedMiddleware, async function (req, res) {
    const { email, username, password, confirmPassword } = req.body;
    const addStudent = await UserModel.addStudent(email, username, password, confirmPassword)
    if (addStudent == 'true') {
        res.redirect('home')
    }
    else if (addStudent == 'otp') {
        req.session.email = email;
        req.session.username = username;
        req.session.password = encrypt(password);
        await OtpModel.sendOTP(email);
        res.redirect('otp');
    }
    else {
        res.render('signup', { 'error': addStudent })
    }
})

router.get("/home", authMiddleware, async (req, res) => {
    var course = 'AI';
    var section = 2;
    const classes = await UserModel.fetchClasses()
    const holidays = await UserModel.fetchHolidays();
    const assignments = await UserModel.fetchAssignments(course, section);
    const evaluationPoints = await UserModel.fetchEvaluation(course);
    const announcements = await UserModel.fetchAnnouncements(course, section);
    var collections = await AdminModel.fetchCollections();
    var type = req.session.type
    let page = type;
    if (type == 'student'){
        page = 'home'
    }
    res.render(type, { 'username': req.session.username, 'email': req.session.email, 'classes': classes, 'holidays': holidays, 'assignments': assignments, 'evaluationPoints': evaluationPoints, 'announcements': announcements , 'collections': collections});
});

router.get("/almanac", authMiddleware, (req, res) => {
    res.render("almanac");
});

router.get("/timetable", authMiddleware, (req, res) => {
    res.render("timetable");
});

router.get("/otp", (req, res) => {
    res.render("otp", { 'error': '' });
});

router.post("/otp", async (req, res) => {
    let email = req.session.email
    let username = req.session.username
    let password = req.session.password
    if (!email || !username || !password) {
        res.redirect('/signup')
    }
    else {
        const { num1, num2, num3, num4 } = req.body;
        let otp = num1 + num2 + num3 + num4
        sts = await OtpModel.checkOTP(email, username, password, otp)
        if (sts == 'true') {
            res.redirect("home");
        }
        else {
            res.render('otp', { 'error': sts })
        }
    }
});

router.get("/settings", authMiddleware, (req, res) => {
    res.render("settings",  { 'username': req.session.username, 'email': req.session.email});
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
    res.render("forgotPassword", { 'error': '' })
})

router.post('/forgotPassword', async function (req, res) {
    const { email } = req.body;
    const check = await UserModel.checkEmail(email);
    if (check != "Exists") {
        res.render('forgotPassword', { error: check });
    } else {
        req.session.email = email
        res.redirect('otp')
    }
})

router.get('/updatePassword', (req, res) => {
    res.render("updatePassword")
})

router.get('/admin/collections/:option', async (req,res)=>{
    const option = req.params.option;
    var keys = await AdminModel.fetchAttributes(option);
    var data = await AdminModel.fetchData(option);
    switch(option){
        case 'student':
            res.render("collections", { 'presentPage': option, 'keys': keys, 'data': data });
    }
})

router.get('/admin/collections/:option/:action', async(req,res)=>{
    const option = req.params.option;
    const action = req.params.action;
    const presentPage = option + '>' + action
    var keys = await AdminModel.fetchAttributes(option);
    switch(action){
        case 'add':
            res.render('add',{ 'presentPage': presentPage, 'option': option ,'keys': keys, 'error': ''});
            break
        case 'update':
            res.render('update',{ 'presentPage': presentPage, 'option': option })
            break
    }
})

router.post('/admin/collections/:option/:action', async(req,res) => {
    const { email, username, password} = req.body;
    const addStudent = await AdminModel.addStudent(email, username, password)
    const option = req.params.option;
    const action = req.params.action;
    const presentPage = option + '>' + action
    var keys = await AdminModel.fetchAttributes(option);
    if (addStudent == 'added') {
        res.redirect(`/admin/collections/${option}`)
    }
    else {
        res.render('add',{ 'presentPage': presentPage, 'option': option ,'keys': keys, 'error': addStudent })
    }
})

module.exports = router;
