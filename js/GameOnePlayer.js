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




        Player1 = new Player(this.game, "player1");
        Player_CPU = new Player(this.game, "cpu");
        this.game.level = 2;



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

        if (Player_CPU.sprite.body.y > this.world.height-250){
            Player_CPU.sprite.salta = false;
        }

        this.physics.arcade.collide(this.pelota, Player1.sprite, this.rebote, null, this);
        this.physics.arcade.collide(this.pelota, Player_CPU.sprite, this.rebote_CPU, null, this);

        this.physics.arcade.collide(this.pelota, platforms);

        this.physics.arcade.collide(Player1.sprite, platforms);
        this.physics.arcade.collide(Player_CPU.sprite, platforms);


        this.pelota.angle += this.pelota.body.velocity.x/20;

        //CONTROL DE LA ACCION ENFADAO/GORRINO
        if(this.time.now > (Player1.sprite.tiempo_gorrino - 100)){
            Player1.sprite.body.rotation = 0;
            Player1.sprite.hace_gorrino = false;
        }

        if(this.time.now > (Player1.sprite.tiempo_gorrino+100)){
            Player1.sprite.para_gorrino = false;
        }

        if(this.time.now > (Player_CPU.sprite.tiempo_gorrino - 100)){
            Player_CPU.sprite.body.rotation = 0;
            Player_CPU.sprite.hace_gorrino = false;
        }

        if(this.time.now > (Player_CPU.sprite.tiempo_gorrino+100)){
            Player_CPU.sprite.para_gorrino = false;
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


        this.procesa_movimientos_maquina();
       

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

    rebote_CPU: function () {
        if (this.punto){
            return true;
        }

        if (this.game.level == 0){
            this.factor_facilidad_x = 0.6;
            this.factor_facilidad_y = 0.8;
        }
        else if (this.game.level == 1){
            this.factor_facilidad_x = 0.9;
            this.factor_facilidad_y = 0.9;
        }
        else if (this.game.level == 2){
            this.factor_facilidad_x = 1;
            this.factor_facilidad_y = 1;
        }

        this.pelota.body.gravity.y = 900;
        this.pelota.body.velocity.y = -600;
        pos_pelota = this.pelota.body.position.x;
        pos_player = Player_CPU.sprite.body.position.x;
        diferencia = pos_pelota - pos_player;
        v_x_pelota = this.pelota.body.velocity.x;
        v_y_pelota = this.pelota.body.velocity.y;
        this.pelota.body.velocity.x = diferencia*3;
        if (this.time.now < Player_CPU.sprite.enfadao_time && Player_CPU.sprite.enfadao){
            //this.acho_audio2.play();
           quehago = Math.floor(Math.random() * 4);
           if (quehago == 0)
            {
                this.pelota.body.velocity.y = v_y_pelota*0.3;
                this.pelota.body.velocity.x = -800*this.factor_facilidad_x;
                this.pelota.body.gravity.y = 1500*this.factor_facilidad_x;
            }
            else if(quehago == 1){
                this.pelota.body.velocity.y = -800*this.factor_facilidad_y;
                this.pelota.body.velocity.x = 800*this.factor_facilidad_x;
                this.pelota.body.gravity.y = 1400*this.factor_facilidad_x;
            }
            else if(quehago == 2){
                this.pelota.body.velocity.y = -800*this.factor_facilidad_y;
                this.pelota.body.velocity.x = -800*this.factor_facilidad_x;
                this.pelota.body.gravity.y = 1400*this.factor_facilidad_x;
            }
            else if(quehago == 3){
                this.pelota.body.velocity.y = 800*this.factor_facilidad_y;
                this.pelota.body.velocity.x = -1000*this.factor_facilidad_x;
                this.pelota.body.gravity.y = 1400*this.factor_facilidad_x;
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
            cuantocorre_gorrino = 300;
            cuanto_tiempo_enfadao = 700;
            cuanto_tiempo_gorrino = 300;
        }
        else if (this.game.level == 1){
            cuantocorre = 125;
            cuantocorre_gorrino = 300;
            cuanto_tiempo_enfadao = 700;
            cuanto_tiempo_gorrino = 300;
        }
        else if (this.game.level == 2){
            cuantocorre = 150;
            cuantocorre_gorrino = 400;
            cuanto_tiempo_enfadao = 800;
            cuanto_tiempo_gorrino = 300;
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
            if(this.dondecae<Player_CPU.sprite.position.x && !Player_CPU.sprite.hace_gorrino){
                Player_CPU.sprite.body.velocity.x = -cuantocorre;
                if (this.time.now > Player_CPU.sprite.enfadao_time && Player_CPU.sprite.body.velocity.x != 0){
                    Player_CPU.sprite.animations.play('semueve');
                }
            }
            //si cae a mi derecha, me muevo palla
            else{
                if (!Player_CPU.sprite.hace_gorrino){
                    Player_CPU.sprite.body.velocity.x = cuantocorre;
                    if (this.time.now > Player_CPU.sprite.enfadao_time && Player_CPU.sprite.body.velocity.x != 0){
                        Player_CPU.sprite.animations.play('semueve');
                    }
                }
            }
            //si va a caer cerca, salto y me enfado
            if(this.dondecae-Player_CPU.sprite.position.x < 70 && x>440 && (Player_CPU.sprite.position.y > this.world.height-200) && (Vx<120&&Vx>-120) && (this.pelota.position.y<this.world.height-300)){
                Player_CPU.sprite.body.velocity.y = -550;
                Player_CPU.sprite.enfadao = true;
                Player_CPU.sprite.animations.play('senfada');
                Player_CPU.sprite.enfadao_time = this.time.now + cuanto_tiempo_enfadao;

            }

            //si pongo aqui el gorrino, no se equivoca
        }
        else{
            //paradico si no cae en mi campo
            Player_CPU.sprite.animations.stop();
            Player_CPU.sprite.frame = 3;
        }


        //a veces no hay donde cae y la lia la maquina, jejej
        if (this.game.level != 0){
            if(H<200){
                if(this.dondecae<Player_CPU.sprite.position.x){
                    if(Player_CPU.sprite.position.x - this.dondecae > 130 && x>440 && !Player_CPU.sprite.hace_gorrino){
                        //this.acho_audio2.play();
                        Player_CPU.sprite.body.velocity.x = -cuantocorre_gorrino;
                        Player_CPU.sprite.body.rotation = -90;
                        Player_CPU.sprite.tiempo_gorrino = this.time.now + cuanto_tiempo_gorrino;
                        Player_CPU.sprite.hace_gorrino=true;
                    }

                }
                else{
                    if(this.dondecae-Player_CPU.sprite.position.x > 130 && x>440 && !Player_CPU.sprite.hace_gorrino){
                        //this.acho_audio2.play();
                        Player_CPU.sprite.body.velocity.x = cuantocorre_gorrino;
                        Player_CPU.sprite.body.rotation = 90;
                        Player_CPU.sprite.tiempo_gorrino = this.time.now + cuanto_tiempo_gorrino;
                        Player_CPU.sprite.hace_gorrino=true;
                    }

                }
            }
        }


    },


};