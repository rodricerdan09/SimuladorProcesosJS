function MemoriaBase(tam, particiones, colaMemoria) {
	this.tam = tam;
	this.particiones = particiones;
	this.colaMemoria = colaMemoria;
}

MemoriaBase.prototype.particionLibre = function(proceso) {
	for (var p of this.particiones) {
		if (p.tam >= proceso.tam && p.isEmpty()) {
			return p;
		}
	}	
	return null;
}

MemoriaBase.prototype.getParticion = function(proceso) {
	for (var p of this.particiones) {
		if (p.proceso == proceso) { return p }
	}
	return null;
}

MemoriaBase.prototype.encolarProceso = function(proceso) {this.colaMemoria.push(proceso);}

MemoriaBase.prototype.desencolarProceso = function() {this.colaMemoria.splice(0, 1)}


function MemoriaFija(...args) {
	MemoriaBase.apply(this, args);
}

MemoriaFija.prototype = Object.create(MemoriaBase.prototype);

MemoriaFija.prototype.insertarProceso = function(proceso) {
	let particionLibre = this.particionLibre(proceso);
	if (particionLibre) {
		particionLibre.proceso = proceso;
		return proceso;
	}
	return null;
}

MemoriaFija.prototype.removerProceso = function(proceso) {
	this.getParticion(proceso).proceso = null;
}


MemoriaFija.prototype.particionLibre = function(proceso) {
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

function MemoriaVariable(...args) {
	MemoriaBase.apply(this, args);
}

MemoriaVariable.prototype = Object.create(MemoriaBase.prototype);

MemoriaVariable.prototype.particionLibre = function(proceso) {
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

MemoriaVariable.prototype.insertarProceso = function(proceso) {
	let particionLibre = this.particionLibre(proceso);
	if (particionLibre && particionLibre.fragInterna(proceso) >= 16) {
		let particionNueva = new Particion((particionLibre.tam - proceso.tam), null);
		particionLibre.tam -= particionLibre.fragInterna(proceso);
		particionLibre.proceso = proceso;
		this.particiones.push(particionNueva);
		return proceso;
	}
	return null;
}

MemoriaVariable.prototype.removerProceso = function(proceso) {
	let alInicio = this.particiones.indexOf(this.getParticion(proceso)) - 1;
	let alFinal = this.particiones.indexOf(this.getParticion(proceso)) + 1;
	let flagFinal = (alFinal > this.particiones.length) ? false : true;
	let flagInicio = (alInicio >= 0) ? true : false;
	while (flagInicio || flagFinal) {
		if (flagFinal && this.particiones[alFinal].isEmpty()) {
			this.getParticion(proceso).tam += this.particiones[alFinal].tam;
			this.particiones.splice(alFinal, 1);
			if (this.particiones[alFinal+1]) {
				alFinal++;
			} else {
				flagFinal = false;
			}
		} else {
			this.particiones[alFinal-1].proceso = null;
			flagFinal = false;
		}
		debugger;
		if (flagInicio && this.particiones[alInicio].isEmpty()) {
			this.getParticion(proceso).tam += this.particiones[alInicio].tam;
			this.particiones.splice(alInicio, 1);
			if (this.particiones[alInicio-1]) {
				alInicio--;
			} else {
				flagInicio = false;
			}
		} else {
			this.particiones[alInicio+1].proceso = null;
			flagInicio = false;
		}
	}
}

function Particion(tam, proceso) {
	this.tam = tam;
	this.proceso = proceso;
}

Particion.prototype.isEmpty = function() {
	return (this.proceso ? false : true);
}

Particion.prototype.fragInterna = function(proceso) {
	return this.tam - proceso.tam;
}

