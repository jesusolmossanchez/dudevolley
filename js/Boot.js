var DudeVolley = {};

DudeVolley.Boot = function (game) {
    
};

DudeVolley.Boot.prototype = {
    init: function () {
        //cuando no está activa la pestaña, el juego se pausa
        this.stage.disableVisibilityChange = true;

        //si escritorio
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //TODO: ver como se ve en pantallas grandes
        this.scale.maxHeight = $(window).height();
        this.scale.maxWidth = 800 * this.scale.maxHeight / 685;
        

    },

    preload: function () {
        //imagen para empezar y barra de progreso
        this.load.image('titulo', 'assets/dude_volley_title.png');
        this.load.image('preloaderBar', 'assets/cargando_dude.png');

    },

    create: function () {
        //lanza precarga
        this.state.start('Preloader');

    },

    rescale : function () {
        this.scale.setShowAll();
        this.scale.maxHeight = $(window).height();
        this.scale.maxWidth = 800 * this.scale.maxHeight / 685;
    },

  
};