console.log('activo test.js')

document.querySelector('#botonagregar').addEventListener('click', traer);


function traer() {
    console.log('dentro de la funcion traer de test.js');

    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', '../static/js/test/test.json', true);

    xhttp.send();

    xhttp.onreadystatechange = function(){
        if (this.readyState==4 && this.status==200){
            //console.log(this.responseText)
            var datos = JSON.parse(this.responseText);
            //console.log(datos);
            var res = document.querySelector('#tableId')
            res.innerHTML = ''

            for ( var item of datos){
                //console.log(item);
                res.innerHTML += `
        
                <tr>
                    <th scope="row">${ item.id }</th>
                    <td>${ item.nombre }</td>
                    <td>${ item.email }</td>
                    <td>${ item.estado ? "Activo" : "Eliminado" }</td>
                </tr>
                
                `

            }
        }
    }

    
}


/* var contenido = document.querySelector('#tableId')

function traer() {
    fetch('static/js/test/test.json')
        .then(res => res.json())
        .then(datos => {
            // console.log(datos)
            tabla(datos)
        })
}

function tabla(datos) {
    // console.log(datos)
    tableId.innerHTML = ''
    for(let valor of datos){
        // console.log(valor.nombre)
        tableId.innerHTML = `
        
        <tr>
            <th scope="row">${ valor.id }</th>
            <td>${ valor.nombre }</td>
            <td>${ valor.email }</td>
            <td>${ valor.estado ? "Activo" : "Eliminado" }</td>
        </tr>
        
        `
    }
} */