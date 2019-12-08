  console.log('activo config.js')
  //Ambiente de variables
  let typeMemory = "Variable"; // tipo de Memoria
  let fitMemory = "First Fit"; //Ajuste de memoria
  let algorithm = "FCFS"; //Algoritmo de Planificacion
  let mlq1= "FCFS"; //Algoritmo de Planificacion por defecto en la cola 1 de mdq
  let mlq2= "FCFS"; //Algoritmo de Planificacion por defecto en la cola 2 de mdq
  let mlq3= "FCFS"; //Algoritmo de Planificacion por defecto en la cola 3 de mdq
  let mlq1Quantum = 2; // Quantum para roundRobin de cola 1
  let mlq2Quantum = 2; // Quantum para roundRobin de cola 2
  let mlq3Quantum = 2; // Quantum para roundRobin de cola 3
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
  let count = 0; //Contador utilizado para verificar la carga de procesos
  let arrayProcess = []; //Arreglo con los procesos importados de la BD
  let arrayPartitions = []; // Arreglo de particiones para la memoria fija
  let parametros=[]; // Arreglo de procesos cargados
  let sim = null;
  let mem = null;
  let flag=false;

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
  //--------------------------Preparamos el entorno de trabajo-------------------------

  //---------------------SECCION CONFIGURACION------------------------------------------
  /* $('ul#navmenu div li a').off().on('click', function(){
    $('ul#navmenu div li a').removeClass('text-primary')
    $(this).addClass('text-primary')
    var activetab=$(this).attr('href'); console.log(activetab)
  }); */

  $('#config-btna').off().on('click', function(){
    let isPrimary1 = $('#config-btna').hasClass('text-primary'); console.log(isPrimary1)
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
    if (isPrimary2 == false){
      $('.alertSimu').addClass('show')
      $(".textoAlertSimu").text("Por favor presione el botón Confirmar para avanzar a la siguinte sección.") 

      setTimeout(function(){ 
        $('.alertSimu').removeClass('show');
        $('.alertSimu').addClass('hide');
      },3000);
    }
  });

  $('#presentation-btna').off().on('click', function(){
    let isPrimary3 = $('#presentation-btna').hasClass('text-primary'); console.log(isPrimary3)
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
    let quanto = parseInt($('.quantumIn').val())
    console.log('Quantum =',quanto)

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
    let typeAlgorithm = $("#optionAlgo").find(':selected').text();

    if (typeAlgorithm == 'FCFS'){
      algorithm = typeAlgorithm; console.log(algorithm);
      $(".quantumIn").val("");
      $(".quantumIn").hide();
      $(".algoInfo").text("FCFS");

    } else if (typeAlgorithm == 'RR'){
      algorithm = typeAlgorithm; console.log(algorithm)
      //$(".quantumIn").show();
        $('#quantumid').removeClass('fade')
        $(".algoInfo").text("RR");

    } else if (typeAlgorithm == 'Prioridades'){ 
        algorithm = typeAlgorithm; console.log(algorithm);  
        $(".quantumIn").val("");
        $(".quantumIn").hide();
        $(".algoInfo").text("PRIO");

      } else if (typeAlgorithm == 'SJF'){ 
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".quantumIn").val("");
        $(".quantumIn").hide();
        $(".algoInfo").text("SJF");

      } else if (typeAlgorithm == 'SRTF'){ 
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".quantumIn").val("");
        $(".quantumIn").hide();
        $(".algoInfo").text("SRTF");

    } else if (typeAlgorithm == 'MLQ'){
        algorithm = typeAlgorithm; console.log(algorithm);
        $(".algoInfo").text("MLQ");
       $("#partfijas").before(`
       <div class="card mb-4" id="card-mlq">
            <h5 class="card-header blue-grey lighten-1 white-text text-center py-4 mb-4">
                <strong id="title-card">Gestión de Colas multinivel sin retroalimentación</strong>
            </h5>     
            <div class="card-body px-lg-5 py-0">
                <p class="lead">Seleccione el algoritmo correspondiente a cada cola.<p/>
                    <div class="row">
                      <span class="col-md-2 input-group-text textPart md-addon py-4">Cola 1</span>
                        <select class="col-md-4 browser-default custom-select mr-3 mt-3 mb-2" id="optionMlq1">
                            <option class="optionPlaningOne" selected>Seleccione</option>
                            <option class="optionPlaningOne" value="FCFS">FCFS</option>
                            <option class="optionPlaningTwo" value="RR">RR-Q:2</option>
                            <option class="optionPlaningThree" value="Prioridades">Prioridades</option>
                            <option class="optionPlaningFour" value="SJF">SJF</option>
                            <option class="optionPlaningFive" value="SRTF">SRTF</option>        
                        </select><br/>
                        <button id="btn-nuevo1" class="btn btn-outline-light-blue z-depth-0 waves-effects h-25 mt-2" type="button">Nueva Cola</button>
                    </div>
                    <div class="row">
                      <span class="col-md-2 input-group-text textPart md-addon py-4">Cola 2</span>
                        <select class="col-md-4 browser-default custom-select mr-3 mt-3 mb-2" disabled id="optionMlq2">
                            <option class="optionPlaningOne" selected>Seleccione</option>
                            <option class="optionPlaningOne" value="FCFS">FCFS</option>
                            <option class="optionPlaningTwo" value="RR">RR-Q:2</option>
                            <option class="optionPlaningThree" value="Prioridades">Prioridades</option>
                            <option class="optionPlaningFour" value="SJF">SJF</option>
                            <option class="optionPlaningFive" value="SRTF">SRTF</option>        
                        </select><br/> 
                        <button id="btn-nuevo2" class="btn btn-outline-light-blue z-depth-0 waves-effects h-25 mt-2 disabled" type="button">Nueva Cola</button>
                    </div>  
                    <div class="row">
                    <span class="col-md-2 input-group-text textPart md-addon py-4">Cola 3</span>
                    <select class="col-md-4 browser-default custom-select mr-3 mt-3 mb-2" disabled id="optionMlq3">
                        <option class="optionPlaningOne" selected>Seleccione</option>
                        <option class="optionPlaningOne" value="FCFS">FCFS</option>
                        <option class="optionPlaningTwo" value="RR">RR-Q:2</option>
                        <option class="optionPlaningThree" value="Prioridades">Prioridades</option>
                        <option class="optionPlaningFour" value="SJF">SJF</option>
                        <option class="optionPlaningFive" value="SRTF">SRTF</option>        
                    </select><br/> 
                    </div> 
              </div>
              <div class="mt-2 d-flex justify-content-center alert alert-info alert-dismissible fade hide alertMdq d-none w-75 mx-auto my-1" role="alert">
                <strong class="textoAlertMdq">Si desea agregar nuevas particiones, por favor realice una nueva configuración</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
              </div>    
            <!--Confirmar formulario--> 
            <div class="d-flex justify-content-center mb-4">
                <button id="btn-conf-mlq" class="btn btn-outline-light-blue z-depth-0 waves-effect w-75 disabled" type="button">Confirmar</button>  
            </div>
            <!--Confirmar formulario--> 
        </div>
       `);
        $("#optionMlq1").change(function(){
          let val = $("#optionMlq1").find(':selected').text();
          $('#btn-conf-mlq').removeClass('disabled'); 
          mlq1 = val; console.log(mlq1);
          let config_part_mlq = `
          <button type="button" class="btn btn-outline-secondary" disabled>Cola 1: ${mlq1}</button>`
          $("#config_part_size").append(config_part_mlq);
          if(mlq1=="RR-Q:2"){
            console.log('Quantum cola 1:',mlq1Quantum); return mlq1Quantum
          }
          return mlq1;
        });
        $("#optionMlq2").change(function(){
          let val = $("#optionMlq2").find(':selected').text(); 
          mlq2 = val; console.log(mlq2);
          let config_part_mlq = `
          <button type="button" class="btn btn-outline-secondary" disabled>Cola 2: ${mlq2}</button>`
          $("#config_part_size").append(config_part_mlq);
          if(mlq2=="RR-Q:2"){
            console.log('Quantum cola 2:',mlq2Quantum); return mlq2Quantum
          }
          return mlq2;
        });
        $("#optionMlq3").change(function(){
          var val = $("#optionMlq3").find(':selected').text(); 
          mlq3 = val; console.log(mlq3);
          let config_part_mlq = `
          <button type="button" class="btn btn-outline-secondary" disabled>Cola 3: ${mlq3}</button>
          `
          $("#config_part_size").append(config_part_mlq);
          if(mlq3=="RR-Q:2"){
            console.log('Quantum cola 3:',mlq3Quantum); return mlq3Quantum
          }
          return mlq3;
        });
        
        $("#btn-nuevo1").on("click", function() {
          $('#optionMlq2').removeAttr('disabled');
          $('#btn-nuevo2').removeClass('disabled');
        })
        $("#btn-nuevo2").on("click", function() {
          $('#optionMlq3').removeAttr('disabled');
        })
        $("#btn-conf-mlq").on("click", function() {
          $('.alertMdq').removeClass('alert-info');
          $('.alertMdq').addClass('alert-success');
          $('.alertMdq').removeClass('d-none');
          $('.alertMdq').addClass('show');
          $(".textoAlertMdq").text("Las colas han sido asignadas correctamente.");
          setTimeout(function(){ 
            $('.alertMdq').removeClass('show');
            $('.alertMdq').addClass('hide');
            alert('Por favor continue avanzando en la configuración principal.');  
          },2000);
          setTimeout(function(){ 
            $('.alertMdq').removeClass('alert-success');
            $('.alertMdq').addClass('alert-info');
          },3000);   
        })
    }
     /*  if (typeAlgorithm == 'RR'){
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
      } */
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
    sizeMemory = valorCurrent;  console.log('sizeMemory',sizeMemory);
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
    let valorCurrent = parseInt($("#tam-memory-so").val()); 
    sizeMemoryCpu = valorCurrent;  console.log('sizememoryCPU',sizeMemoryCpu);
    sizeMemoryDisp = sizeMemory - sizeMemoryCpu;
    value = Math.round((sizeMemoryCpu*100)/8192);
    porcMemoryDispCpu = value;
    memtotal = sizeMemory-sizeMemoryCpu; console.log('memtotal: ',memtotal)
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
    let valueCurrent = $("#optionType").find(':selected').text();
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
    let setMemory = $("#optionSet").find(':selected').text();

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
    $(".textoAlertSimu").text("El proceso se ha guardado correctamente.");
    
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
    let valorCurrent2 =  parseInt($("#cantpart").val());
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
    totalpart = Math.round(memtotal/partition);
    porcMemoryDisp = Math.round((sizeMemoryCpu*100)/sizeMemory);
     
    $("#memoria").text('Tamaño Definido: '+memtotal+' MB.');
    $("#memoriacpu").text('Tamaño Definido para CPU: '+sizeMemoryCpu+' MB.');
    $("#porcentajeTotal").text('Porcentaje de la memoria total utilizada por el Planificador: '+porcMemoryDisp+'%');

    if (partition == 0){
      $(".textoAlertPart").text("La cantidad de particiones debe ser un número entero positivo.");
      $('.alertPart').addClass('show');
      $('#btn-asignar').addClass('disabled');
    }
    for(let i=0; i<partition; i++){     
      let num_part = i+1;         
      let new_partition = `
        <div id ="inputPartsId" class="col-sm-12 d-flex justify-content-center mb-3">
          <span class="input-group-text textPart md-addon py-0">Partición ${num_part}</span>
          <input class="inputParts${num_part} text-center w-25" name="fields[]" value="${totalpart}" placeholder="Ingrese el tamaño en MB" id="Memoryinput"/>
          </div>`
      $('#add-field').append(new_partition);  
      
      $("#add-field").off().keyup('.inputParts'+i,function(){
        $('.alertPart').removeClass('show');
        $('.alertPart').addClass('hide');
        $('#btn-asignar').removeClass('disabled');
        let sumPart = 0;

        for(let i=0; i<partition; i++){
        sizepartinput = parseInt($('.inputParts'+(i+1)).val()); console.log('part: '+i,sizepartinput);
        totalinput = sizepartinput*partition; console.log('totalinput '+i,totalinput);      
        arrayPartitions[i]=sizepartinput;// arrayPartitions.push(sizepartinput);
        sumPart+=arrayPartitions[i]  
        totaldisp = memtotal-sumPart;

        if (sumPart > memtotal){
           $(".textoAlertPart").text("Tamaño de Memoria excedida. Intente nuevamente con un valor menor.");
           $('.alertPart').addClass('show');
           $('#btn-asignar').addClass('disabled');
         } else if (isNaN(sumPart) || ((sumPart < memtotal)||(sizepartinput == 0))){
          $(".textoAlertPart").text("No puede quedar espacio sin utilizar. Debe ingresar un tamaño de partición mayor a cero.");
          $('.alertPart').addClass('show');
          $('#btn-asignar').addClass('disabled');
         } else if (sumPart == memtotal){
          $('.alertPart').removeClass('show');
          $('.alertPart').addClass('hide');
          $('#btn-asignar').removeClass('disabled');
         }
        }   
        console.log('arrayPartitions: ',arrayPartitions); console.log('suma total: ',sumPart);
        $("#disponible").text('Tamaño Disponible: '+totaldisp+' MB.');
          return arrayPartitions
      });
    }    
    return totalpart, totaldisp, porcMemoryDisp, partition
  });

  $("#btn-asignar").on( "click", function() {
    $('.alertPart').removeClass('alert-danger');
    $('.alertPart').addClass('alert-success');
    $('.alertPart').addClass('show');
    $(".textoAlertPart").text("Las particiones han sido asignadas correctamente.");

    if(typeMemory == 'Fija'){
      for(let i=0; i<partition; i++){
        num_part = i+1;
        let config_part_size = `
        <button type="button" class="btn btn-outline-secondary" disabled>Part. ${num_part}: ${arrayPartitions[i]} MB</button>`
        $("#config_part_size").append(config_part_size);
      }     
    }
    setTimeout(function() {
      alert('Por favor presione el botón Confirmar para avanzar a la siguinte sección.');            
    },1000);
  });

  //---------------------SECCION PROCESOS------------------------------------------
  // Funcion para añadir una nueva fila en la tabla
  $('#th-prio').hide();
  $('#interval-prio').hide();
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
    if (algorithm == 'Prioridades'){
      flag=true;
      $('#th-prio').show();
      $('#interval-prio').show();
      var nuevaFila=`
      <tr id="row${idProcess}" class="hide">
        <td class="md-form"><input type="number" class="form-control disabled rafagas-p w-20 p-raf${idProcess}" value="${idProcess}"></td>
        <td class="md-form"><input type="text" class="form-control rafagas-p w-20 p-raf${idProcess}" min=0 max=3 value=0></td>
        <td class="md-form"><input type="number" class="form-control rafagas-p w-20 p-raf${idProcess}"></td>
        <td class="md-form"><input type="number" class="form-control rafagas-p w-20 p-raf${idProcess}"></td>
        <td id="raf" class="pt-3-half" type="number" contenteditable="false"></td>
        <td>
            <button id="btn${idProcess}" type="button" class="add-raf btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light">Agregar</button>
        </td>
        <td>
            <button type="button" class="del-raf btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button>    
        </td>
        <td>
            <button type="button" class="confirm-rafaga btn btn-outline-primary btn-rounded btn-sm my-0 waves-effect waves-light">Confirmar</button>
            <span class="table-remove"><button type="button" class="del btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button></span>
        </td>
      </tr>` 
    } else {
      var nuevaFila=`
      <tr id="row${idProcess}" class="hide">
        <td class="md-form"><input type="number" class="form-control disabled rafagas-p w-20 p-raf${idProcess}" value="${idProcess}"></td>
        <td class="md-form"><input type="number" class="form-control rafagas-p w-20 p-raf${idProcess}"></td>
        <td class="md-form"><input type="number" class="form-control rafagas-p w-20 p-raf${idProcess}"></td>
        <td id="raf" class="pt-3-half" type="number" contenteditable="false"></td>
        <td>
            <button id="btn${idProcess}" type="button" class="add-raf btn btn-outline-success btn-rounded btn-sm my-0 waves-effect waves-light">Agregar</button>
        </td>
        <td>
            <button type="button" class="del-raf btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button>    
        </td>
        <td>
            <button type="button" class="confirm-rafaga btn btn-outline-primary btn-rounded btn-sm my-0 waves-effect waves-light">Confirmar</button>
            <span class="table-remove"><button type="button" class="del btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button></span>
        </td>
      </tr>` 
    }
    $("#tbodyID").append(nuevaFila);

      $('#tableID').keyup(function(){
        $(".confirm-rafaga").on("click", function(){
          $(".textoAlertTable").text("El proceso se ha cargado correctamente.");
          $('.alertTable').addClass('show');
          $('.alertTable').removeClass('hide');
          $('.alertTable').removeClass('alert-danger');
          $('.alertTable').addClass('alert-success');
          setTimeout(function(){ 
            $('.alertTable').removeClass('show');
            $('.alertTable').addClass('hide');
          },2000);
          setTimeout(function(){ 
            $('.alertTable').removeClass('alert-success');
            $('.alertTable').addClass('alert-danger');
          },3000);

          $('#tableID tbody tr').each(function(i,e) {
              let tr = [];
              $(this).find("td").each(function(index, element){
                let td =  parseInt($(this).find("input").val());            
                tr[index]=td;                  
              });
              tr.splice(4,1);
              parametros[i]=tr;  console.log('tr: ',tr);  
            }); 
            console.log('parametros: ',parametros);
            return parametros;
          }); 
        })
    console.log('flag:', flag)
    return idProcess, count, parametros, flag
  });

  // evento para agregar rafagas  
  $("#tableID").off().on("click", ".add-raf", function(){
    $('.alertTable').removeClass('show');
    $('.alertTable').addClass('hide');
    let rafagas = $('#raf').children('td').length
    count+=1;console.log('count:',count);
      
      $(`#tbodyID #row${idProcess} #raf`).each(function(){
        if (count==1){
          $(this).append(`
            <td class="md-form"><input id="p-raf${idProcess}" type="number" class="form-control rafagas-p w-20" placeholder="CPU"></td>
            <td class="md-form"><input id="p-raf${idProcess}" type="number" class="form-control rafagas-p w-20" placeholder="E/S"></td>
            <td class="md-form"><input id="p-raf${idProcess}" type="number" class="form-control rafagas-p w-20" placeholder="CPU"></td>
              `);
        }else{
            $(this).append(`<td class="md-form"><input id="p-raf${idProcess}" type="number" class="form-control rafagas-p w-20" placeholder="E/S"></td>
            <td class="md-form"><input id="p-raf${idProcess}" type="number" class="form-control rafagas-p w-20" placeholder="CPU"></td>`);        
        } 
        if(rafagas == 12 || count == 4){         
          $(".add-raf").addClass('disabled')
          $(".textoAlertTable").text("El máximo número de rafagas que puede agregar es de 4.");
          $('.alertTable').addClass('show');
          $('.alertTable').removeClass('hide');
          console.log($('#raf').children('td').length);
          } 
        })
         return count
   });

  // evento para eliminar las rafagas
  $("#tableID").on("click", ".del-raf", function(){ 
    $('.alertTable').removeClass('show');
    $('.alertTable').addClass('hide'); 
    let rafagas = $('#raf').children('td').length   

    if (rafagas <= 12 && count > 0){
      count-=1; console.log('count:', count)
      $('#tableID').find('tr').each(function(){       
        //let col = $(this).parents("tr").find("td:5")/* .eq(5) */;    
        let col=$(this).find('td:eq(11)')/* .children().removeClass('disabled') */
            console.log('colw:', col)
      })
    } else if (count == 0){
      return count+=1;
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
    $(".textoAlertSimu").text('Por favor presione el botón Confirmar para avanzar a la siguinte sección.'); 
    setTimeout(function(){ 
      $('.alertSimu').removeClass('show');
      $('.alertSimu').addClass('hide');
    },3500);
  });

  $(".sizeInput").keyup(function(){
    $('.alertProcess').removeClass('show');
    $('.alertProcess').addClass('hide');
    let tamProc = parseInt($('.sizeInput').val())
    let maxTamPocess = getMaxProcessSize(typeMemory)

    if (tamProc > maxTamPocess) {
      $(".textoAlertProc").text("El tamaño del proceso no puede ser mayor al tamaño de la Memoria definido.");
      $('.alertProcess').addClass('show');
    }
  });
  ////--------------------------MAPA DE MEMORIA-------------------------------------------
    /* am4core.ready(function() {
    
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
    
    }); // end am4core.ready() */

    //---------------------SECCION PRESENTACION------------------------------------------


  //--------------------------GANTT DE PROCESOS-------------------------------------------
  $('#btnconfirmar2').on('click', function(){
    main();
  });
