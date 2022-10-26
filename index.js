let cadena = document.querySelector("#cadena");

const state = {
    a: [], // almacena
    b: [], // almacena
    c: [], // borra
    automataActual: [], // captura el automata actual
    automata1: ['Z'], // automata para ver el comportamiento del automata ingresado
    cont: 0,
    contLimit: 0
}

// VALIDA SI UN NUMERO ES PAR
function validatePar(numero) {  return (numero % 2) == 0; } 

// VALIDA QUE EL CARACTER CUMPLA LAS CONDICIONES DEL AUTOMATA
function validate(arr, condicion, condicion1) 
{
    let contA = 0;
    if(condicion != "" && condicion1 != "")
    {
        arr.reduce((preview, el) => el == condicion || el == condicion1 ? preview + 1 : preview + 0, 0);
    }
    else if(condicion != "" && condicion1 == "")
    {
        arr.reduce((preview, el) => el == condicion ? preview + 1 : preview + 0, 0);
    }
    // SI NO ES PAR -- NO RESOLVEMOS
    if(!validatePar(contA))
    {
        alert(`La cantidad de letras para '${condicion}' no conciden en la cadena, vuelva a intentarlo`);
        return true;
    }
    return false;
}

// LIMPIAR LOS CAMPOS 
function clearFields() 
{
    state.automata1 = ['Z'];
    state.automataActual = [];
    state.a = [];
    state.b = [];
    state.c = [];
    state.cont = 0;
    state.contLimit = 0;    
}

// OCULTA CONTENIDO
function hideContent()
{
    document.querySelectorAll(".item-none").forEach(el => {
        el.classList.add('d-none');
    })
    document.querySelector(".card_ingresar-cadena").classList.remove("d-none");
}

// MUESTRA EL CONTENIDO OCULTO
function showContent()
{
    document.querySelectorAll(".item-none").forEach(el => {
        el.classList.remove('d-none');
    })
    document.querySelector(".card_ingresar-cadena").classList.add("d-none");
}

// GENERA EL MARCO DE HTML PARA EL AUTOMATA ACTUAL
function generateMarkup(custom, el) { return `<span class="${ custom == "A2" ? 'fw-bold' : '' }"  data-id="${custom}${el}">${el}</span>` }

// RENDERIZAR EL HTML PARA EL AUTOMATA ACTUAL
function renderAutomataActual(data) 
{
    document.querySelector(".cadena-automata-1").innerHTML = "";
    let markup = data.map(el => generateMarkup("A1",el)).join("");
    document.querySelector(".cadena-automata-1").insertAdjacentHTML('afterbegin', markup);
}

// RENDERIZAR EL HTML PARA EL SEGUNDO ACTUAL
function renderAutomataComportamiento(data) 
{
    document.querySelector(".cadena-automata-2").innerHTML = "";
    let markup = data.map(el => generateMarkup("A2",el)).join("");
    document.querySelector(".cadena-automata-2").insertAdjacentHTML('afterbegin', markup);
}

// INICIO DEL AUTOMATA
function iniciarAutomata() 
{
    document.querySelector("#btn_cadena").addEventListener("click", function (e) {
        e.preventDefault();
        clearFields();
        let b = 0;
        let valor = cadena.value;
        if(valor == "") return alert("ingrese una cadena");
        // CONVERTIMOS LA CADENA A UN ARREGLO
        let arr = valor.split("");
    
        // OBTENEMOS LA PRIMERA POSICION DE B PARA LIMITAR LAS A
        arr.forEach((el, i) => el == 'b' && b == 0 ? b = i : null);
        // OBTENEMOS LA ULTIMA POSICION DE B PARA ELIMINAR EN BASE A LA POSICION
        arr.forEach((el, i) => el == 'b'? state.contLimit = i : null);
        // ----- ALMACENAMOS LAS PRIMERAS A ------
        arr.forEach((el, i)=> el == 'a' && b >= i ? state.a.push(el) : null );
        // ----- ALMACENAMOS LAS B -----
        arr.forEach(el => el == 'b' ? state.b.push(el) : null);
        // ----- ALMACENAMOS LAS C -----
        arr.forEach(el => el == 'c' ? state.c.push(el) : null);
        // VALIDAMOS QUE NO EXISTAN OTRAS LETRAS
        let filterLetters = [...arr].filter(el => el != 'a' && el != 'b' && el != 'c');
        if(filterLetters.length > 0) return alert("La cadena no tiene el formato correcto");
        // VALIDAMOS QUE EXISTAN LA MISMA CANTIDAD DE CARACTERES PARA CADA LETRA
        if(validate(arr, 'a', '')) return;
        if(validate(arr, 'b', 'c')) return;
        // DEBE DE EXISTER UNA 'A' AL FINAL DE LA CADENA
        if(arr[arr.length - 1] != 'a') return alert("la cadena no tiene el formato correcto");
        // VALIDAMOS QUE LA CADENA TENGA EL FORMATO CORRECTO (ESTA EXPRESION SE PUEDE MEJORAR)
        let expresion = new RegExp("(a+b+)c{"+state.b.length+"}a{"+state.a.length+"}", "g");
        if(!valor.match(expresion)) return alert("la cadena no es valida");
        state.automataActual = arr;
        renderAutomataActual(arr);
        renderAutomataComportamiento(state.automata1);
        showContent();
    });
}

