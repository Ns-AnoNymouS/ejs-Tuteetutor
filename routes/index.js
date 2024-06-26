var express = require('express');
var router = express.Router();

const UserModel = require('../models/user')
const FacultyModel = require('../models/faculty')
const authMiddleware = require('../middlewares/authMiddleware')
const studentMiddleware = require('../middlewares/studentMiddleware')
const courseMiddleware = require('../middlewares/courseMiddleware')
const alreadyLoggedMiddleware = require('../middlewares/alreadyLoggedMiddleware')
const authorizedMiddleware = require('../middlewares/authorizedMiddleware')
const facultyMiddleware = require('../middlewares/facultyMiddleware')
const OtpModel = require('../models/sendOTP')
const encrypt = require('../models/encryption')
const AdminModel = require('../models/admin')
const HODModel = require('../models/hod');
const faculty = require('../models/faculty');

router.get("/", alreadyLoggedMiddleware, (req, res) => {
    res.render("about");
});

router.get("/assignments", authMiddleware, courseMiddleware, async (req,res)=>{
    let user = await UserModel.getUser(req.session.username, req.session.type)
    let assignments = []
    if (req.session.type == 'student'){
        let courses = user.courses
        for (const key in courses) {
            let new_assignments = await UserModel.fetchAssignments(key, courses[key])
            assignments = [...assignments, ...new_assignments]
        }
    }
    else {
        assignments = await UserModel.fetchAssignments(user.course, user.section)
    }
    res.render('assignment', { 'username': req.session.username, 'email': req.session.email, 'assignments': assignments, 'type': req.session.type, 'error': ''});
});

router.get("/addAssignment", authMiddleware, facultyMiddleware, async (req,res)=>{
    res.render('addAssignment', { 'username': req.session.username, 'email': req.session.email, 'type': req.session.type, 'error': ''});
});

router.post("/addAssignment", authMiddleware, facultyMiddleware, async (req,res)=>{
    var { description, marks, link, section, date} = req.body;
    const user = await UserModel.getUser(req.session.username, req.session.type)
    if (req.session.type != 'hod'){
        section = user.section
    }
    

    await FacultyModel.addAssignment(description, marks, user.course, section, link, date)
    res.redirect("/assignments");
});

router.get("/addFaculty", authMiddleware, authorizedMiddleware, async (req,res)=>{
    res.render('addFaculty', { 'username': req.session.username, 'email': req.session.email, 'error': ''});
});

router.post("/addFaculty", authMiddleware, authorizedMiddleware, async (req,res)=>{
    if (!req.session.course){
        const user = await UserModel.getUser(req.session.username, 'hod')
        req.session.course = user.course   
    }
    const { email, department, section, year } = req.body;
    let type = await HODModel.addFaculty(email, req.session.course, section, department, year);
    if (type == 'true'){
        res.redirect('/facultyStatus');
        return await OtpModel.sendSignupRequestMail(email, req.session.course, section, department, year);
    }
    res.render('addFaculty', { 'username': req.session.username, 'email': req.session.email, 'error': type});
});

router.get("/updateFaculty/:email", authMiddleware, authorizedMiddleware, async (req,res)=>{
    let email = req.params.email;
    let item = await UserModel.getUser(email, 'faculty')
    res.render('updateFaculty', { 'username': req.session.username, 'email': req.session.email, 'item': item, 'error': ''});
});

router.post("/updateFaculty/:email", authMiddleware, authorizedMiddleware, async (req,res)=>{
    if (!req.session.course){
        const user = await UserModel.getUser(req.session.username, 'hod')
        req.session.course = user.course   
    }
    let previous_email = req.params.email;
    const { email, department, section, year } = req.body;
    let type = await HODModel.updateFaculty(previous_email, email, req.session.course, section, department, year);
    if (type == 'true'){
        return res.redirect('/facultyStatus');
    }
    let item = await UserModel.getUser(previous_email, 'faculty')
    res.render('updateFaculty', { 'username': req.session.username, 'email': req.session.email, 'item': item, 'error': type});
});

