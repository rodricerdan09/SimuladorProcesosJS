
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

SimuladorBase.prototype.calcularPromedios = function() {
	let tEsperaProm = 0;
	let tRetornoProm = 0;
	for (let r of this.resultados) {
		tEsperaProm += r.tEspera;
		tRetornoProm += r.tRetorno;
	}
	return [(tEsperaProm / this.resultados.length), (tRetornoProm / this.resultados.length)];
}

SimuladorBase.prototype.ordenarColaListos = function() {
	
}

function Resultado(pid, tSalida, tArrivo, tRetorno, tEspera) {
	this.pid = pid;
	this.tSalida = tSalida;
	this.tArrivo = tArrivo;
	this.tRetorno = tRetorno;
	this.tEspera = tEspera;
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