var io = require('socket.io')(8080);

//Buscar paquetes en npm
var p2pserver = require('socket.io-p2p-server').Server;
io.use(p2pserver)


Player = require("./Player").Player;
var util = require("util");
var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
};


var yasta = false;

function onSocketConnection(client) {
    //Me llega que se ha conectao alguien
    util.log("New player has connected: "+client.id);


    if(players.length > 1){
        //TODO: Hacer algo con más de dos jugadores
        util.log("YA HAY DOS");
        this.emit("fuera del multiplayer", client.id);
        return;

    }

    //Creo el jugador correspondiente
    //-player1 si es el primero en entrar
    //-player2 si es el segundo
    if(players.length > 0){
        this.emit("new player2", client.id);
    }
    else{
        this.emit("new player", client.id);
    }
    //Añado el id_client al array
    players.push(client.id);

    //TODO -- EMITIR EL YASTA CUANDO LOS DOS JUGADORES HAYAN ENVIADO SU NOMBRE

    //si se ha conectado el segundo jugador se llama al método que inicia todo
    if (players.length == 2){
        if(!yasta){
            yasta = true;
            //this.emit("ya estamos todos");
        }
    }
    else if(players.length > 2){
        players.pop();
        client.disconnect();
    }
    else{
        yasta = false;
    }
    
    client.on("disconnect", onClientDisconnect);
    client.on("posicion pelota", onPosicionPelota);
    client.on("posicion jugador1", onPosicionJugador1);
    client.on("actualiza_marcador", onActualizaMarcador);
    client.on("move player", onMovePlayer);
    client.on("player_ready", onPlayerReady);
    client.on("teclas", onTeclas);
    client.on("enfadao2", onEnfadao2);
    client.on("hacegorrino2", onHacegorrino2);
    client.on("teclaspika", onTeclaspika);
    client.on("punto", onPunto);
    client.on("game_over", onGameOver);


    //TODO -- Estos dos no hacen falta??
    client.on("new player", onNewPlayer);
    client.on("tururu", onTururu);

};

//Desconexión
function onClientDisconnect() {
    util.log("Player has disconnected: "+this.id);
    util.log(players);
    players.splice(players.indexOf(this.id), 1);
    players_ready.pop();
    util.log(players);
    util.log(players_ready);
    io.emit("disconnect");
};

//propaga el movimiento
function onMovePlayer(data) {
    io.emit("samovio", data);
};

//propaga el movimiento
function onTeclas(data) {
    io.emit("recibeteclas", data);
};

//propaga el enfadao
function onEnfadao2(data) {
    io.emit("enfadao2", data);
};

//propaga el gorrino2
function onHacegorrino2(data) {
    io.emit("hacegorrino2", data);
};

//propaga el teclaspika
function onTeclaspika(data) {
    io.emit("teclaspika", data);
};

//propaga el teclaspika
function onPunto(data) {
    io.emit("punto", data);
};

//Propaga la pelota
//TODO -- revisar p2p!!!
function onPosicionPelota(data) {
    io.emit("situapelota", data);
};

//Propaga la pelota
//TODO -- revisar p2p!!!
function onActualizaMarcador(data) {
    io.emit("actualiza_marcador", data);
};

//TODO -- revisar p2p!!!
function onPosicionJugador1(data) {
    io.emit("situajugador1", data);
};


function onPlayerReady(data) {

    players_ready.push(data.nombre);

    util.log(players_ready);
    util.log(players_ready.length);

    //si se ha conectado el segundo jugador se llama al método que inicia todo
    if(players_ready.length == 2){
        io.emit("ya estamos todos", players_ready);
    }
    
};


function onGameOver(data) {

    io.emit("goGameOver", data);
    
};



//ELIMINAR ESTOS DOS????
function onNewPlayer(data) {
    util.log("pasas por aqui?");
};

function onTururu(data) {
    io.emit("tururaki", data);
};




function init() {
    players = [];
    players_ready = [];
    io.set("transports", ["websocket"]);
    setEventHandlers();
};

init();