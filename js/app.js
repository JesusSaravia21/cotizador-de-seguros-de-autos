
//Nota: Es importante que los prototypes se usen cuando se vaya a crear elementos HTML

//Constructores
function Seguro(marca, year, tipo){ //Este objeto constructor define las propiedades del tipo de seguro elegido
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//Prototype del objeto de tipo seguro que realiza la cotizacion en base a los datos
Seguro.prototype.cotizarSeguro = function(){
    /*
        1 = Americano  1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

    let cantidad;
    const base = 2000;

    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
            break;

        case '2':
            cantidad = base * 1.05;
            break;

        case '3':
            cantidad = base * 1.35;
            break;

        default:
            break;
    }

    //Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    //Cada año que la diferencia sea mayor el costo va a reducirse un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Si el seguro es basico  se multiplica un 30% mas
        Si el seguro es completo se multiplica un 50% mas
     */

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }

    return cantidad;
   
    
}

//El siguiente constructor no requiere de parametros
function UI(){

}

//Prototype que llena las opciones con los años
UI.prototype.llenarOpciones = () =>{ //No requiere que valide variables locales del objeto, por lo que se usara un arrow function en lugar de un function
    const max = new Date().getFullYear(),
        min = max - 13;


    const selectYear = document.querySelector('#year');

    for(let i = max; i>= min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}

//Prototype que muestra mensaje de error o de confirmacion
UI.prototype.mostrarMensaje = (mensaje, tipo) =>{ //Este prototype recibe como parametros el mensaje y el tipo (ya sea de confirmacion o de error)
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;
    
    //Insertar dentro del HTML
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() =>{//Despues de 3 segundos se removera el div con el mensaje 
        div.remove();
    }, 3000); 
    

}

UI.prototype.mostrarResultado = (total, seguro)=>{
    
    //Destructuring del objeto seguro
    const {marca, year, tipo} = seguro;

    let textoMarca;
    
    switch(marca){
        case '1':
            textoMarca = 'Americano';
            break;
        case '2':
            textoMarca = 'Asiatico';
            break;
        case '3':
            textoMarca = 'Europeo';
            break;
        default:
            break;
    }
            
    
    
    //Crear el resultado que se va a mostrar en pantalla
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
        <p class= "header">Tu Resumen</p>
        <p class= "font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class= "font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class= "font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class= "font-bold">Total: <span class="font-normal">$${total}</span></p>
    
    `;
    //Seleccionamos el div que va a mostrar el resultado dentro del HTML
     const resultadoDiv = document.querySelector('#resultado');
     

     //Mostrar el spinner
     const spinner = document.querySelector('#cargando');
     spinner.style.display = 'block';
    
    setTimeout(()=>{
        spinner.style.display = 'none'; //Quitamos el spinner
        resultadoDiv.appendChild(div); //Se muestra el resultado
    }, 3000);

}

//Instanciar el objeto UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', ()=>{
    ui.llenarOpciones();
})

eventListeners();
function eventListeners(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){
    e.preventDefault();
    console.log('Cotizando...');

    //Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    

    //Leer el año seleccionado
    const year = document.querySelector('#year').value;

    //Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value; //Selecciona el radio button que el usuario haya elegido
    console.log(tipo);

    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'correcto');

    //Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado div'); //Seleccionamos el div que se encuentra dentro del div con el id resultado
    if(resultados != null){ //En caso de que exista un div dentro del div con el id resultado entonces ejecutara el siguiente codigo
        resultados.remove();
    }


    //Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();
    

    //Utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);

}
