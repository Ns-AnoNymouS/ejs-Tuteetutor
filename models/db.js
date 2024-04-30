const { MongoClient } = require('mongodb');
const db_name = "TuteeTutor";

class Database {
    constructor(uri) {
        this.client = new MongoClient(uri);
        this.database = null;
        this.student_collection = null;
        this.hod = null;
        this.faculty = null;
        this.admin = null;
        this.time_table = null;
        this.holidays = null;
        this.breaks = null;
        this.changes = null;
        this.assignments = null;
        this.evaluation = null;
        this.announcements = null;
    }

    async insertData(email, username, password) {
        let details = {
            email: email,
            username: username,
            password: password,
        };
        await this.student_collection.insertOne(details);
    }

    async isEmailSignedIn(email) {
        var student, hod, faculty, admin;
        var key = 'email'
        student = await this.student_collection.findOne({ [key]: email });
        hod = await this.hod.findOne({ [key]: email });
        faculty = await this.faculty.findOne({ [key]: email });
        admin = await this.admin.findOne({ [key]: email });
        if(student) return student;
        else if(hod) return hod;
        else if(faculty) return faculty;
        else if(admin) return admin;
        else {
            return false;
        }
    }

    async isUsernameExist(username) {
        var student, hod, faculty, admin;
        var key = 'username'
        student = await this.student_collection.findOne({ [key]: username });
        hod = await this.hod.findOne({ [key]: username });
        faculty = await this.faculty.findOne({ [key]: username });
        admin = await this.admin.findOne({ [key]: username });
        if (student || hod || faculty || admin) {
            return true;
        } else {
            return false;
        }
    }

    async checkCredentials(username, password) {
        var status, type, key;
        key = username.includes('@') ? 'email' : 'username';
        status = await this.student_collection.findOne({ [key]: username });
        type = 'student'
        if (!status) {
            status = await this.hod.findOne({ [key]: username })
            type = 'hod'
        }
        if (!status) {
            status = await this.faculty.findOne({ [key]: username })
            type = 'faculty'
        }
        if (!status) {
            status = await this.admin.findOne({ [key]: username })
            type = 'admin'
        }
        if (status) {
            if (!status.password){
                return "Signup Required"
            }
            if (password == status.password) {
                return type;
            }
            else {
                return "Incorrect Password";
            }
        }
        else {
            return "User doesnot exists";
        }
    }

    async insertClassData(data) {
        await this.time_table.insertOne(data)
    }

    async insertHolidayData(data) {
        await this.holidays.insertOne(data)
    }

    async insertBreaksData(data) {
        await this.breaks.insertOne(data)
    }

    async insertChangesData(data) {
        await this.changes.insertOne(data)
    }

    async getCurrent(day, time) {
        const condition = {
            startTime: { $lt: time },
            endTime: { $gt: time }
        };
        var res = await this.time_table.findOne({ day: day } && condition) || await this.breaks.findOne(condition)
        return res
    }

    async getUser(username, type) {
        try {
            var user, key, obj;
            key = username.includes('@') ? 'email' : 'username';
            obj = { 'hod': this.hod, 'student': this.student_collection, 'faculty': this.faculty, "admin": this.admin }
            user = await obj[type].findOne({ [key]: username });
            if (!user) {
                return "User not Found"
            }
            else {
                return user
            }
        }
        catch (error) {
            console.error(error)
        }
    }

    async getAllClasses(day) {
        try {
            const sortedData = await this.time_table.find({ day: day }).toArray();
            return sortedData
        }
        catch (error) {
            console.error(error)
        }
    }

    async getHolidays(date, month, year) {
        try {
            const holidays = await this.holidays.find({ date: { $gte: date }, month: { $gte: month }, year: { $gte: year } }).toArray()
            return holidays
        }
        catch (error) {
            console.log(error)
        }
    }

    async updatePassword(email, username, password) {
        try {
            const data = await this.student_collection.findOne({ username: username })
            if (data != null) {
                await this.student_collection.updateOne({ email: email }, { $set: { username: username, password: password } })
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAssignments(course, section) {
        const condition = {
            course: { course },
            section: { section }
        };
        try {
            const data = await this.assignments.find(condition).toArray();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    async getEvaluation(course) {
        const condition = {
            course: { course }
        }
        try {
            const data = await this.evaluation.find(condition).toArray();
            return data;
        }
        catch (error) {
            console.log(error)
        }
    }

    async getAnnouncements(course, section) {
        const condition = {
            course: { course },
            section: { section }
        };
        try {
            const data = await this.announcements.find(condition).toArray();
            return data;
        }
        catch (error) {
            console.log(error)
        }
    }

    async getCollections(collection) {
        try {
            const collections = await this.database.listCollections().toArray();
            return collections;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch collections.");
        }
    }

    async getAttributes(collection) {
        try {
            const firstDocument = await this.database.collection(collection).findOne();
            const keys = Object.keys(firstDocument);

            return keys;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    async getData(collection) {
        try {
            const data = await this.database.collection(collection).find().toArray();
            return data;
        }
        catch (err) {
            console.error(err)
            throw err;
        }
    }

    async deleteStudent(emails){
        try{
            const emailArray = emails.split(',');
            await this.student_collection.deleteMany({ email: { $in: emailArray } })
            return true;
        }
        catch(err){
            console.error(err)
            throw err;
        }
    }

    async updateStudent(email, newUsername, newPassword) {
        try {
            const updateFields = {};
            if (newUsername) {
                updateFields.username = newUsername;
            }
            if (newPassword) {
                updateFields.password = newPassword;
            }
            const result = await this.student_collection.updateOne({ 'email': email }, { $set: updateFields });
            return true;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async insertFacultyData(email,course,section,department,year,statusFaculty,password,username){
        let details = {
            email: email,
            course: course,
            section: section,
            department: department,
            year: year,
            status: statusFaculty,
            password: password,
            username: username
        }
        await this.faculty.insertOne({details})
    }

    async connect() {
        try {
            await this.client.connect();
            this.database = this.client.db(db_name);
            this.student_collection = this.database.collection('student');
            this.hod = this.database.collection('hod');
            this.faculty = this.database.collection('faculty');
            this.admin = this.database.collection('admin');
            this.time_table = this.database.collection('timetable')
            this.holidays = this.database.collection('holidays')
            this.changes = this.database.collection('changes')
            this.breaks = this.database.collection('breaks')
            this.assignments = this.database.collection('assignments')
            this.evaluation = this.database.collection('evaluation')
            this.announcements = this.database.collection('announcements')
        } catch (error) {
            console.log(error);
        }
    }
}

const db = new Database(process.env.DATABASE);
module.exports = db;