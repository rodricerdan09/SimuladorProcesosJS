
  console.log('activo config.js')
  //Ambiente de variables
  //var sizeMemory = 8192; // Tamaño de memoria
  var typeMemory = "Variable"; // tipo de Memoria
  var fitMemory = "First Fit"; //Ajuste de memoria
  var algorithm = "FCFS"; //Algoritmo de Planificacion
  var generalQuantum = 0; // Quantum para roundRobin
  var arrayProcess = []; //Arreglo con los procesos importados de la BD
  var arrayProcGraf = [];
  var procesosTerminados = []; // cola de procesos Terminado
  var particiones = []; // Memoria variable
  var colaListo = []; //Cola de procesos Listos
  var cont = 0;//contador de Particiones fijas
  var maxpart = 5; //cantidad maxima de particiones fijas
  var memFija = []; // memoria fija
  var tiempo = 0
  var lenArrayProcess = 0

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

    $("#Memoryinput, #controlidpart, #tam-memory, #tbodyID, inputParts, .alertRR, .priodInput, .sizeInput, .arrivalInput, .lastCpu, .inputcpu, .inputes").keydown(function(event) {

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
  });     
  //Preparamos el entorno de trabajo
  //------------------------------------------------------------------------

  //---------------------SECCION CONFIGURACION------------------------------------------

  $("#process-btna").on("click", function() {
    $('.alertMemory').addClass('show')
    $(".textoAlertMemory").text("Por favor presione el botón Confirmar para avanzar a la siguinte sección.") 

    setTimeout(function(){ 
      $('.alertMemory').removeClass('show');
      $('.alertMemory').addClass('hide');
    },3500);
  });

  $("#presentation-btna").on("click", function() {
    $('.alertMemory').addClass('show')
    $(".textoAlertMemory").text('Por favor presione el botón Confirmar para avanzar a la siguinte sección.') 

    setTimeout(function(){ 
      $('.alertMemory').removeClass('show');
      $('.alertMemory').addClass('hide');
    },3500);
  });

  $("#btn-parts").on( "click", function() {
    $('#partfijas').removeClass('d-none');
  });

  $(".quantumIn").keyup(function(){
    var quanto = parseInt($('.quantumIn').val())

    if (quanto > 0) {
      generalQuantum = quanto;
      $(".algoInfo").text("RR - Q:"+quanto);
    }else {
      $(".textoAlertProc").text("Debe ingresar un Quantum mayor a cero.");
      $('.alertProcess').addClass('show');
    }

  });

  //--------------------------------
  //control del tipo de memoria
  $("#optionType").change(function(){

    var typeMemory = $("#optionType").find(':selected').text();
      $(".muted-type").hide();
  
    if (typeMemory == 'Fija'){
        $("#btn-parts").removeClass("disabled");
        $(".fixedPart").show();
        $(".memInfo").text("Fija");
        var valueCurrent = typeMemory;
        console.log(valueCurrent);
        $(".alertMem").addClass("show");
        $("#collapseExample").addClass("show");;
        $(".optionFitTwo").hide();
        $(".optionFitOne").show();
        var config_part = `
        <button type="button" class="btn btn-primary" disabled>N° Partición</button>
        <button type="button" class="btn btn-outline-light-blue ml-4 memInfo" disabled></button>`
        var config_part_size = `
        <button type="button" class="btn btn-primary" disabled>Tamaño Partición</button>
        <button type="button" class="btn btn-outline-light-blue ml-4 memInfo" disabled></button>`
        $("#config_part").append(config_part);
        $("#config_part_size").append(config_part_size);

    } else {
        $(".fixedPart").hide();
        $(".memInfo").text("Variable");
        var valueCurrent = typeMemory;
        console.log(valueCurrent);
        $(".alertMem").removeClass("show");
        $(".alertMem").addClass("hide");
        $(".alertMem").addClass("disabled")
        $("#collapseExample").removeClass("show");
        $(".optionFitTwo").show();
        $(".optionFitOne").hide();
    }
    return typeMemory;
  });
  //control del tipo de memoria
  //--------------------------------
  //control de ajuste de memoria
  $("#optionSet").change(function(){
    var setMemory = $("#optionSet").find(':selected').text();
      $(".muted-set").hide();

    if (setMemory == 'Best Fit'){
        var fitMemory = setMemory;
        console.log(fitMemory);
        $(".ajuInfo").text(fitMemory);

    } else if (setMemory == 'Worst Fit'){
        var fitMemory = setMemory;
        console.log(fitMemory);
        $(".ajuInfo").text(fitMemory);

    } else {
        var fitMemory = setMemory;
        console.log(fitMemory);
        $(".ajuInfo").text(fitMemory);
    }
  return fitMemory;
  });

  function valorParticiones(){
    var partition = parseInt($("#cantpart").val());
    var sizeMemory = parseInt($("#tam-memory").val());

    var totaldisp = sizeMemory%partition;
    var totalpart = Math.round(sizeMemory/partition);
    var porcMemoryDisp = Math.round((sizeMemory*100)/8192);
    return totalpart, totaldisp, porcMemoryDisp
  }

  $("#tam-memory").keyup(function(){
    $('.alertMemory').removeClass('show');
    $('.alertMemory').addClass('hide');
    var sizeMemory = parseInt($("#tam-memory").val());
    console.log(sizeMemory);

    if (sizeMemory == 0){
      $(".textoAlertMemory").text("Debe definir un tamaño de memoria mayor a cero.");
      $('.alertMemory').addClass('show');
    }else if (sizeMemory > 8192) {
      $(".textoAlertMemory").text("El tamaño máximo que puede definir es de 8192 MB.");
      $('.alertMemory').addClass('show');
    }

    });

  $("#cantpart").keyup(function(){
    $('.alertPart').removeClass('show');
    $('.alertPart').addClass('hide');
    $('#btn-asignar').removeClass('disabled');
    var partition = $("#cantpart").val()
    var sizeMemory = $("#tam-memory").val();
    var totaldisp = sizeMemory%partition;
    var porcMemoryDisp = Math.round((sizeMemory*100)/8192);
   
    $("#memoria").text('Tamaño Definido: '+sizeMemory+' MB.');
    $("#disponible").text('Tamaño Disponible: '+totaldisp+' MB.');
    $("#porcentajeTotal").text('Porcentaje de la memoria total utilizado: '+porcMemoryDisp+'%');
  
    if (partition == 0){
      $(".textoAlertPart").text("La cantidad de particiones debe ser un número entero positivo.");
      $('.alertPart').addClass('show');
      $('#btn-asignar').addClass('disabled');
    }/* else if (partition > 4098) {
      $(".textoAlertPart").text("La cantidad máxima de particiones que puede crear es de 4096");
      $('.alertPart').addClass('show');
      $('#btn-asignar').addClass('disabled');
    }  */

  });

  $('.btn-add-part').off().on('click',function(e){
    $('.btn-add-part').addClass('disabled');
    $('.alertMem').removeClass('d-none');
    $('.inputParts').removeClass('disabled');
    $('#controlidpart').removeClass('d-none');
    
    var partition = $("#cantpart").val()
    var sizeMemory = $("#tam-memory").val();
    var totalpart = Math.round(sizeMemory/partition);
    
    e.preventDefault();

    for(var i=0; i<partition; i++){
      var sizepartinput = parseInt($('.inputParts'+i).val()); console.log(sizepartinput);
      if (isNaN(sizepartinput)){
          sizepartinput = totalpart;console.log("valor convertido: ",sizepartinput)
        }
      var num_part = i+1;         
      var porcPartUtil = Math.round((sizepartinput*100)/sizeMemory);
      var new_partition = `
        <div class="col-sm-12 d-flex justify-content-center mb-3">
          <span class="input-group-text textPart md-addon py-0">Partición ${num_part}</span>
          <input class="inputParts${num_part} text-center w-25" name="fields[]" value="${totalpart}" placeholder="Ingrese el tamaño en MB" id="Memoryinput"/>
          </div>`
      $('#add-field').append(new_partition);
      $("#porcentajeDef").text('Porcentaje utilizado por partición: '+ porcPartUtil+'%');
    }

    $("#add-field").off().keyup('.inputParts',function(){
      $('.alertPart').removeClass('show');
      $('.alertPart').addClass('hide');
      $('#btn-asignar').removeClass('disabled');
      
      for(var i=0; i<partition; i++){
        var sizepartinput = parseInt($('.inputParts'+i).val()); console.log(sizepartinput);
        var totalinput = sizepartinput*partition; console.log('el total es ',totalinput);

          if (sizepartinput == 0){
            $(".textoAlertPart").text("Debe ingresar un número mayor a cero.");
            $('.alertPart').addClass('show');
            $('#btn-asignar').addClass('disabled');
          } 
          if (totalinput > sizeMemory){
            $(".textoAlertPart").text("Tamaño de Memoria excedida. Intente nuevamente con un valor menor.");
            $('.alertPart').addClass('show');
            $('#btn-asignar').addClass('disabled');
          }
        }
    });
  });

  $("#btn-asignar").on( "click", function() {
    $('.alertPart').removeClass('alert-danger');
    $('.alertPart').addClass('alert-info');
    $('.alertPart').addClass('show');
    $(".textoAlertPart").text("Las particiones han sido asignadas correctamente.");

    setTimeout(function() {
      alert('Por favor presione el botón Confirmar para avanzar a la siguinte sección.');            
    },1000);
  });

  //---------------------SECCION PROCESOS------------------------------------------
