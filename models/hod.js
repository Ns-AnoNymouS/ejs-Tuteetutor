const db = require('./db')

class HOD {
    async getFaculty(course) {
        return db.faculty.find({ 'course': course });
    }

    async deleteFaculty(email) {
        return await db.faculty.deleteOne({ 'email': email });
    }

    async addFaculty(email, course, section, department, year){
        let sts = await db.isEmailSignedIn(email)
        if (sts) {
            return 'Email already exist'
        }
        else {
            let details = {
                email: email,
                course: course,
                section: section,
                department: department,
                year: year,
                status: "Pending..."
            };
            await db.faculty.insertOne(details)
            return 'true'
        }
    }
}
module.exports = new HOD()