router.get("/facultyStatus", authMiddleware, authorizedMiddleware, async (req,res)=>{
    if (!req.session.course){
        const user = await UserModel.getUser(req.session.username, 'hod')
        req.session.course = user.course
    }
    var items = await HODModel.getFaculty(req.session.course)
    var count = await items.count()
    items = count == 0? null : await items.toArray();
    res.render('facultyStatus', {'items': items, 'username': req.session.username, 'email': req.session.email, 'error': ''});
});

router.delete("/facultyStatus/:email", authMiddleware, authorizedMiddleware, async (req, res)=>{
    const email = req.params.email;
    console.log(await HODModel.deleteFaculty(email), email)
    res.send("Sucess");
})

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
    res.redirect('/')
})

router.post('/login', alreadyLoggedMiddleware, async function (req, res) {
    const { username, password } = req.body;
    const type = await UserModel.checkCredentials(username, password)
    if (type != "Incorrect Password" && type != "User doesnot exists" && type != "Signup Required") {
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
    const addStudent = await UserModel.addUser(email, username, password, confirmPassword)
    if (addStudent == 'true') {
        res.redirect('home')
    }
    else if (addStudent == 'faculty otp'){
        req.session.email = email;
        req.session.username = username;
        req.session.type = 'faculty';
        req.session.password = encrypt(password);
        await OtpModel.sendOTP(email);
        res.redirect('otp');
    }
    else if (addStudent == 'otp') {
        req.session.email = email;
        req.session.username = username;
        req.session.type = 'student';
        req.session.password = encrypt(password);
        await OtpModel.sendOTP(email);
        res.redirect('otp');
    }
    else {
        res.render('signup', { 'error': addStudent })
    }
})

router.get("/home", authMiddleware, courseMiddleware, async (req, res) => {
    var course = 'AI';
    var section = 2;
    const classes = await UserModel.fetchClasses()
    const holidays = await UserModel.fetchHolidays();
    const assignments = await UserModel.fetchAssignments(course, section);
    const evaluationPoints = await UserModel.fetchEvaluation(course);
    const announcements = await UserModel.fetchAnnouncements(course, section);
    var collections = await AdminModel.fetchCollections();
    var recent = await AdminModel.fetchRecentActions();
    var type = req.session.type
    let page = type;
    if (type == 'student'){
        page = 'home'
    }
    res.render(type, { 'username': req.session.username, 'email': req.session.email, 'classes': classes, 'holidays': holidays, 'assignments': assignments, 'evaluationPoints': evaluationPoints, 'announcements': announcements , 'collections': collections, 'recent': recent });
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
        sts = await OtpModel.checkOTP(email, username, password, otp, req.session.type)
        if (sts == 'true') {
            res.redirect("home");
        }
        else {
            res.render('otp', { 'error': sts })
        }
    }
});

router.get("/settings", authMiddleware, (req, res) => {
    res.render("settings", { 'username': req.session.username, 'email': req.session.email });
});

router.get('/courses', authMiddleware, studentMiddleware, (req, res) => {
    res.render("course")
})

router.get('/coursesCSE', authMiddleware, studentMiddleware, async (req, res) => {
    if (Object.keys(req.query).length !== 0){
        await UserModel.updateCourses(req.session.username, req.query)
        res.redirect("/home")
    }
    else {
        res.render("course1")
    }
})

