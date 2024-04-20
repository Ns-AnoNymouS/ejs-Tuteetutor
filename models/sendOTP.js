const db = require('./db')
const UserModel = require('./user');
const nodemailer = require('nodemailer');

class OtpModel {
    otpStore = {}
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'iiitstuteetutor@gmail.com',
            pass: 'xpic xajd mckb aruh',
        },
    });

    async checkOTP(email, username, password, otp) {
        let sts = await UserModel.checkEmail(email)
        if (sts == 'Exists') {
            return 'User Already Exists'
        }
        else {
            if (this.otpStore[email] != otp){
                return "Incorrect OTP"
            }
            else {
                await db.insertData(email, username, password);
                return 'true'
            }
        }
    }

    async sendOTP(reciever) {
        let OTP = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);
        this.otpStore[reciever] = OTP;
        const mailOptions = {
            from: 'iiitstuteetutor@gmail.com',
            to: reciever,
            subject: 'Email Verfication.',
            text: `Your OTP is ${OTP}`,
            html: `<p>Your OTP is <b>${OTP}</b></p>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}

module.exports = new OtpModel();