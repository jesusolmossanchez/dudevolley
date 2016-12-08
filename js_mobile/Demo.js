DudeVolley.Demo = function (game) {


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
        this.fondo = this.add.sprite(this.world.width/2, this.world.height/2, 'sky');
        this.fondo.anchor.setTo(0.5, 0.5);
        this.fondo.height = this.world.height;
        this.fondo.width = this.world.height * 800 / 580;

        //Suelo
        platforms = this.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, this.world.height - 30, 'ground');
        ground.scale.setTo(2, 2);
        ground.width = this.world.width;
        ground.body.immovable = true;

        //Red
        var red = platforms.create(this.world.width/2, this.world.height-210, 'red');
        red.body.immovable = true;


        this.limite_izq = parseInt((this.world.width - this.fondo.width)/2);
        this.limite_der = parseInt(this.world.width - this.limite_izq);


        this.pos_pelota_inicio = this.limite_izq + 40;

        this.pelota = this.add.sprite(this.pos_pelota_inicio, 0, 'pelota');

        this.pelota.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.pelota);
        this.pelota.body.gravity.y = 0;
        this.pelota.body.bounce.y = 0.9;
        this.pelota.body.bounce.x = 0.9;
        this.pelota.body.gravity.y = 900;

        var fake_lateral1 = platforms.create(this.limite_izq, 0, 'fake_lateral');
        fake_lateral1.body.immovable = true;

        var fake_lateral2 = platforms.create(this.limite_der, 0, 'fake_lateral');
        fake_lateral2.body.immovable = true;

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




        Player1CPU = new Player(this.game, "player1", false, false, this.limite_izq);
        Player2CPU = new Player(this.game, "cpu", false, false, this.limite_izq);
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

        this.sombra2.position.set(Player1CPU.sprite.body.position.x, this.world.height - 30);
        this.sombra1.position.set(Player2CPU.sprite.body.position.x, this.world.height - 30);
        this.sombra_pelota.position.set(this.pelota.body.position.x, this.world.height - 30);
        
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
            if(this.pelota.body.position.y > (this.world.height - 90)){
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

        if(this.pelota.body.position.x > (this.world.width/2)){
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
        this.dondecae = this.limite_der - 90;

        this.pelota.body.gravity.y = 900;
        Player1CPU.sprite.body.position.x = this.limite_izq + 50;
        Player1CPU.sprite.body.position.y = this.world.height - 150;
        Player1CPU.sprite.body.velocity.x = 0;
        Player1CPU.sprite.body.velocity.y = 0;

        Player2CPU.sprite.body.position.x = this.limite_der - 90;
        Player2CPU.sprite.body.position.y = this.world.height - 150;
        Player2CPU.sprite.body.velocity.x = 0;
        Player2CPU.sprite.body.velocity.y = 0;

        this.pelota.body.position.y = 0;
        this.pelota.body.velocity.x = 0;
        

        if (quien == "uno"){
            Player2CPU.sprite.body.position.x = this.limite_der - 50;
            this.pelota.body.position.x = this.limite_izq + 50;
        }
        else{
            this.pelota.body.position.x = this.limite_der - 90;
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
            if (this.dondecae>this.limite_der){
                this.dondecae = this.limite_der - (this.dondecae - this.limite_der);
            }
            else if(this.dondecae<0){
                this.dondecae = -(this.dondecae);
            }
        }else{
            //solo calculo donde cae si se mueve abajo(la pelota)
        }

        //si cae en mi campo
        if(this.dondecae > (this.world.width/2)-40){
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
            if(this.dondecae-Player2CPU.sprite.position.x < 70 
                && x>(this.world.width/2) 
                && (Player2CPU.sprite.position.y > this.world.height-100) 
                && (Vx<120&&Vx>-120) 
                && (this.pelota.position.y<this.world.height-300)){
                Player2CPU.sprite.body.velocity.y = -550;
                Player2CPU.sprite.enfadao = true;
                Player2CPU.sprite.animations.play('senfada');
                Player2CPU.sprite.enfadaoTime = this.time.now + cuantoTiempoEnfadao;

            }
            
            this.cincoMovimientos2 = (++this.cincoMovimientos2 % 60);
            
            if (this.cincoMovimientos2 > 58){
                ale = Math.random();
                
                if (ale > 0.9 && Player1CPU.sprite.position.y > this.world.height-100){
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
        else if(this.dondecae < (this.world.width/2)+40){
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
            if(this.dondecae-Player2CPU.sprite.position.x < 70 
                && x<(this.world.width/2) 
                && (Player2CPU.sprite.position.y > this.world.height-100) 
                && (Vx<120&&Vx>-120) 
                && (this.pelota.position.y<this.world.height-300)){
                Player1CPU.sprite.body.velocity.y = -550;
                Player1CPU.sprite.enfadao = true;
                Player1CPU.sprite.animations.play('senfada');
                Player1CPU.sprite.enfadaoTime = this.time.now + cuantoTiempoEnfadao;

            }
            
            this.cincoMovimientos1 = (++this.cincoMovimientos1 % 60);
            
            if (this.cincoMovimientos1 > 58){
                ale = Math.random();
                
                if (ale > 0.9 && Player2CPU.sprite.position.y > this.world.height-100){
                    Player2CPU.sprite.body.velocity.y = -550;
                }
                if (ale>0.6 && Player2CPU.sprite.body.position.x > (this.world.width/2)){
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
                    if(Player2CPU.sprite.position.x - this.dondecae > 130 && x>(this.world.width/2) && !Player2CPU.sprite.haceGorrino && Player2CPU.sprite.position.x > Player2CPU.sprite.limiteIzquierda){
                        //this.acho_audio2.play();
                        Player2CPU.sprite.body.velocity.x = -cuantocorreGorrino;
                        Player2CPU.sprite.body.rotation = -90;
                        Player2CPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        Player2CPU.sprite.haceGorrino=true;
                    }

                }
                else{
                    if(this.dondecae-Player2CPU.sprite.position.x > 130 && x>(this.world.width/2) && !Player2CPU.sprite.haceGorrino  && Player2CPU.sprite.body.touching.down){
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
