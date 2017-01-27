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

        this.load.image('joy_back', 'assets/joy_back2.png');
        this.load.image('joy_front', 'assets/joy_front.png');
        this.load.image('pika', 'assets/pika.png');
        
    },

    create: function () {

        this.preloadBar.cropEnabled = false;

        this.ready = true;
        
        this.state.start('GamePartyController');
        
        
    },

    update: function () {


    }

};
