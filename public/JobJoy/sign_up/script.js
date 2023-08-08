const boton_enviar = document.getElementById('ingresar');
const ventana_emergente = document.getElementById('ventana');
const ventana_formulario = document.getElementById('visibles');
const ventana_exito = document.getElementById('ocultos');

boton_enviar.addEventListener('click', ()=>{
    boton_enviar.disabled = true;
    let valor_password = document.getElementById('password').value;
    let valor_repeat_password = document.getElementById('repeat_password').value;

    if(valor_password !== valor_repeat_password){mensaje('las contraseñas no coinciden')}
    else if (valor_password === "" ){mensaje('la contraseña es un campo obligatorio')}
    else{

        let valor_username = document.getElementById('username').value;
        let valor_email = document.getElementById('email').value;

        if(valor_username === ""){mensaje('El nombre de usuario es un campo obligatorio')}
        else if(valor_email === ""){mensaje('El email es un campo obligatorio')}
        else if (!validarFormatoCorreo(valor_email)){mensaje(`"${valor_email}" no es un email valido o no está bien escrito`)}
        else{

            let datos = {usuario : valor_username, email : valor_email, password : valor_password};
            let respuesta;
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/JobJoy/sign_up', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = ()=> {
            if (xhr.readyState == 4 && xhr.status == 200){
                respuesta = JSON.parse(xhr.responseText);
                if (!respuesta.usernameDisponible){mensaje(`El nombre de usuario "${valor_username}" no está disponible`)}
                else {ventana_formulario.hidden = true; ventana_exito.style.display = 'flex'};
            }   
            };
            xhr.send(JSON.stringify(datos));
        }
    }
})

function mensaje (mensaje){
    ventana_emergente.style.backgroundColor = 'red';
    ventana_emergente.innerHTML = mensaje;
    ventana_emergente.hidden = false;
    setTimeout(()=>{ventana_emergente.hidden = true;}, 4000);
    boton_enviar.disabled = false;
}

function validarFormatoCorreo(correo) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(correo)) {return true;} else {return false;}
}