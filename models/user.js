const db = require('./db')
const encrypt = require('./encryption')

class User {
    async checkCredentials(username, password) {
        password = await encrypt.encrypt(password);
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
}
module.exports = new User()