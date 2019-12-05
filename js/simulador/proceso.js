function Proceso(pid, tam, tarrivo, prio, rafaga) {
	this.pid = pid;
	this.tam = tam;
	this.tarrivo = tarrivo;
	this.tiempoEspera = 0;
	this.tiempoRetorno = 0;
	this.tiempoRespuesta = 0;
	this.prio = prio;
	this.rafaga = rafaga;
	this.terminado = false;
	this.bloqueado = false;
}

Proceso.prototype.tratarProceso = function() {
	if (this.isFinished()) {
		this.terminado = true;
	} else {
		this.rafaga[0] -= 1;
		if (this.rafaga[0] == 0) {
			this.rafaga.splice(0, 1);
			return true;
		}
		return false;
	}
}

Proceso.prototype.getRafCpu = function() {
	return this.rafaga[0];
}

Proceso.prototype.isFinished = function() {
	return (this.rafaga.length == 0 ? true : false);
}