
function SimuladorBase(clock, colaListos, colaNuevos, colaBloqueados, memoria) {
	this.clock = clock;
	this.colaListos = colaListos;
	this.colaNuevos = colaNuevos;
	this.colaBloqueados = colaBloqueados;
	this.memoria = memoria;
	this.procesoCpu = null;
	this.procesoEs = null;
	this.tiempoOcioso = 0;
	this.resultados = [];
	this.colaControl = [];
}

SimuladorBase.prototype.cicloMemoria = function() {
	debugger;
	let c = 0;
	this.colaNuevos.sort((a, b) => a.tarrivo - b.tarrivo);
	for (let p of this.colaNuevos) {
		if (p.tarrivo == this.clock) {
			this.memoria.encolarProceso(p);
			c++;
		}
	}
	this.colaNuevos.splice(0, c);
	c = 0;
	this.memoria.colaMemoria.sort((a, b) => a.tam - b.tam);
	for (let p of this.memoria.colaMemoria) {
		let proc = this.memoria.insertarProceso(p);
		if (proc) {
			this.colaListos.push(proc);
			c++;
		}
	}
	this.memoria.colaMemoria.splice(0, c);
}

SimuladorBase.prototype.porcActivo = function() {
	return ((this.clock - this.tiempoOcioso) / this.clock) * 100;
}

SimuladorBase.prototype.imprimirResultado = function() {
	let tiempoRetornoProm = 0;
	let tiempoEsperaProm = 0;
	for (let r of this.resultados) {
		tiempoEsperaProm += r.tiempoEspera;
		tiempoRetornoProm += r.tiempoRetorno;
	}
	return [(tiempoEsperaProm / this.resultados.length), (tiempoRetornoProm / this.resultados.length)];
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
	debugger;
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
		this.procesoCpu.irrupcion++;
		if (rafCpuFinalizada) {
			if (this.procesoCpu.isFinished()) {
				this.memoria.removerProceso(this.procesoCpu);
				let p = {
					pid: this.procesoCpu.pid,
					tiempoRetorno: this.procesoCpu.calcTiempoRetorno(this.clock),
					tiempoEspera: this.procesoCpu.calcTiempoEspera(this.procesoCpu.calcTiempoRetorno(this.clock))
				}
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

/* function main() {

	let part1 = new Particion(500, null);


	let m = new MemoriaVariable(500, [part1], []);

	let sim = new SimuladorNoApropiativo(0, [], [], [], m);

	let p1 = new Proceso(1, 12, 0, 0, [1,2,1]);
	let p2 = new Proceso(2, 13, 1, 0, [2,1,2]);
	let p3 = new Proceso(3, 12, 4, 0, [1,2,1]);
	let p4 = new Proceso(4, 13, 3, 0, [2,1,2]);
	let p5 = new Proceso(5, 12, 2, 0, [1,2,1]);
	let p6 = new Proceso(6, 13, 0, 0, [2,1,2]);

	sim.colaNuevos.push(p1, p2, p3, p4, p5, p6);
	console.log(sim.colaNuevos);
	console.log(sim.colaControl);
	sim.colaControl.push(p1, p2, p3, p4, p5, p6);

	while (sim.colaControl.length > 0) {
		console.log('...............');
		sim.cicloMemoria();
		console.log(sim.memoria);
		sim.cicloCpu();
		console.log(sim);
	}

	let a = sim.imprimirResultado();
	console.log('Tiempo Retorno Promedio: ', a[1]);
	console.log('Tiempo Espera Promedio: ', a[0]);
	console.log('Porcentaje utilización CPU: ', sim.porcActivo());
}
 */