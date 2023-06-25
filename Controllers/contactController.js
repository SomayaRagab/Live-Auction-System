const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
require('./../Models/contactModel');
const contactSchema = mongoose.model('contacts');

exports.addContact = (request, response, next) => {
    const { name, email, message, subject, phone } = request.body;
    // Define the email options
    const mailOptions = {
        from: email,
        to: 'iti.mans.projects@gmail.com',
        subject: subject,
        text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`,
    };
    // Create a transport object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'iti.mans.projects@gmail.com',
            pass: 'gzfaqbuojsbvbeuq',
        },
    });
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
            response.status(500).json({ success: false, message: 'حدث خطأ أثناء إرسال البريد الإلكتروني' });
        } else {
            // console.log('helllo world');
            // Save the contact details to the database
            new contactSchema({
                name: name,
                email: email,
                phone: phone,
                subject: subject,
                message: message,
            })
                .save()
                .then((data) => {
                    response.status(201).json({ data });
                })
                .catch((error) => next(error));
        }
    });
};

exports.getAllContact = async (request, response, next) => {
    await contactSchema
        .find({})
        .then((data) => {
            response.status(200).json({ data });
        })
        .catch((error) => next(error));
}

exports.deleteContact = (request, response, next) => {
    contactSchema
        .findOne({ _id: request.params.id })
        .then((data) => {
            if (!data) {
                throw new Error("الاتصال غير موجود");
            } else {
                return contactSchema.deleteOne({ _id: request.params.id });
            }
        })
        .then((data) => {
            if (data.deletedCount > 0) {
                response.status(200).json({ message: 'تم حذف الاتصال بنجاح' });
            } else {
                throw new Error("فشل حذف الاتصال");
            }
        })
        .catch((error) => {
            next(error);
        });
};