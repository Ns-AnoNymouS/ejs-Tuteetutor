const db = require('./db');
const user = require('./user');
const encrypt = require('./encryption')

class Admin{
    async fetchCollections(){
        const collections = await db.getCollections();
        return collections;
    }

    async fetchAttributes(collection){
        const keys = await db.getAttributes(collection);
        return keys;
    }

    async fetchData(collection){
        const data = await db.getData(collection);
        return data;
    }

    async addStudent(email, username, password) {
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
                await db.insertData(email, username, encrypt(password));
                return "added";
            }
        }
    }

    async deleteStudent(emails){
        let sts = await db.deleteStudent(emails);
        return true;
    }

    async updateStudent(email, username, password){
        if(password.trim() == ''){
            password = '';
        }
        else{
            password = encrypt(password);
        }
        let sts = await db.updateStudent(email,username,password);
        return sts;
    }

    async addFaculty(email,course,section,department,year,status,password,username){
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
        let sts = await db.isEmailSignedIn(email)
        if (sts != false) {
            return `Email already signed in as ${sts}`;
        }
        else {
            let userSts = await db.isUsernameExist(username)
            if (userSts) {
                return userSts;
            }
            else {
                await db.insertFacultyData(email,course,section,department,year,status,encrypt(password),username)
                return true;
            }
        }
    }
}
module.exports = new Admin()