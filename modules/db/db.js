
const sqliteExpress = require('sqlite-express');
const path = require('path');
const db = sqliteExpress.createDB(path.resolve(__dirname, 'data.db'));
module.exports ={
    usuarioExiste : async (usuario)=>{
        let resultado = await sqliteExpress.select(db, 'usuarios', 'usuario', {usuario : usuario});
        if (resultado === undefined || resultado === null){return false}else{return true}
    },
    verificacion_correcta : async (usuario, token)=>{
        try{
            if(await sqliteExpress.select(db, 'usuarios', 'token_verificacion', {usuario : usuario}) === token){///?
                return true
            }else {return false}
        }catch {return false}
    },
    obtenerDato : async(usuario, item)=>{
        return await sqliteExpress.select(db, 'usuarios', item, {usuario : usuario});},
    nuevoUsuario : (usuario) =>{
        usuario.tareas = [];
        usuario.habitos = [];
        usuario.subditos = [];
        usuario.notificaciones = [];
        sqliteExpress.insert(db, 'usuarios', usuario);
    },
    actualizar : (usuario, item, objeto)=>{sqliteExpress.update(db, "usuarios", {[item] : objeto}, {usuario : usuario})},
    seleccionarFila : async (usuario)=>{
        return { 
            tareas : await sqliteExpress.select(db, "usuarios", "tareas", {usuario : usuario}),
            habitos : await sqliteExpress.select(db, "usuarios", "habitos", {usuario : usuario}),
            subditos : await sqliteExpress.select(db, "usuarios", "subditos", {usuario : usuario}),
            notificaciones : await sqliteExpress.select(db, "usuarios", "notificaciones", {usuario : usuario})
        }
    },
    agregarItem : async (usuario, item, objeto)=>{
        sqliteExpress.update(db, "usuarios", {[item] : (x)=>{return [...x, objeto.nuevoElemento]}}, {usuario : usuario})
    },
    quitarItems : async (usuario, detalle) => {
        //separar array de habitos y tareas
        let tareasRealizadas = detalle.filter(indice => indice.item === 'tareas');
        let habitosRealizados = detalle.filter(indice => indice.item === 'habitos');
    
        if(tareasRealizadas.length>0){
            let idsTareas = [];
            tareasRealizadas.forEach(tarea=>{idsTareas.push(tarea.id)});
            sqliteExpress.update(db, 'usuarios', {tareas : (x)=>{return x.filter(objeto => !idsTareas.includes(objeto.id))}}, {usuario : usuario})
        }
        if(habitosRealizados.length>0){
            let idsHabitos = [];
            habitosRealizados.forEach(habito=>{idsHabitos.push(habito.id)}); 
            sqliteExpress.update(db, 'usuarios', {habitos : (x)=>{return x.map(objeto => {if (idsHabitos.includes(objeto.id)){return { ...objeto, realizado: true };}return objeto;});}}, {usuario : usuario})
        }  
    },
    actualizarIds : (usuario, tareas, habitos) => {sqliteExpress.update(db, 'usuarios', {tareas : tareas, habitos : habitos}, {usuario : usuario})},
    eliminarFila :(usuario)=>{sqliteExpress.delete(db, 'usuarios', {usuario : usuario})},
    invitarSubdito : async (amo, subdito)=>{
        sqliteExpress.update(db, 'usuarios', {notificaciones : (x)=>{return [...x, amo];}}, {usuario : subdito});
    },
    agregarSubdito : async(subdito, amo) =>{
        sqliteExpress.update(db, 'usuarios', {notificaciones : (x)=>{return x.filter(notificacion => notificacion !== amo);}}, {usuario : subdito});
        sqliteExpress.update(db, 'usuarios', {subditos: (x)=>{return [...x, subdito];}}, {usuario : amo})
    },
    resetearHabitos : async ()=>{
        let arrayUsuarios = await sqliteExpress.select(db, 'usuarios', 'usuario');
        arrayUsuarios.forEach(user=>{
            sqliteExpress.update(db, 'usuarios', {habitos : (x)=>{return x.map(habito => {return { ...habito, realizado: false };});}}, {usuario : user});//revisar
        });
    }
}