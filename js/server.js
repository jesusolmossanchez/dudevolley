//var io = require('socket.io')(8080);
var util = require("util");

var https = require('https'),
    fs =    require('fs');

var options = {
    key:    fs.readFileSync('/var/www/html/dude_volley_refactor/dudevolley/dudevolley_key.key'),
    cert:   fs.readFileSync('/var/www/html/dude_volley_refactor/dudevolley/dudevolley_cert.crt'),
    ca:     fs.readFileSync('/var/www/html/dude_volley_refactor/dudevolley/dudevolley_bundle.crt')
};
var app = https.createServer(options);
io = require('socket.io').listen(app);     //socket.io server listens to https connections
app.listen(8080, "0.0.0.0");


//Buscar paquetes en npm
var p2pserver = require('socket.io-p2p-server').Server;
//io.use(p2pserver)


Player = require("./Player").Player;
//var util = require("util");
var setEventHandlers = function() {
    io.sockets.on("connection", onSocketConnection);
};


var yasta = false;

var rooms = [];
var room_llena = true;
var rooms_players = [];
var room_disponible = "";

function onSocketConnection(client) {
    //Me llega que se ha conectao alguien
    util.log("New player has connected: "+client.id);
    
    client.on("disconnect", onClientDisconnect);
    client.on("posicion pelota", onPosicionPelota);
    client.on("posicion jugador1", onPosicionJugador1);
    client.on("actualiza_marcador", onActualizaMarcador);
    client.on("move player", onMovePlayer);
    client.on("player_ready", onPlayerReady);


    client.on("player_ready_privada", onPlayerReadyPrivada);

    client.on("prepara_privada", onPreparaPrivada);
    client.on("prepara_publica", onPreparaPublica);

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
    util.log("Player has disconnected: "+this.id+" de la room: "+this.room);
    /*
    util.log(players);
    players.splice(players.indexOf(this.id), 1);
    players_ready.pop();
    util.log(players);
    util.log(players_ready);
    */
    //this.leave(this.room);
    util.log("antes");
    util.log(players_ready);
    util.log(rooms_players);
    players_ready.splice(players_ready.indexOf(this.id), 1);
    rooms_players.splice(players_ready.indexOf(this.id), 1);
    io.to(this.room).emit("disconnect");
    util.log("despues");
    util.log(players_ready);
    util.log(rooms_players)
};

//propaga el movimiento
function onMovePlayer(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("samovio", data);
};

//propaga el movimiento
function onTeclas(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("recibeteclas", data);
};

//propaga el enfadao
function onEnfadao2(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("enfadao2", data);
};

//propaga el gorrino2
function onHacegorrino2(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("hacegorrino2", data);
};

//propaga el teclaspika
function onTeclaspika(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("teclaspika", data);
};

//propaga el teclaspika
function onPunto(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("punto", data);
};

//Propaga la pelota
//TODO -- revisar p2p!!!
function onPosicionPelota(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("situapelota", data);
};

//Propaga la pelota
//TODO -- revisar p2p!!!
function onActualizaMarcador(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("actualiza_marcador", data);
};

//TODO -- revisar p2p!!!
function onPosicionJugador1(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("situajugador1", data);
};


function onPreparaPrivada(data) {
    
    var mi_room = data.id_room;
    players_ready_p[mi_room] = [];
    players_ready_p[mi_room].push(data.nombre);
    this.join(mi_room);
    this.room = mi_room;
    p2pserver(this, null, mi_room);
    util.log(data.nombre+" conectado a la room privada: "+this.room)
    
};


function onPreparaPublica() {
    

    var client = this;

    if(room_llena){
        room_llena = false;
        room_disponible = generateSerial(8);
        rooms.push(room_disponible);
    }




    client.join(room_disponible);
    client.room = room_disponible;
    //console.log(rooms_players.length )

    //util.log("conectado a : "+client.room);

    p2pserver(client, null, room_disponible);   

    console.log(room_disponible);

    console.log("cuantos...",rooms_players.length)
        
    if(rooms_players.length > 0){
        console.log("player2!!");
        io.to(room_disponible).emit("new player2", client.id);
        //io.to(room_disponible).emit("ya estamos todos", players_ready);
    }
    else{
        io.to(room_disponible).emit("new player", client.id);
    }

    //Añado el id_client al array
    //players.push(client.id);
    rooms_players.push(client.id);

    //TODO -- EMITIR EL YASTA CUANDO LOS DOS JUGADORES HAYAN ENVIADO SU NOMBRE

    //si se ha conectado el segundo jugador se llama al método que inicia todo
    if (rooms_players.length == 2){
            rooms_players = [];
            room_llena = true;
            //this.emit("ya estamos todos");
        
    }
    
};


function onPlayerReadyPrivada(data) {
    var mi_room = data.privada;
    this.join(data.privada);
    p2pserver(this, null, mi_room);   
    players_ready_p[mi_room].push(data.nombre);
    io.to(data.privada).emit("ya estamos todos", players_ready_p[mi_room]);
};


function onPlayerReady(data) {
    
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }

    players_ready.push(data.nombre);

    //util.log(players_ready);
    //util.log(players_ready.length);

    //si se ha conectado el segundo jugador se llama al método que inicia todo
    //console.log(room_llena);
    if(players_ready.length == 2){
        io.to(mi_room).emit("ya estamos todos", players_ready);
        players_ready = [];
    }
    
};


function onGameOver(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("goGameOver", data);
    
};



//ELIMINAR ESTOS DOS????
function onNewPlayer(data) {
    //util.log("pasas por aqui?");
};

function onTururu(data) {
    var mi_room = this.client.nsps["/"].room;
    if (typeof mi_room == 'undefined'){
        mi_room = data.room;
    }
    io.to(mi_room).emit("tururaki", data);
};

function generateSerial(len) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 10;
    var randomstring = '';

    for (var x=0;x<string_length;x++) {

        var letterOrNumber = Math.floor(Math.random() * 2);
        if (letterOrNumber == 0) {
            var newNum = Math.floor(Math.random() * 9);
            randomstring += newNum;
        } else {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }

    }
    return (randomstring);
}


function init() {
    players = [];
    players_ready = [];
    players_ready_p = [];
    io.set("transports", ["websocket"]);
    setEventHandlers();
};

init();
