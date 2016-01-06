DudeVolley.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;
	this.ready = false;

};

DudeVolley.Preloader.prototype = {

	preload: function () {

		//situo el titulo y la barra de carga
		var titulo = this.cache.getImage('titulo');
		this.background = this.add.sprite(this.world.centerX - titulo.width/2.0, 120, 'titulo');
		this.preloadBar = this.add.sprite(240, 400, 'preloaderBar');

		//carga la barra horizontalmente(con crop)
		this.load.setPreloadSprite(this.preloadBar);

		//carga de imagenes
	    this.load.spritesheet('menu_principal', 'assets/menu_sprite.png', 400, 400); // MENU PRINCIPAL
	    this.load.image('titulo_estirado', 'assets/dude_volley.png');

	    this.load.image('sky', 'assets/new_campo2.png'); // background principal -- cambiar
	    this.load.image('ground', 'assets/platform2.png'); // suelo
	    this.load.image('red', 'assets/new_red.png'); // red -- cambiar
	    this.load.image('pelota', 'assets/new_pelota.png');


	    this.load.spritesheet('player1','assets/default_player.png',80,110)
	    this.load.spritesheet('cpu','assets/cpu_player.png',80,110)

	},

	create: function () {

		this.preloadBar.cropEnabled = false;

		this.ready = true;
		this.state.start('MainMenu');
		
	},

	update: function () {


	}

};
