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
        
        this.load.spritesheet('menu_1player', 'assets/menu_1player.png', 400, 270); // MENU 1 PLAYER
        this.load.image('titulo_estirado', 'assets/dude_volley.png');

        this.load.image('sky', 'assets/new_campo2.png'); // background principal -- cambiar
        this.load.image('ground', 'assets/platform2.png'); // suelo
        this.load.image('fake_lateral', 'assets/fake_lateral.png'); // suelo
        this.load.image('red', 'assets/new_red.png'); // red -- cambiar
        this.load.image('pelota', 'assets/new_pelota.png');

        this.load.image('sombra', 'assets/sombra.png'); //sombra -- OK
        this.load.image('explota', 'assets/explota.png');

        this.load.image('game_over_back', 'assets/game_over_back.png'); //background final -- cambiar

        this.load.image('volver_a_jugar', 'assets/volver_a_jugar.png');
        this.load.image('seleccionar', 'assets/seleccionar.png');

        //this.load.image('swipe_to_play', 'assets/swipe_to_play.png');


        this.load.spritesheet('player1','assets/default_player.png',80,110);
        this.load.spritesheet('cpu','cpu_player/cpu_player.png',80,110);

        //avion publicitario
        this.load.spritesheet('avion','assets/avion.png',502,101);


        this.load.image('volver', 'assets/volver.png');
        this.load.image('tip1', 'assets/muevete.png');
        this.load.image('tip2', 'assets/salta_arriba.png');
        this.load.image('tip3', 'assets/gorrino.png');
        this.load.image('tip4', 'assets/mate.png');

      

        if (this.game.device.desktop){
            this.load.spritesheet('menu_principal', 'assets/menu_sprite_new.png', 400, 400); // MENU PRINCIPAL
            
        }
        else{
            this.load.spritesheet('menu_principal', 'assets/menu_sprite_movil_new.png', 400, 400); // MENU PRINCIPAL
            this.load.image('joy_back', 'assets/joy_back2.png');
            this.load.image('joy_front', 'assets/joy_front.png');
            this.load.image('vacio', 'assets/vacio.png');
            this.load.image('pika', 'assets/pika.png');
        }

        this.load.audio('musica', ['assets/musica.mp3', 'assets/musica.ogg']);

    },

    create: function () {

        this.preloadBar.cropEnabled = false;

        this.ready = true;

        if (this.game.device.desktop){
            this.state.start('MainMenu');
        }
        else{
            this.state.start('MovilMainMenu');
        }
        
    },

    update: function () {


    }

};
