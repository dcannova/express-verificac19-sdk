const nodemailer = require('nodemailer');

module.exports.send = (_subject, _body) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'debugger.daniele.cannova@gmail.com',
            pass: '#DebuggerDanieleCannova'
        }
    });

    var mailOptions = {
        from: 'debugger.daniele.cannova@gmail.com',
        to: 'daniele.cannova@gmail.com',
        subject: _subject,
        html: _body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email inviata: ' + info.response);
        }
    });
}