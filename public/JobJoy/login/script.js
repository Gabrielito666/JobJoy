const boton_ingresar = document.getElementById('ingresar');
const ventana_emergente = document.getElementById('v_emergente')
boton_ingresar.addEventListener('click', ()=>{
    boton_ingresar.disabled = true;
    let valor_username = document.getElementById('username').value;
    let valor_password = document.getElementById('password').value;
    if (valor_password === "" ){mensaje('la contraseña es un campo obligatorio')}
    else if(valor_username === ""){mensaje('El nombre de usuario es un campo obligatorio')}
    else{
        let datos = {username : valor_username, password : valor_password}
        let respuesta;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200){
            respuesta = JSON.parse(xhr.responseText);
            console.log(respuesta)
            if(respuesta.ok){location.href = '../app/index.html'}
            else{mensaje('Hay un error en el nombre de usuario o la password')}
          }
        };
        xhr.send(JSON.stringify(datos));
    }
})
function mensaje (mensaje){
    ventana_emergente.style.backgroundColor = 'red';
    ventana_emergente.innerHTML = mensaje;
    ventana_emergente.hidden = false;
    setTimeout(()=>{ventana_emergente.hidden = true;}, 4000);
    boton_ingresar.disabled = false;
}