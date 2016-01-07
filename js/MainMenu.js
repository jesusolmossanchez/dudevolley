
DudeVolley.MainMenu = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;
	this.UN_JUGADOR = 0;
	this.DOS_JUGADORES = 1;
	this.JUGAR_ONLINE = 2;
	this.ENTRENAMIENTO = 3;
	this.MEJORES_PUNTUACIONES = 4;
	this.CREDITOS = 5;

};

DudeVolley.MainMenu.prototype = {


	create: function () {
		
		

		//situo las cosas en la pantalla
		var titulo_estirado = this.cache.getImage('titulo_estirado');
		this.titulo_estirado = this.add.sprite(this.world.centerX - titulo_estirado.width/2.0, 20, 'titulo_estirado');

		
		this.menu_principal = this.add.sprite(this.world.centerX, 300, 'menu_principal');
		this.menu_principal.anchor.setTo(0.5, 0.5);
		this.menu_principal.frame = 0;


		//Inputs
		this.cursors = this.input.keyboard.createCursorKeys();
		
		L = this.input.keyboard.addKey(Phaser.Keyboard.L);
		Z = this.input.keyboard.addKey(Phaser.Keyboard.Z);
		ENTER = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		

		this.cambia_menu = this.time.now + 200;



	},

	update: function () {

		if (this.cursors.down.isDown && this.cambia_menu<this.time.now){
			this.cambia_menu = this.time.now + 200;
			if (this.menu_principal.frame<5){
				this.menu_principal.frame++;
			}
			else{
				this.menu_principal.frame = 0;
			}
		}
		if (this.cursors.up.isDown && this.cambia_menu<this.time.now){
			this.cambia_menu = this.time.now + 200;
			if (this.menu_principal.frame==0){
				this.menu_principal.frame = 5;
			}
			else{
				this.menu_principal.frame--;
			}
		}

		if(L.isDown || Z.isDown || ENTER.isDown){
			switch (this.menu_principal.frame){
				case this.UN_JUGADOR:
					this.state.start('GameOnePlayer');
					break;
				case this.DOS_JUGADORES:
					this.state.start('GameTwoPlayer');
					break;
				case this.JUGAR_ONLINE:
					console.log("JUGAR_ONLINE");
					break;
				case this.ENTRENAMIENTO:
					this.state.start('Entrenamiento');
					break;
				case this.MEJORES_PUNTUACIONES:
					console.log("MEJORES_PUNTUACIONES");
					break;
				case this.CREDITOS:
					//Pongo la demo aqui de momento para probar
					//TODO: Poner la demo donde corresponda
					this.state.start('Demo');
					break;
			}
		}

	}

};
