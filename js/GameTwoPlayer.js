DudeVolley.GameTwoPlayer = function (game) {


};

DudeVolley.GameTwoPlayer.prototype = {

    init: function () {

        
        
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
        ARRIBA = cursors.up;
        ABAJO = cursors.down;
        IZQUIERDA = cursors.left;
        DERECHA = cursors.right;

        SUPERPIKA = this.input.keyboard.addKey(Phaser.Keyboard.L);


        //INPUTS PLAYER 2
        ARRIBA2 = this.input.keyboard.addKey(Phaser.Keyboard.R);
        ABAJO2 = this.input.keyboard.addKey(Phaser.Keyboard.F);
        IZQUIERDA2 = this.input.keyboard.addKey(Phaser.Keyboard.D);
        DERECHA2 = this.input.keyboard.addKey(Phaser.Keyboard.G);

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
