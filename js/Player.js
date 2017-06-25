

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, quien, entrenamiento, id, tipo) {
	
    this.eljuego = juego;
    if(!tipo){
        this.tipo = 1;
    }
    else{
        this.tipo = tipo;
    }

    //console.log(this.tipo)

	if (quien === "cpu" || quien === "cpu_chick"){
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

    /* PLAYER 1 variables CHICO */
    if(this.tipo == 1){
        this.velocidad_andando = 150;
        this.velocidad_gorrino = 400;
        this.velocidad_saltando = 550;

        this.colide_time = 100;
        this.gravedad_rebote_normal = 900;
        this.velocidad_rebote_normal = -600;

        this.velocidad_lateral1 = 800;
        this.velocidad_lateral_mate = 1000;
        this.velocidad_lateral3 = 300;
        
        this.velocidad_vertical1 = 700;
        this.velocidad_vertical_mate = 800;
        this.velocidad_vertical_dejada = -100;
        this.velocidad_vertical_arriba = -1000;

        this.gravedad_pika1 = 1500;
        this.gravedad_pika2 = 1400;
        this.gravedad_pika3 = 1400;


        this.espera_saltar_maquina = 300;
    }

    /* PLAYER 1 variables CHICA */
    if(this.tipo == 2){
        this.velocidad_andando = 200;
        this.velocidad_gorrino = 500;
        this.velocidad_saltando = 640;

        this.colide_time = 100;
        this.gravedad_rebote_normal = 900;
        this.velocidad_rebote_normal = -700;

        this.velocidad_lateral1 = 700;
        this.velocidad_lateral_mate = 1000;
        this.velocidad_lateral3 = 300;
        
        this.velocidad_vertical1 = 600;
        this.velocidad_vertical_mate = 1200;
        this.velocidad_vertical_dejada = -100;
        this.velocidad_vertical_arriba = -1000;

        this.gravedad_pika1 = 1500;
        this.gravedad_pika2 = 1400;
        this.gravedad_pika3 = 1800;



        this.espera_saltar_maquina = 500;
    }



    this.mueve = function(adonde) {
        if(this.sprite.haceGorrino){
            if (adonde == "izquierda" && this.sprite.body.touching.down && !this.sprite.paraGorrino){
                //this.acho_audio2.play("",0,0.3);
                if(this.sprite.position.x > this.sprite.limiteIzquierda){
                	this.sprite.body.velocity.x = -this.velocidad_gorrino;
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
                	this.sprite.body.velocity.x = this.velocidad_gorrino;
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
                if (juego.time.now > this.sprite.enfadaoTime){
                        if(this.sprite.body.touching.down){
                            this.sprite.animations.play('semueve');
                        }
                        else{
            				this.sprite.animations.play('salta');
            			}
                }
                if(this.sprite.position.x > this.sprite.limiteIzquierda){
                	this.sprite.body.velocity.x = -this.velocidad_andando;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
            }
            else if (adonde == "derecha"){
                
                if (juego.time.now > this.sprite.enfadaoTime){
        			if(this.sprite.body.touching.down){
        				this.sprite.animations.play('semueve');
        			}
        			else{
        				this.sprite.animations.play('salta');
        			}
                }
                if(this.sprite.position.x < this.sprite.limiteDerecha){
                    this.sprite.body.velocity.x = this.velocidad_andando;
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
                this.sprite.body.velocity.y = -this.velocidad_saltando;
                this.sprite.salta = true;
                this.sprite.animations.play('salta');
                
            }
        }

    }


    this.procesa_movimientos_maquina = function (juego) {
        x = juego.pelota.body.position.x
        //y=515;
        H = (juego.pelota.body.position.y-(juego.world.height-185))*(-1);
        Vx = juego.pelota.body.velocity.x
        Vy = juego.pelota.body.velocity.y;

        if (juego.game.level == 0){
            cuantocorre = 135;
            cuanto_salta = -550;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 700;
            cuantoTiempoGorrino = 300;
        }
        else if (juego.game.level == 1){
            cuantocorre = 125;
            cuanto_salta = -550;
            cuantocorreGorrino = 300;
            cuantoTiempoEnfadao = 700;
            cuantoTiempoGorrino = 300;
        }
        else if (juego.game.level == 2){
            if(this.tipo == 1){
                cuantocorre = 135;
                cuanto_salta = -550;
                cuantocorreGorrino = 300;
            }
            if(this.tipo == 2){
                cuantocorre = 175;
                cuanto_salta = -640;
                cuantocorreGorrino = 400;
            }
            cuantoTiempoEnfadao = 800;
            cuantoTiempoGorrino = 300;
        }
        
        
        //calcula donde cae
        if (Vy<0){
            Vy = Vy*(-1);
            juego.dondecae = x + (Vx)/juego.pelota.body.gravity.y * Math.sqrt((2*juego.pelota.body.gravity.y*H)+(Vx));
            if (juego.dondecae>juego.world.width){
                juego.dondecae = juego.world.width -(juego.dondecae-juego.world.width);
            }
            else if(juego.dondecae<0){
                juego.dondecae = -(juego.dondecae);
            }
        }else{
            //solo calculo donde cae si se mueve abajo(la pelota)
        }

        //si cae en mi campo
        if(juego.dondecae > (juego.world.width/2 - 50)){
            //si cae a mi izquierda, me muevo pallá
            if(juego.dondecae<this.sprite.position.x && !this.sprite.haceGorrino && this.sprite.position.x > this.sprite.limiteIzquierda){
                this.sprite.body.velocity.x = -cuantocorre;
                if (juego.time.now > this.sprite.enfadaoTime && this.sprite.body.velocity.x != 0){
                    this.sprite.animations.play('semueve');
                }
            }
            //si cae a mi derecha, me muevo palla
            else{
                if (!this.sprite.haceGorrino){
                    this.sprite.body.velocity.x = cuantocorre;
                    if (juego.time.now > this.sprite.enfadaoTime && this.sprite.body.velocity.x != 0){
                        this.sprite.animations.play('semueve');
                    }
                }
            }
            //si va a caer cerca, salto y me enfado
            if(juego.dondecae-this.sprite.position.x < 70 && 
                x>juego.world.width/2 && 
                (this.sprite.position.y > juego.world.height-200) && 
                (Vx<120&&Vx>-120) && 
                (juego.pelota.position.y<juego.world.height-this.espera_saltar_maquina)){

                this.sprite.body.velocity.y = cuanto_salta;
                this.sprite.enfadao = true;
                this.sprite.animations.play('senfada');
                this.sprite.enfadaoTime = juego.time.now + cuantoTiempoEnfadao;

            }

            //si pongo aqui el gorrino, no se equivoca
        }
        else{

            juego.cincoMovimientos = (++juego.cincoMovimientos % 60);
            
            if (juego.cincoMovimientos > 58){
                ale = Math.random();
                
                if (ale > 0.9 && this.sprite.position.y > juego.world.height-200){
                    this.sprite.body.velocity.y = -cuanto_salta;
                }
                if (ale>0.5 && this.sprite.body.position.x > 440){
                    this.sprite.body.velocity.x = -100;
                }
                else if(ale <0.5){
                    this.sprite.body.velocity.x = 100;
                }
                juego.dondeVaCpu = this.sprite.body.velocity.x;
            }
            else{
                
                this.sprite.body.velocity.x = juego.dondeVaCpu;
            }

            this.sprite.animations.play('semueve');
        }


        //a veces no hay donde cae y la lia la maquina, jejej
        if (juego.game.level != 0){
            if(H<200 && this.sprite.body.touching.down){
                if(juego.dondecae<this.sprite.position.x && this.sprite.position.x > this.sprite.limiteIzquierda){
                    if(this.sprite.position.x - juego.dondecae > 130 && x>440 && !this.sprite.haceGorrino){
                        //juego.acho_audio2.play();
                        this.sprite.body.velocity.x = -cuantocorreGorrino;
                        this.sprite.body.rotation = -90;
                        this.sprite.tiempoGorrino = juego.time.now + cuantoTiempoGorrino;
                        this.sprite.haceGorrino=true;
                    }

                }
                else{
                    if(juego.dondecae-this.sprite.position.x > 130 && x>440 && !this.sprite.haceGorrino){
                        //juego.acho_audio2.play();
                        this.sprite.body.velocity.x = cuantocorreGorrino;
                        this.sprite.body.rotation = 90;
                        this.sprite.tiempoGorrino = juego.time.now + cuantoTiempoGorrino;
                        this.sprite.haceGorrino=true;
                    }

                }
            }
        }


    }


    this.rebote = function(juego) {
        if (juego.punto){
            juego.esperaCollide1 = juego.time.now + 1500;
            return true;
        }

        juego.esperaCollide1 = juego.time.now + this.colide_time;

        juego.pelota.body.gravity.y = this.gravedad_rebote_normal;
        juego.pelota.body.velocity.y = this.velocidad_rebote_normal;

        var posXPelota = juego.pelota.body.position.x;
        var posXPlayer = Player1.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = juego.pelota.body.velocity.x;
        var VyPelota = juego.pelota.body.velocity.y;
        juego.pelota.body.velocity.x = diferencia*3;


        if (juego.time.now < Player1.sprite.enfadaoTime && Player1.sprite.enfadao){
            //pulsado izquierda o derecha solo
            if (((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && !ABAJO.isDown) || ((juego.muevederecha || juego.mueveizquierda) && !juego.muevearriba && !juego.mueveabajo))
            {
                juego.pelota.body.velocity.y = VyPelota*0.3;
                juego.pelota.body.velocity.x = this.velocidad_lateral1;
                juego.pelota.body.gravity.y = this.gravedad_pika1;
            }
            // arriba derecha
            else if((DERECHA.isDown && ARRIBA.isDown && !ABAJO.isDown) || (juego.muevederecha && juego.muevearriba && !juego.mueveabajo) )
            {
                juego.pelota.body.velocity.y = -this.velocidad_vertical1;
                juego.pelota.body.velocity.x = this.velocidad_lateral1;
                juego.pelota.body.gravity.y = this.gravedad_pika2;
            }
            //arriba izquierda
            else if((IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown) || (juego.mueveizquierda && juego.muevearriba && !juego.mueveabajo) )
            {
                juego.pelota.body.velocity.y = -this.velocidad_vertical1;
                juego.pelota.body.velocity.x = -this.velocidad_lateral1;
                juego.pelota.body.gravity.y = this.gravedad_pika2;
            }
            // abajo y a un lado
            else if(((DERECHA.isDown || IZQUIERDA.isDown) && !ARRIBA.isDown && ABAJO.isDown) || ((juego.mueveizquierda || juego.muevederecha) && !juego.muevearriba && juego.mueveabajo)){
                juego.pelota.body.velocity.y = this.velocidad_vertical_mate;
                juego.pelota.body.velocity.x = this.velocidad_lateral_mate;
                juego.pelota.body.gravity.y = this.gravedad_pika3;
            }
            // abajo solo
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && ABAJO.isDown)||(!juego.muevederecha && !juego.mueveizquierda && !juego.muevearriba && juego.mueveabajo)){
                juego.pelota.body.velocity.y = this.velocidad_vertical_mate;
                juego.pelota.body.velocity.x = this.velocidad_lateral3;
                juego.pelota.body.gravity.y = this.gravedad_pika2;
            }
            //sin pulsar ningun lado
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && !ARRIBA.isDown && !ABAJO.isDown)&&(!juego.muevederecha && !juego.mueveizquierda && !juego.muevearriba && !juego.mueveabajo)){
                juego.pelota.body.velocity.y = this.velocidad_vertical_dejada;
                juego.pelota.body.velocity.x = this.velocidad_lateral3;
                juego.pelota.body.gravity.y = this.gravedad_pika2;
            }
            //arriba solo
            else if((!DERECHA.isDown && !IZQUIERDA.isDown && ARRIBA.isDown && !ABAJO.isDown)||(!juego.muevederecha && !juego.mueveizquierda && juego.muevearriba && !juego.mueveabajo)){
                juego.pelota.body.velocity.y = this.velocidad_vertical_arriba;
                juego.pelota.body.velocity.x = this.velocidad_lateral3;
                juego.pelota.body.gravity.y = this.gravedad_pika2;
            }
        }
    }


    this.rebote_CPU = function (juego) {
        if (juego.punto){
            juego.esperaCollide2 = juego.time.now + 1500;
            return true;
        }

        juego.esperaCollide2 = juego.time.now + 100;

        if (juego.game.level == 0){
            juego.factorFacilidadX = 0.6;
            juego.factorFacilidadY = 0.8;
        }
        else if (juego.game.level == 1){
            juego.factorFacilidadX = 0.9;
            juego.factorFacilidadY = 0.9;
        }
        else if (juego.game.level == 2){
            juego.factorFacilidadX = 1;
            juego.factorFacilidadY = 1;
        }


        juego.pelota.body.gravity.y = this.gravedad_rebote_normal;
        juego.pelota.body.velocity.y = this.velocidad_rebote_normal;

        var posXPelota = juego.pelota.body.position.x;
        var posXPlayer = this.sprite.body.position.x;
        var diferencia = posXPelota - posXPlayer;
        var VxPelota = juego.pelota.body.velocity.x;
        var VyPelota = juego.pelota.body.velocity.y;
        juego.pelota.body.velocity.x = diferencia*3;
        

        if (juego.time.now < this.sprite.enfadaoTime && this.sprite.enfadao){
            //juego.acho_audio2.play();

            
            if(((posXPlayer - juego.world.width/2) < 110) && this.tipo == 2 && (Math.random() > 0.3)){

                juego.pelota.body.velocity.y = this.velocidad_vertical_mate;
                juego.pelota.body.velocity.x = -this.velocidad_lateral_mate;
                juego.pelota.body.gravity.y = this.gravedad_pika3;

            }
            else{
                quehago = Math.floor(Math.random() * 4);
                if (this.sprite.position.x > 450 & quehago == 3){
                    quehago = Math.floor(Math.random() * 3);
                }
                if (quehago == 0){
                    juego.pelota.body.velocity.y = VyPelota*0.3;
                    juego.pelota.body.velocity.x = -this.velocidad_lateral1*juego.factorFacilidadX;
                    juego.pelota.body.gravity.y = this.gravedad_pika1*juego.factorFacilidadX;
                }
                else if(quehago == 1){
                    juego.pelota.body.velocity.y = -this.velocidad_vertical1*juego.factorFacilidadY;
                    juego.pelota.body.velocity.x = this.velocidad_lateral1*juego.factorFacilidadX;
                    juego.pelota.body.gravity.y = this.gravedad_pika2*juego.factorFacilidadX;
                }
                else if(quehago == 2){
                    juego.pelota.body.velocity.y = -this.velocidad_vertical1*juego.factorFacilidadY;
                    juego.pelota.body.velocity.x = -this.velocidad_lateral1*juego.factorFacilidadX;
                    juego.pelota.body.gravity.y = this.gravedad_pika2*juego.factorFacilidadX;
                }
                else if(quehago == 3){
                    juego.pelota.body.velocity.y = this.velocidad_vertical_mate*juego.factorFacilidadY;
                    juego.pelota.body.velocity.x = -1000*juego.factorFacilidadX;
                    juego.pelota.body.gravity.y = this.gravedad_pika2*juego.factorFacilidadX;
                }              
            }


            
            
        }
    }

};
