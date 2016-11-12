
DudeVolley.GameMultiplayer = function (game) {

};

DudeVolley.GameMultiplayer.prototype = {

    init: function () {

        ga('send', 'pageview', '/GameMultiplayer');

        //alias para el objeto del juego
        eljuego = this;
        primeraVez = true;

        /***********************************************************************
        ***********************************************************************
                        START -- MANEJO DE SOCKET
        ***********************************************************************
        ***********************************************************************/

        if (typeof io == "undefined"){
            alert("sin definir");
            //TODO: no seguir, hacer algo
            location.reload();
        }

        //conecto con socket
        //socket = io.connect("http://192.168.0.194:8080", {port: 8080, transports: ["websocket"]});
        socket = io.connect("http://188.166.12.42:8080", {port: 8080, transports: ["websocket"]});
        p2p = new P2P(socket);


        p2p.on('ready', function(){
            p2p.usePeerConnection = true;
            console.log(p2p);            
            try { 
                p2p.emit('peer-obj', { peerId: peerId });
            }
            catch (e) {
                console.log("mierror",e); 
            }

        })


        //llamo a la función que maneja los mensajes recibidos
        setEventHandlers();

        function onSocketConnected() {
            //console.log("Me conecto");
        };

        function onSocketDisconnect() {
            eljuego.game.desconectado = true;
            
            eljuego.game.hasperdio = false;
            eljuego.game.perdedor = Player1.sprite;
            eljuego.game.ganador = OTROPLAYER.sprite;
            eljuego.game.nombre_ganador = OTROPLAYER.nombre;


            eljuego.state.start('GameOver');

        };

        function onNewPlayer(data) {
            //Me viene uno nuevo, lo creo
            //console.log("New player connected: "+data);
            if (typeof Player1 === 'undefined'){
                Player1 = new Player(eljuego, 'player1', null, data);

                //TODO -- EN LA CREACIÓN MOSTRAR UNA CAPA ENCIMA DEL CAVAS
                //EN ESA CAPA SE PEDIRÁ UN NOMBRE Y HABRÁ UN ENLACE PARA 'RETAR A UN AMIGO'
                //UNA VEZ ENVIADO SE DEBE EMITIR ALGO COMO:
                $("#socket_overlay").show();
                $("#socket_nombre").focus();
                //$("#soy_el_uno").show();
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.D);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.R);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.F);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.G);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.Z);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.L);
                $("#socket_empezar").click(function(){
                    ARRIBA = eljuego.input.keyboard.addKey(Phaser.Keyboard.R);
                    ABAJO = eljuego.input.keyboard.addKey(Phaser.Keyboard.F);
                    IZQUIERDA = eljuego.input.keyboard.addKey(Phaser.Keyboard.D);
                    DERECHA = eljuego.input.keyboard.addKey(Phaser.Keyboard.G);
                    SUPERPIKA = eljuego.input.keyboard.addKey(Phaser.Keyboard.L);
                    SUPERPIKA2 = eljuego.input.keyboard.addKey(Phaser.Keyboard.Z);
                    Player1.nombre = $("#socket_nombre").val();
                    socket.emit("player_ready", {nombre: Player1.nombre, id: Player1.id});
                    $("#volley_label").hide();
                    $("#botonera_socket").hide();
                    $("#reta_a_un_colega").show();
                    $(document).off('keyup');
                });

                $(document).on('keyup',function(e) {
                    if(e.which == 13) {
                        ARRIBA = eljuego.input.keyboard.addKey(Phaser.Keyboard.R);
                        ABAJO = eljuego.input.keyboard.addKey(Phaser.Keyboard.F);
                        IZQUIERDA = eljuego.input.keyboard.addKey(Phaser.Keyboard.D);
                        DERECHA = eljuego.input.keyboard.addKey(Phaser.Keyboard.G);
                        SUPERPIKA = eljuego.input.keyboard.addKey(Phaser.Keyboard.L);
                        SUPERPIKA2 = eljuego.input.keyboard.addKey(Phaser.Keyboard.Z);
                        Player1.nombre = $("#socket_nombre").val();
                        socket.emit("player_ready", {nombre: Player1.nombre, id: Player1.id});
                        $("#volley_label").hide();
                        $("#botonera_socket").hide();
                        $("#reta_a_un_colega").show();
                        $(document).off('keyup');
                    }
                });

                $("#reta_a_un_colega_button").click(function(){
                    $("#reta_a_un_colega_button").hide();
                    $("#juega_con_quien_sea").hide();
                    $("#pasa_el_enlace").show();
                    $("#esperando_oponente").show();
                });

                $("#juega_con_quien_sea").click(function(){
                    $("#reta_a_un_colega_button").hide();
                    $("#juega_con_quien_sea").hide();
                    $("#esperando_oponente").show();
                });


            }
            //ELEMINAR?? NO HARÍA FALTA, NO? NUNCA ENTRA AQUI?
            else{
                OTROPLAYER = new Player('player1', eljuego, data);
                
            }

        };

        function onNewPlayer2(data) {
            //Me viene uno nuevo, lo creo
            //console.log("New player2 connected: "+data);

            //Si es el segundo jugador que ha entrado en el juego, no tiene definido Player 1, así que lo creo
            //En la posición derecha de la pantalla 
            if (typeof Player1 === 'undefined'){
                Player1 = new Player(eljuego,'cpu', null, data);

                $("#socket_overlay").show();
                $("#socket_nombre").focus();
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.D);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.R);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.F);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.G);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.Z);
                eljuego.input.keyboard.removeKey(Phaser.Keyboard.L);
                $("#socket_empezar").click(function(){
                    ARRIBA = eljuego.input.keyboard.addKey(Phaser.Keyboard.R);
                    ABAJO = eljuego.input.keyboard.addKey(Phaser.Keyboard.F);
                    IZQUIERDA = eljuego.input.keyboard.addKey(Phaser.Keyboard.D);
                    DERECHA = eljuego.input.keyboard.addKey(Phaser.Keyboard.G);
                    SUPERPIKA = eljuego.input.keyboard.addKey(Phaser.Keyboard.L);
                    SUPERPIKA2 = eljuego.input.keyboard.addKey(Phaser.Keyboard.Z);
                    Player1.nombre = $("#socket_nombre").val();
                    socket.emit("player_ready", {nombre: Player1.nombre, id: Player1.id});
                    $(document).off('keyup');
                });
                $(document).on('keyup',function(e) {
                    console.log("pulso")
                    if(e.which == 13) {
                        ARRIBA = eljuego.input.keyboard.addKey(Phaser.Keyboard.R);
                        ABAJO = eljuego.input.keyboard.addKey(Phaser.Keyboard.F);
                        IZQUIERDA = eljuego.input.keyboard.addKey(Phaser.Keyboard.D);
                        DERECHA = eljuego.input.keyboard.addKey(Phaser.Keyboard.G);
                        SUPERPIKA = eljuego.input.keyboard.addKey(Phaser.Keyboard.L);
                        SUPERPIKA2 = eljuego.input.keyboard.addKey(Phaser.Keyboard.Z);
                        Player1.nombre = $("#socket_nombre").val();
                        socket.emit("player_ready", {nombre: Player1.nombre, id: Player1.id});
                        $(document).off('keyup');
                    }
                });

            }
            
            //Creo el OTROPLAYER en el lugar correspondiente
            if (data.id !== Player1.id && typeof OTROPLAYER === 'undefined'){
                if (Player1.soyplayer1 == false){
                    ruta = "player1";
                }
                else{
                    ruta = 'cpu';
                }
                OTROPLAYER = new Player(eljuego, ruta, null, data);
            }
            
        };

        function onYaestaPlayer(data) {

            eljuego.nombre1.text = data[0];
            Player1.nombre = data[0];
            eljuego.nombre2.text = data[1];
            OTROPLAYER.nombre = data[0];
            $("#socket_overlay").hide();

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
                    OTROPLAYER.mueve("derecha");
                }
                if (data.dir == "izquierda"){
                    OTROPLAYER.mueve("izquierda");
                }
                if (data.dir == "arriba"){
                    OTROPLAYER.mueve("arriba");   
                }
                if (data.dir == "parao"){
                    OTROPLAYER.mueve("parao");
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
                    OTROPLAYER.mueve("derecha");
                }
                if (data.L == "1"){
                    OTROPLAYER.mueve("izquierda");
                }
                if (data.U == "1"){
                    OTROPLAYER.mueve("arriba");   
                }
                if (data.P == "1"){
                    OTROPLAYER.mueve("parao");
                }
                if (data.D == "1"){
                }
            }
        };


        function onSituaPelota(data) {
            if (!Player1.soyplayer1){
                eljuego.pelota.angle = data.angulo;
                
                //if ((eljuego.pelota.x > data.x + 30) || (eljuego.pelota.x < data.x - 30)){
                    eljuego.pelota.x = data.x;
               // }
                //if ((eljuego.pelota.y > data.y + 30) || (eljuego.pelota.y < data.y - 30)){
                    eljuego.pelota.y = data.y;
                //}

               
                
                //tween = eljuego.add.tween(eljuego.pelota).to( { x: [ eljuego.pelota.x, data.x ], y: [ eljuego.pelota.y, data.y ] }, 5, Phaser.Easing.Linear.None, true);
            }
        };


        function onActualizaMarcador(data) {
            if (!Player1.soyplayer1){
                eljuego.scoreText1.text = data.puntos1;
                eljuego.scoreText2.text = data.puntos2;
                eljuego.game.puntosPlayer1 = data.puntos1;
                eljuego.game.puntosPlayer2 = data.puntos2;
            }
        };

        function onPunto(data) {
            eljuego.procesapunto_sync(data.x, data.y+5);
        };

        function onSituajugador1(data) {

            if (!Player1.soyplayer1){
                if ((OTROPLAYER.sprite.x > data.P1x+40) || (OTROPLAYER.sprite.x < data.P1x-40)){
                    OTROPLAYER.sprite.x = data.P1x;
                    tween = eljuego.add.tween(OTROPLAYER.sprite).to( { x: [ OTROPLAYER.sprite.x, data.P1x ] }, 2, Phaser.Easing.Linear.None, true);
                }    
                if ((Player1.sprite.x > data.P2x+40) || (Player1.sprite.x < data.P2x-40)){
                    Player1.sprite.x = data.P2x;
                    tween2 = eljuego.add.tween(Player1.sprite).to( { x: [ Player1.sprite.x, data.P2x ] }, 2, Phaser.Easing.Linear.None, true);
                } 
                /*
                if ((OTROPLAYER.sprite.y > data.P1y+40) || (OTROPLAYER.sprite.y < data.P1y-40)){
                    OTROPLAYER.sprite.y = data.P1y;
                } 
                if ((Player1.sprite.y > data.P2y+40) || (Player1.sprite.y < data.P2y-40)){
                    Player1.sprite.y = data.P2y;
                }  */ 
            }
        };

        function onEnfadao2(data){
            if(Player1.id != data.id){
                OTROPLAYER.sprite.enfadao = true;
                OTROPLAYER.sprite.animations.play('senfada');
                OTROPLAYER.sprite.enfadaoTime = eljuego.time.now + 500;
            }
        }
        function onHacegorrino2(){
            OTROPLAYER.sprite.haceGorrino=true;
            OTROPLAYER.sprite.tiempoGorrino = eljuego.time.now + 400;
        }
        function onTeclaspika2(data){
            if(data.U == 1){
                if(data.L == 1){
                    quehaceel2 = 7;
                }
                else if(data.R == 1){
                    quehaceel2 = 9;
                }
                else{
                    quehaceel2 = 8;
                }
            }
            else if(data.D == 1){
                if(data.L == 1){
                    quehaceel2 = 1;
                }
                else if(data.R == 1){
                    quehaceel2 = 2;
                }
                else{
                    quehaceel2 = 3;
                }
            }
            else{
                if(data.L == 1){
                    quehaceel2 = 4;
                }
                else if(data.R == 1){
                    quehaceel2 = 6;
                }
                else{
                    quehaceel2 = 5;
                }
            }
        }

        function onGoGameOver(data){
            if (data.ganador_id == Player1.id){
                eljuego.game.hasperdio = true;
                eljuego.game.perdedor = OTROPLAYER.sprite;
                eljuego.game.ganador = Player1.sprite;
                eljuego.game.nombre_ganador = Player1.nombre;
            }
            else{
                eljuego.game.hasperdio = false;
                eljuego.game.perdedor = Player1.sprite;
                eljuego.game.ganador = OTROPLAYER.sprite;
                eljuego.game.nombre_ganador = OTROPLAYER.nombre;
            }
            //p2p.emit("disconnect");
            eljuego.state.start('GameOver');
        }


        function onRemovePlayer(data) {
        };

        function onFueraMultiplayer(data) {
            if (typeof(Player1) === 'undefined'){
                location.reload();
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
            // New player message received
            socket.on("new player2", onNewPlayer2);
            // Player move message received
            socket.on("samovio", onSaMovio);
            socket.on("recibeteclas", onTeclas);
            // Player move message received
            socket.on("situapelota", onSituaPelota);
            socket.on("situajugador1", onSituajugador1);


            //TODO: Hacer esto bien
            socket.on("fuera del multiplayer", onFueraMultiplayer);


            socket.on("goGameOver", onGoGameOver);



            p2p.on("posicion pelota", onSituaPelota);
            p2p.on("posicion jugador1", onSituajugador1);
            p2p.on("actualiza_marcador", onActualizaMarcador);
            p2p.on("punto", onPunto);


            p2p.on("enfadao2", onEnfadao2);
            p2p.on("hacegorrino2", onHacegorrino2);
            p2p.on("teclaspika", onTeclaspika2);





            // Player removed message received
            socket.on("remove player", onRemovePlayer);
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

        //cosas de movil
        if (!this.game.device.desktop){
            //MOVIL
        
            this.joy = new Joystick(this.game, 120, this.world.height - 100);

            //TODO: Pillar el correcto (boton de accion)
            this.movil_accion = this.add.sprite(this.world.width - 100, this.world.height - 100, 'pika');
            this.movil_accion.anchor.setTo(0.5, 0.5);
            this.movil_accion.inputEnabled = true;
            this.movil_accion.input.sprite.events.onInputDown.add(this.entra_movil_accion, this);
            this.movil_accion.input.sprite.events.onInputUp.add(this.sal_movil_accion, this);
        
            //SLOW MOTION!!
            //this.game.factor_slow_velocity = 0.8;
            //this.game.factor_slow_gravity = 0.64;
        }

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



        /***********************************************************************
        ***********************************************************************
                        START -- REGISTRO DE INPUTS
        ***********************************************************************
        ***********************************************************************/
        
        //Inputs
        cursors = this.input.keyboard.createCursorKeys();
        //pikas
        SUPERPIKA = this.input.keyboard.addKey(Phaser.Keyboard.L);
        SUPERPIKA2 = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        PAUSE = this.input.keyboard.addKey(Phaser.Keyboard.ESC);



        quehaceel2 = 0;

        /***********************************************************************
        ***********************************************************************
                        END -- REGISTRO DE INPUTS
        ***********************************************************************
        ***********************************************************************/



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

    entra_movil_accion: function (){
        this.click_accion = true;
    },

    sal_movil_accion: function (){
        this.click_accion = false;
    },

    update: function () {

        
        /***********************************************************************
        ***********************************************************************
                        START -- FISICAS DE LOS JUGADORES
        ***********************************************************************
        ***********************************************************************/  
        if (typeof OTROPLAYER !== 'undefined'){
            if (OTROPLAYER.sprite.body.y > this.world.height-250){
                OTROPLAYER.sprite.salta = false;
            }
            this.sombra2.position.set(OTROPLAYER.sprite.body.position.x, this.world.height - 144);
            if (typeof this.pelota !== 'undefined' && this.time.now > this.esperaCollide2){
                this.physics.arcade.collide(this.pelota, OTROPLAYER.sprite, this.pika_OTRO, null, this);
            }
            this.physics.arcade.collide(OTROPLAYER.sprite, platforms);
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
        if (typeof this.pelota !== 'undefined' && Player1.soyplayer1){
            this.sombraPelota.position.set(this.pelota.body.position.x, this.world.height - 144);
            this.pelota.angle += this.pelota.body.velocity.x/20;
            this.physics.arcade.collide(this.pelota, platforms);
            try { 
                p2p.emit("posicion pelota", {x: this.pelota.x, y: this.pelota.y, angulo: this.pelota.angle});
                if (this.need_sync){
                    this.need_sync = false;
                    p2p.emit("posicion jugador1", {P1x: Player1.sprite.x, P2x: OTROPLAYER.sprite.x, P1y: Player1.sprite.y, P2y: OTROPLAYER.sprite.y});
                }
            }
            catch (e) {
              console.log("mierror",e); 
            }
            if (this.time.now > this.sincronizapelotatime){
                this.sincronizapelotatime = this.time.now + 20;        
            }
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
                this.need_sync = true;
                this.explota.kill();
                this.empieza(this.quienEmpieza);
            }
        }
        else{
            if (typeof OTROPLAYER !== 'undefined'){
                if(this.time.now > (OTROPLAYER.sprite.tiempoGorrino - 100)){
                    OTROPLAYER.sprite.body.rotation = 0;
                    OTROPLAYER.sprite.haceGorrino = false;
                }

                if(this.time.now > (OTROPLAYER.sprite.tiempoGorrino+100)){
                    OTROPLAYER.sprite.paraGorrino = false;
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

                //MOVIMIENTOS PLAYER1
                if(SUPERPIKA.isDown || this.click_accion || SUPERPIKA2.isDown){
                    if (!Player1.sprite.body.touching.down && !Player1.sprite.paraGorrino){
                        Player1.sprite.enfadao = true;
                        Player1.sprite.animations.play('senfada');
                        Player1.sprite.enfadaoTime = this.time.now + 500;
                        try { 
                           p2p.emit("enfadao2",{id:Player1.id});
                        }
                        catch (e) {
                          console.log("mierror",e); 
                        }
                        
                    }
                    else if (!Player1.sprite.paraGorrino){
                        try { 
                           p2p.emit("hacegorrino2");
                        }
                        catch (e) {
                          console.log("mierror",e); 
                        }
                        Player1.sprite.haceGorrino=true;
                        Player1.sprite.tiempoGorrino = this.time.now + 400;
                    }
                }


                if (!this.game.device.desktop){
                    this.joy.update();
                    this.joy.holder.events.onMove.add(this.procesaDragg, this);
                    this.joy.holder.events.onUp.add(this.paraDragg, this);
                }


                var l = 0;
                var r = 0;
                var u = 0;
                var d = 0;
                var p = 0;

                if (cursors.left.isDown || this.mueveizquierda){
                    l=1;
                }
                else if(cursors.right.isDown || this.muevederecha){
                    r=1;
                }
                else{
                    p=1;
                }

                if (cursors.up.isDown || this.muevearriba){
                    u=1;
                }
                if(cursors.down.isDown || this.mueveabajo){
                    d=1;
                }

                

                socket.emit("teclas",{id: Player1.id, L:l, R:r, U:u, D:d, P:p});
                if (!Player1.soyplayer1){
                    try { 
                        p2p.emit("teclaspika",{L:l, R:r, U:u, D:d});
                    }
                    catch (e) {
                      console.log("mierror",e); 
                    }
                }
            }


            //LA PELOTA TOCA EL SUELO
            if(typeof this.pelota !== 'undefined' && Player1.soyplayer1 && this.pelota.body.position.y > 500 ){
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

    paraDragg: function (pointer) {

        Player1.mueve("parao");
        this.mueveizquierda = false;
        this.muevederecha = false;
        this.muevearriba = false;
        this.mueveabajo = false;

    },

    procesaDragg: function (a, distance, radianes) {
        var angulo = radianes*180/Math.PI;

        if (distance < 30){
            Player1.mueve("parao");
            this.mueveizquierda = false;
            this.muevederecha = false;
            this.muevearriba = false;
            this.mueveabajo = false;
            return;
        }

        if (angulo > -90 && angulo < 90){
            Player1.mueve("derecha");
            this.mueveizquierda = false;
            this.muevederecha = true;
        }
        if (angulo > 90 || angulo < -90){
            
            Player1.mueve("izquierda");
            this.mueveizquierda = true;
            this.muevederecha = false;
        }
        
        if (angulo > -135 && angulo < -45){
            Player1.mueve("arriba");
            this.muevearriba = true;
        }
        else{
            this.muevearriba = false;
        }
        
        if (angulo < 135 && angulo > 45){
            this.mueveabajo = true;
        }
        else{
            this.mueveabajo = false;
        }


    },


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    procesapunto: function () {

        this.explota = this.add.sprite(this.pelota.body.position.x, this.pelota.body.position.y+5, 'explota');
        this.punto = true;

        //Relentizo todo...
        Player1.sprite.body.velocity.y = Player1.sprite.body.velocity.y * 0.2;
        OTROPLAYER.sprite.body.velocity.y = OTROPLAYER.sprite.body.velocity.y * 0.2;
        Player1.sprite.body.velocity.x = Player1.sprite.body.velocity.x * 0.2;
        OTROPLAYER.sprite.body.velocity.x = OTROPLAYER.sprite.body.velocity.x * 0.2;
        this.pelota.body.velocity.y = this.pelota.body.velocity.y * 0.2;
        this.pelota.body.velocity.x = this.pelota.body.velocity.x * 0.2;
        this.pelota.body.gravity.y = 200;

        if(this.pelota.body.position.x > 390){
            this.game.puntosPlayer1++;
            this.scoreText1.text = this.game.puntosPlayer1;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "uno";
            
            if (this.game.puntosPlayer1 >= 15){
                socket.emit("game_over", {ganador: Player1.nombre, ganador_id: Player1.id, perdedor: OTROPLAYER.nombre, perdedor_id: OTROPLAYER.id});
            }
        }
        else{
            this.game.puntosPlayer2++;
            this.scoreText2.text = this.game.puntosPlayer2;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "dos";
            
            if (this.game.puntosPlayer2 >= 15){
                socket.emit("game_over", {ganador: Player1.nombre, ganador_id: Player1.id, perdedor: OTROPLAYER.nombre, perdedor_id: OTROPLAYER.id});
            }
        }


        try { 
            p2p.emit("actualiza_marcador", {puntos1: this.game.puntosPlayer1, puntos2: this.game.puntosPlayer2});
            p2p.emit("punto",{x:this.pelota.body.position.x, y:this.pelota.body.position.y});
        }
        catch (e) {
          console.log("mierror",e); 
        }
        
    },

    procesapunto_sync: function(x,y){
        if (!Player1.soyplayer1){
            this.explota = this.add.sprite(x, y, 'explota');
            this.punto = true;
            this.enunratico = this.time.now + 2400;
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
            pos_player = OTROPLAYER.sprite.body.position.x;
            diferencia = pos_pelota - pos_player;
            v_x_pelota = this.pelota.body.velocity.x;
            v_y_pelota = this.pelota.body.velocity.y;
            this.pelota.body.velocity.x = diferencia*3;

            if (this.time.now < OTROPLAYER.sprite.enfadaoTime && OTROPLAYER.sprite.enfadao){
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

                OTROPLAYER.sprite.body.position.x = this.world.width - 32;
                OTROPLAYER.sprite.body.position.y = this.world.height - 250;
                OTROPLAYER.sprite.body.velocity.x = 0;
                OTROPLAYER.sprite.body.velocity.y = 0;
            }
            else{
                OTROPLAYER.sprite.body.position.x = 32;
                OTROPLAYER.sprite.body.position.y = this.world.height - 250;
                OTROPLAYER.sprite.body.velocity.x = 0;
                OTROPLAYER.sprite.body.velocity.y = 0;

                Player1.sprite.body.position.x = this.world.width - 32;
                Player1.sprite.body.position.y = this.world.height - 250;
                Player1.sprite.body.velocity.x = 0;
                Player1.sprite.body.velocity.y = 0;
            }
            

        } 
    }
};
