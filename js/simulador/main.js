function instMemoria() {
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
    let particiones = [];
    for (p of arrayPartitions) {
      let part = new Particion(p, null);
      particiones.push(part);
    }
    mem = new MemoriaFija(memtotal, particiones, []);
    if (fitMemory == "Best Fit") {
      MemoriaFija.prototype.particionLibre = function(proceso) {
        let fragInternaGlobal = 999999999999999;
        let particionBestFit = null;
        for (var p of this.particiones) {
          if (p.isEmpty() && p.tam >= proceso.tam) {
            if (p.tam - proceso.tam <= fragInternaGlobal) {
              fragInternaGlobal = p.tam - proceso.tam;
              particionBestFit = p;
            }
          }
        }
        return particionBestFit;
      }
    }
  }
  return mem;
}

function instSimulador() {
  switch (algorithm) {
    case 'FCFS':
      sim = new SimuladorNoApropiativo(0, [],[],[], mem);
      break;
    case 'SJF':
      sim = new SimuladorNoApropiativo(0, [], [], [], mem);
      SimuladorNoApropiativo.prototype.ordenarColaListos = function() {
        this.colaListos.sort((a, b) => ((a.getRafCpu() < b.getRafCpu()) ? 1 : -1));
      }
      break;
    case 'SRTF':
      sim = new SimuladorApropiativo(0, [], [], [], mem);
      SimuladorApropiativo.prototype.ordenarColaListos = function() {

      }
      SimuladorApropiativo.prototype.cicliCpu = function() {
        if (this.colaListos.length > 0 && !this.procesoCpu) {
          this.procesoCpu = this.colaListos[0];
          this.colaListos.splice(0, 1);
        } else if (this.procesoCpu && this.colaListos.length > 0) {
          // logica de SRTF
        }

        if (this.colaBloqueados.length > 0 && !this.procesoEs) {
          this.procesoEs = this.colaBloqueados[0];
          this.colaBloqueados.splice(0, 1);
        }
        if (this.procesoCpu) {
          let rafCpuFinalizada = this.procesoCpu.tratarProceso();
          this.procesoCpu.irrupcion++;
          if (rafCpuFinalizada) {
            if (this.procesoCpu.isFinished()) {
              this.memoria.removerProceso(this.procesoCpu);
              let p = new Resultado(this.procesoCpu.pid, this.clock, this.procesoCpu.tarrivo, this.procesoCpu.calcTiempoRetorno(this.clock), this.procesoCpu.calcTiempoEspera(this.procesoCpu.calcTiempoRetorno(this.clock)));
              this.resultados.push(p);
              this.colaControl.splice(this.colaControl.indexOf(this.procesoCpu), 1);
              this.procesoCpu = null;
            } else {
              this.colaBloqueados.push(this.procesoCpu);
              this.procesoCpu = null;
            }
          }
        } else {
          this.tiempoOcioso++;
        }

        if (this.procesoEs) {
          let rafEsFinalizada = this.procesoEs.tratarProceso();
          if (rafEsFinalizada) {
            this.colaListos.push(this.procesoEs);
            this.procesoEs = null;
          }
        }

        this.clock++;
      }
      break;
    case 'RR':
      sim = new SimuladorApropiativo(0, [], [], [], mem);
      sim.quantum = generalQuantum;
      let quantumReset = false;
      SimuladorApropiativo.prototype.cicloCpu = function() {
        debugger;
        let clock = this.clock;// estos clocks son mas que nada para incrementar en 1 en cada ciclo el clock por el
        let clocki = this.clock;// hecho que a veces no incrementa al estar al final

        if (this.colaListos.length > 0 && !this.procesoCpu) {
          this.procesoCpu = this.colaListos[0];
          this.colaListos.splice(0, 1);
        } else if (this.quantum == 0) {
          this.colaListos.push(this.procesoCpu);
          this.quantum = generalQuantum;
          this.procesoCpu.inicio = true;
          let r = new Res(this.procesoCpu.pid, "CPU" , this.procesoCpu.iniclock ,clock, "#23FF00"); // objeto resultado para el gantt del cpu
          this.res.push(r);
          this.procesoCpu = this.colaListos[0];
          this.colaListos.splice(0, 1);//este faltaba, era uno de los errores del quantum no lo eliminaba de la cola
        }
        if (this.colaBloqueados.length > 0 && !this.procesoEs) {
          this.procesoEs = this.colaBloqueados[0];
          this.colaBloqueados.splice(0, 1);
        }
        if (this.procesoCpu) {
          clock++;
          if (this.procesoCpu.inicio){
            this.procesoCpu.iniclock = this.clock;
          } 
          let rafCpuFinalizada = this.procesoCpu.tratarProceso();
          this.quantum--;
          this.procesoCpu.irrupcion++;
          if (rafCpuFinalizada) {
            if (this.procesoCpu.isFinished()) {
              this.memoria.removerProceso(this.procesoCpu);
              let r = new Res(this.procesoCpu.pid, "CPU" , this.procesoCpu.iniclock ,clock, "#23FF00"); 
              this.res.push(r); 
              let p = new Resultado(this.procesoCpu.pid, clock, this.procesoCpu.tarrivo, this.procesoCpu.calcTiempoRetorno(clock), this.procesoCpu.calcTiempoEspera(this.procesoCpu.calcTiempoRetorno(clock)));
              this.resultados.push(p);
              this.colaControl.splice(this.colaControl.indexOf(this.procesoCpu), 1);
              this.procesoCpu = null;
              this.quantum = generalQuantum;
            } else {
              this.colaBloqueados.push(this.procesoCpu);
              let r = new Res(this.procesoCpu.pid, "CPU" , this.procesoCpu.iniclock ,clock, "#23FF00"); 
              this.res.push(r); 
              this.procesoCpu = null;
              this.quantum = generalQuantum;//al final de cada rafaga siempre se resetea el quantum
            }
          } 
        } else {
          this.tiempoOcioso++;
        }

        if (this.procesoEs) {
          clocki++;
          if (this.procesoEs.inicio){
            this.procesoEs.iniclock = this.clock;
          }
          let rafEsFinalizada = this.procesoEs.tratarProceso();
          if (rafEsFinalizada) {
            this.colaListos.push(this.procesoEs);
            let r = new Res(this.procesoEs.pid, "E/S" , this.procesoEs.iniclock , clocki, "#00D4FF"); //objeto para el gantt de la E/S
            this.res.push(r);
            this.procesoEs = null;
          }
        }
        this.clock++;
      }
      break;
    case 'MLQ':
      sim = new SimuladorApropiativo(0, [[], [], []], [], [], mem);
      SimuladorApropiativo.prototype.cicloCpu = function() {
      }
      break;
    case 'Prioridades':
      sim = new SimuladorApropiativo(0, [], [], [], mem);
      SimuladorApropiativo.prototype.ordenarColaListos = function() {
        this.colaListos.sort((a, b) => (a.prio < b.prio) ? 1 : -1);
      }
      SimuladorApropiativo.prototype.cicloCpu = function() {
        //debugger;
        let clock = this.clock;
        let clocki = this.clock;

        if (this.colaListos.length > 0 && !this.procesoCpu) {
          this.procesoCpu = this.colaListos[0];
          this.colaListos.splice(0, 1);
        } else if (this.procesoCpu && this.colaListos.length > 0 && this.colaListos[0].prio > this.procesoCpu.prio) {
          this.colaListos.push(this.procesoCpu);
          this.procesoCpu = this.colaListos[0];
          this.colaListos.splice(0, 1);
          this.ordenarColaListos();
        }
        if (this.colaBloqueados.length > 0 && !this.procesoEs) {
          this.procesoEs = this.colaBloqueados[0];
          this.colaBloqueados.splice(0, 1);
        }
        if (this.procesoCpu) {
          clock++;
          if (this.procesoCpu.inicio) {
            this.procesoCpu.iniclock = this.clock;
          }
          let rafCpuFinalizada = this.procesoCpu.tratarProceso();
          this.procesoCpu.irrupcion++;
          if (rafCpuFinalizada) {
            if (this.procesoCpu.isFinished()) {
              this.memoria.removerProceso(this.procesoCpu);
              let r = new Res(this.procesoCpu.pid, "CPU" , this.procesoCpu.iniclock ,clock, "#23FF00"); 
              this.res.push(r); 
              let p = new Resultado(this.procesoCpu.pid, this.clock, this.procesoCpu.tarrivo, this.procesoCpu.calcTiempoRetorno(this.clock), this.procesoCpu.calcTiempoEspera(this.procesoCpu.calcTiempoRetorno(this.clock)));
              this.resultados.push(p);
              this.colaControl.splice(this.colaControl.indexOf(this.procesoCpu), 1);
              this.procesoCpu = null;
            } else {
              this.colaBloqueados.push(this.procesoCpu);
              let r = new Res(this.procesoCpu.pid, "CPU" , this.procesoCpu.iniclock ,clock, "#23FF00"); 
              this.res.push(r);
              this.procesoCpu = null;
            }
          }
        } else {
          this.tiempoOcioso++;
        }

        if (this.procesoEs) {
          clocki++;
          if (this.procesoEs.inicio){
            this.procesoEs.iniclock = this.clock;
          } 
          let rafEsFinalizada = this.procesoEs.tratarProceso();
          if (rafEsFinalizada) {
            this.colaListos.push(this.procesoEs);
            let r = new Res(this.procesoEs.pid, "E/S" , this.procesoEs.iniclock , clocki, "#00D4FF");
            this.res.push(r);
            this.procesoEs = null;
          }
        }

        this.clock++;
      }
      break;
  }
  return sim;
}

