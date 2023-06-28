const tabla_tareas = document.getElementById('t_tareas');
const tabla_habitos = document.getElementById('t_habitos');
const boton_actualizar = document.getElementById('b_actualizar');
const boton_invitar_sub = document.getElementById('b_invitar_sub');
const boton_agregar = document.querySelectorAll('#agregar');
const boton_enviar = document.getElementById('b_enviar');
const boton_realizar = document.getElementById('b_realizar');
const ventana_agregar = document.getElementById('v_agregar');
const salir_ventana = document.getElementById('s_ventana');
const ventana_mensaje = document.getElementById('v_mensaje')

let usuario, porx_id_habito, prox_id_tarea;
let hayTareas = false;
let hayHabitos = false;

function ajaxPost (url, objeto, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200){callback(JSON.parse(xhr.responseText));}
    };
    xhr.send(JSON.stringify(objeto));
}

function renderizarTablas(datos){

    console.log(datos)
    porx_id_habito = 0;
    prox_id_tarea = 0;
   
    if(datos.ok){
        let tareas = datos.tareas;
        let habitos = datos.habitos;

        usuario = datos.usuario;

        if(tareas !== null && tareas.length > 0 ){
            hayTareas = true;
            let stringTareas = "<tr id='t_cabecera'><th>Tarea</th><th>Creador</th><th>realizada</th></tr>";
            tareas.forEach((tarea)=>{
                stringTareas += `<tr id="${tarea.id}" name="tareas"><td>${tarea.actibidad}</td><td>${tarea.creador}</td><td><input type='checkbox' id="${tarea.id}" name="tareas"></td></tr>`
                prox_id_tarea ++;
            });
            tabla_tareas.innerHTML = stringTareas;
        }
        if(habitos !== null && habitos.length > 0){
            let stringHabitos = "<tr id='h_cabecera'><th>Habito</th><th>realizado</th></tr>";
            
            habitos.forEach((habito)=>{
                if(!habito.realizado){
                    stringHabitos += `<tr id="${habito.id}" name="habitos"><td>${habito.actibidad}</td><td><input type='checkbox' id="${habito.id}" name="habitos"></td></tr>`
                    hayHabitos = true;
                }
              porx_id_habito ++;
            });
            if(hayHabitos){tabla_habitos.innerHTML = stringHabitos;}
        }        
        setTimeout(()=>{ajaxPost('/pantalla', {}, renderizarTablas)}, datos.timeForMidnight)
    }else{location.href = '../login/index.html'};
    if(datos.notificaciones.length>0){
        console.log("si")
        //pantalla emergente notifficaciones con boton de aceptar 
    }else{console.log("no")}
}
function actualizarTabla(tabla, actibidad, id) {
    let stringTareas = "";
    let stringHabitos = "";
    if(tabla === 'tareas'){
        if(!hayTareas){stringTareas +="<tr id='t_cabecera'><th>Tarea</th><th>Creador</th><th>realizada</th></tr>"; hayTareas=true;};
        stringTareas += `<tr id="${id}" name="tareas"><td>${actibidad}</td><td>${usuario}</td><td><input type='checkbox' id="${id}" name="tareas"></td></tr>`
    }
    if(tabla === 'habitos'){
        if(!hayHabitos){stringHabitos += "<tr id='h_cabecera'><th>Habito</th><th>realizado</th></tr>"; hayHabitos=true;}
        stringHabitos += `<tr id="${id}" name="habitos"><td>${actibidad}</td><td><input type='checkbox' id="${id}" name="habitos"></td></tr>`
    }
    if(stringTareas.length > 0){tabla_tareas.innerHTML += stringTareas;}
    if(stringHabitos.length > 0){tabla_habitos.innerHTML += stringHabitos;}
}

function callbackSubdito(respuesta){
    if(!respuesta.usuarioExiste){ventanaMensaje('red', 'El usuario que escribiste no existe')}
    else{ventanaMensaje('green', '¡Invitación enviada!')};
}

function ventanaMensaje(color, mensaje){
    ventana_mensaje.style.backgroundColor = color,
    ventana_mensaje.innerHTML = `<p>${mensaje}</p>`
    ventana_mensaje.hidden = false;
    setTimeout(()=>{ventana_mensaje.hidden = true}, 4000)
}

boton_actualizar.addEventListener('click', ()=>{ajaxPost('/pantalla', {}, renderizarTablas);})

let aEnviar;
boton_agregar.forEach((boton)=>{
    boton.addEventListener('click', (e)=>{
       aEnviar = e.target.name;
       ventana_agregar.hidden = false;
    })
})
salir_ventana.addEventListener('click', ()=>{ventana_agregar.hidden = true;})

boton_enviar.addEventListener('click', ()=>{
    let input = document.getElementById('i_agregar').value
    if(aEnviar === 'subdito'){
        if (input === usuario){ventanaMensaje('red', 'No puedes ser tu propio subdito')}
        ajaxPost('/invitar_subdito', {subdito : input}, callbackSubdito)
    }else{
        let nuevoElemento = {actibidad : input};
        let proxID;
        if(aEnviar === 'tareas'){
            nuevoElemento.creador = usuario;
            nuevoElemento.id = prox_id_tarea;
            proxID = prox_id_tarea;
            prox_id_tarea++
        } else if (aEnviar === 'habitos'){
            nuevoElemento.id = porx_id_habito;
            nuevoElemento.realizado = false;
            proxID = porx_id_habito;
            porx_id_habito++
        };
        console.log(prox_id_tarea, porx_id_habito, proxID)
        
        ajaxPost(`agregar/${aEnviar}`, {nuevoElemento : nuevoElemento}, ()=>{});
        actualizarTabla(aEnviar, input, proxID);
        document.getElementById('i_agregar').value = "";
        ventana_agregar.hidden = true;
    }
});

boton_realizar.addEventListener('click', ()=>{
    let checkBoxes = document.querySelectorAll('input[type=checkbox]');
    let objetos = [];
    checkBoxes.forEach(ckbx=>{
        if(ckbx.checked){
            objetos.push({id : parseInt(ckbx.id, 10), item : ckbx.name})
        };
    });
    console.log(objetos)
    ajaxPost('/quitar', objetos, ()=>{});  
    objetos.forEach(indice => {
        console.log(indice)
        let tr = document.querySelector(`tr[id="${indice.id.toString()}"][name="${indice.item}"]`).remove();
    })
    if(hayTareas){
        let trsTareas = document.querySelectorAll('tr[name="tareas"]');
        if (trsTareas.length === 0){document.getElementById('t_cabecera').remove(); hayTareas=false};
    }
    if(hayHabitos){
        let trsHabitos = document.querySelectorAll('tr[name="habitos"]');
        if (trsHabitos.length === 0){document.getElementById('h_cabecera').remove(); hayHabitos=false};
    }
})

ajaxPost('/pantalla', {}, renderizarTablas);