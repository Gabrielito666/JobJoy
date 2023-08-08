require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
const router = express.Router();
const PORT = process.env.PORT;

const timeForMidnight = require('./modules/habit-reset/time_for_midnight');
const db = require('./modules/db/db');
const mail = require('./modules/mail/mail')
const crypt = require('./modules/db/crypt')
const numerar = require('./modules/db/numerar')

app.use(express.static("public"));
app.use(express.json());

app.use(session({
    secret: 'miClaveSecreta',
    resave: false,
    saveUninitialized: false
}));
app.use('/', router);

router.get('/JobJoy', async (req, res)=>{res.redirect('/JobJoy/app/index.html')});
    
router.post('/sign_up', async(req, res)=>{
    let mensaje = req.body;
    console.log(mensaje.password);
    if(await db.usuarioExiste(mensaje.usuario)){res.json({usernameDisponible : false})}
    else{
        res.json({usernameDisponible : true});
        mensaje.password = await crypt.encryptpass(mensaje.password);
        mensaje.token_verificacion = crypt.randomString();
        mensaje.email_verificado = 'false';
        console.log(mensaje.password);
        db.nuevoUsuario(mensaje);
        await mail(process.env.EMAILKEY, mensaje.email, {asunto : "verifica tu cuenta JobJoy", cuerpo : `¡hola ${mensaje.usuario}!\nhaz click en el siguiente enlace para verificar tu cuenta:\n\n' ${process.env.URL}verificar/${mensaje.usuario}/${mensaje.token_verificacion}`});
    }
});

router.get('/verificar/:user/:token', async(req, res)=>{
    if(db.verificacion_correcta(req.params.user, req.params.token)){
        db.actualizar(req.params.user, 'email_verificado', 'true')
        res.redirect('/JobJoy/sign_up/autentication/index.html?true')
    }else{
        res.redirect('/JobJoy/sign_up/autentication/index.html?false')
    }
})

router.post('/login', async(req, res)=>{
    let mensaje = req.body;
    let emailVerificado = await db.obtenerDato(mensaje.username, 'email_verificado');
    let passCorrecta = await crypt.comparePass(mensaje.password, await db.obtenerDato(mensaje.username, 'password'));
    let usuarioExistente = await db.usuarioExiste(mensaje.username);

    if(emailVerificado && passCorrecta && usuarioExistente){
        req.session.usuario = mensaje.username;
        res.json({ok : true});
    }
    else{ res.json({ok : false});};
})

router.post('/pantalla', async(req, res)=>{
    if(req.session.usuario){
        let fila = await db.seleccionarFila(req.session.usuario);
        fila.tareas = numerar(fila.tareas);
        fila.habitos = numerar(fila.habitos);
        fila.ok = true;
        fila.timeForMidnight = timeForMidnight() + 10000;
        fila.usuario = req.session.usuario;
        db.actualizarIds(req.session.usuario, fila.tareas, fila.habitos);
        res.json(fila);
    }else{res.json({ok : false})}
});

router.post('/agregar/:item/:usuario', async(req, res)=>{

    db.agregarItem(req.params.usuario, req.params.item, req.body); res.json({ ok : true })

});

router.post('/quitar', async(req, res)=>{
    let mensaje = req.body;
    db.quitarItems(req.session.usuario, mensaje);
    res.json({ok : true})
})

router.post('/invitar_subdito', async(req, res)=>{
    let mensaje = req.body;
    let userExist = await db.usuarioExiste(mensaje.subdito);
    //comprobar si no se ha enviado ya una notificación igual
    if(userExist){db.invitarSubdito(req.session.usuario, mensaje.subdito)};
    res.json({usuarioExiste : userExist});
})

router.post('/solicitud_aceptada', async(req, res)=>{
    let mensaje = req.body;
    console.log(mensaje.amo)
    //comprobar que no se ha aceptado ya una solicitud igual/hacerrrrr!!!!!!!!!!!!!
    db.agregarSubdito(req.session.usuario, mensaje.amo)
})

function medianoche (){
    setTimeout(()=>{
        db.resetearHabitos();
        setTimeout(medianoche, 30000)
    }, timeForMidnight())
}medianoche();

module.exports = router;

//app.listen(PORT, ()=>{console.log('escuchando el puerto '+ PORT)});
