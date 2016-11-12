var DudeVolley = {};

DudeVolley.Boot = function (game) {
    
};

DudeVolley.Boot.prototype = {
    init: function () {

        ga('send', 'pageview', '/Boot');

        //cuando no está activa la pestaña, el juego se pausa
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //si escritorio
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //TODO: ver como se ve en pantallas grandes
            this.scale.maxHeight = $(window).height();
            this.scale.maxWidth = 800 * this.scale.maxHeight / 685;
        }
        else
        {
            //si no escritotio
            window.onresize = this.rescale.bind(this);
            //this.doOnOrientationChange();
            //cosas del escalado
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            
            this.scale.maxHeight = $(window).height();
            this.scale.maxWidth = 800 * $(window).height() / 685;

        }

    },

    preload: function () {
        //imagen para empezar y barra de progreso
        this.load.image('titulo', 'assets/dude_volley_title.png');
        this.load.image('preloaderBar', 'assets/cargando_dude.png');

    },

    create: function () {
        //lanza precarga
        this.state.start('Preloader');

    },

    rescale : function () {
        this.scale.setShowAll();
        this.scale.maxHeight = $(window).height();
        this.scale.maxWidth = 800 * this.scale.maxHeight / 685;
    },

  
};DudeVolley.Entrenamiento = function (game) {


};

