//--------------------------------
//agregar particiones primer version
 /* $(".optionPart").off().change(function(){
  var partition = $("#optionPart").find(':selected').text();
  var cantidad = parseInt(partition); console.log(cantidad)
  $('#rowspan').append($('<span class="mt-5 lead">Ingrese el tamaño de las particiones</span>'));
  if (partition == '1') { 
    $('#partinput').append($('<input type="text" id="inputMemory" class="form-control py-3 mb-2 mt-1" placeholder="Partición 1">'));
    $('#partbtn1').append($('<button class="btn btn-outline-info z-depth-0 waves-effect py-2" type="submit">Agregar</button>'));
    $('#partbtn2').append($('<button class="btn btn-outline-danger z-depth-0 waves-effect py-2" type="submit" id="qbtn1">Quitar</button>'));
  } else {
        for (var i = 1; i <= cantidad ; i++) {  
          $('#partinput').append($('<input type="text" id="inputMemory" class="form-control py-3 mb-2 mt-1" placeholder="Partición '+i+'">'));
          $('#partbtn1').append($('<button class="btn btn-outline-info z-depth-0 waves-effect btn-sm py-2 mb-1" type="submit">Agregar</button>'));
          $('#partbtn2').append($('<button class="btn btn-outline-danger z-depth-0 waves-effect btn-sm py-2 mb-1" type="submit" id="qbtn'+i+'">Quitar</button>'));
          console.log(cantidad)
        }
  }  
}); */
//agregar particiones primer version
/* 
<div class="controls">
    <form class="md-form input-group mb-3" role="form" autocomplete="off" id="formid">
        <div class="entry input-group-prepend">
            <span class="input-group-text textPart md-addon py-0">Partición 0</span>
                <input class="form-control inputMemory ml-2" name="fields[]" placeholder="Ingrese el tamaño" id="Memoryinput"/>
                <span class="mx-auto input-group-btn">
                <button class="btn btn-outline-info z-depth-0 waves-effect mb-1 btn-sm btn-add btn-remove" type="button">
                    <span class="glyphicon glyphicon-plus">Agregar</span>
                </button>
                
                </span>
        </div>
    </form>
</div>

<span class="mt-5 lead">Ingresa el tamaño de las Particiones:</span>
  <select class="browser-default custom-select mb-1 mt-3 optionPart" id="optionPart">
    <option value="" disabled selected>Selecciona</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
  </select> 

 <div class="row">
    <span class="col-md-3 input-group-text textPart md-addon py-0">Partición 0</span>
        <input class="col-md-3 form-control inputMemory " name="fields[]" placeholder="Tamaño" id="Memoryinput"/>                        
        <button class="col-md-3 btn btn-info z-depth-0 waves-effect mb-1 px-1 mx-0 btn-sm btn-add" type="button">
            Agregar
        </button>
        <button class="col-md-3 btn btn-info z-depth-0 waves-effect mb-1 mx-0 btn-sm btn-remove" type="button">
            Quitar
        </button>
</div> */

$("#optionAlgo").change(function(){
  var rr = $("#optionAlgo").find(':selected').text();
  if (rr == 'Round Robin'){
   $('.alertRR').removeClass('hide');
   $('.alertRR').addClass('show');
  } else{
   $('.alertRR').removeClass('show');
   $('.alertRR').addClass('hide');
   $(".alertRR").addClass("disabled");
  }
});