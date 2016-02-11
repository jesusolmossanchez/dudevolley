DudeVolley.Entrenamiento = function (game) {


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
