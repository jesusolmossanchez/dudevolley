var DudeVolley = {};

DudeVolley.Boot = function (game) {
    
};

DudeVolley.Boot.prototype = {
    init: function () {
        //cuando no está activa la pestaña, el juego se pausa
        this.stage.disableVisibilityChange = true;
    },

    preload: function () {
        //imagen para empezar y barra de progreso
        this.load.image('titulo', 'assets/dude_volley_title.png');
        this.load.image('preloaderBar', 'assets/cargando_dude.png');

    },

    create: function () {
        //lanza precarga
        this.state.start('Preloader');

    }
};