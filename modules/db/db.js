const { json } = require('express');
const sqliteExpress = require('sqlite-express');
module.exports = () =>{
    const db = sqliteExpress.createDB('./data.db');
    sqliteExpress.createTable(db, 'usuarios', {usuario : 'text not null primary key', email : 'text', email_verificado : 'text', password : 'text', tareas : 'text', habitos : 'text', subditos : 'text', notificaciones : 'text', token_verificacion : 'text'});
    return {
        usuarioExiste : async (usuario)=>{
            let resultado = await sqliteExpress.select(db, 'usuarios', 'usuario', {usuario : usuario});
            if (resultado.length === 0){return false}else{return true}
        },
        verificacion_correcta : async (usuario, token)=>{
            try{
                if(await sqliteExpress.select(db, 'usuarios', 'token_verificacion', {usuario : usuario}) === token){
                    return true
                }else {return false}
            }catch {return false}
        },
        obtenerDato : async(usuario, item)=>{
            let dato = await sqliteExpress.select(db, 'usuarios', item, {usuario : usuario})
            if (dato[0][item] === 'true'){return true}
            else if(dato[0][item] === 'false'){return false}
            else{return dato[0][item]}
        },
        nuevoUsuario : (usuario) =>{
            usuario.tareas = "[]";
            usuario.habitos = "[]";
            usuario.subditos = "[]";
            usuario.notificaciones = "[]";
            sqliteExpress.insert(db, 'usuarios', usuario)
        },
        actualizar : (usuario, item, objeto)=>{sqliteExpress.update(db, "usuarios", {[item] : objeto}, {usuario : usuario})},
        seleccionarFila : async (usuario)=>{
            let tareas = await sqliteExpress.select(db, "usuarios", "tareas", {usuario : usuario});
            let habitos = await sqliteExpress.select(db, "usuarios", "habitos", {usuario : usuario});
            let subditos = await sqliteExpress.select(db, "usuarios", "subditos", {usuario : usuario});
            let notificaciones = await sqliteExpress.select(db, "usuarios", "notificaciones", {usuario : usuario});

            return { 
                tareas : JSON.parse(tareas[0].tareas),
                habitos : JSON.parse(habitos[0].habitos),
                subditos : JSON.parse(subditos[0].subditos),
                notificaciones : JSON.parse(notificaciones[0].notificaciones)
            }
        },
        agregarItem : async (usuario, item, objeto)=>{
            let array = await sqliteExpress.select(db, 'usuarios', item, {usuario : usuario});
            console.log(item)
            console.log(objeto)
            array = array[0][item];
           
            if(array === null || JSON.parse(array).length === 0){array = [objeto.nuevoElemento]}
            else{
                array = JSON.parse(array);
                array.push(objeto.nuevoElemento);
            }
            sqliteExpress.update(db, "usuarios", {[item] : JSON.stringify(array)}, {usuario : usuario})
        },
        quitarItems : async (usuario, detalle) => {
            //separar array de habitos y tareas
            let tareasRealizadas = detalle.filter(indice => indice.item === 'tareas');
            let habitosRealizados = detalle.filter(indice => indice.item === 'habitos');

            console.log(tareasRealizadas, habitosRealizados, "analize pue señor")
        
            if(tareasRealizadas.length>0){
                let idsTareas = [];
                tareasRealizadas.forEach(tarea=>{idsTareas.push(tarea.id)});

                let arrayTareas = await sqliteExpress.select(db, 'usuarios', 'tareas', {usuario : usuario});
             
                arrayTareas = JSON.parse(arrayTareas[0].tareas);
                arrayTareas = arrayTareas.filter(objeto => !idsTareas.includes(objeto.id))
             
                sqliteExpress.update(db, 'usuarios', {tareas : JSON.stringify(arrayTareas)}, {usuario : usuario})
            }
            if(habitosRealizados.length>0){
                let idsHabitos = [];
                habitosRealizados.forEach(habito=>{idsHabitos.push(habito.id)});
                let arrayHabitos = await sqliteExpress.select(db, 'usuarios', 'habitos', {usuario : usuario});
                arrayHabitos = JSON.parse(arrayHabitos[0].habitos);
        
                arrayHabitos = arrayHabitos.map(objeto => {
                    if (idsHabitos.includes(objeto.id)) {
                      return { ...objeto, realizado: true };
                    }return objeto;
                });
            
                sqliteExpress.update(db, 'usuarios', {habitos : JSON.stringify(arrayHabitos)}, {usuario : usuario})
            }  
        },
        actualizarIds : (usuario, tareas, habitos) => {sqliteExpress.update(db, 'usuarios', {tareas : JSON.stringify(tareas), habitos : JSON.stringify(habitos)}, {usuario : usuario})},
        resetearHabitos : ()=>{},
        eliminarFila :(usuario)=>{sqliteExpress.delete(db, 'usuarios', {usuario : usuario})}
    }
}