// AGREGAR COLOR SEGUN EL ESTADO
function colorStateAutomata(state) 
{
    document.querySelectorAll(".state").forEach(el => {
        el.classList.remove("bg-success");
        el.classList.remove("text-white");
    });
   if(state != "R")
   {
        document.querySelector(`.state-${state}`).classList.add("bg-success");
        document.querySelector(`.state-${state}`).classList.add("text-white");
   }
}

// PASO DEL AUTOMATA
function pasoAutomata() 
{
    document.querySelector(".btn-paso").addEventListener("click", function (e) {
        e.preventDefault();
        if(state.cont <= state.contLimit)
        {
            state.automata1.unshift(state.automataActual[state.cont]);
            if(state.automataActual[state.cont] == 'a')
            {
                colorStateAutomata("0");
                document.querySelector(".estado-actual").textContent = "Q0";
            }
            if(state.automataActual[state.cont] == 'b')
            {
                colorStateAutomata("1");
                document.querySelector(".estado-actual").textContent = "Q1";
            }
            state.cont++;
            renderAutomataComportamiento(state.automata1);
        }
        else
        {
            state.automata1.shift();
            renderAutomataComportamiento(state.automata1);
            if(state.automata1.filter(el => el == 'b').length > 0) 
            {
                colorStateAutomata("2");
                document.querySelector(".estado-actual").textContent = "Q2";
            }
            else if(state.automata1.filter(el => el == 'a').length > 0) 
            {
                colorStateAutomata("3");
                document.querySelector(".estado-actual").textContent = "Q3";
            }
            if(state.automata1.length == 0) 
            {
                colorStateAutomata("4");
                document.querySelector(".estado-actual").textContent = "Q4";
                document.querySelector(".card-automata").classList.add("bg-success");
                document.querySelector(".card-automata").classList.add("text-white");
            }
        }
    });
}

// REINICIAR AUTOMATA
function reiniciarAutomata() 
{
    document.querySelector(".btn-reiniciar").addEventListener("click", function (e) {
        e.preventDefault();
        state.cont = 0;
        state.automata1 = ['Z'];
        renderAutomataComportamiento(state.automata1);
        document.querySelector(".card-automata").classList.remove("bg-success");
        document.querySelector(".card-automata").classList.remove("text-white");
        document.querySelector(".estado-actual").textContent = "Q0";
        colorStateAutomata("R");
    });
}

// NUEVO AUTOMATA 
function nuevoAutomata() 
{
    document.querySelector(".btn-nuevo").addEventListener("click", function (e) {
        e.preventDefault();
        clearFields();
        hideContent();
        cadena.value = "";
        document.querySelector(".estado-actual").value = "Q0";
        document.querySelector(".card-automata").classList.remove("bg-success");
        document.querySelector(".card-automata").classList.remove("text-white");
        colorStateAutomata("R");
    });
}

function init() 
{
    hideContent();
    iniciarAutomata();
    pasoAutomata();
    reiniciarAutomata();
    nuevoAutomata();
}

init();