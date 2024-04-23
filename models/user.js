const db = require('./db')
const encrypt = require('./encryption')
const Time = require('./time')

class User {
    async checkCredentials(username, password) {
        password = await encrypt(password);
        const status = await db.student_collection.findOne({ username: username });
        if (status) {
            if (password == status.password) {
                return 'true';
            }
            else {
                return "Incorrect Password";
            }
        }
        else {
            return "User doesnot exists";
        }
    }

    async addUser(email, username, password, confirmPassword) {
        email = email.toLowerCase();
        username = username.toLowerCase();
        if (email == null || email.trim() === "") {
            return "Enter email";
        }
        else if (username == null || username.trim() === "") {
            return "Enter username";
        }
        else if (password == null || password.trim() === "") {
            return "Enter password";
        }
        else if (email.indexOf("@") === -1 || email.split("@")[1] != "iiits.in") {
            return "Email Invalid";
        }
        else if (password !== confirmPassword) {
            return "Passwords doesn't match"
        }


        let sts = await db.isEmailSignedIn(email)
        if (sts) {
            return "Email already signed in";
        }
        else {
            let userSts = await db.isUsernameExist(username)
            if (userSts) {
                return "Username already exists";
            }
            else {
                return "otp";
            }
        }
    }

    async getEmail(username) {
        return await db.getEmail(username)
    }

    async checkEmail(email) {
        email = email.toLowerCase();
        if (email == null || email.trim() === "") {
            return "Enter email";
        }
        let sts = await db.isEmailSignedIn(email)
        if (sts) {
            return "Exists";
        }
        else {
            return "Doesn't Exists";
        }
    }

    formatTime(time) {
        let hours = time.hours
        if (time.hours < 10) {
            hours = `0${time.hours}`;
        }
        let minutes = time.minutes
        if (time.minutes == 0) {
            minutes = '00';
        }
        return `${hours}:${minutes} ${time.part}`;
    }

    async fetchClasses() {
        let date = new Date();
        let day = date.getDay();
        var formatedStart, formatedEnd, time;
        if (date.getHours() > 12) {
            time = new Time(date.getHours() - 12, date.getMinutes(), 'PM')
        }
        else {
            time = new Time(date.getHours(), date.getMinutes(), 'AM')
        }
        var classes = await db.getAllClasses(day);
        if (classes.length == 0) {
            return "No Classes Today!!"
        } else {
            classes.forEach(function (element) {
                element.present = false;
                formatedStart = new Time(element.startTime.hours, element.startTime.minutes, element.startTime.part)
                formatedEnd = new Time(element.endTime.hours, element.endTime.minutes, element.endTime.part)
                element.startTime = formatedStart
                element.endTime = formatedEnd
                if (formatedStart <= time && formatedEnd >= time) {
                    element.present = true;
                }
            })
            classes.sort((a, b) => a.startTime - b.startTime)

            let upcoming = false
            classes.forEach((element) => {
                formatedStart = new Time(element.startTime.hours, element.startTime.minutes, element.startTime.part)
                formatedEnd = new Time(element.endTime.hours, element.endTime.minutes, element.endTime.part)
                if (formatedStart >= time && !element.present && !upcoming) {
                    upcoming = true;
                    element.upcoming = true;
                }
                element.time = `${this.formatTime(element.startTime)} - ${this.formatTime(element.endTime)}`
            })
            return classes;
        }
    }

    async fetchHolidays() {
        var date = new Date()
        var holidays = await db.getHolidays(date.getDate(), date.getMonth(), date.getYear());
        if (holidays.length == 0) return "No More Holidays!!";
        return holidays;
    }

    async fetchAssignments(course, section){
        var assignments = await db.getAssignments(course,section);
        if(assignments.length == 0) return 'No Assignments';
        return assignments;
    }
}
module.exports = new User()