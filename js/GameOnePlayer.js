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


        /***********************************************************************
        ***********************************************************************
                        END -- ELEMENTOS VISUALES FIJOS
        ***********************************************************************
        ***********************************************************************/




        Player1 = new Player(this.game);



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
        superpika = this.input.keyboard.addKey(Phaser.Keyboard.L);
        superpika2 = this.input.keyboard.addKey(Phaser.Keyboard.Z);
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

        
        if (Player1.sprite.body.y > this.world.height-250){
            Player1.sprite.salta = false;
        }

        this.pelota.angle += this.pelota.body.velocity.x/20;
        this.physics.arcade.collide(this.pelota, Player1.sprite, this.rebote, null, this);
        this.physics.arcade.collide(this.pelota, platforms);
        this.physics.arcade.collide(Player1.sprite, platforms);



        //CONTROL DE LA ACCION ENFADAO/GORRINO
        if(this.time.now > (Player1.sprite.tiempo_gorrino - 100)){
            Player1.sprite.body.rotation = 0;
            Player1.sprite.hace_gorrino = false;
        }

        if(this.time.now > (Player1.sprite.tiempo_gorrino+100)){
            Player1.sprite.para_gorrino = false;
        }

        if(superpika.isDown || superpika2.isDown){
            if (!Player1.sprite.body.touching.down && !Player1.sprite.para_gorrino){
                Player1.sprite.enfadao = true;
                Player1.sprite.animations.play('senfada');
                Player1.sprite.enfadao_time = this.time.now + 500;
            }
            else if (!Player1.sprite.para_gorrino){
                Player1.sprite.hace_gorrino=true;
                Player1.sprite.tiempo_gorrino = this.time.now + 400;
            }
        }
        //FIN --- CONTROL DE LA ACCION ENFADAO/GORRINO

        if (cursors.left.isDown){
            Player1.mueve("izquierda");
        }
        else if(cursors.right.isDown){
            Player1.mueve("derecha");
        }
        else{
            Player1.mueve("parao");
        }

        if(cursors.up.isDown){
            Player1.mueve("arriba");
        }
        if(cursors.down.isDown){
            
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


        pos_pelota = this.pelota.body.position.x;
        pos_player = Player1.sprite.body.position.x;
        diferencia = pos_pelota - pos_player;
        v_x_pelota = this.pelota.body.velocity.x;
        v_y_pelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;


        if (this.time.now < Player1.sprite.enfadao_time && Player1.sprite.enfadao){
            //pulsado izquierda o derecha solo
            if ((cursors.right.isDown || cursors.left.isDown) && !cursors.up.isDown && !cursors.down.isDown)
            {
                this.pelota.body.velocity.y = v_y_pelota*0.3;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1500;
            }
            // arriba derecha
            else if(cursors.right.isDown && cursors.up.isDown && !cursors.down.isDown)
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = 800;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba izquierda
            else if(cursors.left.isDown && cursors.up.isDown && !cursors.down.isDown)
            {
                this.pelota.body.velocity.y = -800;
                this.pelota.body.velocity.x = -800;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo y a un lado
            else if((cursors.right.isDown || cursors.left.isDown) && !cursors.up.isDown && cursors.down.isDown){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 1000;
                this.pelota.body.gravity.y = 1400;
            }
            // abajo solo
            else if(!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && cursors.down.isDown){
                this.pelota.body.velocity.y = 800;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //sin pulsar ningun lado
            else if(!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown){
                this.pelota.body.velocity.y = -100;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
            //arriba solo
            else if(!cursors.right.isDown && !cursors.left.isDown && cursors.up.isDown && !cursors.down.isDown){
                this.pelota.body.velocity.y = -1000;
                this.pelota.body.velocity.x = 300;
                this.pelota.body.gravity.y = 1400;
            }
        }

    },


};