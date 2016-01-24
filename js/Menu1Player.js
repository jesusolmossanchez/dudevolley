DudeVolley.Menu1Player = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

DudeVolley.Menu1Player.prototype = {


	create: function () {
		
		//situo las cosas en la pantalla
		var titulo_estirado = this.cache.getImage('titulo_estirado');
		this.titulo_estirado = this.add.sprite(this.world.centerX - titulo_estirado.width/2.0, 20, 'titulo_estirado');

		
		this.menu_1player = this.add.sprite(this.world.centerX, 300, 'menu_1player');
		this.menu_1player.anchor.setTo(0.5, 0.5);
		this.menu_1player.frame = 0;


		//Inputs
		this.cursors = this.input.keyboard.createCursorKeys();
		
		L = this.input.keyboard.addKey(Phaser.Keyboard.L);
		Z = this.input.keyboard.addKey(Phaser.Keyboard.Z);
		ENTER = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		

		this.cambia_menu = this.time.now + 200;
	},


	update: function () {
		//muevo el selector y salto al menu correspondiente

		if ((this.cursors.down.isDown || this.mueveabajo) && this.cambia_menu<this.time.now){
			this.mueveabajo = false;
			this.cambia_menu = this.time.now + 200;
			if (this.menu_1player.frame<1){
				this.menu_1player.frame++;
			}
			else{
				this.menu_1player.frame = 0;
			}
		}
		if ((this.cursors.up.isDown || this.muevearriba) && this.cambia_menu<this.time.now){
			this.muevearriba = false;
			this.cambia_menu = this.time.now + 200;
			if (this.menu_1player.frame==0){
				this.menu_1player.frame = 1;
			}
			else{
				this.menu_1player.frame--;
			}
		}

		if(L.isDown || Z.isDown || ENTER.isDown){
			switch (this.menu_1player.frame){
				case 0:
					this.juega(false);
					break;
				case 1:
					this.empieza();
					break;
			}
			
		}
	},

	
	empieza: function (pointer) {
		this.menu_1player.destroy();
		this.game.normalplayer = false;
		//dificultad jodia por defecto ( 2 )
		yomismo = this;
    	
		$("#subefoto").show();

		$('#fileToUpload').change(function() {
		  	$('#inputsubefoto').submit();
		});

		window.sube = 0;
		window.sube2 = 0;
		$("#subefoto").on('submit',(function(e) {
			e.preventDefault();
			if (window.sube < 1){
				window.sube = 1;

				$.ajax({
					url: "subeajax1.php", 
					type: "POST",             
					data: new FormData(this),
					contentType: false,   
					cache: false,      
					processData:false,    
					success: function(data){
						$("#subefoto").hide();
						$("#contiene_foto_subida").show();
						lo_que_habia = $("#contiene_foto_subida").html();
						$("#contiene_foto_subida").html(lo_que_habia+data);



						$("#sube_img_cortada").on('submit',(function(e) {
							e.preventDefault();
							if (window.sube2 < 1){
								window.sube2 = 1;
								$.ajax({
									url: "subeajax2.php", 
									type: "POST",             
									data: new FormData(this),
									contentType: false,   
									cache: false,      
									processData:false,    
									success: function(data){
										//window.ruta_jugador = data;
										

										yomismo.juega(data);
									}
								});
							}
						}));
					}
				});
			}
		}));

	},

	juega: function (ruta_jugador) {
		
		$("#contiene_foto_subida").css("display","none");
		this.game.ruta_jugador = ruta_jugador;
		this.state.start('PreOnePlayer');
	},

};