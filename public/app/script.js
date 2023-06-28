const tabla_tareas = document.getElementById('t_tareas');
const tabla_habitos = document.getElementById('t_habitos');
const boton_actualizar = document.getElementById('b_actualizar');
const boton_invitar_sub = document.getElementById('b_invitar_sub');
const boton_agregar = document.querySelectorAll('#agregar');
const boton_enviar = document.getElementById('b_enviar');
const boton_realizar = document.getElementById('b_realizar');
const ventana_agregar = document.getElementById('v_agregar');
const salir_ventana = document.getElementById('s_ventana');

let usuario, porx_id_habito, prox_id_tarea;

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

    porx_id_habito = 0;
    prox_id_tarea = 0;
   
    if(datos.ok){
        let tareas = datos.tareas;
        let habitos = datos.habitos;

        usuario = datos.usuario;

        if(tareas !== null && tareas.length !== 0 ){
            console.log(tareas)
            let stringTareas = "<tr><th>Tarea</th><th>Creador</th><th>realizada</th></tr>";
            tareas.forEach((tarea)=>{
                stringTareas += `<tr id="${tarea.id}" name="tareas"><td>${tarea.actibidad}</td><td>${tarea.creador}</td><td><input type='checkbox' id="${tarea.id}" name="tareas"></td></tr>`
                prox_id_tarea ++;
            });
            tabla_tareas.innerHTML = stringTareas;
        }
        if(habitos !== null && habitos.length !== 0){
            let stringHabitos = "<tr><th>Habito</th><th>realizado</th></tr>";
            habitos.forEach((habito)=>{
                if(!habito.realizado){
                    stringHabitos += `<tr id="${habito.id}" name="habitos"><td>${habito.actibidad}</td><td><input type='checkbox' id="${habito.id}" name="habitos"></td></tr>`
                }
                porx_id_habito ++;
            });
            tabla_habitos.innerHTML = stringHabitos;
        }        
        setTimeout(()=>{ajaxPost('/pantalla', {}, renderizarTablas)}, datos.timeForMidnight)
    }else{location.href = '../login/index.html'}
}
function actualizarTabla(tabla, actibidad, id) {
    if(tabla === 'tareas'){
        tabla_tareas.innerHTML += `<tr id="${id}" name="tareas"><td>${actibidad}</td><td>${usuario}</td><td><input type='checkbox' id="${id}" name="tareas"></td></tr>`
    }
    if(tabla === 'habitos'){
        tabla_habitos.innerHTML += `<tr id="${id}" name="habitos"><td>${actibidad}</td><td><input type='checkbox' id="${id}" name="habitos"></td></tr>`
    }
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
    let nuevoElemento ={actibidad : document.getElementById('i_agregar').value};
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
    actualizarTabla(aEnviar, document.getElementById('i_agregar').value, proxID);
    document.getElementById('i_agregar').value = "";
    ventana_agregar.hidden = true;
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
})

ajaxPost('/pantalla', {}, renderizarTablas);