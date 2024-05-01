const db = require('./db')

class HOD {
    async getFaculty(course) {
        return db.faculty.find({ 'course': course });
    }

    async deleteFaculty(email) {
        return await db.faculty.deleteOne({ 'email': email });
    }

    async addFaculty(email, course, section, department, year) {
        email = email.toLowerCase();
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

    async updateFaculty(previous_email, email, course, section, department, year) {
        previous_email = previous_email.toLowerCase();
        email = email.toLowerCase();
        let prev_sts = await db.isEmailSignedIn(previous_email)
        let sts = await db.isEmailSignedIn(email)
        if (!prev_sts) {
            return "true"
        }
        if (sts && previous_email != email) {
            return 'Email already exist'
        }
        else {
            let details = {
                course: course,
                section: section,
                department: department,
                year: year,
            };
            console.log(previous_email, email, previous_email != email)
            if (previous_email != email) {
                details.email = email
                details.status = 'Pending...'
                await this.deleteFaculty(previous_email)
                await db.faculty.insertOne(details)
            } else {
                await db.faculty.updateOne({ 'email': email }, {
                    '$set': {
                        course: course,
                        section: section,
                        department: department,
                        year: year,
                    }
                })
            }
            return 'true'
        }
    }
}
module.exports = new HOD()