//control de la seleccion de algoritmo
$("#optionAlgo").change(function(){
  var typeAlgorithm = $("#optionAlgo").find(':selected').text();
  $(".muted-algo").hide();

  if (typeAlgorithm == 'FCFS'){
    algorithm = typeAlgorithm;
    console.log(algorithm);
    $(".quantumIn").val("");
    $(".quantumIn").hide();
    $(".algoInfo").text("FCFS");

  } else if (typeAlgorithm == 'Round Robin'){
      algorithm = typeAlgorithm;
      console.log(algorithm);
      $(".quantumIn").show();
      $(".algoInfo").text("RR");

  } else if (typeAlgorithm == 'Prioridades'){ 
      algorithm = typeAlgorithm;
      console.log(algorithm);
      $(".quantumIn").val("");
      $(".quantumIn").hide();
      $(".algoInfo").text("Prioridades");

    } else if (typeAlgorithm == 'Prioridades SJF'){ 
      algorithm = typeAlgorithm;
      console.log(algorithm);
      $(".quantumIn").val("");
      $(".quantumIn").hide();
      $(".algoInfo").text("Prioridades SJF");

    } else if (typeAlgorithm == 'Prioridades SRTF'){ 
      algorithm = typeAlgorithm;
      console.log(algorithm);
      $(".quantumIn").val("");
      $(".quantumIn").hide();
      $(".algoInfo").text("Prioridades SRTF");
  } else {
      algorithm = typeAlgorithm;
      console.log(algorithm);
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
  // Funcion para añadir una nueva fila en la tabla
  var idProcess=0;
  $("#btn-añadir").on("click", function() {
    
    if (idProcess < 20) {
      idProcess++;
    } else if (idProcess = idProcess++) {
        idProcess = 0;
    }
    var nuevaFila=`
                  <tr class="hide">
                    <td class="pt-3-half" contenteditable="false">${idProcess}</td>
                    <td class="pt-3-half" contenteditable="false">Proc_${idProcess}</td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td class="pt-3-half" type="number" contenteditable="true"></td>
                    <td>
                      <span class="table-remove"><button type="button" class="del btn btn-outline-danger btn-rounded btn-sm my-0 waves-effect waves-light">Eliminar</button></span>
                    </td>
                  </tr>` 
    $("#tbodyID").append(nuevaFila);
  });

  // evento para eliminar la fila
  $("#tableID").on("click", ".del", function(){
    if (idProcess > 0) {--idProcess;} 
    $(this).parents("tr").remove();
  });

  $("#config-btnb").on("click", function() {
    $('.alertProcs').addClass('show')
    $(".textoAlertProcs").text("Debe presionar el botón Nueva Configuración y definir una nueva configuración.") 

    setTimeout(function(){ 
      $('.alertProcs').removeClass('show');
      $('.alertProcs').addClass('hide');
    },3500);
  });

  $("#presentation-btnb").on("click", function() {
    $('.alertProcs').addClass('show')
    $(".textoAlertProcs").text('Por favor presione el botón Confirmar para avanzar a la siguinte sección.') 

    setTimeout(function(){ 
      $('.alertProcs').removeClass('show');
      $('.alertProcs').addClass('hide');
    },3500);
  });
  ////--------------------------MAPA DE MEMORIA-------------------------------------------
    am4core.ready(function() {
    var partition = $("#cantpart").val()
    var sizeMemory = $("#tam-memory").val();
    var cant_partitions = $("#cantpart").val();
    var totalpart = Math.round(sizeMemory/partition);
    
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.PieChart);
    
    for(var i=0; i<cant_partitions; i++){
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
    $("#config-btnc").on("click", function() {
      $('.alertPresent').addClass('show')
      $(".textoAlertPresent").text("Debe presionar el botón Nueva Configuración y definir una nueva configuración.") 
  
      setTimeout(function(){ 
        $('.alertPresent').removeClass('show');
        $('.alertPresent').addClass('hide');
      },3500);
    });
  
    $("#process-btnc").on("click", function() {
      $('.alertPresent').addClass('show')
      $(".textoAlertPresent").text("Debe presionar el botón Nueva Configuración y definir una nueva configuración.") 
  
      setTimeout(function(){ 
        $('.alertPresent').removeClass('show');
        $('.alertPresent').addClass('hide');
      },3500);
    });

//--------------------------GANTT DE PROCESOS-------------------------------------------
    am4core.ready(function() {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end
      
      var chart = am4core.create("chartdiv-gantt", am4charts.XYChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      
      chart.paddingRight = 30;
      chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";
      
      var colorSet = new am4core.ColorSet();
      colorSet.saturation = 0.4;
      
      chart.data = [
        {
          name: "Proceso 1",
          fromDate: "2018-01-01 08:00",
          toDate: "2018-01-01 10:00",
          color: colorSet.getIndex(0).brighten(0)
        },
        {
          name: "Proceso 2",
          fromDate: "2018-01-01 12:00",
          toDate: "2018-01-01 15:00",
          color: colorSet.getIndex(0).brighten(0.4)
        },
        {
          name: "Proceso 3",
          fromDate: "2018-01-01 15:30",
          toDate: "2018-01-01 21:30",
          color: colorSet.getIndex(0).brighten(0.8)
        },
        {
          name: "CPU",
          fromDate: "2018-01-01 08:00",
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
      
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
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
      
      }); // end am4core.ready()

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

  //Formulario
  var raf=0;
  var maxraf=5;
  var cpuList = []
  var esList = []
  //agregar rafagas dinamicas
  $('#rafdynamicId').off().on('click', '.btn-add-raf', function(e){

      e.preventDefault();
      console.log('raf: ',raf, ' maxraf: ', maxraf);

        if(raf < maxraf){

          var controlForm = $('#rafdynamicId:first'),
              currentEntry = $(this).parents('.entryRaf:first');
              console.log('controlForm1: ',controlForm);
          //rafaga de cpu ingresada
          var cpu = currentEntry.find('.inputcpu').val();
          var es = currentEntry.find('.inputes').val();

          cpu = parseInt(cpu);
          es = parseInt(es);
          
          if (cpu > 0 && es!=0 ) {
            $('.alertRaf').removeClass('alert-success');
            $('.alertRaf').addClass('alert-danger');
            $(".alertRaf").text("Debes ingresar un valor en E/S mayor a cero.");
          }else { 
            if (cpu != 0 && es > 0 ) {
              $('.alertRaf').removeClass('alert-success');
              $('.alertRaf').addClass('alert-danger');
              $(".alertRaf").text("Debes ingresar un valor en CPU mayor a cero.");
            }
          };
          
          if (cpu > 0 && es > 0 ) {
            $('.alertRaf').removeClass('alert-danger');
            $('.alertRaf').addClass('alert-success');
            $(".alertRaf").text("5 es la cantidad máxima de ráfagas que puede agregar.");
            raf = raf + 1;
            //se puede agregar particion
            console.log('raf: ',cpu);
            console.log('cpu: ',cpu);
            console.log('es: ',es);
            cpuList.push(cpu);
            esList.push(es);
            console.log('La rafaga ingresada es: ',cpuList, esList)//_------------------------------
            var controlForm = $('#rafdynamicId:first'),
                currentEntry = $(this).parents('.entryRaf:first')
                newEntry = $(currentEntry.clone()).appendTo(controlForm);

              newEntry.find('.inputcpu').val('');
              newEntry.find('.inputes').val('');

              newEntry.find('.textCpu').text("CPU " + raf);
              newEntry.find('.textEs').text("E/S " + raf);
              $(this).parents('.entryRaf:first').addClass('divDelete'+raf);

              controlForm.find('.entryRaf:not(:last) .inputcpu')
                .addClass('classDisabled')
                .removeClass('inputcpu')
                .prop("disabled", true);

              controlForm.find('.entryRaf:not(:last) .inputes')
                  .addClass('classDisabled')
                  .removeClass('inputes')
                  .prop("disabled", true);

              controlForm.find('.entryRaf:not(:last) .btn-add-raf')
                  .removeClass('btn-add-raf').addClass('btn-remove-raf')
                  .removeClass('btn-outline-info').addClass('btn-outline-danger')
                  .attr('onClick', 'removeElement('+raf+');')
                  .html('<span class="glyphicon glyphicon-minus deleteInput">Quitar</span>');
          }
          if(raf == 5){
            $('.alertRaf').removeClass('alert-success');
            $('.alertRaf').addClass('alert-danger');
          }
        }
  });
