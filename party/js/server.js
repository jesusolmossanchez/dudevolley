var io = require('socket.io')(8081);
var util = require("util");


var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
};


function onSocketConnection(client) {
	
    client.on("prepara_party", onPreparaParty);
    client.on("new_controller", onNewController);
    client.on("accion_pulsado", onAccionPulsado);
    client.on("accion_suelto", onAccionSuelto);
    client.on("teclas", onTeclas);
}

//Desconexión
function onClientDisconnect() {
    //TODO -- quitar del array de conexiones (tiene parametros? como saco la room?)
}

//Prepara partida
function onPreparaParty(room) {
    console.log("Creo partida privada en la room: ", room);
    var mi_room = room;
	this.join(mi_room);
	this.room = mi_room;
}

//Entra un mando
function onNewController(data) {
	console.log("nuevo controlador: ",data);
    var mi_room = data.id_room;
    this.join(mi_room);
    this.room = mi_room;

    jugador = {};
    jugador.id = this.id;
    jugador.nombre = data.nombre;

    players[mi_room] = [];

    players[mi_room].push(jugador);


    //TODO - Ver si ya hay dos y hacer otra cosa...
    io.to(mi_room).emit("new_player", jugador);
}

//propaga la pulsacion
function onAccionPulsado(data) {
    mi_room = data.room;
    io.to(mi_room).emit("accion_pulsado", data.id);
}

//propaga la pulsacion
function onAccionSuelto(data) {
    mi_room = data.room;
    io.to(mi_room).emit("accion_suelto", data.id);
}


//propaga el movimiento
function onTeclas(data) {
    mi_room = data.room;
    io.to(mi_room).emit("recibeteclas", data);
}



function init() {
    players = [];
    io.set("transports", ["websocket"]);
    setEventHandlers();
}

init();
