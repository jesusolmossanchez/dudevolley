

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(juego, quien) {
	
	if (quien === "cpu"){
        this.sprite =juego.add.sprite(juego.world.width - 52, juego.world.height - 250, quien);
        this.sprite.animations.add('senfada', [0], 5, true);
        this.sprite.animations.add('semueve', [2, 3], 7, true);
        this.sprite.animations.add('salta', [1], 5, true);
        this.sprite.limite_izquierda = 470;
        this.sprite.limite_derecha = 800;
        this.soyplayer1 = false; 
        this.frame_parao = 3;
    }
    else{
        this.sprite =juego.add.sprite(32, juego.world.height - 250, quien);
        this.sprite.animations.add('semueve', [0, 1], 7, true);
        this.sprite.animations.add('senfada', [3], 5, true);
        this.sprite.animations.add('salta', [2], 5, true);
        this.sprite.limite_izquierda = 0;
        this.sprite.limite_derecha = 330;
        this.soyplayer1 = true;
        this.frame_parao = 0; 
    }
	

	juego.physics.arcade.enable(this.sprite);
	this.sprite.anchor.setTo(0.5, 0.5);

	this.sprite.body.bounce.y = 0;
    this.sprite.body.gravity.y = 800;
    this.sprite.body.collideWorldBounds = true;

    this.sprite.enfadao = false;
    this.sprite.enfadao_time = juego.time.now;

 	this.sprite.tiempo_gorrino = juego.time.now;
    this.sprite.hace_gorrino = false;


    this.sprite.frame = 1;

    this.mueve = function(adonde) {
        if(this.sprite.hace_gorrino){
            if (adonde == "izquierda" && this.sprite.body.touching.down && !this.sprite.para_gorrino){
                //this.acho_audio2.play("",0,0.3);
                if(this.sprite.position.x > this.sprite.limite_izquierda){
                	this.sprite.body.velocity.x = -400;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
                this.sprite.rotation = -90;

                this.sprite.para_gorrino = true;
            }
            else if (adonde == "derecha" && this.sprite.body.touching.down && !this.sprite.para_gorrino){
                //this.acho_audio2.play("",0,0.3);
                if(this.sprite.position.x < this.sprite.limite_derecha){
                	this.sprite.body.velocity.x = 400;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
                this.sprite.rotation = 90;
                this.sprite.para_gorrino = true;
            }
        }
        else{
            if (adonde == "izquierda"){
                if (juego.time.now > this.sprite.enfadao_time && this.sprite.salta != true){
                    this.sprite.animations.play('semueve');
                }
                if(this.sprite.position.x > this.sprite.limite_izquierda){
                	this.sprite.body.velocity.x = -150;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
            }
            else if (adonde == "derecha"){
                if (juego.time.now > this.sprite.enfadao_time && this.sprite.salta != true){
                    this.sprite.animations.play('semueve');
                }
                if(this.sprite.position.x < this.sprite.limite_derecha){
                	this.sprite.body.velocity.x = 150;
                }
                else{
                	this.sprite.body.velocity.x = 0;
                }
            }
            else
            {
                if (adonde == "parao" && juego.time.now > this.sprite.enfadao_time){
                    this.sprite.animations.stop();
                    this.sprite.body.velocity.x = 0;
                    this.sprite.frame = this.frame_parao;
                }
            }

            if(adonde == "arriba" && !this.sprite.hace_gorrino && this.sprite.body.touching.down){
                this.sprite.body.velocity.y = -550;
                this.sprite.salta = true;
                this.sprite.animations.play('salta');
                
            }
        }

    }

};