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
            return `Email already signed in as ${sts}`;
        }
        else {
            let userSts = await db.isUsernameExist(username)
            if (userSts) {
                return "Username already exists";
            }
            else {
                await db.insertData(email, username, encrypt(password));
                await this.logAction('student','added');
                return "added";
            }
        }
    }

    async deleteStudent(emails){
        let sts = await db.deleteStudent(emails);
        await this.logAction('student','deleted');
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
        await this.logAction('student','updated');
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
                await this.logAction('faculty','added');
                return true;
            }
        }
    }

    async deleteFaculty(emails){
        let sts = await db.deleteFaculty(emails);
        await this.logAction('faculty','deleted');
        return true;
    }

    async updateFaculty(email,course,section,department,year,statusFaculty,password,username){
        if(password.trim() == ''){
            password = '';
        }
        else{
            password = encrypt(password);
        }
        let sts = await db.updateStudent(email,course,section,department,year,statusFaculty,password,username);
        await this.logAction('faculty','updated');
        return sts;
    }

    async addHod(course,username,email,password,year){
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
                await db.insertHodData(course,username,email,encrypt(password),year)
                await this.logAction('hod','added');
                return true;
            }
        }
    }

    async deleteHod(emails){
        let sts = await db.deleteHod(emails);
        await this.logAction('hod','deleted');
        return true;
    }

    async updateHod(course,username,email,password,year){
        if(password.trim() == ''){
            password = '';
        }
        else{
            password = encrypt(password);
        }
        let sts = await db.updateHod(course,username,email,password,year);
        await this.logAction('hod','updated');
        return sts;
    }

    async logAction(collection, actionType) {
        try {
            const timestamp = new Date();
            await db.insertAction(collection, actionType, timestamp);
        } catch (error) {
            console.error('Error logging action:', error);
        }
    }

    async fetchRecentActions() {
        try {
            const recentActions = await db.getRecentActions(7);
            return recentActions;
        } catch (error) {
            console.error('Error fetching recent actions:', error);
            return [];
        }
    }
}
module.exports = new Admin()