function instProcesos() {
  let iter = (flag) ? 4 : 3;
  for (p of parametros) { 
    let pro = new Proceso();
    let arr = []
    for (var i = 0; i < p.length-3; i++) {
      if (i >= iter){
        arr.push(p[i]);
      } else if (iter == 4){
        switch (i) {
          case 0:
            pro.pid = p[i];
            break;
          case 1:
            pro.prio = p[i];
            break;
          case 2:
            pro.tam = p[i];
            break;
          case 3:
            pro.tarrivo = p[i];
            break;
        }
      } else if (iter == 3){
        switch (i) {
          case 0:
            pro.pid = p[i];
            break;
          case 1:
            pro.tam = p[i];
            break;
          case 2:
            pro.tarrivo = p[i];
            pro.prio = 0;
            break;
        }
      }
    }
    pro.rafaga = arr;
    sim.colaNuevos.push(pro);
    sim.colaControl.push(pro);
  }
}

function cargaResultados() {
  let listaResult = []; //LISTA DE DATOS DE LOS RESULTADOS PROCESADOS EN EL GANTT
  for (let r of sim.res) {
    listaResult.push(r);
  }

  am4core.ready(function() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    var chart = am4core.create("chartdiv-d", am4charts.XYChart); //chart usa datos tipo json o array de objetos por eso paso la lista de resultados
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.paddingRight = 30;
  
    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    chart.data = listaResult; // Esta es la lista de resultados xd
  
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis()); //CategoryAxis es para usar datos tipo text
    categoryAxis.title.text = "Procesos"; // TITULO AXI-Y
    categoryAxis.dataFields.category = "name"; //datafields son los datos recolectados de la lista en este caso el nombre pasado al grafico
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
  
    var xAxis = chart.xAxes.push(new am4charts.DurationAxis()); //DurationAxis usa datos tipo numerico en forma de tiempo
    xAxis.baseUnit = "second"; //unidad de tiempo
    xAxis.title.text = "tiempo" //TITULO AXI-X
    xAxis.renderer.minGridDistance = 70;
    xAxis.baseInterval = { count: 30, timeUnit: "minute" };
    xAxis.max = 60; //maximo se puede cambiar pero se me hace que un minuto esta bien
    xAxis.min = 0;
    xAxis.strictMinMax = true;
    xAxis.renderer.tooltipLocation = 0;
  
    var series1 = chart.series.push(new am4charts.ColumnSeries()); 
    series1.columns.template.width = am4core.percent(80);
    series1.dataFields.openValueX = "fromDur";//valor desde
    series1.dataFields.valueX = "toDur";// valor hasta
    series1.dataFields.categoryY = "name";// valor del nombre
    series1.columns.template.propertyFields.fill = "color"; // get color from data
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;
    series1.columns.template.tooltipText = "P{name}: {rafaga} ({fromDur} - {toDur}) "; //esto es lo que muestra cuando pasas el mouse por el grafico

    chart.scrollbarX = new am4core.Scrollbar();
  });
    //AMCHART------------------------------------------------------------------

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
  $('#cpu').append(sim.porcActivo().toFixed(1) + '%');
}


function main(){
  instMemoria();
  instSimulador();
  instProcesos();

  while(sim.colaControl.length > 0){
    sim.cicloMemoria();
    sim.ordenarColaListos();
    sim.cicloCpu();
  }

  cargaResultados();
}

