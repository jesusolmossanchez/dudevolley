
DudeVolley.GameOver = function (game) {



};

DudeVolley.GameOver.prototype = {

	create: function () {

		var rutajuagdor = this.game.ruta_jugador;

		relacion = $(window).height()/$(window).width();
		//relacion = 1-relacion;
		if (relacion < 1){
			//relacion=relacion+1.5;
			letra1 = $(window).height()/9;
			letra2 = $(window).height()/14;
			letra3 = $(window).height()/20;

			borde = $(window).height()/40;
			ancho = $(window).height()/2;

			$("#puntos").css("font-size",letra1+"px");

			$("#texto_fin").css("font-size",letra2+"px");
			$("#envia_tus_puntos").css("font-size",letra2+"px");

			$("#inputtunombre").css("font-size",letra2+"px");
			$("#inputtunombre").css("padding",borde+"px");
			$("#inputtunombre").css("width",ancho+"px");
			$("#inputtunombre").css("border",borde+"px solid #f5f823");
			$("#envia_tu_nombre").css("font-size",letra2+"px");
			$("#envia_tu_nombre").css("padding",borde+"px");
			$("#envia_tu_nombre").css("border",borde+"px solid #f5f823");

			$("#contiene_mandapuntos").css("font-size",letra3+"px");
			$("#contiene_clasificacion").css("font-size",letra3+"px");

		}            
		
		
		this.add.sprite(0, 0, 'game_over_back');


		var diferencia = this.game.puntosPlayer1 - this.game.puntosPlayer2;
		var puntuacion = this.game.puntosPlayer1+" - "+this.game.puntosPlayer2;

		
		if(this.game.unplayer){
			var tiempofinal = this.time.now - this.game.empieza;
			var resultado;
			var level;
			if(this.game.hasperdio == true){
				resultado = "lost";
			}
			else{
				resultado = "won";
			}

			
		}

		else{
			var nombreGanador;
			
			if (this.game.multiplayer){
				nombreGanador = this.game.nombre_ganador;
			}
			else if(this.game.hasperdio){
				nombreGanador = "Player2";
			}
			else{
				nombreGanador = "Player1";
			}
			
		}
		
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.ganador = this.add.sprite(32, this.world.height - 250, this.game.ganador.key);
		this.perdedor = this.add.sprite(this.world.width/2, this.world.height - 250, this.game.perdedor.key);

		this.ganador.anchor.setTo(0.5, 0.5);
		this.perdedor.anchor.setTo(0.5, 0.5);

		//Fisica de jugadores y this.pelota
		this.physics.arcade.enable(this.ganador);
		this.physics.arcade.enable(this.perdedor);

		//Fisica del jugador
		this.ganador.body.bounce.y = 0;
		this.ganador.body.gravity.y = 800;
		this.ganador.body.collideWorldBounds = true;

		this.perdedor.body.bounce.y = 0;
		this.perdedor.body.gravity.y = 800;
		this.perdedor.body.collideWorldBounds = true;

		this.pelota = this.add.sprite(300, this.world.height - 130, 'pelota');
		this.pelota.anchor.setTo(0.5, 0.5);
		this.pelota.angle = Math.floor((Math.random() * 180) + 1); 
		this.explota = this.add.sprite(300, this.world.height - 150, 'explota');

		//animaciones de movimiento
		this.ganador.animations.add('semueve', [0, 1], 7, true);
		this.perdedor.animations.add('semueve2', [0, 1], 7, true);
		this.ganador.animations.add('senfada', [2, 3], 7, true);
		this.perdedor.animations.add('senfada2', [2, 3], 7, true);

		var play_again = this.cache.getImage('play_again');
		this.play_again = this.add.sprite(this.world.centerX - play_again.width/2.0,470,'play_again');
		this.play_again.inputEnabled = true;
		this.play_again.input.sprite.events.onInputDown.add(this.empieza, this);



	},

	update: function () {
		if (this.ganador.body.x >= (this.world.width-180))
		{
			this.ganador.body.velocity.x = -150;
		}
		if(this.ganador.body.x <= 140){
			this.ganador.body.velocity.x = 150;
		}
		this.ganador.animations.play('semueve');
		this.perdedor.animations.play('senfada');
		this.perdedor.body.rotation = 90;
		if (this.ganador.body.y > (this.world.height-190))
		{
			this.ganador.body.velocity.y = -550;
		}
		if (this.perdedor.body.y > (this.world.height-180))
		{
			this.perdedor.body.velocity.y = 0;
			this.perdedor.body.y = this.world.height-180;
		}
		
		if(SUPERPIKA.isDown || SUPERPIKA2.isDown){
			this.state.start('Preloader');
		} 

	},

	empieza: function(){
		location.reload();
	}

};