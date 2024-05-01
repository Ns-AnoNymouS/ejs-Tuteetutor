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

    async checkOTP(email, username, password, otp, type) {
        let sts = await UserModel.checkEmail(email)
        if (sts == 'Exists') {
            return 'User Already Exists'
        }
        else {
            if (this.otpStore[email] != otp) {
                return "Incorrect OTP"
            }
            else {
                if (type == "faculty") {
                    await db.faculty.updateOne({ 'email': email }, { '$set': { 'username': username, 'password': password, 'status': "accepted" } });
                }
                else {
                    await db.insertData(email, username, password);
                }
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

    async sendSignupRequestMail(reciever, course, section, department, year) {
        const mailOptions = {
            from: 'iiitstuteetutor@gmail.com',
            to: reciever,
            subject: 'Signup Reminder',
            html: `<!DOCTYPE html>
            <html lang="en">
            
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Agbalumo&display=swap" rel="stylesheet">
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css">
              <title>Faculty Invitation</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                }
            
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #ffffff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
            
                .logo-container {
                  text-align: center;
                  margin-bottom: 20px;
                }
            
                .logo {
                  max-width: 50px;
                  height: auto;
                  border-radius: 50%;
                }
            
                h2 {
                  color: #007bff;
                  margin-top: 0;
                }
            
                #logo-heading {
                  padding-left: 15px;
                  color: black;
                  font-family: "Agbalumo", sans-serif;
                  font-size: x-large;
                  font-weight: 100;
                }
            
                p {
                  margin-bottom: 20px;
                  line-height: 1.5;
                }
            
                ul {
                  list-style-type: none;
                  padding: 0;
                }
            
                a {
                  display: inline-block;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                }
            
                a:hover {
                  background-color: #0056b3;
                }
            
                .footer {
                  margin-top: 30px;
                  font-size: 0.8em;
                  color: #666666;
                  text-align: center;
                }
              </style>
            </head>
            
            <body>
              <div class="container">
                <div class="logo-container">
                  <div class="container-logo">
                    <h2 id="logo-heading">TuteeTutor</h2>
                  </div>
                </div>
                <p>Dear Faculty,</p>
                <p>You are invited to join TuteeTutor as a faculty member for the following course and section:</p>
                <ul>
                  <li><strong>Course:</strong> ${course}</li>
                  <li><strong>Section:</strong> ${section}</li>
                  <li><strong>Department:</strong> ${department}</li>
                  <li><strong>Year:</strong> UG-${year}</li>
                </ul>
                <p>Please click the following link to go to the signup page. You will be automatically signed up as a faculty member:</p>
                <p><a href="https://ejs-tuteetutor.onrender.com/signup">Sign Up Now</a></p>
                <p>If you have any questions or need assistance, please feel free to contact us.</p>
                <div class="footer">
                  <p>Best regards,<br>Your TuteeTutor Team</p>
                </div>
              </div>
            </body>
            
            </html>`
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