const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.smtpUser,
        pass: process.env.smtpPass
    }
})

module.exports = { transporter }