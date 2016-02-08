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
        this.load.image('red', 'assets/new_red.png'); // red -- cambiar
        this.load.image('pelota', 'assets/new_pelota.png');

        this.load.image('sombra', 'assets/sombra.png'); //sombra -- OK
        this.load.image('explota', 'assets/explota.png');

        this.load.image('game_over_back', 'assets/game_over_back.png'); //background final -- cambiar

        this.load.image('play_again', 'assets/play_again.png'); //TODO: Poner en español!


        this.load.spritesheet('player1','assets/default_player.png',80,110);
        this.load.spritesheet('cpu','cpu_player/cpu_player.png',80,110);

      

        if (this.game.device.desktop){
            this.load.spritesheet('menu_principal', 'assets/menu_sprite.png', 400, 400); // MENU PRINCIPAL
            this.load.image('volver', 'assets/volver.png');
            this.load.image('tip1', 'assets/muevete.png');
            this.load.image('tip2', 'assets/salta_arriba.png');
            this.load.image('tip3', 'assets/gorrino.png');
            this.load.image('tip4', 'assets/mate.png');
        }
        else{
            //TODO: imagenes explicativas para el movil
            this.load.spritesheet('menu_principal', 'assets/menu_sprite.png', 400, 400); // MENU PRINCIPAL
            this.load.image('volver', 'assets/volver.png');
            this.load.image('tip1', 'assets/muevete_movil.png');
            this.load.image('tip2', 'assets/salta_arriba_movil.png');
            this.load.image('tip3', 'assets/gorrino_movil.png');
            this.load.image('tip4', 'assets/mate_movil.png');
        }

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