DudeVolley.Entrenamiento.prototype = {

    preload: function(){
        this.tip1 = this.add.sprite(20, 20, 'tip1');
        this.tip2 = this.add.sprite(220, 20, 'tip2');
        this.tip3 = this.add.sprite(420, 20, 'tip3');
        this.tip4 = this.add.sprite(620, 20, 'tip4');
        
        this.tip1.alpha = 0.5;
        this.tip2.alpha = 0.5;
        this.tip3.alpha = 0.5;
        this.tip4.alpha = 0.5;

        this.volver = this.add.sprite(650, 220, 'volver');
        
        this.volver.inputEnabled = true;
        this.volver.input.sprite.events.onInputDown.add(this.volver_a_jugar, this);
    },

    init: function () {

        ga('send', 'pageview', '/Entrenamiento');
        
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
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;


        this.pelota = this.add.sprite(32, 0, 'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.pelota);
        this.pelota.body.gravity.y = 0;
        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;
        this.pelota.body.gravity.y = 900;
        this.pelota.body.collideWorldBounds = true;

        this.pelota.body.mass= 0.15;


        /***********************************************************************
        ***********************************************************************
                        END -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/




        Player1 = new Player(this.game, "player1", true);

        this.game.level = 2;

        this.esperaCollide1 = this.time.now;




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        //MOVIL
        if (!this.game.device.desktop){
            this.joy = new Joystick(this.game, 120, this.world.height - 100);

            //TODO: Pillar el correcto (boton de accion)
            this.movil_accion = this.add.sprite(this.world.width - 100, this.world.height - 100, 'pika');
            this.movil_accion.anchor.setTo(0.5, 0.5);
            this.movil_accion.inputEnabled = true;
            this.movil_accion.input.sprite.events.onInputDown.add(this.entra_movil_accion, this);
            this.movil_accion.input.sprite.events.onInputUp.add(this.sal_movil_accion, this);
        }

        this.mueveizquierda = false;
        this.muevederecha = false;
        this.muevearriba = false;
        this.mueveabajo = false;




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- REGISTRO DE INPUTS
        ***********************************************************************
        ***********************************************************************/
        
        //INPUTS
        cursors = this.input.keyboard.createCursorKeys();

        PAUSE = this.input.keyboard.addKey(Phaser.Keyboard.ESC);

        //INPUTS PLAYER1
        ARRIBA = cursors.up;
        ABAJO = cursors.down;
        IZQUIERDA = cursors.left;
        DERECHA = cursors.right;

        SUPERPIKA = this.input.keyboard.addKey(Phaser.Keyboard.L);

        SUPERPIKA2 = this.input.keyboard.addKey(Phaser.Keyboard.Z);


        /***********************************************************************
        ***********************************************************************
                        END -- REGISTRO DE INPUTS
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


    entra_movil_accion: function (){
        this.click_accion = true;
    },

    sal_movil_accion: function (){
        this.click_accion = false;
    },




    update: function () {


        if (Player1.sprite.body.y > this.world.height-250){
            Player1.sprite.salta = false;
            this.tip2.alpha = 0.5;
            this.tip4.alpha = 0.5;
        }

        if (this.time.now > this.esperaCollide1){
            this.physics.arcade.collide(this.pelota, Player1.sprite, this.rebote, null, this);
        }
        
        this.physics.arcade.collide(this.pelota, platforms);

        this.physics.arcade.collide(Player1.sprite, platforms);

        this.pelota.angle += this.pelota.body.velocity.x/20;



        //CONTROL DE LA ACCION ENFADAO/GORRINO
        if(this.time.now > (Player1.sprite.tiempoGorrino - 100)){
            Player1.sprite.body.rotation = 0;
            Player1.sprite.haceGorrino = false;
            this.tip3.alpha = 0.5;
        }

        if(this.time.now > (Player1.sprite.tiempoGorrino+100)){
            Player1.sprite.paraGorrino = false;
        }

        if(this.time.now > Player1.sprite.enfadaoTime){
            Player1.sprite.enfadao = false;
        }


        if(SUPERPIKA.isDown || SUPERPIKA2.isDown || this.click_accion){
            if (!Player1.sprite.body.touching.down && !Player1.sprite.paraGorrino){
                Player1.sprite.enfadao = true;
                Player1.sprite.animations.play('senfada');
                Player1.sprite.enfadaoTime = this.time.now + 500;
            }
            else if (!Player1.sprite.paraGorrino){
                Player1.sprite.haceGorrino=true;
                Player1.sprite.tiempoGorrino = this.time.now + 400;
            }
        }

        //FIN --- CONTROL DE LA ACCION ENFADAO/GORRINO
        

        //MOVIMIENTOS
        if (this.game.device.desktop){
            if (IZQUIERDA.isDown){
                Player1.mueve("izquierda");
                if(this.time.now < (Player1.sprite.tiempoGorrino - 100)){
                    this.tip3.alpha = 1;
                }
                else{
                    this.tip1.alpha = 1;
                }
                
            }
            else if(DERECHA.isDown){
                Player1.mueve("derecha");
                if(this.time.now < (Player1.sprite.tiempoGorrino - 100)){
                    this.tip3.alpha = 1;
                }
                else{
                    this.tip1.alpha = 1;
                }
            }
            else{
                Player1.mueve("parao");
                this.tip1.alpha = 0.5;
            }

            if(ARRIBA.isDown){
                Player1.mueve("arriba");
                this.tip2.alpha = 1;
            }
            if(ABAJO.isDown){
                
            }
        }
        else{
            this.joy.update();
            this.joy.holder.events.onMove.add(this.procesaDragg, this);
            this.joy.holder.events.onUp.add(this.paraDragg, this);
        }


        //FIN MOVIMIENTOS
       
        
        
        

    },

    quitGame: function (pointer) {

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


    rebote: function () {

        if (this.pelota.body.position.y > (Player1.sprite.body.position.y + 60)){
            return true;
        }

        this.esperaCollide1 = this.time.now + 100;

        if ((this.pelota.body.position.y > 450)){
            this.pelota.body.velocity.y = -600;
        }
        
        
        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;


        var posXPelota = this.pelota.body.position.x;
        var posXPlayer = Player1.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = this.pelota.body.velocity.x;
        var VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;

        if (this.time.now < Player1.sprite.enfadaoTime && Player1.sprite.enfadao){
            this.tip4.alpha = 1;
            //pulsado izquierda o derecha solo
            if (((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && !ABAJO.isDown) || ((this.muevederecha || this.mueveizquierda) && !this.muevearriba && !this.mueveabajo))
            {
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1500;
            }
            // arriba derecha
            else if((DERECHA.isDown && ARRIBA.isDown && !ABAJO.isDown) || (this.muevederecha && this.muevearriba && !this.mueveabajo) )
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba izquierda
            else if((IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown) || (this.mueveizquierda && this.muevearriba && !this.mueveabajo) )
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = -800;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo y a un lado
            else if(((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && ABAJO.isDown) || ((this.mueveizquierda || this.muevederecha) && !this.muevearriba && this.mueveabajo)){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 1000;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo solo
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && ABAJO.isDown)||(!this.muevederecha && !this.mueveizquierda && !this.muevearriba && this.mueveabajo)){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //sin pulsar ningun lado
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && !ABAJO.isDown)&&(!this.muevederecha && !this.mueveizquierda && !this.muevearriba && !this.mueveabajo)){
                this.pelota.body.velocity.y = -100;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba solo
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown)||(!this.muevederecha && !this.mueveizquierda && this.muevearriba && !this.mueveabajo)){
                this.pelota.body.velocity.y = -1000;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
        }

    },

    volver_a_jugar: function () {
        location.reload();
    }

};
DudeVolley.GameOnePlayer = function (game) {


};

DudeVolley.GameOnePlayer.prototype = {

    init: function () {

        ga('send', 'pageview', '/GameOnePlayer');
        
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
        var ground = platforms.create(0, this.world.height-134, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        //Red
        var red = platforms.create(390, this.world.height-320, 'red');
        red.body.immovable = true;

        this.pelota = this.add.sprite(32, 0, 'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.pelota);
        
        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;
        this.pelota.body.gravity.y = 900;
        this.pelota.body.collideWorldBounds = true;

        this.pelota.body.mass= 0.15;

        this.sombra1 = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra_pelota = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra2 = this.add.sprite(this.world.width - 52, this.world.height-200, 'sombra');
        this.sombra1.alpha = 0.5;
        this.sombra2.alpha = 0.5;
        this.sombra_pelota.alpha = 0.2;


        /***********************************************************************
        ***********************************************************************
                        END -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/




        Player1 = new Player(this.game, "player1", false);
        PlayerCPU = new Player(this.game, "cpu", false);

        //TODO: LEVEL
        this.game.level = 2;


        this.game.hasperdio = false;
        this.game.unplayer = true;
        this.game.empieza = this.time.now;



        this.scoreText1 = this.add.text(16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2 = this.add.text(this.world.width - 16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2.anchor.x = 1;
        this.game.puntosPlayer1 = 0;
        this.game.puntosPlayer2 = 0;


        this.esperaCollide1 = this.time.now;
        this.esperaCollide2 = this.time.now;
        this.cincoMovimientos = 0;
        this.dondeVaCpu = -100;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        
        //MOVIL
        if (!this.game.device.desktop){
            this.joy = new Joystick(this.game, 120, this.world.height - 100);

            //TODO: Pillar el correcto (boton de accion)
            this.movil_accion = this.add.sprite(this.world.width - 100, this.world.height - 100, 'pika');
            this.movil_accion.anchor.setTo(0.5, 0.5);
            this.movil_accion.inputEnabled = true;
            this.movil_accion.input.sprite.events.onInputDown.add(this.entra_movil_accion, this);
            this.movil_accion.input.sprite.events.onInputUp.add(this.sal_movil_accion, this);
        }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- REGISTRO DE INPUTS
        ***********************************************************************
        ***********************************************************************/
        
        //Inputs
        cursors = this.input.keyboard.createCursorKeys();
        //pikas
        //INPUTS PLAYER1
        ARRIBA = cursors.up;
        ABAJO = cursors.down;
        IZQUIERDA = cursors.left;
        DERECHA = cursors.right;

        SUPERPIKA = this.input.keyboard.addKey(Phaser.Keyboard.L);
        SUPERPIKA2 = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        PAUSE = this.input.keyboard.addKey(Phaser.Keyboard.ESC);


        /***********************************************************************
        ***********************************************************************
                        END -- REGISTRO DE INPUTS
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

    entra_movil_accion: function (){
        this.click_accion = true;
    },

    sal_movil_accion: function (){
        this.click_accion = false;
    },


    update: function () {

        

        this.sombra2.position.set(Player1.sprite.body.position.x, this.world.height - 144);
        this.sombra1.position.set(PlayerCPU.sprite.body.position.x, this.world.height - 144);
        this.sombra_pelota.position.set(this.pelota.body.position.x, this.world.height - 144);
        
        if (this.time.now > this.esperaCollide1){
            this.physics.arcade.collide(this.pelota, Player1.sprite, this.rebote, null, this);
        }
        
        if (this.time.now > this.esperaCollide2){
            this.physics.arcade.collide(this.pelota, PlayerCPU.sprite, this.rebote_CPU, null, this);
        }

        this.physics.arcade.collide(this.pelota, platforms);

        this.physics.arcade.collide(Player1.sprite, platforms);
        this.physics.arcade.collide(PlayerCPU.sprite, platforms);
        
        if (this.punto){
            this.pelota.angle += this.pelota.body.velocity.x/20;
            if(this.time.now > this.enunratico){
                this.punto = false;
                this.explota.kill();
                this.empieza(this.quienEmpieza);
            }
            Player1.sprite.body.velocity.x = 0;
        }

        else{

            if(this.time.now > (PlayerCPU.sprite.tiempoGorrino - 100)){
                PlayerCPU.sprite.body.velocity.x = 0;
                PlayerCPU.sprite.body.rotation = 0;
                PlayerCPU.sprite.haceGorrino = false;
            }


            if (Player1.sprite.body.y > this.world.height-250){
                Player1.sprite.salta = false;
            }

            if (PlayerCPU.sprite.body.y > this.world.height-250){
                PlayerCPU.sprite.salta = false;
            }

            


            this.pelota.angle += this.pelota.body.velocity.x/20;

            //CONTROL DE LA ACCION ENFADAO/GORRINO
            if(this.time.now > (Player1.sprite.tiempoGorrino - 100)){
                Player1.sprite.body.rotation = 0;
                Player1.sprite.haceGorrino = false;
                Player1.sprite.body.velocity.x = 0;
            }

            if(this.time.now > (Player1.sprite.tiempoGorrino+100)){
                Player1.sprite.paraGorrino = false;
            }

            if(this.time.now > (PlayerCPU.sprite.tiempoGorrino - 100)){
                PlayerCPU.sprite.body.rotation = 0;
                PlayerCPU.sprite.haceGorrino = false;
            }

            if(this.time.now > (PlayerCPU.sprite.tiempoGorrino+100)){
                PlayerCPU.sprite.paraGorrino = false;
            }

            if(SUPERPIKA.isDown || SUPERPIKA2.isDown || this.click_accion){
                if (!Player1.sprite.body.touching.down && !Player1.sprite.paraGorrino){
                    Player1.sprite.enfadao = true;
                    Player1.sprite.animations.play('senfada');
                    Player1.sprite.enfadaoTime = this.time.now + 500;
                }
                else if (!Player1.sprite.paraGorrino){
                    Player1.sprite.haceGorrino=true;
                    Player1.sprite.tiempoGorrino = this.time.now + 400;
                }
            }
            //FIN --- CONTROL DE LA ACCION ENFADAO/GORRINO

            
           


            //MOVIMIENTOS
            if (this.game.device.desktop){
                if (IZQUIERDA.isDown){
                    Player1.mueve("izquierda");
                    
                }
                else if(DERECHA.isDown){
                    Player1.mueve("derecha");
                }
                else{
                    Player1.mueve("parao");
                }

                if(ARRIBA.isDown){
                    Player1.mueve("arriba");
                }
                if(ABAJO.isDown){
                    
                }
            }
            else{
                this.joy.update();
                this.joy.holder.events.onMove.add(this.procesaDragg, this);
                this.joy.holder.events.onUp.add(this.paraDragg, this);
            }


            this.procesa_movimientos_maquina();

            //LA PELOTA TOCA EL SUELO
            if(this.pelota.body.position.y > 500){
                this.procesapunto();
            }
            
        }

        

        
       

    },



    procesapunto: function () {

        this.explota = this.add.sprite(this.pelota.body.position.x, this.pelota.body.position.y+5, 'explota');

        //Relentizo todo...
        Player1.sprite.body.velocity.y = Player1.sprite.body.velocity.y * 0.2;
        PlayerCPU.sprite.body.velocity.y = PlayerCPU.sprite.body.velocity.y * 0.2;
        Player1.sprite.body.velocity.x = Player1.sprite.body.velocity.x * 0.2;
        PlayerCPU.sprite.body.velocity.x = PlayerCPU.sprite.body.velocity.x * 0.2;
        this.pelota.body.velocity.y = this.pelota.body.velocity.y * 0.2;
        this.pelota.body.velocity.x = this.pelota.body.velocity.x * 0.2;
        this.pelota.body.gravity.y = 200;

        //... veo que hago con el punto

        if(this.pelota.body.position.x > 390){
            this.game.puntosPlayer1++;
            this.scoreText1.text = this.game.puntosPlayer1;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "uno";
            this.punto = true;
            if (this.game.puntosPlayer1 >= 10){
                this.game.ganador = Player1.sprite;
                this.game.perdedor = PlayerCPU.sprite;
                this.state.start('GameOver');
            }
        }
        else{
            this.game.puntosPlayer2++;
            this.scoreText2.text = this.game.puntosPlayer2;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "dos";
            this.punto = true;
            if (this.game.puntosPlayer2 >= 10){
                this.game.hasperdio = true;
                this.game.perdedor = Player1.sprite;
                this.game.ganador = PlayerCPU.sprite;
                this.state.start('GameOver');
            }
        }
    },


    empieza: function (quien) {
        this.dondecae = this.world.width-1;

        this.pelota.body.gravity.y = 900;
        Player1.sprite.body.position.x = 32;
        Player1.sprite.body.position.y = this.world.height - 250;
        Player1.sprite.body.velocity.x = 0;
        Player1.sprite.body.velocity.y = 0;

        PlayerCPU.sprite.body.position.x = this.world.width - 32;
        PlayerCPU.sprite.body.position.y = this.world.height - 250;
        PlayerCPU.sprite.body.velocity.x = 0;
        PlayerCPU.sprite.body.velocity.y = 0;

        this.pelota.body.position.y = 0;
        this.pelota.body.velocity.x = 0;
        

        if (quien == "uno"){
            PlayerCPU.sprite.body.position.x = this.world.width - 150;
            this.pelota.body.position.x = 10;
        }
        else{
            this.pelota.body.position.x = this.world.width - 32;
        }
    },

    quitGame: function (pointer) {

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


    rebote: function () {

        
        if (this.punto){
            this.esperaCollide1 = this.time.now + 2500;
            return true;
        }

        this.esperaCollide1 = this.time.now + 100;

        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;



        var posXPelota = this.pelota.body.position.x;
        var posXPlayer = Player1.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = this.pelota.body.velocity.x;
        var VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;


        if (this.time.now < Player1.sprite.enfadaoTime && Player1.sprite.enfadao){
            //pulsado izquierda o derecha solo
            if (((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && !ABAJO.isDown) || ((this.muevederecha || this.mueveizquierda) && !this.muevearriba && !this.mueveabajo))
            {
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1500;
            }
            // arriba derecha
            else if((DERECHA.isDown && ARRIBA.isDown && !ABAJO.isDown) || (this.muevederecha && this.muevearriba && !this.mueveabajo) )
            {
                this.pelota.body.velocity.y = -700;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba izquierda
            else if((IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown) || (this.mueveizquierda && this.muevearriba && !this.mueveabajo) )
            {
                this.pelota.body.velocity.y = -700;
                this.pelota.body.velocity.x = -800;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo y a un lado
            else if(((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && ABAJO.isDown) || ((this.mueveizquierda || this.muevederecha) && !this.muevearriba && this.mueveabajo)){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 1000;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo solo
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && ABAJO.isDown)||(!this.muevederecha && !this.mueveizquierda && !this.muevearriba && this.mueveabajo)){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //sin pulsar ningun lado
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && !ABAJO.isDown)&&(!this.muevederecha && !this.mueveizquierda && !this.muevearriba && !this.mueveabajo)){
                this.pelota.body.velocity.y = -100;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba solo
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown)||(!this.muevederecha && !this.mueveizquierda && this.muevearriba && !this.mueveabajo)){
                this.pelota.body.velocity.y = -1000;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
        }

    },

    rebote_CPU: function () {
        if (this.punto){
            this.esperaCollide2 = this.time.now + 2500;
            return true;
        }

        this.esperaCollide2 = this.time.now + 100;

        if (this.game.level == 0){
            this.factorFacilidadX = 0.6;
            this.factorFacilidadY = 0.8;
        }
        else if (this.game.level == 1){
            this.factorFacilidadX = 0.9;
            this.factorFacilidadY = 0.9;
        }
        else if (this.game.level == 2){
            this.factorFacilidadX = 1;
            this.factorFacilidadY = 1;
        }

        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;

        var posXPelota = this.pelota.body.position.x;
        var posXPlayer = PlayerCPU.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = this.pelota.body.velocity.x;
        var VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;

        if (this.time.now < PlayerCPU.sprite.enfadaoTime && PlayerCPU.sprite.enfadao){
            //this.acho_audio2.play();
            quehago = Math.floor(Math.random() * 4);
            if (PlayerCPU.sprite.position.x > 450 & quehago == 3){
                quehago = Math.floor(Math.random() * 3);
            }
            if (quehago == 0){
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = -800*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1500*this.factorFacilidadX;
            }
            else if(quehago == 1){
                this.pelota.body.velocity.y = -700*this.factorFacilidadY;
                this.pelota.body.velocity.x = 800*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
            else if(quehago == 2){
                this.pelota.body.velocity.y = -700*this.factorFacilidadY;
                this.pelota.body.velocity.x = -800*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
            else if(quehago == 3){
                this.pelota.body.velocity.y = 800*this.factorFacilidadY;
                this.pelota.body.velocity.x = -1000*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
        }
    },


    //TODO: Mejorar este spagueti!
    procesa_movimientos_maquina: function () {
        x = this.pelota.body.position.x
        y=515;
        H = (this.pelota.body.position.y-(this.world.height-185))*(-1);
        Vx = this.pelota.body.velocity.x
        Vy = this.pelota.body.velocity.y;

        if (this.game.level == 0){
            cuantocorre = 135;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 700;
            cuantoTiempoGorrino = 300;
        }
        else if (this.game.level == 1){
            cuantocorre = 125;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 700;
            cuantoTiempoGorrino = 300;
        }
        else if (this.game.level == 2){
            cuantocorre = 135;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 800;
            cuantoTiempoGorrino = 300;
        }
        
        
        //calcula donde cae
        if (Vy<0){
            Vy = Vy*(-1);
            this.dondecae =x + (Vx)/this.pelota.body.gravity.y * Math.sqrt((2*this.pelota.body.gravity.y*H)+(Vx));
            if (this.dondecae>800){
                this.dondecae = 800 -(this.dondecae-800);
            }
            else if(this.dondecae<0){
                this.dondecae = -(this.dondecae);
            }
        }else{
            //solo calculo donde cae si se mueve abajo(la pelota)
        }

        //si cae en mi campo
        if(this.dondecae > 360){
            //si cae a mi izquierda, me muevo pallá
            if(this.dondecae<PlayerCPU.sprite.position.x && !PlayerCPU.sprite.haceGorrino && PlayerCPU.sprite.position.x > PlayerCPU.sprite.limiteIzquierda){
                PlayerCPU.sprite.body.velocity.x = -cuantocorre;
                if (this.time.now > PlayerCPU.sprite.enfadaoTime && PlayerCPU.sprite.body.velocity.x != 0){
                    PlayerCPU.sprite.animations.play('semueve');
                }
            }
            //si cae a mi derecha, me muevo palla
            else{
                if (!PlayerCPU.sprite.haceGorrino){
                    PlayerCPU.sprite.body.velocity.x = cuantocorre;
                    if (this.time.now > PlayerCPU.sprite.enfadaoTime && PlayerCPU.sprite.body.velocity.x != 0){
                        PlayerCPU.sprite.animations.play('semueve');
                    }
                }
            }
            //si va a caer cerca, salto y me enfado
            if(this.dondecae-PlayerCPU.sprite.position.x < 70 && x>440 && (PlayerCPU.sprite.position.y > this.world.height-200) && (Vx<120&&Vx>-120) && (this.pelota.position.y<this.world.height-300)){
                PlayerCPU.sprite.body.velocity.y = -550;
                PlayerCPU.sprite.enfadao = true;
                PlayerCPU.sprite.animations.play('senfada');
                PlayerCPU.sprite.enfadaoTime = this.time.now + cuantoTiempoEnfadao;

            }

            //si pongo aqui el gorrino, no se equivoca
        }
        else{
            
            this.cincoMovimientos = (++this.cincoMovimientos % 60);
            
            if (this.cincoMovimientos > 58){
                ale = Math.random();
                
                if (ale > 0.9 && PlayerCPU.sprite.position.y > this.world.height-200){
                    PlayerCPU.sprite.body.velocity.y = -550;
                }
                if (ale>0.5 && PlayerCPU.sprite.body.position.x > 440){
                    PlayerCPU.sprite.body.velocity.x = -100;
                }
                else if(ale <0.5){
                    PlayerCPU.sprite.body.velocity.x = 100;
                }
                this.dondeVaCpu = PlayerCPU.sprite.body.velocity.x;
            }
            else{
                
                PlayerCPU.sprite.body.velocity.x = this.dondeVaCpu;
            }

            PlayerCPU.sprite.animations.play('semueve');
        }


        //a veces no hay donde cae y la lia la maquina, jejej
        if (this.game.level != 0){
            if(H<200 && PlayerCPU.sprite.body.touching.down){
                if(this.dondecae<PlayerCPU.sprite.position.x && PlayerCPU.sprite.position.x > PlayerCPU.sprite.limiteIzquierda){
                    if(PlayerCPU.sprite.position.x - this.dondecae > 130 && x>440 && !PlayerCPU.sprite.haceGorrino){
                        //this.acho_audio2.play();
                        PlayerCPU.sprite.body.velocity.x = -cuantocorreGorrino;
                        PlayerCPU.sprite.body.rotation = -90;
                        PlayerCPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        PlayerCPU.sprite.haceGorrino=true;
                    }

                }
                else{
                    if(this.dondecae-PlayerCPU.sprite.position.x > 130 && x>440 && !PlayerCPU.sprite.haceGorrino){
                        //this.acho_audio2.play();
                        PlayerCPU.sprite.body.velocity.x = cuantocorreGorrino;
                        PlayerCPU.sprite.body.rotation = 90;
                        PlayerCPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        PlayerCPU.sprite.haceGorrino=true;
                    }

                }
            }
        }


    },


};
DudeVolley.GameTwoPlayer = function (game) {


};

DudeVolley.GameTwoPlayer.prototype = {

    init: function () {

        ga('send', 'pageview', '/GameTwoPlayer');
        
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
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        //Red
        var red = platforms.create(390, this.world.height-320, 'red');
        red.body.immovable = true;

        this.pelota = this.add.sprite(32, 0, 'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.pelota);
        this.pelota.body.gravity.y = 0;
        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;
        this.pelota.body.gravity.y = 900;
        this.pelota.body.collideWorldBounds = true;

        this.pelota.body.mass= 0.15;

        this.sombra1 = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra_pelota = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra2 = this.add.sprite(this.world.width - 52, this.world.height-200, 'sombra');
        this.sombra1.alpha = 0.5;
        this.sombra2.alpha = 0.5;
        this.sombra_pelota.alpha = 0.2;


        /***********************************************************************
        ***********************************************************************
                        END -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/




        Player1 = new Player(this.game, "player1");

        //Player2
        Player2 = new Player(this.game, "cpu");




        //////////////
        this.game.level = 2;
        this.enunratico = this.time.now;
        this.quienEmpieza = "uno";
        this.punto = false;


        this.scoreText1 = this.add.text(16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2 = this.add.text(this.world.width - 16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2.anchor.x = 1;
        this.game.puntosPlayer1 = 0;
        this.game.puntosPlayer2 = 0;

        this.esperaCollide1 = this.time.now;
        this.esperaCollide2 = this.time.now;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- REGISTRO DE INPUTS
        ***********************************************************************
        ***********************************************************************/
        
        //INPUTS
        cursors = this.input.keyboard.createCursorKeys();

        PAUSE = this.input.keyboard.addKey(Phaser.Keyboard.ESC);

        //INPUTS PLAYER1
        ARRIBA2 = cursors.up;
        ABAJO2 = cursors.down;
        IZQUIERDA2 = cursors.left;
        DERECHA2 = cursors.right;

        SUPERPIKA2 = this.input.keyboard.addKey(Phaser.Keyboard.L);


        //INPUTS PLAYER 2
        ARRIBA = this.input.keyboard.addKey(Phaser.Keyboard.R);
        ABAJO = this.input.keyboard.addKey(Phaser.Keyboard.F);
        IZQUIERDA = this.input.keyboard.addKey(Phaser.Keyboard.D);
        DERECHA = this.input.keyboard.addKey(Phaser.Keyboard.G);

        SUPERPIKA = this.input.keyboard.addKey(Phaser.Keyboard.Z);


        /***********************************************************************
        ***********************************************************************
                        END -- REGISTRO DE INPUTS
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




    update: function () {


        this.sombra2.position.set(Player1.sprite.body.position.x, this.world.height - 144);
        this.sombra1.position.set(Player2.sprite.body.position.x, this.world.height - 144);
        this.sombra_pelota.position.set(this.pelota.body.position.x, this.world.height - 144);
        
        if (this.time.now > this.esperaCollide1){
            this.physics.arcade.collide(this.pelota, Player1.sprite, this.rebote, null, this);
        }
        
        if (this.time.now > this.esperaCollide2){
            this.physics.arcade.collide(this.pelota, Player2.sprite, this.rebote2, null, this);
        }

        this.physics.arcade.collide(this.pelota, platforms);

        this.physics.arcade.collide(Player1.sprite, platforms);
        this.physics.arcade.collide(Player2.sprite, platforms);

        this.pelota.angle += this.pelota.body.velocity.x/20;

        if (this.punto){
            if(this.time.now > this.enunratico){
                this.punto = false;
                this.explota.kill();
                this.empieza(this.quienEmpieza);
            }
        }
        else{

            if (Player1.sprite.body.y > this.world.height-250){
                Player1.sprite.salta = false;
            }

            if (Player2.sprite.body.y > this.world.height-250){
                Player2.sprite.salta = false;
            }

        

            //CONTROL DE LA ACCION ENFADAO/GORRINO
            if(this.time.now > (Player1.sprite.tiempoGorrino - 100)){
                Player1.sprite.body.rotation = 0;
                Player1.sprite.haceGorrino = false;
            }

            if(this.time.now > (Player1.sprite.tiempoGorrino+100)){
                Player1.sprite.paraGorrino = false;
            }

            if(this.time.now > (Player2.sprite.tiempoGorrino - 100)){
                Player2.sprite.body.rotation = 0;
                Player2.sprite.haceGorrino = false;
            }

            if(this.time.now > (Player2.sprite.tiempoGorrino+100)){
                Player2.sprite.paraGorrino = false;
            }

            if(SUPERPIKA.isDown ){
                if (!Player1.sprite.body.touching.down && !Player1.sprite.paraGorrino){
                    Player1.sprite.enfadao = true;
                    Player1.sprite.animations.play('senfada');
                    Player1.sprite.enfadaoTime = this.time.now + 500;
                }
                else if (!Player1.sprite.paraGorrino){
                    Player1.sprite.haceGorrino=true;
                    Player1.sprite.tiempoGorrino = this.time.now + 400;
                }
            }

            if(SUPERPIKA2.isDown){
                if (!Player2.sprite.body.touching.down && !Player2.sprite.paraGorrino){
                    Player2.sprite.enfadao = true;
                    Player2.sprite.animations.play('senfada');
                    Player2.sprite.enfadaoTime = this.time.now + 500;
                }
                else if (!Player2.sprite.paraGorrino){
                    Player2.sprite.haceGorrino=true;
                    Player2.sprite.tiempoGorrino = this.time.now + 400;
                }
            }
            //FIN --- CONTROL DE LA ACCION ENFADAO/GORRINO
            

            //MOVIMIENTOS
            if (IZQUIERDA.isDown){
                Player1.mueve("izquierda");
            }
            else if(DERECHA.isDown){
                Player1.mueve("derecha");
            }
            else{
                Player1.mueve("parao");
            }

            if(ARRIBA.isDown){
                Player1.mueve("arriba");
            }
            if(ABAJO.isDown){
                
            }

            if (IZQUIERDA2.isDown){
                Player2.mueve("izquierda");
            }
            else if(DERECHA2.isDown){
                Player2.mueve("derecha");
            }
            else{
                Player2.mueve("parao");
            }

            if(ARRIBA2.isDown){
                Player2.mueve("arriba");
            }
            if(ABAJO2.isDown){
                
            }
            //FIN MOVIMIENTOS



            //LA PELOTA TOCA EL SUELO
            if(this.pelota.body.position.y > 500){
                this.procesapunto();
            }

        }

        
        
       

    },

    quitGame: function (pointer) {

        this.state.start('MainMenu');

    },


    procesapunto: function () {

        this.explota = this.add.sprite(this.pelota.body.position.x, this.pelota.body.position.y+5, 'explota');

        //Relentizo todo...
        Player1.sprite.body.velocity.y = Player1.sprite.body.velocity.y * 0.2;
        Player2.sprite.body.velocity.y = Player2.sprite.body.velocity.y * 0.2;
        Player1.sprite.body.velocity.x = Player1.sprite.body.velocity.x * 0.2;
        Player2.sprite.body.velocity.x = Player2.sprite.body.velocity.x * 0.2;
        this.pelota.body.velocity.y = this.pelota.body.velocity.y * 0.2;
        this.pelota.body.velocity.x = this.pelota.body.velocity.x * 0.2;
        this.pelota.body.gravity.y = 200;

        //... veo que hago con el punto

        if(this.pelota.body.position.x > 390){
            this.game.puntosPlayer1++;
            this.scoreText1.text = this.game.puntosPlayer1;
            if (this.game.puntosPlayer1 >= 15){
                
                this.game.ganador = Player1.sprite;
                this.game.perdedor = Player2.sprite;
                this.state.start('GameOver');
            
            }
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "uno";
            this.punto = true;
        }
        else{
            this.game.puntosPlayer2++;
            this.scoreText2.text = this.game.puntosPlayer2;
            if (this.game.puntosPlayer2 >= 15){
                this.game.ganador = Player2.sprite;
                this.game.perdedor = Player1.sprite;
                this.state.start('GameOver');
                this.game.hasperdio = true;
            }
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "dos";
            this.punto = true;
        }
    },


    empieza: function (quien) {
        this.pelota.body.gravity.y = 900;
        Player1.sprite.body.position.x = 32;
        Player1.sprite.body.position.y = this.world.height - 250;
        Player1.sprite.body.velocity.x = 0;
        Player1.sprite.body.velocity.y = 0;

        Player2.sprite.body.position.x = this.world.width - 32;
        Player2.sprite.body.position.y = this.world.height - 250;
        Player2.sprite.body.velocity.x = 0;
        Player2.sprite.body.velocity.y = 0;

        this.pelota.body.position.y = 0;
        this.pelota.body.velocity.x = 0;

        if (quien == "uno"){
            this.pelota.body.position.x = 32;
        }
        else{
            this.pelota.body.position.x = this.world.width - 32;
        }
    },


    rebote: function () {
        
        if (this.punto){
            return true;
        }

        this.esperaCollide1 = this.time.now + 100;

        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;


        var posXPelota = this.pelota.body.position.x;
        var posXPlayer = Player1.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = this.pelota.body.velocity.x;
        var VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;


        if (this.time.now < Player1.sprite.enfadaoTime && Player1.sprite.enfadao){
            //pulsado izquierda o derecha solo
            if ((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && !ABAJO.isDown)
            {
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1500;
            }
            // arriba derecha
            else if(DERECHA.isDown && ARRIBA.isDown && !ABAJO.isDown)
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba izquierda
            else if(IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown)
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = -800;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo y a un lado
            else if((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && ABAJO.isDown){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 1000;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo solo
            else if(!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && ABAJO.isDown){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //sin pulsar ningun lado
            else if(!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && !ABAJO.isDown){
                this.pelota.body.velocity.y = -100;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba solo
            else if(!DERECHA.isDown && !IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown){
                this.pelota.body.velocity.y = -1000;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
        }

    },

    rebote2: function () {
        
        if (this.punto){
            return true;
        }

        this.esperaCollide2 = this.time.now + 100;

        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;


        posXPelota = this.pelota.body.position.x;
        posXPlayer = Player2.sprite.body.position.x;
        diferencia = posXPelota - posXPlayer;
        VxPelota = this.pelota.body.velocity.x;
        VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;


        if (this.time.now < Player2.sprite.enfadaoTime && Player2.sprite.enfadao){
            //pulsado izquierda o derecha solo
            if ((DERECHA2.isDown || IZQUIERDA2.isDown) && !ARRIBA2.isDown && !ABAJO2.isDown)
            {
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = -800;
                this.pelota.body.gravity.y = 1500;
            }
            // arriba derecha
            else if(DERECHA2.isDown && ARRIBA2.isDown && !ABAJO2.isDown)
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = -800;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba izquierda
            else if(IZQUIERDA2.isDown && ARRIBA2.isDown && !ABAJO2.isDown)
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo y a un lado
            else if((DERECHA2.isDown || IZQUIERDA2.isDown) && !ARRIBA2.isDown && ABAJO2.isDown){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = -1000;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo solo
            else if(!DERECHA2.isDown && !IZQUIERDA2.isDown && !ARRIBA2.isDown && ABAJO2.isDown){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = -300;
                this.pelota.body.gravity.y = 1400;
            }
            //sin pulsar ningun lado
            else if(!DERECHA2.isDown && !IZQUIERDA2.isDown && !ARRIBA2.isDown && !ABAJO2.isDown){
                this.pelota.body.velocity.y = -100;
                this.pelota.body.velocity.x = -300;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba solo
            else if(!DERECHA2.isDown && !IZQUIERDA2.isDown && ARRIBA2.isDown && !ABAJO2.isDown){
                this.pelota.body.velocity.y = -1000;
                this.pelota.body.velocity.x = -300;
                this.pelota.body.gravity.y = 1400;
            }
        }

    },

};
DudeVolley.Menu1Player = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

DudeVolley.Menu1Player.prototype = {


	create: function () {

		ga('send', 'pageview', '/Menu1Player');
		
		//situo las cosas en la pantalla
		var titulo_estirado = this.cache.getImage('titulo_estirado');
		this.titulo_estirado = this.add.sprite(this.world.centerX - titulo_estirado.width/2.0, 20, 'titulo_estirado');

		
		this.menu_1player = this.add.sprite(this.world.centerX, 300, 'menu_1player');
		this.menu_1player.anchor.setTo(0.5, 0.5);
		this.menu_1player.frame = 0;


		//Inputs
		this.cursors = this.input.keyboard.createCursorKeys();
		
		L = this.input.keyboard.addKey(Phaser.Keyboard.L);
		Z = this.input.keyboard.addKey(Phaser.Keyboard.Z);
		ENTER = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		

		this.cambia_menu = this.time.now + 200;


		//PRUEBAS MOVIL
		this.movil_jugar = this.add.sprite(this.world.centerX, this.world.height - 100, 'seleccionar');
		this.movil_jugar.anchor.setTo(0.5, 0.5);
		this.movil_jugar.inputEnabled = true;
		this.movil_jugar.input.sprite.events.onInputDown.add(this.empieza_movil, this);
	},

	//CONTROL DEL SWIPE PARA SELECCIÓN
	beginSwipe: function () {
        startX = this.game.input.worldX;
        startY = this.game.input.worldY;
        
        this.game.input.onDown.remove(this.beginSwipe);
        this.game.input.onUp.add(this.endSwipe,this);
    },

    endSwipe: function () {

        endX = this.game.input.worldX;
        endY = this.game.input.worldY;

        var distX = startX-endX;
        var distY = startY-endY;
        
        
        if(Math.abs(distY)>60){
            if(distY>0){           
				this.muevearriba = true;
			}
				else{
				this.mueveabajo = true;
			}
        }   
        // stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
        this.game.input.onDown.add(this.beginSwipe);
        this.game.input.onUp.remove(this.endSwipe);

    },


	update: function () {

		//CAPTURA EL SWIPE
		this.game.input.onDown.add(this.beginSwipe, this);

		//muevo el selector y salto al menu correspondiente

		if ((this.cursors.down.isDown || this.mueveabajo) && this.cambia_menu<this.time.now){
			this.mueveabajo = false;
			this.cambia_menu = this.time.now + 200;
			if (this.menu_1player.frame<1){
				this.menu_1player.frame++;
			}
			else{
				this.menu_1player.frame = 0;
			}
		}
		if ((this.cursors.up.isDown || this.muevearriba) && this.cambia_menu<this.time.now){
			this.muevearriba = false;
			this.cambia_menu = this.time.now + 200;
			if (this.menu_1player.frame==0){
				this.menu_1player.frame = 1;
			}
			else{
				this.menu_1player.frame--;
			}
		}

		if(L.isDown || Z.isDown || ENTER.isDown){
			switch (this.menu_1player.frame){
				case 0:
					this.game.normalplayer = true;
					this.juega(false);
					break;
				case 1:
					this.empieza();
					break;
			}
			
		}
	},

	
	empieza: function (pointer) {
		this.menu_1player.destroy();
		this.game.normalplayer = false;
		//dificultad jodia por defecto ( 2 )
		yomismo = this;
    	
		$("#subefoto").show();

		$('#fileToUpload').change(function() {
		  	$('#inputsubefoto').submit();
		});

		window.sube = 0;
		window.sube2 = 0;
		$("#subefoto").on('submit',(function(e) {
			e.preventDefault();
			if (window.sube < 1){
				window.sube = 1;

				$.ajax({
					url: "subeajax1.php", 
					type: "POST",             
					data: new FormData(this),
					contentType: false,   
					cache: false,      
					processData:false,    
					success: function(data){
						yomismo.movil_jugar.visible = false;

						$("#subefoto").hide();
						$("#contiene_foto_subida").show();
						lo_que_habia = $("#contiene_foto_subida").html();
						$("#contiene_foto_subida").html(lo_que_habia+data);

						$("#sube_img_cortada").on('submit',(function(e) {
							e.preventDefault();
							if (window.sube2 < 1){
								window.sube2 = 1;
								$.ajax({
									url: "subeajax2.php", 
									type: "POST",             
									data: new FormData(this),
									contentType: false,   
									cache: false,      
									processData:false,    
									success: function(data){
										yomismo.juega(data);
									}
								});
							}
						}));
					}
				});
			}
		}));

	},

	juega: function (ruta_jugador) {
		
		$("#contiene_foto_subida").css("display","none");
		this.game.ruta_jugador = ruta_jugador;
		this.state.start('PreOnePlayer');
	},

	empieza_movil: function () {
		switch (this.menu_1player.frame){
			case 0:
				this.juega(false);
				this.game.normalplayer = true;
				break;
			case 1:
				this.empieza();
				break;
		}
	},

};

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, quien, entrenamiento, id) {
	
	if (quien === "cpu"){
        this.sprite =juego.add.sprite(juego.world.width - 52, juego.world.height - 250, quien);
        this.sprite.animations.add('senfada', [0], 5, true);
        this.sprite.animations.add('semueve', [2, 3], 7, true);
        this.sprite.animations.add('salta', [1], 5, true);
        this.sprite.limiteIzquierda = 470;
        this.sprite.limiteDerecha = 800;
        this.soyplayer1 = false; 
        this.frameParao = 3;
    }
    else{
        this.sprite =juego.add.sprite(32, juego.world.height - 250, quien);
        this.sprite.animations.add('semueve', [0, 1], 7, true);
        this.sprite.animations.add('senfada', [3], 5, true);
        this.sprite.animations.add('salta', [2], 5, true);
        this.sprite.limiteIzquierda = 0;
        if (!entrenamiento){
            this.sprite.limiteDerecha = 330;
        }
        else{
            this.sprite.limiteDerecha = juego.world.width;
        }
        this.soyplayer1 = true;
        this.frameParao = 0; 
    }

    if(id){
        this.id = id;
    }
	

	juego.physics.arcade.enable(this.sprite);
	this.sprite.anchor.setTo(0.5, 0.5);

	this.sprite.body.bounce.y = 0;
    this.sprite.body.gravity.y = 800;
    this.sprite.body.collideWorldBounds = true;

    this.sprite.enfadao = false;
    this.sprite.enfadaoTime = juego.time.now;

 	this.sprite.tiempoGorrino = juego.time.now;
    this.sprite.haceGorrino = false

    this.sprite.frame = 1;

    this.mueve = function(adonde) {
        if(this.sprite.haceGorrino){
            if (adonde == "izquierda" && this.sprite.body.touching.down && !this.sprite.paraGorrino){
                //this.acho_audio2.play("",0,0.3);
                if(this.sprite.position.x > this.sprite.limiteIzquierda){
                	this.sprite.body.velocity.x = -400;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
                this.sprite.rotation = -90;

                this.sprite.paraGorrino = true;
            }
            else if (adonde == "derecha" && this.sprite.body.touching.down && !this.sprite.paraGorrino){
                //this.acho_audio2.play("",0,0.3);
                if(this.sprite.position.x < this.sprite.limiteDerecha){
                	this.sprite.body.velocity.x = 400;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
                this.sprite.rotation = 90;
                this.sprite.paraGorrino = true;
            }

        }
        else{
            
            if (adonde == "izquierda"){
                if (juego.time.now > this.sprite.enfadaoTime && this.sprite.salta != true){
                    this.sprite.animations.play('semueve');
                }
                if(this.sprite.position.x > this.sprite.limiteIzquierda){
                	this.sprite.body.velocity.x = -150;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
            }
            else if (adonde == "derecha"){
                
                if (juego.time.now > this.sprite.enfadaoTime && this.sprite.salta != true){
                    this.sprite.animations.play('semueve');
                }
                if(this.sprite.position.x < this.sprite.limiteDerecha){
                    this.sprite.body.velocity.x = 150;
                }
                else{
                    this.sprite.body.velocity.x = 0;
                }
            }
            else
            {
                if (adonde == "parao" && juego.time.now > this.sprite.enfadaoTime){
                    this.sprite.animations.stop();
                    this.sprite.body.velocity.x = 0;
                    this.sprite.frame = this.frameParao;
                }
            }

            if(adonde == "arriba" && !this.sprite.haceGorrino && this.sprite.body.touching.down){
                this.sprite.body.velocity.y = -550;
                this.sprite.salta = true;
                this.sprite.animations.play('salta');
                
            }
        }

    }

};DudeVolley.PreOnePlayer = function (game) {

};

DudeVolley.PreOnePlayer.prototype = {

	preload: function (){
		if (this.game.normalplayer){
			this.load.spritesheet('player1','cpu_player/default_player.png',80,110)
		}else{
			this.load.spritesheet('player1', this.game.ruta_jugador, 80, 110);
		}
	},
	
	init: function (){
		
	},

	create: function () {

	},

	update: function () {
		this.empieza();
	},

	empieza: function (pointer) {
    	this.state.start('GameOnePlayer');
	}
};DudeVolley.Demo = function (game) {


};

DudeVolley.Demo.prototype = {

    init: function () {
        
        ga('send', 'pageview', '/Demo');

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
        var ground = platforms.create(0, this.world.height-134, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        //Red
        var red = platforms.create(390, this.world.height-320, 'red');
        red.body.immovable = true;

        this.pelota = this.add.sprite(32, 0, 'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.pelota);
        this.pelota.body.gravity.y = 0;
        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;
        this.pelota.body.gravity.y = 900;
        this.pelota.body.collideWorldBounds = true;

        this.pelota.body.mass= 0.3;

        this.sombra1 = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra_pelota = this.add.sprite(32, this.world.height-200, 'sombra');
        this.sombra2 = this.add.sprite(this.world.width - 52, this.world.height-200, 'sombra');
        this.sombra1.alpha = 0.5;
        this.sombra2.alpha = 0.5;
        this.sombra_pelota.alpha = 0.2;


        /***********************************************************************
        ***********************************************************************
                        END -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/




        Player1CPU = new Player(this.game, "player1", false);
        Player2CPU = new Player(this.game, "cpu", false);
        this.game.level = 2;

        this.scoreText1 = this.add.text(16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2 = this.add.text(this.world.width - 38, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.game.puntosPlayer1 = 0;
        this.game.puntosPlayer2 = 0;

        this.cincoMovimientos1 = 0;
        this.cincoMovimientos2 = 0;
        this.dondeVaCpu1 = 100;
        this.dondeVaCpu2 = -100;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



        /***********************************************************************
        ***********************************************************************
                        START -- REGISTRO DE INPUTS
        ***********************************************************************
        ***********************************************************************/
        
        //Inputs
        cursors = this.input.keyboard.createCursorKeys();
        //pikas
        //INPUTS PLAYER1
        ARRIBA = cursors.up;
        ABAJO = cursors.down;
        IZQUIERDA = cursors.left;
        DERECHA = cursors.right;

        SUPERPIKA = this.input.keyboard.addKey(Phaser.Keyboard.L);
        SUPERPIKA2 = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        PAUSE = this.input.keyboard.addKey(Phaser.Keyboard.ESC);


        /***********************************************************************
        ***********************************************************************
                        END -- REGISTRO DE INPUTS
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




    update: function () {

        $(document).keyup(function(e) {
            location.reload();
        });
        $(document).click(function(e) {
            location.reload();
        });
        document.addEventListener("touchend", function (event) {
            location.reload(); }, false);



        if(this.time.now > (Player1CPU.sprite.tiempoGorrino - 100)){
            Player1CPU.sprite.body.velocity.x = 0;
            Player1CPU.sprite.body.rotation = 0;
            Player1CPU.sprite.haceGorrino = false;
        }
        if(this.time.now > (Player2CPU.sprite.tiempoGorrino - 100)){
            Player2CPU.sprite.body.velocity.x = 0;
            Player2CPU.sprite.body.rotation = 0;
            Player2CPU.sprite.haceGorrino = false;
        }

        this.sombra2.position.set(Player1CPU.sprite.body.position.x, this.world.height - 144);
        this.sombra1.position.set(Player2CPU.sprite.body.position.x, this.world.height - 144);
        this.sombra_pelota.position.set(this.pelota.body.position.x, this.world.height - 144);
        
        this.physics.arcade.collide(this.pelota, Player1CPU.sprite, this.rebote_CPU, null, this);
        this.physics.arcade.collide(this.pelota, Player2CPU.sprite, this.rebote_CPU, null, this);

        this.physics.arcade.collide(this.pelota, platforms);

        this.physics.arcade.collide(Player1CPU.sprite, platforms);
        this.physics.arcade.collide(Player2CPU.sprite, platforms);


        this.pelota.angle += this.pelota.body.velocity.x/20;

        if (this.punto){
            if(this.time.now > this.enunratico){
                this.punto = false;
                this.explota.kill();
                this.empieza(this.quienEmpieza);
            }
        }
        else{
        
            if (Player1CPU.sprite.body.y > this.world.height-250){
                Player1CPU.sprite.salta = false;
            }

            if (Player2CPU.sprite.body.y > this.world.height-250){
                Player2CPU.sprite.salta = false;
            }



            //CONTROL DE LA ACCION ENFADAO/GORRINO
            if(this.time.now > (Player1CPU.sprite.tiempoGorrino - 100)){
                Player1CPU.sprite.body.rotation = 0;
                Player1CPU.sprite.haceGorrino = false;
            }

            if(this.time.now > (Player1CPU.sprite.tiempoGorrino+100)){
                Player1CPU.sprite.paraGorrino = false;
            }

            if(this.time.now > (Player2CPU.sprite.tiempoGorrino - 100)){
                Player2CPU.sprite.body.rotation = 0;
                Player2CPU.sprite.haceGorrino = false;
            }

            if(this.time.now > (Player2CPU.sprite.tiempoGorrino+100)){
                Player2CPU.sprite.paraGorrino = false;
            }


            this.procesa_movimientos_maquina();

            //LA PELOTA TOCA EL SUELO
            if(this.pelota.body.position.y > 500){
                this.procesapunto();
            }

        }
       

    },

    quitGame: function (pointer) {

        this.state.start('MainMenu');

    },




    procesapunto: function () {

        this.explota = this.add.sprite(this.pelota.body.position.x, this.pelota.body.position.y+5, 'explota');

        //Relentizo todo...
        Player1CPU.sprite.body.velocity.y = Player1CPU.sprite.body.velocity.y * 0.2;
        Player2CPU.sprite.body.velocity.y = Player2CPU.sprite.body.velocity.y * 0.2;
        Player1CPU.sprite.body.velocity.x = Player1CPU.sprite.body.velocity.x * 0.2;
        Player2CPU.sprite.body.velocity.x = Player2CPU.sprite.body.velocity.x * 0.2;
        this.pelota.body.velocity.y = this.pelota.body.velocity.y * 0.2;
        this.pelota.body.velocity.x = this.pelota.body.velocity.x * 0.2;
        this.pelota.body.gravity.y = 200;

        //... veo que hago con el punto

        if(this.pelota.body.position.x > 390){
            this.game.puntosPlayer1++;
            this.scoreText1.text = this.game.puntosPlayer1;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "uno";
            this.punto = true;
        }
        else{
            this.game.puntosPlayer2++;
            this.scoreText2.text = this.game.puntosPlayer2;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "dos";
            this.punto = true;
        }
    },


    empieza: function (quien) {
        

        this.pelota.body.gravity.y = 900;
        Player1CPU.sprite.body.position.x = 32;
        Player1CPU.sprite.body.position.y = this.world.height - 250;
        Player1CPU.sprite.body.velocity.x = 0;
        Player1CPU.sprite.body.velocity.y = 0;

        Player2CPU.sprite.body.position.x = this.world.width - 32;
        Player2CPU.sprite.body.position.y = this.world.height - 250;
        Player2CPU.sprite.body.velocity.x = 0;
        Player2CPU.sprite.body.velocity.y = 0;

        this.pelota.body.position.y = 0;
        this.pelota.body.velocity.x = 0;

        if (quien == "uno"){
            this.pelota.body.position.x = 32;
            this.dondecae = 1;
        }
        else{
            this.pelota.body.position.x = this.world.width - 32;
            this.dondecae = this.world.width-1;
        }
    },


    rebote_CPU: function (pelota, jugador) {
        if (this.punto){
            return true;
        }

        var playerIzq;
        if (jugador.key == "cpu"){
            playerIzq = 1;
            jugadorCPU = Player2CPU;
        }
        else{
            playerIzq = -1;
            jugadorCPU = Player1CPU;
        }

        if (this.game.level == 0){
            this.factorFacilidadX = 0.6;
            this.factorFacilidadY = 0.8;
        }
        else if (this.game.level == 1){
            this.factorFacilidadX = 0.9;
            this.factorFacilidadY = 0.9;
        }
        else if (this.game.level == 2){
            this.factorFacilidadX = 1;
            this.factorFacilidadY = 1;
        }

        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;

        var posXPelota = this.pelota.body.position.x;
        var posXPlayer = jugadorCPU.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = this.pelota.body.velocity.x;
        var VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;

        if (this.time.now < jugadorCPU.sprite.enfadaoTime && jugadorCPU.sprite.enfadao){
            //this.acho_audio2.play();
           quehago = Math.floor(Math.random() * 4);
           if (quehago == 0)
            {
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = playerIzq*(-800)*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
            else if(quehago == 1){
                this.pelota.body.velocity.y = -700*this.factorFacilidadY;
                this.pelota.body.velocity.x = playerIzq*800*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
            else if(quehago == 2){
                this.pelota.body.velocity.y = -700*this.factorFacilidadY;
                this.pelota.body.velocity.x = playerIzq*(-800)*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
            else if(quehago == 3){
                this.pelota.body.velocity.y = 800*this.factorFacilidadY;
                this.pelota.body.velocity.x = playerIzq*(-1000)*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
        }
    },


    //TODO: Mejorar este spagueti!
    procesa_movimientos_maquina: function () {
        x = this.pelota.body.position.x
        y=515;
        H = (this.pelota.body.position.y-(this.world.height-185))*(-1);
        Vx = this.pelota.body.velocity.x
        Vy = this.pelota.body.velocity.y;

        if (this.game.level == 0){
            cuantocorre = 135;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 700;
            cuantoTiempoGorrino = 300;
        }
        else if (this.game.level == 1){
            cuantocorre = 125;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 700;
            cuantoTiempoGorrino = 300;
        }
        else if (this.game.level == 2){
            cuantocorre = 135;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 800;
            cuantoTiempoGorrino = 300;
        }
        
        
        //calcula donde cae
        if (Vy<0){
            Vy = Vy*(-1);
            this.dondecae =x + (Vx)/this.pelota.body.gravity.y * Math.sqrt((2*this.pelota.body.gravity.y*H)+(Vx));
            if (this.dondecae>800){
                this.dondecae = 800 -(this.dondecae-800);
            }
            else if(this.dondecae<0){
                this.dondecae = -(this.dondecae);
            }
        }else{
            //solo calculo donde cae si se mueve abajo(la pelota)
        }

        //si cae en mi campo
        if(this.dondecae > 360){
            //si cae a mi izquierda, me muevo pallá
            if(this.dondecae<Player2CPU.sprite.position.x && !Player2CPU.sprite.haceGorrino  && Player2CPU.sprite.position.x > Player2CPU.sprite.limiteIzquierda){
                Player2CPU.sprite.body.velocity.x = -cuantocorre;
                if (this.time.now > Player2CPU.sprite.enfadaoTime && Player2CPU.sprite.body.velocity.x != 0){
                    Player2CPU.sprite.animations.play('semueve');
                }
            }
            //si cae a mi derecha, me muevo palla
            else{
                if (!Player2CPU.sprite.haceGorrino){
                    Player2CPU.sprite.body.velocity.x = cuantocorre;
                    if (this.time.now > Player2CPU.sprite.enfadaoTime && Player2CPU.sprite.body.velocity.x != 0){
                        Player2CPU.sprite.animations.play('semueve');
                    }
                }
            }
            //si va a caer cerca, salto y me enfado
            if(this.dondecae-Player2CPU.sprite.position.x < 70 && x>440 && (Player2CPU.sprite.position.y > this.world.height-200) && (Vx<120&&Vx>-120) && (this.pelota.position.y<this.world.height-300)){
                Player2CPU.sprite.body.velocity.y = -550;
                Player2CPU.sprite.enfadao = true;
                Player2CPU.sprite.animations.play('senfada');
                Player2CPU.sprite.enfadaoTime = this.time.now + cuantoTiempoEnfadao;

            }
            
            this.cincoMovimientos2 = (++this.cincoMovimientos2 % 60);
            
            if (this.cincoMovimientos2 > 58){
                ale = Math.random();
                
                if (ale > 0.9 && Player1CPU.sprite.position.y > this.world.height-200){
                    Player1CPU.sprite.body.velocity.y = -550;
                }
                if (ale>0.6 && Player1CPU.sprite.body.position.x < 360){
                    Player1CPU.sprite.body.velocity.x = 100;
                }
                else if(ale <0.5){
                    Player1CPU.sprite.body.velocity.x = -100;
                }
                this.dondeVaCpu1 = Player1CPU.sprite.body.velocity.x;
            }
            else{
                
                Player1CPU.sprite.body.velocity.x = this.dondeVaCpu1;
            }

            Player1CPU.sprite.animations.play('semueve');

        }
        else if(this.dondecae < 440){
            //si cae a mi izquierda, me muevo pallá
            if(this.dondecae<Player1CPU.sprite.position.x && !Player1CPU.sprite.haceGorrino){
                Player1CPU.sprite.body.velocity.x = -cuantocorre;
                if (this.time.now > Player1CPU.sprite.enfadaoTime && Player1CPU.sprite.body.velocity.x != 0){
                    Player1CPU.sprite.animations.play('semueve');
                }
            }
            //si cae a mi derecha, me muevo palla
            else if(Player1CPU.sprite.position.x < Player1CPU.sprite.limiteDerecha){
                if (!Player1CPU.sprite.haceGorrino){
                    Player1CPU.sprite.body.velocity.x = cuantocorre;
                    if (this.time.now > Player1CPU.sprite.enfadaoTime && Player1CPU.sprite.body.velocity.x != 0){
                        Player1CPU.sprite.animations.play('semueve');
                    }
                }
            }
            //si va a caer cerca, salto y me enfado
            if(this.dondecae-Player1CPU.sprite.position.x < 70 && x<360 && (Player1CPU.sprite.position.y > this.world.height-200) && (Vx<120&&Vx>-120) && (this.pelota.position.y<this.world.height-300)){
                Player1CPU.sprite.body.velocity.y = -550;
                Player1CPU.sprite.enfadao = true;
                Player1CPU.sprite.animations.play('senfada');
                Player1CPU.sprite.enfadaoTime = this.time.now + cuantoTiempoEnfadao;

            }
            
            this.cincoMovimientos1 = (++this.cincoMovimientos1 % 60);
            
            if (this.cincoMovimientos1 > 58){
                ale = Math.random();
                
                if (ale > 0.9 && Player2CPU.sprite.position.y > this.world.height-200){
                    Player2CPU.sprite.body.velocity.y = -550;
                }
                if (ale>0.6 && Player2CPU.sprite.body.position.x > 440){
                    Player2CPU.sprite.body.velocity.x = -100;
                }
                else if(ale <0.5){
                    Player2CPU.sprite.body.velocity.x = 100;
                }
                this.dondeVaCpu2 = Player2CPU.sprite.body.velocity.x;
            }
            else{
                
                Player2CPU.sprite.body.velocity.x = this.dondeVaCpu2;
            }

            Player2CPU.sprite.animations.play('semueve');
        

        }
        


        //a veces no hay donde cae y la lia la maquina, jejej
        if (this.game.level != 0){
            if(H<200){
                if(this.dondecae<Player2CPU.sprite.position.x && Player2CPU.sprite.body.touching.down){
                    if(Player2CPU.sprite.position.x - this.dondecae > 130 && x>440 && !Player2CPU.sprite.haceGorrino && Player2CPU.sprite.position.x > Player2CPU.sprite.limiteIzquierda){
                        //this.acho_audio2.play();
                        Player2CPU.sprite.body.velocity.x = -cuantocorreGorrino;
                        Player2CPU.sprite.body.rotation = -90;
                        Player2CPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        Player2CPU.sprite.haceGorrino=true;
                    }

                }
                else{
                    if(this.dondecae-Player2CPU.sprite.position.x > 130 && x>440 && !Player2CPU.sprite.haceGorrino  && Player2CPU.sprite.body.touching.down){
                        //this.acho_audio2.play();
                        Player2CPU.sprite.body.velocity.x = cuantocorreGorrino;
                        Player2CPU.sprite.body.rotation = 90;
                        Player2CPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        Player2CPU.sprite.haceGorrino=true;
                    }

                }


                if(this.dondecae<Player1CPU.sprite.position.x  && Player1CPU.sprite.body.touching.down){
                    if(Player1CPU.sprite.position.x - this.dondecae > 130 && x<360 && !Player1CPU.sprite.haceGorrino && Player1CPU.sprite.position.x < Player1CPU.sprite.limiteDerecha){
                        //this.acho_audio2.play();
                        Player1CPU.sprite.body.velocity.x = -cuantocorreGorrino;
                        Player1CPU.sprite.body.rotation = -90;
                        Player1CPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        Player1CPU.sprite.haceGorrino=true;
                    }

                }
                else{
                    if(this.dondecae-Player1CPU.sprite.position.x > 130 && x<360 && !Player1CPU.sprite.haceGorrino && Player1CPU.sprite.body.touching.down){
                        //this.acho_audio2.play();
                        Player1CPU.sprite.body.velocity.x = cuantocorreGorrino;
                        Player1CPU.sprite.body.rotation = 90;
                        Player1CPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        Player1CPU.sprite.haceGorrino=true;
                    }

                }
            }
        }


    },


};
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

DudeVolley.GameOver = function (game) {



};

DudeVolley.GameOver.prototype = {

    create: function () {

        ga('send', 'pageview', '/GameOver');

        var rutajuagdor = this.game.ruta_jugador;

        relacion = $(window).height()/$(window).width();
        //relacion = 1-relacion;
        if (relacion < 1){
            //relacion=relacion+1.5;
            letra1 = $(window).height()/9;
            letra2 = $(window).height()/14;
            letra3 = $(window).height()/20;

            borde = $(window).height()/40;
            ancho = $(window).height()/2;

            $("#puntos").css("font-size",letra1+"px");

            $("#texto_fin").css("font-size",letra2+"px");
            $("#envia_tus_puntos").css("font-size",letra2+"px");

            $("#inputtunombre").css("font-size",letra2+"px");
            $("#inputtunombre").css("padding",borde+"px");
            $("#inputtunombre").css("width",ancho+"px");
            $("#inputtunombre").css("border",borde+"px solid #f5f823");
            $("#envia_tu_nombre").css("font-size",letra2+"px");
            $("#envia_tu_nombre").css("padding",borde+"px");
            $("#envia_tu_nombre").css("border",borde+"px solid #f5f823");

            $("#contiene_mandapuntos").css("font-size",letra3+"px");
            $("#contiene_clasificacion").css("font-size",letra3+"px");

        }            
        

        this.input.keyboard.removeKey(Phaser.Keyboard.D);
        this.input.keyboard.removeKey(Phaser.Keyboard.R);
        this.input.keyboard.removeKey(Phaser.Keyboard.F);
        this.input.keyboard.removeKey(Phaser.Keyboard.G);
        this.input.keyboard.removeKey(Phaser.Keyboard.Z);
        this.input.keyboard.removeKey(Phaser.Keyboard.L);
        
        this.add.sprite(0, 0, 'game_over_back');


        var diferencia = this.game.puntosPlayer1 - this.game.puntosPlayer2;
        var puntuacion = this.game.puntosPlayer1+" - "+this.game.puntosPlayer2;

        
        
        if(this.game.unplayer){
            var tiempofinal = this.time.now - this.game.empieza;
            var resultado;
            var level;
            if(this.game.hasperdio == true){
                resultado = "perdido";
            }
            else{
                resultado = "ganado";

                if (rutajuagdor != false){
                    var post_data= {
                        rutaplayer: rutajuagdor,
                        token: window.token
                    }
                    $.post("cambia_imagen_winner.php", post_data)
                        .done(function( data ) {
                            console.log(data);
                    });
                }

            }


            if (this.game.level == 0){
                level = "chupao";
            }
            else if (this.game.level == 1){
                level = "normalico";
            }
            else if (this.game.level == 2){
                level = "jodio";
            }
            
            $("#mandapuntos").show();
            $("#contiene_mandapuntos").fadeIn();
            $("#contiene_mandapuntos").focus();
            $("#texto_fin").text("Has "+resultado);
            $("#puntos").text(this.game.puntosPlayer1+" - "+this.game.puntosPlayer2);

            var cri = cricri(diferencia+puntuacion+tiempofinal+window.token);

            window.entra = 0;
            $("#envia_tu_nombre").click(function(e){
                e.preventDefault();
                if (window.entra < 1){
                    //window.entra = 1;
                    
                    
                    var post_data= {
                                        nombre: $("#inputtunombre").val(),
                                        diferencia: diferencia,
                                        puntuacion: puntuacion,
                                        tiempo: tiempofinal,
                                        level: level,
                                        token: window.token,
                                        cri: cri
                                    }
                    $.post( "registrapuntos.php", post_data)
                        .done(function( data ) {
                            console.log(data);
                            $("#mandapuntos").slideUp();
                            $("#contiene_clasificacion").slideDown();
                            //console.log( "Data Loaded: " + data );
                            acho = JSON.parse(data);
                            $.each(acho, function() {
                                var num = Number(this.tiempo);
                                var seconds = Math.floor(num / 1000);
                                var minutes = Math.floor(seconds / 60);
                                var seconds = seconds - (minutes * 60);
                                if (seconds<10){
                                    seconds="0"+seconds;
                                }
                                var format = minutes + ':' + seconds
                                //$("#titulo_nivel").html("Nivel: "+level);
                                $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<dl><dt>"+this.nombre+"</dt><dd>"+this.puntuacion+"("+format+")</dd></dl>");
                                //use obj.id and obj.name here, for example:
                            });
                            //DudeVolley.scale.refresh();
                    });
                }
            });
        }

        else{
            var nombreGanador;
            
            var elotrosehapirao = "";
            if (this.game.multiplayer){
                nombreGanador = this.game.nombre_ganador;
                if (this.game.desconectado){
                    var elotrosehapirao = "</br>...el otro se ha pirao";
                }
            }
            else if(this.game.hasperdio){
                nombreGanador = "Player2";
            }
            else{
                nombreGanador = "Player1";
            }
            $("#contiene_mandapuntos").show();
            $("#contiene_mandapuntos").css("top","20vw");
            $("#mandapuntos").show();
            $("#envia_tus_puntos").hide();
            $("#inputtunombre").hide();
            $("#envia_tu_nombre").hide();
            $("#texto_fin").html("Ganador: "+nombreGanador+elotrosehapirao);
            $("#puntos").text(this.game.puntosPlayer1+" - "+this.game.puntosPlayer2);
        }
        
        

        
        
        
        //var palizaca = this.cache.getImage('palizaca');
        //this.palizaca = this.add.sprite(this.world.centerX - palizaca.width/2.0, 150, 'palizaca');

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.ganador = this.add.sprite(32, this.world.height - 250, this.game.ganador.key);
        this.perdedor = this.add.sprite(this.world.width/2, this.world.height - 250, this.game.perdedor.key);

        this.ganador.anchor.setTo(0.5, 0.5);
        this.perdedor.anchor.setTo(0.5, 0.5);

        //Fisica de jugadores y this.pelota
        this.physics.arcade.enable(this.ganador);
        this.physics.arcade.enable(this.perdedor);

        //Fisica del jugador
        this.ganador.body.bounce.y = 0;
        this.ganador.body.gravity.y = 800;
        this.ganador.body.collideWorldBounds = true;

        this.perdedor.body.bounce.y = 0;
        this.perdedor.body.gravity.y = 800;
        this.perdedor.body.collideWorldBounds = true;

        this.pelota = this.add.sprite(300, this.world.height - 130, 'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.pelota.angle = Math.floor((Math.random() * 180) + 1); 
        this.explota = this.add.sprite(300, this.world.height - 150, 'explota');

        //animaciones de movimiento
        this.ganador.animations.add('semueve', [0, 1], 7, true);
        this.perdedor.animations.add('semueve2', [0, 1], 7, true);
        this.ganador.animations.add('senfada', [2, 3], 7, true);
        this.perdedor.animations.add('senfada2', [2, 3], 7, true);

        var play_again = this.cache.getImage('volver_a_jugar');
        this.play_again = this.add.sprite(this.world.centerX - play_again.width/2.0,470,'volver_a_jugar');
        this.play_again.inputEnabled = true;
        this.play_again.input.sprite.events.onInputDown.add(this.empieza, this);



    },

    update: function () {
        if (this.ganador.body.x >= (this.world.width-180))
        {
            this.ganador.body.velocity.x = -150;
        }
        if(this.ganador.body.x <= 140){
            this.ganador.body.velocity.x = 150;
        }
        this.ganador.animations.play('semueve');
        this.perdedor.animations.play('senfada');
        this.perdedor.body.rotation = 90;
        if (this.ganador.body.y > (this.world.height-190))
        {
            this.ganador.body.velocity.y = -550;
        }
        if (this.perdedor.body.y > (this.world.height-180))
        {
            this.perdedor.body.velocity.y = 0;
            this.perdedor.body.y = this.world.height-180;
        }
        
        if(SUPERPIKA.isDown || SUPERPIKA2.isDown){
            this.state.start('Preloader');
        } 

    },

    empieza: function(){
        location.reload();
    }

};


function cricri(str) {

  var xl;

  var rotateLeft = function(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  var addUnsigned = function(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  var _F = function(x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function(x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function(x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function(x, y, z) {
    return (y ^ (x | (~z)));
  };

  var _FF = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _GG = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _HH = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _II = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var convertToWordArray = function(str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  var wordToHex = function(lValue) {
    var wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  var x = [],
    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  str = utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
};

function utf8_encode ( argString ) {

    if (argString === null || typeof argString === 'undefined') {
        return '';
      }

      // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      var string = (argString + '');
      var utftext = '',
        start, end, stringl = 0;

      start = end = 0;
      stringl = string.length;
      for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
          end++;
        } else if (c1 > 127 && c1 < 2048) {
          enc = String.fromCharCode(
            (c1 >> 6) | 192, (c1 & 63) | 128
          );
        } else if ((c1 & 0xF800) != 0xD800) {
          enc = String.fromCharCode(
            (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
          );
        } else {
          // surrogate pairs
          if ((c1 & 0xFC00) != 0xD800) {
            throw new RangeError('Unmatched trail surrogate at ' + n);
          }
          var c2 = string.charCodeAt(++n);
          if ((c2 & 0xFC00) != 0xDC00) {
            throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
          }
          c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
          enc = String.fromCharCode(
            (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
          );
        }
        if (enc !== null) {
          if (end > start) {
            utftext += string.slice(start, end);
          }
          utftext += enc;
          start = end = n + 1;
        }
      }

      if (end > start) {
        utftext += string.slice(start, stringl);
      }

      return utftext;
}
var Joystick = function(juego, x, y) {

	this.pin = juego.add.sprite(0, 0, "joy_front");
	this.holder = juego.add.sprite(0, 0, "joy_back");
	this.holder.anchor.setTo(0.5, 0.5);
	this.holder.fixedToCamera = true;
	this.holder.cameraOffset.setTo(x, y);

	this.holder.direction      = new Phaser.Point(0, 0);
	this.holder.distance       = 0;
	this.holder.pinAngle       = 0;
	this.holder.disabled       = false;
	this.holder.isBeingDragged = false;

	this.holder.events.onDown = new Phaser.Signal();
	this.holder.events.onUp   = new Phaser.Signal();
	this.holder.events.onMove = new Phaser.Signal();

	this.pin.anchor.setTo(0.5, 0.5);
	this.holder.addChild(this.pin);

	/* Invisible sprite that players actually drag */
	var dragger = this.dragger = juego.add.sprite(0, 0, "null");
		dragger.anchor.setTo(0.5, 0.5);
		dragger.width = dragger.height = 181;
		dragger.inputEnabled = true;
		dragger.input.enableDrag(true);
		/* Set flags on drag */
		dragger.events.onDragStart.add(onDragStart, this);
		dragger.events.onDragStop.add(onDragStop, this);
		dragger.alpha = 0;
	this.holder.addChild(dragger);

	this.enable = function() {
		this.disabled = false;
	}
	this.disable = function() {
		this.disabled = true;
	}
	function onDragStart() {
		this.isBeingDragged = true;
		if (this.disabled) return;
		this.holder.events.onDown.dispatch();
	}
	function onDragStop () {
		this.isBeingDragged = false;
		/* Reset pin and dragger position */
		this.dragger.position.setTo(0, 0);
		this.pin.position.setTo(0, 0);
		if (this.disabled) return;
		this.holder.events.onUp.dispatch(this.direction, this.distance, this.angle);
	}
	this.update = function() {
		
		if (this.isBeingDragged) {
			var dragger   = this.dragger.position;
			var pin       = this.pin.position;

			var zero = new Phaser.Point(0, 0);
			var angle     = this.pinAngle = zero.angle(dragger);
			var distance  = this.distance = dragger.getMagnitude();

			var normalize = Phaser.Point.normalize;
			var direction = normalize(dragger, this.direction);
			pin.copyFrom(dragger);
			if (distance > 80) pin.setMagnitude(80);
			if (this.disabled) return;
			this.holder.events.onMove.dispatch(direction, distance, angle);
		}
	}


}

DudeVolley.MainMenu = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;
    this.UN_JUGADOR = 0;
    this.DOS_JUGADORES = 1;
    this.JUGAR_ONLINE = 2;
    this.ENTRENAMIENTO = 3;
    this.MEJORES_PUNTUACIONES = 4;
    this.CREDITOS = 5;

};

DudeVolley.MainMenu.prototype = {


    create: function () {

        ga('send', 'pageview', '/MainMenu');
        
        //situo las cosas en la pantalla
        var titulo_estirado = this.cache.getImage('titulo_estirado');
        this.titulo_estirado = this.add.sprite(this.world.centerX - titulo_estirado.width/2.0, 20, 'titulo_estirado');

        
        this.menu_principal = this.add.sprite(this.world.centerX, 300, 'menu_principal');
        this.menu_principal.anchor.setTo(0.5, 0.5);
        this.menu_principal.frame = 0;


        //Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        
        L = this.input.keyboard.addKey(Phaser.Keyboard.L);
        Z = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        ENTER = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        

        this.cambia_menu = this.time.now + 200;

        this.notocas = this.time.now + 10000;

        this.game.best_player_got = false;

    },

    get_creditos: function (){
        if(this.game.creditos_got){
            return;
        }
        this.menu_principal.visible = false;
        this.game.creditos_got = true;
        eljuego = this;
        $("#contiene_creditos").show();
    },

    cierra_creditos: function(){
        this.game.creditos_got = false;
        $("#contiene_creditos").hide();
        eljuego.menu_principal.visible = true;
    },


    get_best_players: function (pointer) {
        if(this.game.best_player_got){
            return;
        }
        this.game.best_player_got = true;
        eljuego = this;
        $.ajax({
            url: "best_players.php", 
            type: "GET",             
            contentType: false,   
            cache: false,      
            processData:false,    
            success: function(data){
                $("#mandapuntos").hide();
                $("#contiene_mandapuntos").show();
                $("#contiene_clasificacion").html("<dl id='titulo_nivel'></dl>");
                acho = JSON.parse(data);
                $.each(acho, function() {
                    var num = Number(this.tiempo);
                    var seconds = Math.floor(num / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var seconds = seconds - (minutes * 60);
                    if (seconds<10){
                        seconds="0"+seconds;
                    }
                    var format = minutes + ':' + seconds;
                    $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<dl><dt>"+this.nombre+"</dt><dd>"+this.puntuacion+"("+format+")</dd></dl>");
                });
                $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<div style='text-align:center;'><input id='volver_menu' onclick='eljuego.cierra_best();' type='submit' value='volver' /></div>");
                eljuego.menu_principal.visible = false;
                $("#contiene_mandapuntos").css("top","120px");
                
            }
        });
    },

    cierra_best: function(){
        this.game.best_player_got = false;
        $("#contiene_mandapuntos").slideDown();
        $("#contiene_clasificacion").html('');
        $("#contiene_mandapuntos").css("top","4vw");
        this.menu_principal.visible = true;
    },


    update: function () {
        
        //muevo el selector y salto al menu correspondiente

        if (this.time.now > this.notocas){
            this.state.start('Demo');
        }
        var juego = this;
        $(document).keyup(function(e) {
            juego.notocas = juego.time.now + 10000;
        });
        

        if ((this.cursors.down.isDown || this.mueveabajo) && this.cambia_menu<this.time.now){
            this.mueveabajo = false;
            this.cambia_menu = this.time.now + 200;
            if (this.menu_principal.frame<5){
                this.menu_principal.frame++;
            }
            else{
                this.menu_principal.frame = 0;
            }
        }
        if ((this.cursors.up.isDown || this.muevearriba) && this.cambia_menu<this.time.now){
            this.muevearriba = false;
            this.cambia_menu = this.time.now + 200;
            if (this.menu_principal.frame==0){
                this.menu_principal.frame = 5;
            }
            else{
                this.menu_principal.frame--;
            }
        }

        if(L.isDown || Z.isDown || ENTER.isDown){
            this.empieza();
        }

    },

    //CONTROL DEL SWIPE PARA SELECCIÓN
    empieza: function () {
        switch (this.menu_principal.frame){
            case this.UN_JUGADOR:
                //this.state.start('GameOnePlayer');
                this.state.start('Menu1Player');
                break;
            case this.DOS_JUGADORES:
                this.state.start('GameTwoPlayer');
                break;
            case this.JUGAR_ONLINE:
                this.state.start('GameMultiplayer');
                break;
            case this.ENTRENAMIENTO:
                this.state.start('Entrenamiento');
                break;
            case this.MEJORES_PUNTUACIONES:
                this.get_best_players();
                break;
            case this.CREDITOS:
                this.get_creditos();
                break;
        }
    }

};
DudeVolley.MovilMainMenu = function (game) {

    this.background = null;
    this.preloadBar = null;

    this.ready = false;
    this.UN_JUGADOR = 0;
    this.JUGAR_ONLINE = 1;
    this.ENTRENAMIENTO = 2;
    this.MEJORES_PUNTUACIONES = 3;
    this.CREDITOS = 4;

};

DudeVolley.MovilMainMenu.prototype = {


    create: function () {
        
        ga('send', 'pageview', '/MovilMainMenu');

        //situo las cosas en la pantalla
        var titulo_estirado = this.cache.getImage('titulo_estirado');
        this.titulo_estirado = this.add.sprite(this.world.centerX - titulo_estirado.width/2.0, 20, 'titulo_estirado');

        this.menu_principal = this.add.sprite(this.world.centerX, 300, 'menu_principal');
        this.menu_principal.anchor.setTo(0.5, 0.5);
        this.menu_principal.frame = 0;

        this.cambia_menu = this.time.now + 200;

        this.notocas = this.time.now + 10000;

        this.game.best_player_got = false;


        //TODO: Hacer boton de seleccionar
        this.movil_jugar = this.add.sprite(this.world.centerX, this.world.height - 100, 'seleccionar'); 
        this.movil_jugar.anchor.setTo(0.5, 0.5);
        this.movil_jugar.inputEnabled = true;
        this.movil_jugar.input.sprite.events.onInputDown.add(this.empieza, this);

    },

    get_creditos: function (){
        if(this.game.creditos_got){
            return;
        }
        this.menu_principal.visible = false;
        this.movil_jugar.visible = false;
        this.game.creditos_got = true;
        eljuego = this;
        $("#contiene_creditos").show();
    },

    cierra_creditos: function(){
        this.game.creditos_got = false;
        $("#contiene_creditos").hide();
        this.menu_principal.visible = true;
        this.movil_jugar.visible = true;
    },


    get_best_players: function (pointer) {
        if(this.game.best_player_got){
            return;
        }
        this.game.best_player_got = true;
        self = this;
        $.ajax({
            url: "best_players.php", 
            type: "GET",             
            contentType: false,   
            cache: false,      
            processData:false,    
            success: function(data){
                $("#mandapuntos").hide();
                $("#contiene_mandapuntos").show();
                $("#contiene_clasificacion").html("<dl id='titulo_nivel'></dl>");
                acho = JSON.parse(data);
                $.each(acho, function() {
                    var num = Number(this.tiempo);
                    var seconds = Math.floor(num / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var seconds = seconds - (minutes * 60);
                    if (seconds<10){
                        seconds="0"+seconds;
                    }
                    var format = minutes + ':' + seconds;
                    $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<dl><dt>"+this.nombre+"</dt><dd>"+this.puntuacion+"("+format+")</dd></dl>");
                });
                $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<div style='text-align:center;'><input id='volver_menu' onclick='self.cierra_best();' type='submit' value='volver' /></div>");
                self.menu_principal.visible = false;
                self.movil_jugar.visible = false;
                $("#contiene_mandapuntos").css("top","120px");
                
            }
        });
    },

    cierra_best: function(){
        this.game.best_player_got = false;
        $("#contiene_mandapuntos").slideDown();
        $("#contiene_clasificacion").html('');
        $("#contiene_mandapuntos").css("top","4vw");
        this.menu_principal.visible = true;
        this.movil_jugar.visible = true;
    },

    //CONTROL DEL SWIPE PARA SELECCIÓN
    beginSwipe: function () {
        //más delay para que se muestre la demo
        this.notocas = this.time.now + 10000;
        startX = this.game.input.worldX;
        startY = this.game.input.worldY;
        
        this.game.input.onDown.remove(this.beginSwipe);
        this.game.input.onUp.add(this.endSwipe,this);
    },

    endSwipe: function () {

        endX = this.game.input.worldX;
        endY = this.game.input.worldY;

        var distX = startX-endX;
        var distY = startY-endY;
        
        
        if(Math.abs(distY)>60){
            if(distY>0){           
                this.mueveabajo = true;
            }
                else{
                this.muevearriba = true;
            }
        }   
        // stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
        this.game.input.onDown.add(this.beginSwipe);
        this.game.input.onUp.remove(this.endSwipe);

    },

    update: function () {
        //CAPTURA EL SWIPE
        this.game.input.onDown.add(this.beginSwipe, this);

        var juego = this;

        document.addEventListener("touchend", function (event) {
            juego.notocas = juego.time.now + 10000; }, false);
        
        //muevo el selector y salto al menu correspondiente

        if (this.time.now > this.notocas){
            this.state.start('Demo');
        }
        

        if (this.mueveabajo && this.cambia_menu<this.time.now){
            this.mueveabajo = false;
            this.cambia_menu = this.time.now + 200;
            if (this.menu_principal.frame<4){
                this.menu_principal.frame++;
            }
            else{
                this.menu_principal.frame = 0;
            }
        }
        if (this.muevearriba && this.cambia_menu<this.time.now){
            this.muevearriba = false;
            this.cambia_menu = this.time.now + 200;
            if (this.menu_principal.frame==0){
                this.menu_principal.frame = 4;
            }
            else{
                this.menu_principal.frame--;
            }
        }

    },

    //CONTROL DEL SWIPE PARA SELECCIÓN
    empieza: function () {
        switch (this.menu_principal.frame){
            case this.UN_JUGADOR:
                //this.state.start('GameOnePlayer');
                this.state.start('Menu1Player');
                break;
            case this.JUGAR_ONLINE:
                this.state.start('GameMultiplayer');
                break;
            case this.ENTRENAMIENTO:
                this.state.start('Entrenamiento');
                break;
            case this.MEJORES_PUNTUACIONES:
                this.get_best_players();
                break;
            case this.CREDITOS:
                this.get_creditos();
                break;
        }
    }

};
DudeVolley.Preloader = function (game) {

    this.background = null;
    this.preloadBar = null;
    this.ready = false;

};

DudeVolley.Preloader.prototype = {

    preload: function () {

        //situo el titulo y la barra de carga
        var titulo = this.cache.getImage('titulo');
        this.background = this.add.sprite(this.world.centerX - titulo.width/2.0, 120, 'titulo');
        this.preloadBar = this.add.sprite(240, 400, 'preloaderBar');

        //carga la barra horizontalmente(con crop)
        this.load.setPreloadSprite(this.preloadBar);

        //carga de imagenes
        
        this.load.spritesheet('menu_1player', 'assets/menu_1player.png', 400, 270); // MENU 1 PLAYER
        this.load.image('titulo_estirado', 'assets/dude_volley.png');

        this.load.image('sky', 'assets/new_campo2.png'); // background principal -- cambiar
        this.load.image('ground', 'assets/platform2.png'); // suelo
        this.load.image('red', 'assets/new_red.png'); // red -- cambiar
        this.load.image('pelota', 'assets/new_pelota.png');

        this.load.image('sombra', 'assets/sombra.png'); //sombra -- OK
        this.load.image('explota', 'assets/explota.png');

        this.load.image('game_over_back', 'assets/game_over_back.png'); //background final -- cambiar

        this.load.image('volver_a_jugar', 'assets/volver_a_jugar.png');
        this.load.image('seleccionar', 'assets/seleccionar.png');


        this.load.spritesheet('player1','assets/default_player.png',80,110);
        this.load.spritesheet('cpu','cpu_player/cpu_player.png',80,110);


        this.load.image('volver', 'assets/volver.png');
        this.load.image('tip1', 'assets/muevete.png');
        this.load.image('tip2', 'assets/salta_arriba.png');
        this.load.image('tip3', 'assets/gorrino.png');
        this.load.image('tip4', 'assets/mate.png');

      

        if (this.game.device.desktop){
            this.load.spritesheet('menu_principal', 'assets/menu_sprite.png', 400, 400); // MENU PRINCIPAL
            
        }
        else{
            this.load.spritesheet('menu_principal', 'assets/menu_sprite_movil.png', 400, 400); // MENU PRINCIPAL
            this.load.image('joy_back', 'assets/joy_back2.png');
            this.load.image('joy_front', 'assets/joy_front.png');
            this.load.image('pika', 'assets/pika.png');
        }

    },

    create: function () {

        this.preloadBar.cropEnabled = false;

        this.ready = true;

        if (this.game.device.desktop){
            this.state.start('MainMenu');
        }
        else{
            this.state.start('MovilMainMenu');
        }
        
    },

    update: function () {


    }

};
