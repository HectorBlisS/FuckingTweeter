const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: process.env.USERMAIL, // generated ethereal user
            pass: process.env.USERMAILPASSWORD // generated ethereal password
        }     
    }
)

exports.sendActivationLink = (user) => {
    const options = {
        from: '"Ironhack 👻" <fixtergeek@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: 'Bienvenido ✔', // Subject line
        html: `<h2>Activa tu cuenta: <a href="http://localhost:3000/activation"> Click aqui </a></h2>`, // plain text body
        //html: '<b>Hello world?</b>' // html body
    };
    transporter.sendMail(options, (err,info)=>{
        console.log(err)
        console.log(info)
    });

}