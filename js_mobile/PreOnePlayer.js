DudeVolley.PreOnePlayer = function (game) {

};

DudeVolley.PreOnePlayer.prototype = {

	preload: function (){
		if (this.game.normalplayer){
			this.load.spritesheet('player1','cpu_player/default_player.png',80,110)
		}else{
			this.load.spritesheet('player1', this.game.ruta_jugador, 80, 110);
		}
	},
	
	init: function (){
		
	},

	create: function () {

	},

	update: function () {
		this.empieza();
	},

	empieza: function (pointer) {
    	this.state.start('GameOnePlayer');
	}
};