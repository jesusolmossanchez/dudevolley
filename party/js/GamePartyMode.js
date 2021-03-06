
DudeVolley.GamePartyMode = function (game) {

};

DudeVolley.GamePartyMode.prototype = {

    init: function () {

        ga('send', 'pageview', '/GamePartyMode');

        //alias para el objeto del juego
        eljuego = this;
        primeraVez = true;

        /***********************************************************************
        ***********************************************************************
                        START -- MANEJO DE SOCKET
        ***********************************************************************
        ***********************************************************************/

        if (typeof io == "undefined"){
            //alert("sin definir");
            //TODO: no seguir, hacer algo
            location.reload();
        }

        //conecto con socket
        //socket = io.connect("http://188.166.12.42:8081", {port: 8081, transports: ["websocket"]});
        socket = io.connect("http://localhost:8081", {port: 8081, transports: ["websocket"]});

        //llamo a la función que maneja los mensajes recibidos
        setEventHandlers();

        function onSocketConnected() {
            $("#party_overlay").show();

            var id_socket = this.id;

            //$("#soy_el_uno").show();
            eljuego.input.keyboard.removeKey(Phaser.Keyboard.D);
            eljuego.input.keyboard.removeKey(Phaser.Keyboard.R);
            eljuego.input.keyboard.removeKey(Phaser.Keyboard.F);
            eljuego.input.keyboard.removeKey(Phaser.Keyboard.G);
            eljuego.input.keyboard.removeKey(Phaser.Keyboard.Z);
            eljuego.input.keyboard.removeKey(Phaser.Keyboard.L);

            //Prepara una nueva partida party
            socket.emit("prepara_party");
        };

        function onSocketDisconnect() {

            //Maneja desconexión
            eljuego.state.start('GameOver');

        };

        function onNewPlayer(data) {
            //Me viene uno nuevo, lo creo
            if (typeof Player1 === 'undefined'){
                Player1 = new Player(eljuego,'player1', null, data);
                Player1.nombre = "PLAYER 1";
                socket.emit("player_ready", {nombre: Player1.nombre, id: Player1.id});   
            }
            else{
                Player2 = new Player(eljuego,'cpu', null, data);
                Player2.nombre = "PLAYER 1";
                socket.emit("player_ready", {nombre: Player2.nombre, id: Player2.id});   
            }

        };


        function onYaestaPlayer(data) {
            
            $("#party_overlay").hide();
            //Puedo empezar... empiezo
            eljuego.empieza("uno");

        };

        function onSaMovio(data) {
            if (data.id === Player1.id){
                //el otro se mueve y lo muevo
                if (data.dir == "derecha"){
                    Player1.mueve("derecha");
                }
                if (data.dir == "izquierda"){
                    Player1.mueve("izquierda");
                }
                if (data.dir == "arriba"){
                    Player1.mueve("arriba");   
                }
                if (data.dir == "parao"){
                    Player1.mueve("parao");
                }
            }
            else{
                if (data.dir == "derecha"){
                    Player2.mueve("derecha");
                }
                if (data.dir == "izquierda"){
                    Player2.mueve("izquierda");
                }
                if (data.dir == "arriba"){
                    Player2.mueve("arriba");   
                }
                if (data.dir == "parao"){
                    Player2.mueve("parao");
                }
            }
        };


        function onTeclas(data) {
            if (data.id === Player1.id){
                if (data.R == "1"){
                    Player1.mueve("derecha");
                }
                if (data.L == "1"){
                    Player1.mueve("izquierda");
                }
                if (data.U == "1"){
                    Player1.mueve("arriba");   
                }
                if (data.P == "1"){
                    Player1.mueve("parao");
                }
            }
            else{
                if (data.R == "1"){
                    Player2.mueve("derecha");
                }
                if (data.L == "1"){
                    Player2.mueve("izquierda");
                }
                if (data.U == "1"){
                    Player2.mueve("arriba");   
                }
                if (data.P == "1"){
                    Player2.mueve("parao");
                }
                if (data.D == "1"){
                }
            }
        };



        //manejador de eventos
        function setEventHandlers() {
            // Socket connection successful
            socket.on("connect", onSocketConnected);
            // Socket disconnection
            socket.on("disconnect", onSocketDisconnect);
            // New player message received
            socket.on("new player", onNewPlayer);
            // Player move message received
            socket.on("samovio", onSaMovio);
            socket.on("recibeteclas", onTeclas);

            p2p.on("teclaspika", onTeclaspika2);

            // Player removed message received
            socket.on("ya estamos todos", onYaestaPlayer);
        };


        /***********************************************************************
        ***********************************************************************
                        END -- MANEJO DE SOCKET
        ***********************************************************************
        ***********************************************************************/

        
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


         //Inicializo la fisica del juego
        this.physics.startSystem(Phaser.Physics.ARCADE);



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        /***********************************************************************
        ***********************************************************************
                        START -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/

        //fondo
        this.add.sprite(0, 0, 'sky');

        //Suelo
        platforms = this.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, this.world.height - 134, 'ground');
        //  Scale it to fit the width of the this (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);
        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;
        //Red
        var red = platforms.create(390, this.world.height-320, 'red');
        red.body.immovable = true;
        //Sombras
        this.sombra1 = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombraPelota = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra2 = this.add.sprite(this.world.width - 52, this.world.height-200, 'sombra');
        this.sombra1.alpha = 0.5;
        this.sombra2.alpha = 0.5;
        this.sombraPelota.alpha = 0.2;
        //marcadores

        this.nombre1 = this.add.text(16, 10, '', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.nombre2 = this.add.text(this.world.width - 16, 10, '', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.nombre2.anchor.x = 1;

        this.scoreText1 = this.add.text(16, 46, '0', { font: '54px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2 = this.add.text(this.world.width - 16, 46, '0', { font: '54px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2.anchor.x = 1;
        this.game.puntosPlayer1 = 0;
        this.game.puntosPlayer2 = 0;
        this.scoreText1.text = this.game.puntosPlayer1;
        this.scoreText2.text = this.game.puntosPlayer2;


        this.esperaCollide1 = this.time.now;
        this.esperaCollide2 = this.time.now;

        /***********************************************************************
        ***********************************************************************
                        END -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- COSAS PARA EL MOVIL
        ***********************************************************************
        ***********************************************************************/

        //VELOCIDAD NORMAL
        //this.game.factor_slow_velocity = 0.8;
        //this.game.factor_slow_gravity = 0.64;
        this.game.factor_slow_velocity = 1;
        this.game.factor_slow_gravity = 1;


        /***********************************************************************
        ***********************************************************************
                        END -- COSAS PARA EL MOVIL
        ***********************************************************************
        ***********************************************************************/





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- AUDIO
        ***********************************************************************
        ***********************************************************************/


        //AUDIO
        //this.acho_audio2 =  this.game.add.audio('acho');
        //this.explosion_sound2 =  this.game.add.audio('explosion_sound');
        

        /***********************************************************************
        ***********************************************************************
                        END -- AUDIO
        ***********************************************************************
        ***********************************************************************/



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




        /***********************************************************************
        ***********************************************************************
                        START -- INICIALIZACIÓN DE COSAS IMPORTANTES
        ***********************************************************************
        ***********************************************************************/


        this.sincronizapelotatime = this.time.now + 100;

        this.enunratico = this.time.now;
        this.quienEmpieza = "uno";
        this.punto = false;

        this.dondecae = 0;
        this.cuandocae = 0;

        this.muevederecha = false;
        this.mueveizquierda = false;
        this.muevearriba = false;
        this.mueveabajo = false;

        this.game.hasperdio = false;
        this.game.unplayer = false;
        this.game.multiplayer = true;
        this.game.empieza = this.time.now;

        //control para nivel de dificultad
        //this.game.level = 2;
        this.need_sync = false;

        /***********************************************************************
        ***********************************************************************
                        END -- INICIALIZACIÓN DE COSAS IMPORTANTES
        ***********************************************************************
        ***********************************************************************/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        /***********************************************************************
        ***********************************************************************
                        START -- MANEJO DE PAUSA
        ***********************************************************************
        ***********************************************************************/

        this.enpausa = false;
        window.onkeydown = function() {
            if (this.PAUSE.game.input.keyboard.event.keyCode == 27){
                this.PAUSE.game.paused = !this.PAUSE.game.paused;
            }
        }

        /***********************************************************************
        ***********************************************************************
                        END -- MANEJO DE PAUSA
        ***********************************************************************
        ***********************************************************************/

    },



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///


    update: function () {

        
        /***********************************************************************
        ***********************************************************************
                        START -- FISICAS DE LOS JUGADORES
        ***********************************************************************
        ***********************************************************************/  
        if (typeof Player2 !== 'undefined'){
            if (Player2.sprite.body.y > this.world.height-250){
                Player2.sprite.salta = false;
            }
            this.sombra2.position.set(Player2.sprite.body.position.x, this.world.height - 144);
            if (typeof this.pelota !== 'undefined' && this.time.now > this.esperaCollide2){
                this.physics.arcade.collide(this.pelota, Player2.sprite, this.pika_OTRO, null, this);
            }
            this.physics.arcade.collide(Player2.sprite, platforms);
        }


        if (typeof Player1 !== 'undefined'){
            if (Player1.sprite.body.y > this.world.height-250){
                Player1.sprite.salta = false;
            }
            this.sombra1.position.set(Player1.sprite.body.position.x, this.world.height - 144);
            if (typeof this.pelota !== 'undefined' && this.time.now > this.esperaCollide1){
                this.physics.arcade.collide(this.pelota, Player1.sprite, this.pika, null, this);
            }
            this.physics.arcade.collide(Player1.sprite, platforms);
        }
        /***********************************************************************
        ***********************************************************************
                        END -- FISICAS DE LOS JUGADORES
        ***********************************************************************
        ***********************************************************************/

        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        /***********************************************************************
        ***********************************************************************
                        START -- FISICA DE LA PELOTA
        ***********************************************************************
        ***********************************************************************/
        if (typeof this.pelota !== 'undefined'){
            this.sombraPelota.position.set(this.pelota.body.position.x, this.world.height - 144);
            this.pelota.angle += this.pelota.body.velocity.x/20;
            this.physics.arcade.collide(this.pelota, platforms);
        }
        /***********************************************************************
        ***********************************************************************
                        END -- FISICA DE LA PELOTA
        ***********************************************************************
        ***********************************************************************/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- MOVIMIENTOS JUGADORES
        ***********************************************************************
        ***********************************************************************/                      

        if (this.punto){
            if(this.time.now > this.enunratico){
                this.punto = false;
                this.explota.kill();
                this.empieza(this.quienEmpieza);
            }
        }
        else{
            if (typeof Player2 !== 'undefined'){
                if(this.time.now > (Player2.sprite.tiempoGorrino - 100)){
                    Player2.sprite.body.rotation = 0;
                    Player2.sprite.haceGorrino = false;
                }

                if(this.time.now > (Player2.sprite.tiempoGorrino+100)){
                    Player2.sprite.paraGorrino = false;
                }
            }

            if (typeof Player1 !== 'undefined'){
                if(this.time.now > (Player1.sprite.tiempoGorrino - 100)){
                    Player1.sprite.body.rotation = 0;
                    Player1.sprite.haceGorrino = false;
                }

                if(this.time.now > (Player1.sprite.tiempoGorrino+100)){
                    Player1.sprite.paraGorrino = false;
                }

            }


            //LA PELOTA TOCA EL SUELO
            if(typeof this.pelota !== 'undefined' && this.pelota.body.position.y > 500 ){
                this.procesapunto();
            }

        }

        /***********************************************************************
        ***********************************************************************
                        END -- MOVIMIENTOS JUGADORES
        ***********************************************************************
        ***********************************************************************/  

        
    },

    quitGame: function (pointer) {

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    procesapunto: function () {

        this.explota = this.add.sprite(this.pelota.body.position.x, this.pelota.body.position.y+5, 'explota');
        this.punto = true;

        //Relentizo todo...
        Player1.sprite.body.velocity.y = Player1.sprite.body.velocity.y * 0.2;
        Player2.sprite.body.velocity.y = Player2.sprite.body.velocity.y * 0.2;
        Player1.sprite.body.velocity.x = Player1.sprite.body.velocity.x * 0.2;
        Player2.sprite.body.velocity.x = Player2.sprite.body.velocity.x * 0.2;
        this.pelota.body.velocity.y = this.pelota.body.velocity.y * 0.2;
        this.pelota.body.velocity.x = this.pelota.body.velocity.x * 0.2;
        this.pelota.body.gravity.y = 200;

        if(this.pelota.body.position.x > 390){
            this.game.puntosPlayer1++;
            this.scoreText1.text = this.game.puntosPlayer1;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "uno";
            
            if (this.game.puntosPlayer1 >= 15){
                socket.emit("game_over", {ganador: Player1.nombre, ganador_id: Player1.id, perdedor: Player2.nombre, perdedor_id: Player2.id, room: window.te_reto});
            }
        }
        else{
            this.game.puntosPlayer2++;
            this.scoreText2.text = this.game.puntosPlayer2;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "dos";
            
            if (this.game.puntosPlayer2 >= 15){
                //socket.emit("game_over", {ganador: Player2.nombre, ganador_id: Player2.id, perdedor: Player1.nombre, perdedor_id: Player1.id, room: window.te_reto});
            }
        }


        try { 
            //p2p.emit("actualiza_marcador", {puntos1: this.game.puntosPlayer1, puntos2: this.game.puntosPlayer2, room: window.te_reto});
            //p2p.emit("punto",{x:this.pelota.body.position.x, y:this.pelota.body.position.y, room: window.te_reto});
        }
        catch (e) {
          console.log("mierror",e); 
        }
        
    },


    /***********************************************************************
    ***********************************************************************
                    START -- COLISION JUGADOR1-PELOTA
    ***********************************************************************
    ***********************************************************************/

    pika: function () {

        if (typeof this.pelota !== 'undefined'){
            if (this.punto){
                return true;
            }

            this.esperaCollide1 = this.time.now + 100;

            this.pelota.body.gravity.y = 900*this.game.factor_slow_gravity;
            this.pelota.body.velocity.y = -600*this.game.factor_slow_velocity;

            pos_pelota = this.pelota.body.position.x;
            pos_player = Player1.sprite.body.position.x;
            diferencia = pos_pelota - pos_player;
            v_x_pelota = this.pelota.body.velocity.x;
            v_y_pelota = this.pelota.body.velocity.y;
            this.pelota.body.velocity.x = diferencia*3;

            if (this.time.now < Player1.sprite.enfadaoTime && Player1.sprite.enfadao){
                //this.acho_audio2.play("",0,0.3);

                if ((cursors.right.isDown || cursors.left.isDown || this.mueveizquierda || this.muevederecha || !this.game.device.desktop) 
                    && (!cursors.up.isDown && !this.muevearriba)  && (!cursors.down.isDown && !this.mueveabajo))
                {
                    this.pelota.body.velocity.y = v_y_pelota*0.3*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 800*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1500*this.game.factor_slow_gravity;
                }
                else if((cursors.right.isDown || this.muevederecha)  && (cursors.up.isDown || this.muevearriba) 
                    && (!cursors.down.isDown && !this.mueveabajo)){
                    this.pelota.body.velocity.y = -700*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 800*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if((cursors.left.isDown || this.mueveizquierda) && (cursors.up.isDown || this.muevearriba) 
                    && (!cursors.down.isDown && !this.mueveabajo)){
                    this.pelota.body.velocity.y = -700*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -800*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if((cursors.right.isDown || cursors.left.isDown || this.mueveizquierda || this.muevederecha) 
                    && (!cursors.up.isDown && !this.muevearriba) && (cursors.down.isDown || this.mueveabajo)){
                    this.pelota.body.velocity.y = 800*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 1000*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if((!cursors.right.isDown && !this.muevederecha) && (!cursors.left.isDown && !this.mueveizquierda) 
                    && (!cursors.up.isDown && !this.muevearriba) && (cursors.down.isDown || this.mueveabajo)){
                    this.pelota.body.velocity.y = 800*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 300*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if((!cursors.right.isDown && !this.muevederecha) && (!cursors.left.isDown && !this.muevearriba)
                    && (!cursors.up.isDown && !this.muevearriba) && (!cursors.down.isDown && !this.mueveabajo)){
                    this.pelota.body.velocity.y = -100*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 300*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if((!cursors.right.isDown && !this.muevederecha) && (!cursors.left.isDown && !this.mueveizquierda) 
                    && (cursors.up.isDown || this.muevearriba) && (!cursors.down.isDown && !this.mueveabajo)){
                    this.pelota.body.velocity.y = -1000*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 300*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
            }
        }
    },


    /***********************************************************************
    ***********************************************************************
                    END -- COLISION JUGADOR1-PELOTA
    ***********************************************************************
    ***********************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    /***********************************************************************
    ***********************************************************************
                    START -- COLISION OTROJUGADOR-PELOTA
    ***********************************************************************
    ***********************************************************************/

    pika_OTRO: function () {

        this.need_sync = true;

        if (typeof this.pelota !== 'undefined'){
            if (this.punto){
                return true;
            }

            this.esperaCollide2 = this.time.now + 100;
            
            this.pelota.body.gravity.y = 900*this.game.factor_slow_gravity;
            this.pelota.body.velocity.y = -600*this.game.factor_slow_velocity;
            pos_pelota = this.pelota.body.position.x;
            pos_player = Player2.sprite.body.position.x;
            diferencia = pos_pelota - pos_player;
            v_x_pelota = this.pelota.body.velocity.x;
            v_y_pelota = this.pelota.body.velocity.y;
            this.pelota.body.velocity.x = diferencia*3;

            if (this.time.now < Player2.sprite.enfadaoTime && Player2.sprite.enfadao){
                //this.acho_audio2.play("",0,0.3);
                
                if (quehaceel2 == 4 || quehaceel2 == 6){
                    this.pelota.body.velocity.y = v_y_pelota*0.3*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -800*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1500*this.game.factor_slow_gravity;
                }
                else if(quehaceel2 == 9){
                    this.pelota.body.velocity.y = -700*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = 800*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if(quehaceel2 == 7){
                    this.pelota.body.velocity.y = -700*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -800*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if(quehaceel2 == 1 || quehaceel2 == 3){
                    this.pelota.body.velocity.y = 800*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -1000*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if(quehaceel2 == 2){
                    this.pelota.body.velocity.y = 800*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -300*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if(quehaceel2 == 5){
                    this.pelota.body.velocity.y = -100*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -300*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
                else if(quehaceel2 == 8){
                    this.pelota.body.velocity.y = -1000*this.game.factor_slow_velocity;
                    this.pelota.body.velocity.x = -300*this.game.factor_slow_velocity;
                    this.pelota.body.gravity.y = 1400*this.game.factor_slow_gravity;
                }
            }
            //socket.emit("posicion pelota", {x: this.pelota.x, y: this.pelota.y, vx: this.pelota.body.velocity.x, vy:this.pelota.body.velocity.y});
            
        }
    },

    /***********************************************************************
    ***********************************************************************
                    END -- COLISION OTROJUGADOR-PELOTA
    ***********************************************************************
    ***********************************************************************/


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    empieza: function (quien) {


        if (primeraVez){

            //Creo la pelota
            this.pelota = this.add.sprite(32, 0, 'pelota');
            this.pelota.anchor.setTo(0.5, 0.5);

            //Para el usuario que entró primero(master), se crean las físicas de la pelota
            //Para el otro usuario no se crean, de esa forma, solo se moverá la pelota cuando se lo diga el evento 
            if (Player1.soyplayer1){
                this.physics.arcade.enable(this.pelota);
                this.pelota.body.gravity.y = 0;
                this.pelota.body.bounce.y = 0.9;
                this.pelota.body.bounce.x = 0.900;
                this.pelota.body.gravity.y = 900*this.game.factor_slow_gravity;
                this.pelota.body.collideWorldBounds = true;
                
                this.pelota.body.mass= 0.15;
            }
            primeraVez = false;

        }

        else{
            if (Player1.soyplayer1){
                this.dondecae = this.world.width-1;
                this.pelota.body.gravity.y = 900;
                if (quien == "uno"){
                    this.pelota.body.position.x = 32;
                }
                else{
                    this.pelota.body.position.x = this.world.width - 32;
                }

                this.pelota.body.position.y = 0;
                this.pelota.body.velocity.x = 0;

                Player1.sprite.body.position.x = 32;
                Player1.sprite.body.position.y = this.world.height - 250;
                Player1.sprite.body.velocity.x = 0;
                Player1.sprite.body.velocity.y = 0;

                Player2.sprite.body.position.x = this.world.width - 32;
                Player2.sprite.body.position.y = this.world.height - 250;
                Player2.sprite.body.velocity.x = 0;
                Player2.sprite.body.velocity.y = 0;
            }
            else{
                Player2.sprite.body.position.x = 32;
                Player2.sprite.body.position.y = this.world.height - 250;
                Player2.sprite.body.velocity.x = 0;
                Player2.sprite.body.velocity.y = 0;

                Player1.sprite.body.position.x = this.world.width - 32;
                Player1.sprite.body.position.y = this.world.height - 250;
                Player1.sprite.body.velocity.x = 0;
                Player1.sprite.body.velocity.y = 0;
            }
            

        } 
    }
};