router.get('/coursesECE', authMiddleware, studentMiddleware, async (req, res) => {
    if (Object.keys(req.query).length !== 0){
        await UserModel.updateCourses(req.session.username, req.query)
        res.redirect("/home")
    }
    else {
        res.render("course2")
    }
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

router.get('/admin/collections/:option', async (req, res) => {
    const option = req.params.option;
    var keys = await AdminModel.fetchAttributes(option);
    var data = await AdminModel.fetchData(option);
    res.render("collections", { 'option': option, 'keys': keys, 'data': data});
})

router.post('/admin/collections/:option', async (req, res) => {
    const option = req.params.option;
    const { action, emails } = req.body;
    if (action == 'Delete' && option == 'student') {
        const deleteStudent = await AdminModel.deleteStudent(emails);
        if (deleteStudent) {
            res.redirect(`/admin/collections/${option}`);
        } else {
            res.render('error', { message: 'Failed to delete students' });
        }
    }
    else if (action == 'Delete' && option == 'faculty') {
        const deleteFaculty = await AdminModel.deleteFaculty(emails);
        if (deleteFaculty) {
            res.redirect(`/admin/collections/${option}`);
        } else {
            res.render('error', { message: 'Failed to delete students' });
        }
    }
    else if (action == 'Delete' && option == 'hod') {
        const deleteHod = await AdminModel.deleteHod(emails);
        if (deleteHod) {
            res.redirect(`/admin/collections/${option}`);
        } else {
            res.render('error', { message: 'Failed to delete students' });
        }
    }
    else {
        res.redirect(`/admin/collections/${option}`);
    }
})

router.get('/admin/collections/:option/:action', async (req, res) => {
    const option = req.params.option;
    const action = req.params.action;
    var keys = await AdminModel.fetchAttributes(option);
    var data = await AdminModel.fetchData(option);
    var query = req.query;
    switch (action) {
        case 'add':
            res.render('add', { 'option': option, 'action': action, 'keys': keys, 'error': '' });
            break
        case 'update':
            res.render('update', {'option': option, 'action': action, 'keys': keys, 'query': query, 'error': '' })
            break
        case 'delete':
            const deleteStudent = await AdminModel.deleteStudent(email);
            res.redirect(`/admin/collections/${option}`);
            break;
            
    }
})

router.post('/admin/collections/:option/:action', async (req, res) => {
    const option = req.params.option;
    const action = req.params.action;
    var keys = await AdminModel.fetchAttributes(option);
    var query = req.query;
    var presentPage = option + '>' + action
    console.log(req.body)
    switch (presentPage) {
        case 'student>add':
            var { email, username, password } = req.body;
            const addStudent = await AdminModel.addStudent(email, username, password)
            if (addStudent == 'added') {
                res.redirect(`/admin/collections/${option}`)
            }
            else {
                res.render('add', {'option': option,'action': action, 'keys': keys, 'error': addStudent })
            }
            break;
        case 'student>update':
            var { email, username, password } = req.body;
            const updateStudent = await AdminModel.updateStudent(query['email'], username, password)
            if (updateStudent == true) {
                res.redirect(`/admin/collections/${option}`)
            }
            else {
                res.render('update', { 'option': option, 'action': action, 'keys': keys, 'error': updateStudent })
            }
            break;
        case 'faculty>add':
            var {email,course,section,department,year,status,password,username} = req.body;
            const addFaculty = await AdminModel.addFaculty(email,course,section,department,year,status,password,username)
            if(addFaculty == true) res.redirect(`/admin/collections/${option}`)
            else res.render('add', { 'presentPage': presentPage, 'option': option, 'keys': keys, 'error': addFaculty })
            break;
        case 'faculty>update':
            var {email,course,section,department,year,statusFaculty,password,username} = req.body;
            const updateFaculty = await AdminModel.updateFaculty(query['email'],course,section,department,year,statusFaculty,password,username);
            if (updateFaculty == true) {
                res.redirect(`/admin/collections/${option}`)
            }
            else {
                res.render('update', { 'option': option, 'action': action, 'keys': keys, 'error': updateFaculty })
            }
            break;
        case 'hod>add':
            var {course,username,email,password,year} = req.body;
            const addHod = await AdminModel.addHod(course,username,email,password,year)
            if(addHod == true) res.redirect(`/admin/collections/${option}`)
            else res.render('add', { 'presentPage': presentPage, 'option': option, 'keys': keys, 'error': addHod })
            break;
        case 'hod>update':
            var {course,username,email,password,year} = req.body;
            const updateHod = await AdminModel.updateHod(course,username,query['email'],password,year);
            if (updateHod == true) {
                res.redirect(`/admin/collections/${option}`)
            }
            else {
                res.render('update', { 'option': option, 'action': action, 'keys': keys, 'error': updateHod })
            }
            break;
    }
})



module.exports = router;
