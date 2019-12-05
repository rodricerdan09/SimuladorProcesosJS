
function SimuladorBase(clock, colaListos, colaNuevos, colaBloqueados, memoria) {
	this.clock = clock;
	this.colaListos = colaListos;
	this.colaNuevos = colaNuevos;
	this.colaBloqueados = colaBloqueados;
	this.memoria = memoria;
	this.procesoCpu = null;
	this.procesoEs = null;
	this.tiempoOcioso = 0;
	this.resultados = {};
	this.colaControl = [];
}

SimuladorBase.prototype.cicloMemoria = function() {

	let colaNuevosIterable = JSON.parse(JSON.stringify(this.colaNuevos));
	for (var p of colaNuevosIterable) {
		if (p.tarrivo == this.clock) {
			this.memoria.encolarProceso(p);
			this.colaNuevos.splice(0, 1);
		}
	}
	for (var p of this.memoria.colaMemoria) {
		let proc = this.memoria.insertarProceso(p);
		if (proc) {this.colaListos.push(proc)}
	}
}

function SimuladorApropiativo(...args) {
	SimuladorBase.apply(this, args);
}

SimuladorApropiativo.prototype.cicloCpu = function() {

}

function SimuladorNoApropiativo(...args) {
	SimuladorBase.apply(this, args);
}

SimuladorNoApropiativo.prototype = Object.create(SimuladorBase.prototype);

SimuladorNoApropiativo.prototype.cicloCpu = function() {

	if (this.colaListos.length > 0 && !this.procesoCpu) {
		this.procesoCpu = this.colaListos[0];
		this.colaListos.splice(0, 1);
	}

	if (this.colaBloqueados.length > 0 && !this.procesoEs) {
		this.procesoEs = this.colaBloqueados[0];
		this.colaBloqueados.splice(0, 1);
	}

	if (this.procesoCpu) {
		let rafCpuFinalizada = this.procesoCpu.tratarProceso();
		if (this.procesoCpu.terminado) {
			this.memoria.removerProceso(this.procesoCpu);
			this.colaControl.splice(this.colaControl.indexOf(this.procesoCpu), 1);
			this.procesoCpu = null;
		} else if (rafCpuFinalizada) {
			this.colaBloqueados.push(this.procesoCpu);
			this.procesoCpu = null;
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

function SimuladorMLQ(...args) {

}

function SimuladorSJF(...args) {
	SimuladorNoApropiativo.apply(this, args);
}

SimuladorSJF.prototype.ordernarColaListos = function() {

}

function SimuladorFCFS(...args) {
	SimuladorNoApropiativo.apply(this, args);
}

SimuladorFCFS.prototype.ordenarColaListos = function() {

}

function main() {

	let part1 = new Particion(500, null);
	
	let m = new MemoriaVariable(500, [part1], []);

	let sim = new SimuladorNoApropiativo(0, [], [], [], m);

	let p1 = new Proceso(1, 12, 0, false, 0, [1,2,1]);
	let p2 = new Proceso(2, 13, 0, false, 0, [2,1,2]);

	sim.colaNuevos.push(p1, p2);
	console.log(sim.colaNuevos);
	console.log(sim.colaControl);
	sim.colaControl.push(p1, p2);

	while (sim.colaControl.length > 0) {
		console.log('...............');
		sim.cicloMemoria();
		console.log(sim.memoria);
		sim.cicloCpu();
		console.log(sim);
	}
}
