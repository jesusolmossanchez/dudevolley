

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, quien, entrenamiento, id, donde) {
	
    if(!donde){
        donde = 40;
    }
    else{
        donde = donde + 40;
    }

	if (quien === "cpu"){
        this.sprite =juego.add.sprite(juego.world.width - donde, juego.world.height - 250, quien);
        this.sprite.animations.add('senfada', [0], 5, true);
        this.sprite.animations.add('semueve', [2, 3], 7, true);
        this.sprite.animations.add('salta', [1], 5, true);
        this.sprite.limiteIzquierda = (juego.world.width/2)+40;
        this.sprite.limiteDerecha = 800;
        this.soyplayer1 = false; 
        this.frameParao = 3;
    }
    else{
        this.sprite =juego.add.sprite(donde, juego.world.height - 250, quien);
        this.sprite.animations.add('semueve', [0, 1], 7, true);
        this.sprite.animations.add('senfada', [3], 5, true);
        this.sprite.animations.add('salta', [2], 5, true);
        this.sprite.limiteIzquierda = 0;
        if (!entrenamiento){
            this.sprite.limiteDerecha = (juego.world.width/2)-40;
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

};