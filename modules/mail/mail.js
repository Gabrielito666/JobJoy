const nodemailer = require('nodemailer');
module.exports = (emailkey, email, mensaje)=>{
  const config = {
    host : 'mail.lekinstrumentos.cl',
    port : 465,
    auth : {
      user : 'gabriel@lekinstrumentos.cl',
      pass : emailkey
    }
  }

  let sobre = {
    from: 'gabriel@lekinstrumentos.cl',
    to: email,
    subject: mensaje.asunto,
    text: mensaje.cuerpo
  };

  const transporter = nodemailer.createTransport(config);
  transporter.sendMail(sobre, function(error, info){
    if (error) {console.log(error);}else{console.log('Correo enviado: ' + info.response);}
  });
}