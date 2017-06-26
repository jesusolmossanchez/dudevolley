DudeVolley.GameOnePlayer = function (game) {


};

DudeVolley.GameOnePlayer.prototype = {

    init: function () {

        //CHECK TWITTER
        if(window.twitter_img){
            ga('send', 'pageview', '/GameOnePlayer_tw');
        }
        else{
            ga('send', 'pageview', '/GameOnePlayer');
        }
        
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

            
        /***********************************************************************
        ***********************************************************************
                        START -- PUBLICIDAD
        ***********************************************************************
        ***********************************************************************/

        this.avion = this.add.sprite(-(this.world.width + 10), 100, 'avion');
        this.avion.anchor.setTo(0.5, 0.5);
        this.physics.arcade.enable(this.avion);
        this.avion.body.gravity.y = 0;
        this.avion.body.collideWorldBounds = false;
        this.avion.inputEnabled = true;
        this.avion.input.sprite.events.onInputDown.add(function(){window.open(window.ad_url, '_blank');}, this);
        
        this.avion.animations.add('vuela_izq', [0,1,2], 12, true);
        this.avion.animations.add('vuela_der', [3,4,5], 12, true);
        this.avion.animations.play('vuela_der');

        /***********************************************************************
        ***********************************************************************
                        END -- PUBLICIDAD
        ***********************************************************************
        ***********************************************************************/


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




        Player1 = new Player(this.game, "player1", false, false, this.limite_izq);
        PlayerCPU = new Player(this.game, "cpu", false, false, this.limite_izq);

        //TODO: LEVEL
        this.game.level = 2;


        this.game.hasperdio = false;
        this.game.unplayer = true;
        this.game.empieza = this.time.now;



        this.scoreText1 = this.add.text(40 + this.limite_izq, 16, '0', { font: '74px ArcadeClassic', fill: "#eaff02", align: "center" });
        this.scoreText2 = this.add.text(this.limite_der - 40, 16, '0', { font: '74px ArcadeClassic', fill: "#eaff02", align: "center" });
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
            this.joy = new Joystick(this.game, 130, this.world.height - 250);

            //TODO: Pillar el correcto (boton de accion)
            this.movil_accion_shadow = this.add.sprite(this.world.width - 120, this.world.height - 250, 'pika');
            this.movil_accion = this.add.sprite(this.world.width - 120, this.world.height - 250, 'pika');
            this.movil_accion.anchor.setTo(0.5, 0.5);
            this.movil_accion.scale.setTo(1.7, 1.7);
            this.movil_accion.inputEnabled = true;
            this.movil_accion.input.sprite.events.onInputDown.add(this.entra_movil_accion, this);
            this.movil_accion.input.sprite.events.onInputUp.add(this.sal_movil_accion, this);

            this.movil_accion_shadow.anchor.set(0.5,0.5);
            this.movil_accion_shadow.scale.set(2,2);
            this.movil_accion_shadow.tint = 0xffffff;
            this.movil_accion_shadow.alpha = 0;
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
        this.movil_accion_shadow.alpha = 0.6;
    },

    sal_movil_accion: function (){
        this.click_accion = false;
        this.movil_accion_shadow.alpha = 0;
    },


    update: function () {

        

        this.sombra2.position.set(Player1.sprite.body.position.x, this.world.height - 40);
        this.sombra1.position.set(PlayerCPU.sprite.body.position.x, this.world.height - 40);
        this.sombra_pelota.position.set(this.pelota.body.position.x, this.world.height - 40);
        
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
            if(this.pelota.body.position.y > (this.world.height - 90)){
                this.procesapunto();
            }
            
        }

        

        this.publicidad();
       

    },




    publicidad: function () {
        if(this.avion.body.position.x < (-this.world.width)){
            var random = Math.random();
            var v_random = random * 200 + 80;
            var scale = 0.5 + random;
            this.avion.scale.setTo(scale,scale);
            this.avion.body.velocity.x = v_random;
            this.avion.animations.play('vuela_der');
        }
        if(this.avion.body.position.x > (2*this.world.width)){
            this.avion.scale.x = 1;
            var random = Math.random();
            var v_random = random * 200 + 80;
            var scale = 1 - random;
            this.avion.scale.setTo(scale,scale);
            this.avion.body.velocity.x = -v_random;
            this.avion.animations.play('vuela_izq');
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

        if(this.pelota.body.position.x > (this.world.width/2)){
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
        this.dondecae = this.limite_der;

        this.pelota.body.gravity.y = 900;
        Player1.sprite.body.position.x = this.limite_izq + 50;
        Player1.sprite.body.position.y = this.world.height - 150;
        Player1.sprite.body.velocity.x = 0;
        Player1.sprite.body.velocity.y = 0;

        PlayerCPU.sprite.body.position.x = this.limite_der - 140;
        PlayerCPU.sprite.body.position.y = this.world.height - 150;
        PlayerCPU.sprite.body.velocity.x = 0;
        PlayerCPU.sprite.body.velocity.y = 0;

        this.pelota.body.position.y = 0;
        this.pelota.body.velocity.x = 0;
        

        if (quien == "uno"){
            PlayerCPU.sprite.body.position.x = this.limite_der - 140;
            this.pelota.body.position.x = this.limite_izq + 32;
        }
        else{
            this.pelota.body.position.x = this.limite_der - 90;
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

            ale = Math.random();
            //si va a caer cerca, salto y me enfado
            if(this.dondecae-PlayerCPU.sprite.position.x < 70 
                && x>(this.world.width/2) 
                && (PlayerCPU.sprite.position.y > this.world.height-100) 
                && (Vx<120&&Vx>-120) 
                && (this.pelota.position.y<this.world.height-300)
                && ale > 0.95){
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
                
                if (ale > 0.9 && PlayerCPU.sprite.position.y > this.world.height-100){
                    PlayerCPU.sprite.body.velocity.y = -550;
                }
                if (ale>0.5 && PlayerCPU.sprite.body.position.x > (this.world.width/2)){
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
                    if(PlayerCPU.sprite.position.x - this.dondecae > 130 && x>(this.world.width/2) && !PlayerCPU.sprite.haceGorrino){
                        //this.acho_audio2.play();
                        PlayerCPU.sprite.body.velocity.x = -cuantocorreGorrino;
                        PlayerCPU.sprite.body.rotation = -90;
                        PlayerCPU.sprite.tiempoGorrino = this.time.now + cuantoTiempoGorrino;
                        PlayerCPU.sprite.haceGorrino=true;
                    }

                }
                else{
                    if(this.dondecae-PlayerCPU.sprite.position.x > 130 && x>(this.world.width/2) && !PlayerCPU.sprite.haceGorrino){
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
