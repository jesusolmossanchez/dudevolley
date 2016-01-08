DudeVolley.GameOnePlayer = function (game) {


};

DudeVolley.GameOnePlayer.prototype = {

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




        Player1 = new Player(this.game, "player1", false);
        PlayerCPU = new Player(this.game, "cpu", false);
        this.game.level = 2;



        this.scoreText1 = this.add.text(16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2 = this.add.text(this.world.width - 16, 16, '0', { font: '44px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2.anchor.x = 1;
        this.puntosPlayer1 = 0;
        this.puntosPlayer2 = 0;



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

        this.sombra2.position.set(Player1.sprite.body.position.x, this.world.height - 144);
        this.sombra1.position.set(PlayerCPU.sprite.body.position.x, this.world.height - 144);
        this.sombra_pelota.position.set(this.pelota.body.position.x, this.world.height - 144);
        
        this.physics.arcade.collide(this.pelota, Player1.sprite, this.rebote, null, this);
        this.physics.arcade.collide(this.pelota, PlayerCPU.sprite, this.rebote_CPU, null, this);

        this.physics.arcade.collide(this.pelota, platforms);

        this.physics.arcade.collide(Player1.sprite, platforms);
        this.physics.arcade.collide(PlayerCPU.sprite, platforms);
        
        if (this.punto){
            if(this.time.now > this.enunratico){
                this.punto = false;
                this.explota.kill();
                this.empieza(this.quienEmpieza);
            }
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

            if(SUPERPIKA.isDown || SUPERPIKA2.isDown){
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
            this.puntosPlayer1++;
            this.scoreText1.text = this.puntosPlayer1;
            this.enunratico = this.time.now + 2500;
            this.quienEmpieza = "uno";
            this.punto = true;
        }
        else{
            this.puntosPlayer2++;
            this.scoreText2.text = this.puntosPlayer2;
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

        PlayerCPU.sprite.body.position.x = this.world.width - 32;
        PlayerCPU.sprite.body.position.y = this.world.height - 250;
        PlayerCPU.sprite.body.velocity.x = 0;
        PlayerCPU.sprite.body.velocity.y = 0;

        this.pelota.body.position.y = 0;
        this.pelota.body.velocity.x = 0;

        if (quien == "uno"){
            this.pelota.body.position.x = 32;
        }
        else{
            this.pelota.body.position.x = this.world.width - 32;
        }
    },

    quitGame: function (pointer) {

        this.state.start('MainMenu');

    },


    rebote: function () {
        
        if (this.punto){
            return true;
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

    rebote_CPU: function () {
        if (this.punto){
            return true;
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
        var posXPlayer = PlayerCPU.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = this.pelota.body.velocity.x;
        var VyPelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;

        if (this.time.now < PlayerCPU.sprite.enfadaoTime && PlayerCPU.sprite.enfadao){
            //this.acho_audio2.play();
           quehago = Math.floor(Math.random() * 4);
           if (quehago == 0)
            {
                this.pelota.body.velocity.y = VyPelota*0.3;
                this.pelota.body.velocity.x = -800*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1500*this.factorFacilidadX;
            }
            else if(quehago == 1){
                this.pelota.body.velocity.y = -800*this.factorFacilidadY;
                this.pelota.body.velocity.x = 800*this.factorFacilidadX;
                this.pelota.body.gravity.y = 1400*this.factorFacilidadX;
            }
            else if(quehago == 2){
                this.pelota.body.velocity.y = -800*this.factorFacilidadY;
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
            cuantocorre = 150;
            cuantocorreGorrino = 400;
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
            //paradico si no cae en mi campo
            PlayerCPU.sprite.animations.stop();
            PlayerCPU.sprite.frame = 3;
        }


        //a veces no hay donde cae y la lia la maquina, jejej
        if (this.game.level != 0){
            if(H<200){
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