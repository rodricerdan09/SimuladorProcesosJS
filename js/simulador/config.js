//Ambiente de variables
let typeMemory = "Variable"; // tipo de Memoria
let fitMemory = "First Fit"; //Ajuste de memoria
let algorithm = "FCFS"; //Algoritmo de Planificacion
let generalQuantum = 0; // Quantum para roundRobin
let sizeMemoryCpu = 4096; // Tamaño de memoria cpu
let sizeMemory = 8192; // Tamaño de memoria planificador
let sizeMemoryDisp = 0; //Tamaño de memoria disponible para el planificador
let sizeMemoryMin = 0; // Tamaño minimo de memoria para la cpu
let sizeMemoryMax = 8192; // Tamaño maximo de memoria para la cpu
let partition = 0; //Numero de particiones fijas de la memoria
let sizepartinput =1; 
let totalpart = 0; //Valor de cada particion
let totaldisp = 0; //Tamaño restante de la memoria
let totalinput = 0; //Valor de cada particion
let memtotal = 0 // memoria total definida por el usuario
let porcMemoryDisp = 0; //Porcentaje restante de la memoria total
let arrayProcess = []; //Arreglo con los procesos importados de la BD
let arrayPartitions = []; // Memoria letiable
let count = 0;
let sim = null;
let mem = null;
/*  let arrayProcGraf = [];
let procesosTerminados = []; // cola de procesos Terminado
let colaListo = []; //Cola de procesos Listos
let cont = 0;//contador de Particiones fijas
let maxpart = 5; //cantidad maxima de particiones fijas
let memFija = []; // memoria fija
let tiempo = 0
let lenArrayProcess = 0
*/

  //Preparamos el entorno de trabajo
  $(function () {
    $("[data-toggle=popover]").popover({
          html: true
      });
  })

  $(document).tooltip({
      selector: '.tt'
  });

  $(document).ready(function(){

    $("#Memoryinput, #controlidpart, #tam-memory, #tam-memory-so, #tbodyID, inputParts, .alertRR, .priodInput, .sizeInput, .arrivalInput, .lastCpu, .inputcpu, .inputes").keydown(function(event) {

    //No permite mas de 11 caracteres Numéricos
    if (event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39) 
        if($(this).val().length >= 11)
            event.preventDefault();
    // Solo Numeros del 0 a 9 
    if (event.keyCode < 48 || event.keyCode > 57)
        //Solo Teclado Numerico 0 a 9
        if (event.keyCode < 96 || event.keyCode > 105)
            /*  
                No permite ingresar pulsaciones a menos que sean los siguietes
                KeyCode Permitidos
                keycode 8 Retroceso
                keycode 37 Flecha Derecha
                keycode 39  Flecha Izquierda
                keycode 46 Suprimir
            */
            if(event.keyCode != 46 && event.keyCode != 8 && event.keyCode != 37 && event.keyCode != 39)
                event.preventDefault();
    });
    $("#cargaprocesos").hide()
    $("#presentacion").hide()

  });     
  //Preparamos el entorno de trabajo
  //------------------------------------------------------------------------

  //---------------------SECCION CONFIGURACION------------------------------------------
  /* $('ul#navmenu div li a').off().on('click', function(){
    $('ul#navmenu div li a').removeClass('text-primary')
    $(this).addClass('text-primary')
    var activetab=$(this).attr('href'); console.log(activetab)
  }); */

  $('#config-btna').off().on('click', function(){
    var isPrimary1 = $('#config-btna').hasClass('text-primary'); console.log(isPrimary1)
    if (isPrimary1 == false){
      $('.alertSimu').addClass('show')
      $(".textoAlertSimu").text("Debe presionar el botón Nueva Configuración y definir una nueva configuración.") 
      
      setTimeout(function(){ 
        $('.alertSimu').removeClass('show');
        $('.alertSimu').addClass('hide');
      },3000);
    }
  });

  $('#process-btna').off().on('click', function(){
    const isPrimary2 = $('#process-btna').hasClass('text-primary')
    const isBorder = $('#process-btna').hasClass('border-primary')
    if (isPrimary2 == false){
      $('.alertSimu').addClass('show')
      $(".textoAlertSimu").text("Por favor presione el botón Confirmar para avanzar a la siguinte sección.") 

      setTimeout(function(){ 
        $('.alertSimu').removeClass('show');
        $('.alertSimu').addClass('hide');
      },3000);
    }
    /* if (isBorder==false){ 
      $('.alertSimu').addClass('show')
      $(".textoAlertSimu").text("Debe presionar el botón Nueva Configuración y definir una nueva configuración.")  
    } */
  });

  $('#presentation-btna').off().on('click', function(){
    var isPrimary3 = $('#presentation-btna').hasClass('text-primary'); console.log(isPrimary3)
    if (isPrimary3 == false){
      $('.alertSimu').addClass('show')
      $(".textoAlertSimu").text("Por favor presione el botón Confirmar para avanzar a la siguinte sección.") 

      setTimeout(function(){ 
        $('.alertSimu').removeClass('show');
        $('.alertSimu').addClass('hide');
      },3000);
    } else{
      $('#presentation-btna').addClass('disabled');
    }
  });

  $("#btn-parts").on("click", function() {
    $('#partfijas').removeClass('d-none');
    setTimeout(function(){ 
      $('#form-fijas').show();
    },100); 
  });

  $("#quantumid").keyup(function(){
    var quanto = parseInt($('.quantumIn').val())
    console.log(quanto)

    if (quanto > 0) {
      generalQuantum = quanto;
      $(".algoInfo").text("RR - Q:"+quanto);
    }else {
      $('.alertPlan').addClass('show');
      $(".textoAlertPlan").text("Debe ingresar un Quantum mayor a cero.");
      setTimeout(function(){ 
        $('.alertPlan').removeClass('show');
        $('.alertPlan').addClass('hide');
      },3000);
    }
    return generalQuantum;
  });
  //control de la seleccion de algoritmo
  $(".algoInfo").text("FCFS");
  $("#optionAlgo").change(function(){
    $("#quantumid").removeClass('disabled');
    var typeAlgorithm = $("#optionAlgo").find(':selected').text();

    if (typeAlgorithm == 'FCFS'){
      algorithm = typeAlgorithm; console.log(algorithm);
      $(".quantumIn").val("");
      $(".quantumIn").hide();
      $(".algoInfo").text("FCFS");

    } else if (typeAlgorithm == 'Round Robin'){
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".quantumIn").show();
        $(".algoInfo").text("RR");

    } else if (typeAlgorithm == 'Prioridades'){ 
        algorithm = typeAlgorithm; console.log(algorithm);  
        $(".quantumIn").val("");
        $(".quantumIn").hide();
        $(".algoInfo").text("Prioridades");

      } else if (typeAlgorithm == 'Prioridades SJF'){ 
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".quantumIn").val("");
        $(".quantumIn").hide();
        $(".algoInfo").text("Prioridades SJF");

      } else if (typeAlgorithm == 'Prioridades SRTF'){ 
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".quantumIn").val("");
        $(".quantumIn").hide();
        $(".algoInfo").text("Prioridades SRTF");
    } else {
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".quantumIn").hide();
        $(".algoInfo").text("Multinivel sin Retro");
    }
    
      if (typeAlgorithm == 'Round Robin'){
      $('.alertRR').removeClass('hide');
      $('.alertRR').addClass('show');
      } else{
      $('.alertRR').removeClass('show');
      $('.alertRR').addClass('hide');
      $(".alertRR").addClass("disabled");
      }
      if (typeAlgorithm == 'Prioridades'){
        $('.alertPriod').removeClass('hide');
        $('.alertPriod').addClass('show');
      } else{
        $('.alertPriod').removeClass('show');
        $('.alertPriod').addClass('hide');
        $(".alertPriod").addClass("disabled");
      }
    return algorithm;
  });
  //control de la seleccion de algoritmo

   //control de la memoria de la cpu 
   $("#tam-memory").keyup(function(){
    $('.alertPlan').removeClass('show');
    $('.alertPlan').addClass('hide');
    $('#btnconfirmar').addClass('disabled');
    $("#btn-memory").removeClass("disabled");
    $('#tam-memory-so').val('');
    let valorCurrent = parseInt($("#tam-memory").val());
    sizeMemory = valorCurrent;  console.log('sizememory',sizeMemory);
    sizeMemoryMin= Math.round(sizeMemory*0.05)
    sizeMemoryMax= Math.round(sizeMemory*0.15)
    
    setTimeout(function(){ 
      $('#p-memory').text('El tamaño mínimo es: '+sizeMemoryMin+' MB. El tamaño máximo es: '+sizeMemoryMax+' MB.')
    },1000); 

    if (sizeMemory == 0){
      $(".textoAlertPlan").text("Debe definir un tamaño de memoria mayor a cero.");
      $('.alertPlan').addClass('show');
      $('#btnconfirmar').addClass('disabled');
      $("#tam-memory-so").addClass('disabled');
      $("#btn-type").addClass('disabled');
      $("#btn-fit").addClass('disabled'); 
    }else if (sizeMemory > 8192) {
      $(".textoAlertPlan").text("Debe definir un tamaño de memoria menor a 8192 MB.");
      $('.alertPlan').addClass('show');
      $('#btnconfirmar').addClass('disabled');
      $("#tam-memory-so").addClass('disabled');
      $("#btn-type").addClass('disabled');
      $("#btn-fit").addClass('disabled'); 
    } else{
      $('#optionType').removeClass('disabled');
      $("#tam-memory-so").removeClass('disabled');
      $("#btn-type").removeClass('disabled');
      $("#btn-fit").removeClass('disabled'); 
    }
    return sizeMemory, sizeMemoryMin, sizeMemoryMax
  });

  //control de la memoria de la cpu 
  $("#tam-memory-so").keyup(function(){
    $('.alertPlan').removeClass('show');
    $('.alertPlan').addClass('hide');
    $("#btn-memory").removeClass("disabled");
    $("#btn-type").removeClass('disabled');
    $("#btn-fit").removeClass('disabled');
    $('#btnconfirmar').removeClass('disabled'); 
    $("#btnconfirmar").removeClass('d-none');
    var valorCurrent = parseInt($("#tam-memory-so").val()); 
    sizeMemoryCpu = valorCurrent;  console.log('sizememoryCPU',sizeMemoryCpu);
    sizeMemoryDisp = sizeMemory - sizeMemoryCpu;
    value = Math.round((sizeMemoryCpu*100)/8192);
    porcMemoryDispCpu = value;
    memtotal = sizeMemory-sizeMemoryCpu;
    console.log(memtotal);
    this.min = sizeMemoryMin; 
    this.max = sizeMemoryMax; 

    if(sizeMemory == 8192 || isNaN(sizeMemory)){
      $("#btn-memory").addClass("disabled");
      $("#btnconfirmar").addClass('d-none');
      $("#btnconfirmar").addClass('disabled');
      $("#btn-type").addClass('disabled');
      $("#btn-fit").addClass('disabled'); 
      $('.alertPlan').addClass('show');
      $(".textoAlertPlan").text("Debe definir el tamaño de la memoria del Planificador.");
    }  else{
      $('.alertPlan').addClass('d-none');
      $('.alertPlan').removeClass('show');
      $("#btn-memory").removeClass("disabled"); 
      $("#btnconfirmar").removeClass('d-none');
    } 

    if (sizeMemoryCpu < sizeMemoryMin){
      $(".textoAlertPlan").text("El tamaño mínimo de memoria para la CPU es de "+sizeMemoryMin+" MB.");
      $('.alertPlan').addClass('show');
      $("#btnconfirmar").addClass('disabled');
      $("#btn-type").addClass('disabled');
      $("#btn-fit").addClass('disabled'); 
    }else if (sizeMemoryCpu > sizeMemoryMax) {
      $(".textoAlertPlan").text("El tamaño máximo de memoria para la CPU es de "+sizeMemoryMax+" MB.");
      $('.alertPlan').addClass('show');
      $("#btnconfirmar").addClass('disabled');
      $("#btn-type").addClass('disabled');
      $("#btn-fit").addClass('disabled');     
    }
    return sizeMemoryDisp, porcMemoryDispCpu, sizeMemoryCpu, memtotal;
  });
  //control de la memoria del planificador

  //control del tipo de memoria
  $("#optionType").change(function(){

    var valueCurrent = $("#optionType").find(':selected').text();
      $(".muted-type").hide();

    if (valueCurrent == 'Fija'){
        $("#btn-parts").removeClass("disabled");
        $(".optionFitOne").removeClass("d-none");
        $(".optionFitTwo").addClass("d-none");
        $(".fixedPart").show();
        $(".memInfo").text("Fija");
        typeMemory = valueCurrent; console.log(valueCurrent);
        $(".alertMem").addClass("show");
        $("#collapseExample").addClass("show");;
        $(".optionFitTwo").hide();
        $(".optionFitOne").show();

    } else {
        $(".fixedPart").hide();
        $(".memInfo").text("Variable");
        typeMemory = valueCurrent; console.log(valueCurrent);
        $(".alertMem").removeClass("show");
        $(".alertMem").addClass("hide");
        $(".alertMem").addClass("disabled")
        $("#collapseExample").removeClass("show");
        $(".optionFitTwo").show();
        $(".optionFitOne").hide();
    }
    return typeMemory;
  });

  $("#btn-type").on('click',function(){  
    $('#btnconfirmar').removeClass('disabled');
    if(sizeMemory==8192){
      $(".alertMem").removeClass("show");
      $(".alertMem").addClass("disabled")
      $('.alertPlan').addClass('show');
      $(".textoAlertPlan").text("Debe definir el tamaño de la memoria del planificador.");
      $('.alertPlan').addClass('show');
      $(".textoAlertPlan").text("Debe definir el tamaño de la memoria del planificador.");
      $('#btnconfirmar').addClass('disabled');
    } else{
          if(typeMemory == 'Fija'){
            $(".alertMem").addClass("show");
            $('.alertMem').removeClass('disabled');
          } else{
            $(".optionFitTwo").removeClass("d-none");
          }
      $('.alertPlan').removeClass('show');
      $("#btnconfirmar").removeClass('d-none');
    }
  });
  //control del tipo de memoria
  //--------------------------------
  //control de ajuste de memoria
  $("#optionSet").change(function(){
    var setMemory = $("#optionSet").find(':selected').text();

    if (setMemory == 'Best Fit'){
        fitMemory = setMemory;
        console.log(fitMemory);
        $(".ajuInfo").text(fitMemory);

    } else if (setMemory == 'Worst Fit'){
        fitMemory = setMemory;
        console.log(fitMemory);
        $(".ajuInfo").text(fitMemory);

    } else {
        fitMemory = setMemory;
        console.log(fitMemory);
        $(".ajuInfo").text(fitMemory);
    }
  return fitMemory;
  });

  $('#btnconfirmar').off().on('click', function(){
    $('#configuracion').hide();
    $('#config-btna').removeClass('text-primary');
    $('#config-btna').removeClass('border-primary');
    $('#process-btna').addClass('disabled')
    $('#process-btna').addClass('text-primary');
    $('#process-btna').addClass('border-primary');
    $('#process-btna').addClass('border-bottom-0');

    $(".tamInfo").text(sizeMemory+' MB');
    $(".memInfo").text(typeMemory);
    $(".ajuInfo").text(fitMemory);
    $('.alertSimu').removeClass('alert-danger');
    $('.alertSimu').addClass('alert-success');
    $('.alertSimu').addClass('show');
    $(".textoAlertSimu").text("Su configuración se ha guardado correctamente.");
    
    setTimeout(function(){ 
      $('.alertSimu').removeClass('show');
      $('.alertSimu').addClass('hide');    
    },2500);
    setTimeout(function(){ 
      $('.alertSimu').removeClass('alert-success');
      $('.alertSimu').addClass('alert-danger');
    },3000); 
    setTimeout(function(){ 
      $('#cargaprocesos').show();
    },100); 

  });

  $('#btnconfirmar2').off().on('click', function(){
    $('#cargaprocesos').hide();
    $('#process-btna').removeClass('text-primary');
    $('#process-btna').removeClass('border-primary');
    $('#process-btna').addClass('disabled')
    $('#presentation-btna').addClass('text-primary');
    $('#presentation-btna').addClass('border-primary');
    $('#presentation-btna').addClass('border-bottom-0');

    $('.alertSimu').removeClass('alert-danger');
    $('.alertSimu').addClass('alert-success');
    $('.alertSimu').addClass('show');
    $(".textoAlertSimu").text("Los procesos se han guardado correctamente.");
    
    setTimeout(function(){ 
      $('.alertSimu').removeClass('show');
      $('.alertSimu').addClass('hide');    
    },2500);
    setTimeout(function(){ 
      $('.alertSimu').removeClass('alert-success');
      $('.alertSimu').addClass('alert-danger');
    },3000); 
    setTimeout(function(){ 
      $('#presentacion').show();
    },100); 
  });

  $("#cantpart").keyup(function(){
    $('.alertPart').removeClass('show');
    $('.alertPart').addClass('hide');
    $('#btn-asignar').removeClass('disabled');

    var valorCurrent2 =  parseInt($("#cantpart").val());
    partition = valorCurrent2;

    if (partition == 0){
      $(".textoAlertPart").text("La cantidad de particiones debe ser un número entero positivo.");
      $('.alertPart').addClass('show');
      $('#btn-asignar').addClass('disabled');
    }
  console.log('partition',partition)
  return partition
  });

  $('.btn-add-part').off().on('click',function(e){
    $('.btn-add-part').addClass('disabled');
    $('.alertMem').removeClass('d-none');
    $('.inputParts').removeClass('disabled');
    $('#controlidpart').removeClass('d-none');  
    e.preventDefault();
    
    memtotal = sizeMemory-sizeMemoryCpu;
    value1 = Math.round(memtotal/partition);
    value2 = sizeMemory%partition;
    value3 = Math.round((sizeMemoryCpu*100)/sizeMemory);
    totalpart = value1;
    totaldisp = value2;
    porcMemoryDisp = value3;
    
    $("#memoria").text('Tamaño Definido: '+memtotal+' MB.');
    $("#disponible").text('Tamaño Disponible: '+totaldisp+' MB.');
    $("#memoriacpu").text('Tamaño Definido para CPU: '+sizeMemoryCpu+' MB.');
    $("#porcentajeTotal").text('Porcentaje de la memoria total utilizada por el Planificador: '+porcMemoryDisp+'%');

    if (partition == 0){
      $(".textoAlertPart").text("La cantidad de particiones debe ser un número entero positivo.");
      $('.alertPart').addClass('show');
      $('#btn-asignar').addClass('disabled');
    }

    for(var i=0; i<partition; i++){   
      let num_part = i+1;         
      let new_partition = `
        <div id ="inputPartsId" class="col-sm-12 d-flex justify-content-center mb-3">
          <span class="input-group-text textPart md-addon py-0">Partición ${num_part}</span>
          <input class="inputParts${num_part} text-center w-25" name="fields[]" value="" placeholder="Ingrese el tamaño en MB" id="Memoryinput"/>
          </div>`
      $('#add-field').append(new_partition);  
      
      $("#add-field").off().keyup('.inputParts'+i,function(){
        $('.alertPart').removeClass('show');
        $('.alertPart').addClass('hide');
        $('#btn-asignar').removeClass('disabled');
        for(var i=0; i<partition; i++){
          sizepartinput = parseInt($('.inputParts'+i).val()); console.log('part: '+i,sizepartinput);
          arrayPartitions[i] = [sizepartinput]; console.log(arrayPartitions);
          if (isNaN(sizepartinput)) {
            sizepartinput = arrayPartitions[i+1];console.log('partnan: '+i,sizepartinput); 
          }
          
          if (sizepartinput == 0){
           $(".textoAlertPart").text("Debe ingresar un número mayor a cero.");
           $('.alertPart').addClass('show');
           $('#btn-asignar').addClass('disabled');
         } else if (totalinput > memtotal){
           $(".textoAlertPart").text("Tamaño de Memoria excedida. Intente nuevamente con un valor menor.");
           $('.alertPart').addClass('show');
           $('#btn-asignar').addClass('disabled');
         } 
        
         
        }   
       /*  for(let i=0; i<partition; i++){
          let sizepartinput = parseInt($('.inputParts'+i).val()); console.log(sizepartinput);
          let totalinput = sizepartinput*partition; console.log('el total es ',totalinput);
          
          } */
      });
    }    
    //console.log("array particiones: ",arrayPartitions)
    
   /*  
    /* $("#inputPartsId").off().keyup('.inputParts'+num_part,function(){
      for(var i=0; i<partition; i++){
        var valueCurrent = parseInt($('.inputParts'+i).val()); console.log("valuecurrent ",valueCurrent);
        if (isNaN(valueCurrent)){
          valueCurrent = totalpart;
        }
        arrayPartitions[i-1]=valueCurrent;console.log(arrayPartitions);
      }
      //console.log("array particiones2: ",arrayPartitions)
    }) */
    return totalpart, totaldisp, porcMemoryDisp, partition
  });

  $("#btn-asignar").on( "click", function() {
    $('.alertPart').removeClass('alert-danger');
    $('.alertPart').addClass('alert-success');
    $('.alertPart').addClass('show');
    $(".textoAlertPart").text("Las particiones han sido asignadas correctamente.");

    if(typeMemory == 'Fija'){
     /*  var config_part = `
      <button type="button" class="btn btn-primary" disabled>Pariticiones</button>
      <button type="button" class="btn btn-outline-light-blue partInfo" disabled>${partition}</button>`
      $("#config_part").append(config_part); */
      for(var i=0; i<partition; i++){
        num_part = i+1;
        var config_part_size = `
        <button type="button" class="btn btn-outline-secondary" disabled>Part. ${num_part}: ${totalpart} MB</button>
        `
        $("#config_part_size").append(config_part_size);
      }     
    }
    setTimeout(function() {
      alert('Por favor presione el botón Confirmar para avanzar a la siguinte sección.');            
    },1000);
  });

  //---------------------SECCION PROCESOS------------------------------------------

  // Funcion para añadir una nueva fila en la tabla
  let idProcess=0;
  $("#btn-añadir").on("click", function() {  
    $('.alertTable').removeClass('show');
    $('.alertTable').addClass('hide');
    let rafagas = $('#raf').children('td').length

    if(count>=1){
      $(".add-raf").addClass('disabled')
      $(".del-raf").addClass('disabled')
    } else if (rafagas == 0 && count >=1){
      $("tr-rafaga").addClass('disabled')
      $(".textoAlertTable").text("Debe agregar como mínimo una ráfaga al proceso.");
      $('.alertTable').addClass('show');
      $('.alertTable').removeClass('hide'); 
    }
    
    count=0;
    if (idProcess < 20) {
      idProcess+=1;
    } else if (idProcess = (idProcess-1)) {
      idProcess+=1;
    }
    var nuevaFila=`
                  <tr id="row${idProcess}" class="hide">
                    <td class="pt-3-half" contenteditable="false">${idProcess}</td>
                    <td class="pt-3-half" contenteditable="false">Proc_${idProcess}</td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td id="raf" class="pt-3-half" type="number" contenteditable="false"></td>
                    <td>
                        <button id="btn${idProcess}" type="button" class="add-raf btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light">Agregar</button>
                    </td>
                    <td>
                        <button type="button" class="del-raf btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button>    
                    </td>
                    <td>
                      <span class="table-remove"><button type="button" class="del btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button></span>
                    </td>
                  </tr>` 
    $("#tbodyID").append(nuevaFila);
                 $('#tableID tr').each(function() {
                  let values = $(this).find("td").map(function() { 
                    return $(this).html();
                  })
                  for(let i=2;i<=4;i++){
                      if(values[i]=="" && count>1){
                        console.log('hola mundo')
                      } else{
                        console.log('mundo hola')
                      }
                  }
                  /* console.log('col-2',values[2]);
                  console.log('col-3',values[3]);
                  console.log('col-4',values[4]); */
                })
    return idProcess, count;
  });

  // evento para agregar rafagas  
  $("#tableID").off().on("click", ".add-raf", function(){
    $('.alertTable').removeClass('show');
    $('.alertTable').addClass('hide');
    let rafagas = $('#raf').children('td').length
    count+=1;console.log('count:',count);
   
      $(`#tbodyID #row${idProcess} #raf`).each(function(){
        $(this).append(`<td class="pt-3-half" type="number" contenteditable="true">CPU</td>
                        <td class="pt-3-half" type="number" contenteditable="true">E/S</td>
                        <td class="pt-3-half" type="number" contenteditable="true">CPU</td>`);
        $(this).attr('contenteditable',false);

          if(rafagas == 12 || count == 4){
            
            $(".add-raf").addClass('disabled')
            $(".textoAlertTable").text("El máximo número de rafagas que puede agregar es de 4.");
            $('.alertTable').addClass('show');
            $('.alertTable').removeClass('hide');
            console.log($('#raf').children('td').length);
          } 
        })
        /* $('#tableID').find('tr').each(function(){ 
          $(this).find('th').eq(4).after('<th>HEADER</th><th>HEADER</th>');      
          $(this).find('td').eq(4).after(`<td class="pt-3-half" type="number" contenteditable="true"></td>
          */
         return count
   });

  // evento para eliminar las rafagas
  $("#tableID").on("click", ".del-raf", function(){ 
    $('.alertTable').removeClass('show');
    $('.alertTable').addClass('hide'); 
    let rafagas = $('#raf').children('td').length   
    count-=1; console.log('count:', count)

    if (rafagas <= 12){
      $('#tableID').find('tr').each(function(){       
            let col=$(this).find('td:eq(17)').children().removeClass('disabled')
            console.log('col:', col)
      })
    } else if (count == 0){
      count+=1;
    }
      for(let i=3; i>0; --i){
        $(`#tbodyID #row${idProcess} #raf`).each(function(){
        $(this).find('td').eq(3).remove();
      })   
    }
    return count
  });

  // Funcion para eliminar una nueva fila de la tabla
  $("#tableID").on("click", ".del", function(){
    if (idProcess > 0) {idProcess-=1;} 
    $(this).parents("tr").remove();
    return idProcess;
  });

  $("#presentation-btna").on("click", function() {
    $('.alertSimu').addClass('show')
    $(".textoAlertSimu").text('Por favor presione el botón Confirmar para avanzar a la siguinte sección.') 

    setTimeout(function(){ 
      $('.alertSimu').removeClass('show');
      $('.alertSimu').addClass('hide');
    },3500);
  });
  ////--------------------------MAPA DE MEMORIA-------------------------------------------
    am4core.ready(function() {
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.PieChart);
    
    for(var i=0; i<partition; i++){
    }
    // Add data
    chart.data = [ {
      "number-partition": "Proc_"+i,
      "size-partition": 25
    }, {
      "number-partition": "Proc_1",
      "size-partition": 25
    }, {
      "number-partition": "Proc_2",
      "size-partition": 25
    }, {
      "number-partition": "Proc_3",
      "size-partition": 25
    }];     

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "button";
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "size-partition";
    pieSeries.dataFields.category = "number-partition";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    
    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;
    
    }); // end am4core.ready()

    //---------------------SECCION PRESENTACION------------------------------------------

  //--------------------------GANTT DE PROCESOS-------------------------------------------
    am4core.ready(function() {
      var chart = am4core.create("chartdiv-gantt", am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      
      chart.paddingRight = 30;
      chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
      
      var colorSet = new am4core.ColorSet();
      colorSet.saturation = 0.4;
      
      chart.data = [
        {
          name: "CPU",
          value: "2018-01-01 08:00",
          toDate: "2018-01-01 10:00",
          color: colorSet.getIndex(2).brighten(0)
        },
        {
          name: "E/S",
          fromDate: "2018-01-01 12:00",
          toDate: "2018-01-01 15:00",
          color: colorSet.getIndex(2).brighten(0.4)
        }
      ];
      
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.inversed = true;
      
      var dateAxis = chart.xAxes.push(new am4charts.TimeAxis());
      dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
      dateAxis.renderer.minGridDistance = 70;
      dateAxis.baseInterval = { count: 30, timeUnit: "minute" };
      dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
      dateAxis.strictMinMax = true;
      dateAxis.renderer.tooltipLocation = 0;
      
      var series1 = chart.series.push(new am4charts.ColumnSeries());
      series1.columns.template.width = am4core.percent(80);
      series1.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";
      
      series1.dataFields.openDateX = "fromDate";
      series1.dataFields.dateX = "toDate";
      series1.dataFields.categoryY = "name";
      series1.columns.template.propertyFields.fill = "color"; // get color from data
      series1.columns.template.propertyFields.stroke = "color";
      series1.columns.template.strokeOpacity = 1;
      
      chart.scrollbarX = new am4core.Scrollbar();
      
      }); 

  $(".sizeInput").keyup(function(){

    $('.alertProcess').removeClass('show');
    $('.alertProcess').addClass('hide');

    var tamProc = parseInt($('.sizeInput').val())
    var maxTamPocess = getMaxProcessSize(typeMemory)

    if (tamProc > maxTamPocess) {
      $(".textoAlertProc").text("El tamaño del proceso no puede ser mayor al tamaño de la Memoria definido.");
      $('.alertProcess').addClass('show');
    }
  });
  //--------------------------------------------------------------------------

  function main(){
    if (typeMemory == "Variable"){
      let p = new Particion(memtotal, null);     
      mem = new MemoriaVariable(memtotal, [p], []);
      if (fitMemory == "Worst Fit") {
        MemoriaVariable.prototype.particionLibre = function(proceso) {
          let fragInternaGlobal = 0;
          let particionWorstFit = null;
          for (var p of this.particiones) {
            if (p.isEmpty() && p.tam >= proceso.tam) {
              if (p.tam - proceso.tam >= fragInternaGlobal) {
                fragInternaGlobal = p.tam - proceso.tam;
                particionWorstFit = p;
              }
            }
          }
          return particionWorstFit;
        }
      }
    } else {
      // captura de particiones 
      mem = new MemoriaFija(memtotal, [], []);
      if (fitMemory == "Best Fit") {
        MemoriaFija.prototype.particionLibre = function(proceso) {
          let fragInternaGlobal = 999999999999999;
          let particionBestFit = null;
          for (var p of this.particiones) {
            if (p.isEmpty() && p.tam >= proceso.tam) {
              if (p.tam - proceso.tam < fragInternaGlobal) {
                fragInternaGlobal = p.tam - proceso.tam;
                particionBestFit = p;
              }
            }
          }
          return particionBestFit;
        }
      }
    }

    switch (algorithm) {
      case 'FCFS':
        sim = new SimuladorNoApropiativo(0, [],[],[], mem);
        break;
      case 'Prioridades SJF':
        sim = new SimuladorNoApropiativo(0, [],[],[], mem);
        SimuladorNoApropiativo.prototype.ordenarColaListos = function() {
        }
        break;
      case 'Prioridades SRTF':
        sim = new SimuladorApropiativo(0, [], [], [], mem);
        SimuladorApropiativo.prototype.ordenarColaListos = function() {

        }
        break;
      case 'Round Robin':
        sim = new SimuladorApropiativo(0, [], [], [], mem);
        SimuladorApropiativo.prototype.cicloCpu = function() {

        }
        break;
      case 'Multinivel sin Retro':
        sim = new SimuladorApropiativo(0, [[], [], []], [], [], mem);
        SimuladorApropiativo.prototype.cicloCpu = function() {

        }
        break;
      case 'Prioridades':
        sim = new SimuladorApropiativo(0, [], [], [], mem);
        SimuladorApropiativo.prototype.ordenarColaListos = function() {
          this.colaListos.sort((a, b) => (a.prio > b.prio) ? 1 : -1);
        }
    }

    let p1 = new Proceso(1, 12, 0, 0, [1,2,1]);
    let p2 = new Proceso(2, 120, 1, 0, [2,2,1]);
    let p3 = new Proceso(3, 44, 2, 0, [1,2,3]);
    let p4 = new Proceso(4, 55, 1, 0, [2,2,4]);
    let p5 = new Proceso(5, 12, 5, 0, [6,2,1]);
    let p6 = new Proceso(6, 156, 0, 0, [4,15,7]);
    let p7 = new Proceso(7, 12, 0, 0, [1,11,1]);
    let p8 = new Proceso(8, 120, 1, 0, [2,16,1]);
    let p9 = new Proceso(9, 44, 2, 0, [1,14,3,5,6]);
    let p10 = new Proceso(10, 55, 1, 0, [2,2,4]);
    let p11 = new Proceso(11, 12, 5, 0, [6,2,1]);
    let p12 = new Proceso(12, 156, 0, 0, [4,5,7]);

    sim.colaNuevos.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12);
    sim.colaControl.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12);

    while(sim.colaControl.length > 0){
      sim.cicloMemoria();
      sim.ordenarColaListos();
      sim.cicloCpu();
      console.log(sim)
    }

    console.log('Porcentaje utilizado de CPU: ', sim.porcActivo());

    for (let r of sim.resultados) {
      let result = ` <tr>
                    <td> ${r.pid} </td>
                    <td> ${r.tSalida} </td>
                    <td> ${r.tArrivo} </td>
                    <td> ${r.tRetorno} </td>
                    <td> ${r.tEspera} </td>
                  </tr>
                  `;
      $('#t-result').append(result);
    }
    let results = sim.calcularPromedios();
    let result2 = ` <tr>
                    <td colspan="3"><b>${'PROMEDIOS'}</td>
                    <td><b> ${results[0].toFixed(1)} </td>
                    <td><b> ${results[1].toFixed(1)} </td>
                  </tr>
                  `;

    $('#t-result').append(result2);
}

