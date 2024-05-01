const db = require('./db')

class Faculty {
    async addAssignment(description, marks, course, section, link, deadline) {
        let details = {
            description: description,
            marks: marks,
            course: course,
            section: section,
            link: link,
            deadline: deadline
        };
        await db.assignments.insertOne(details)
        return 'true'
    }

    async updateAssignment(previous_email, email, course, section, department, year) {
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
module.exports = new Faculty()