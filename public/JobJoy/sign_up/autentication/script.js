const txt = document.getElementById('texto');
const valores = window.location.search;
if(valores){
    txt.innerHTML = 'bien echo, ahora puedes loguearte usando tu nombre de usuario y tu contraseña en la app'
}else{
    txt.innerHTML = 'Ha ocurrido un error e su autenticación, por fabor intentelo más tarde'
}