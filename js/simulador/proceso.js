function Proceso(pid, prio, tam, tarrivo, rafaga) {
	this.pid = pid;
	this.tam = tam;
	this.tarrivo = tarrivo;
	this.prio = prio;
	this.rafaga = rafaga;
	this.terminado = false;
	this.irrupcion = 0;
}

Proceso.prototype.tratarProceso = function() {
	this.rafaga[0] -= 1;
	if (this.rafaga[0] == 0) {
		this.rafaga.splice(0, 1);
		return true;
	}
	return false;
}

Proceso.prototype.getRafCpu = function() {
	return this.rafaga[0];
}

Proceso.prototype.isFinished = function() {
	return (this.rafaga.length == 0 ? true : false);
}

Proceso.prototype.calcTiempoRetorno = function(tiempoSalida) {
	return tiempoSalida - this.tarrivo;
}

Proceso.prototype.calcTiempoEspera = function(tiempoRetorno) {
	return tiempoRetorno - this.irrupcion;
}