const db = require('./modules/db/db');
const sqliteExpress = require('sqlite-express');

//db().eliminarFila('Gabrielito666');
//db().eliminarFila('Gabrieltio');
//db().eliminarFila('corchea');


const dbs = sqliteExpress.createDB('./data.db');
//sqliteExpress.createTable(db, 'usuarios', {usuario : 'text not null primary key', email : 'text', email_verificado : 'text', password : 'text', tareas : 'text', habitos : 'text', subditos : 'text', notificaciones : 'text', token_verificacion : 'text'});

sqliteExpress.update(dbs, 'usuarios', {tareas : []}, {usuario : 'Gabrielito666'})
