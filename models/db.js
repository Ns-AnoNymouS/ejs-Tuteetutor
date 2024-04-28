const { MongoClient } = require('mongodb');
const db_name = "TuteeTutor";

class Database {
    constructor(uri) {
        this.client = new MongoClient(uri);
        this.database = null;
        this.student_collection = null;
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
        const filteredDocs = await this.student_collection.findOne({ email: email });
        if (filteredDocs) {
            return true;
        }
        else {
            return false;
        }
    }

    async isUsernameExist(username) {
        const filteredDocs = await this.student_collection.findOne({ username: username });
        if (filteredDocs) {
            return true;
        } else {
            return false;
        }
    }

    async checkCredentials(username, password) {
        const status = await this.student_collection.findOne({ username: username });
        if (status) {
            if (password == status.password) {
                return true;
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

    async getEmail(username) {
        try {
            const user = await this.student_collection.findOne({ username: username });
            if (!user) {
                return "User not Found"
            }
            else {
                return user.email
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

    async getAssignments(course, section){
        const condition = {
            course: { course },
            section: { section }
        };
        try{
            const data = await this.assignments.find(condition).toArray();
            return data;
        }catch(error){
            console.log(error);
        }
    }

    async getEvaluation(course){
        const condition = {
            course: {course}
        }
        try{
            const data = await this.evaluation.find(condition).toArray();
            return data;
        }
        catch(error){
            console.log(error)
        }
    }

    async getAnnouncements(course, section){
        const condition = {
            course: { course },
            section: { section }
        };
        try{
            const data = await this.announcements.find(condition).toArray();
            return data;
        }
        catch(error){
            console.log(error)
        }
    }

    async getCollections(){
        try {
            const collections = await this.database.listCollections().toArray();
            console.log(await this.database['student'].findOne())
            return collections;
        } catch (error) {
            console.error(error);
            throw new Error("Failed to fetch collections.");
        }
    }

    // async getAttributes(collection){
    //     try {
    //         await this.connect();
    //         const database = this.client.db(db_name);
    
    //         // Access the collection and find documents
    //         const firstDocument = await db.collection(collection).findOne();
    
    //         // Get the keys (field names) of the first document
    //         const keys = Object.keys(firstDocument);
    
    //         return keys;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         throw error; // Rethrow the error for handling in the caller function
    //     } 
    // }

    async connect() {
        try {
            await this.client.connect();
            this.database = this.client.db(db_name);
            this.student_collection = this.database.collection('student');
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