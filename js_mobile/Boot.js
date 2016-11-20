var DudeVolley = {};

DudeVolley.Boot = function (game) {
    
};

DudeVolley.Boot.prototype = {
    init: function () {
        //CHECK TWITTER
        if(window.twitter_img){
            ga('send', 'pageview', '/Boot_tw');
        }
        else{
            ga('send', 'pageview', '/Boot');
        }

        //cuando no está activa la pestaña, el juego se pausa
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop){

            $(document).one('click',function(event) {
                if($(event.target).is(".clickable, .clickable *")) return;
                $("#usa_flechas").show();
                
                $("#cierra_usaflechas").one('click', function(e) {
                    $("#usa_flechas").hide();
                });
            });

            //si escritorio
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //TODO: ver como se ve en pantallas grandes
            this.scale.maxHeight = $(window).height();
            this.scale.maxWidth = 800 * this.scale.maxHeight / 685;
        }
        else
        {
            //si no escritotio
            window.onresize = this.rescale.bind(this);
            //this.doOnOrientationChange();
            //cosas del escalado
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.scale.forceOrientation(false, true);
            this.scale.enterIncorrectOrientation.add(this.handleIncorrect);
            this.scale.leaveIncorrectOrientation.add(this.handleCorrect);
            
            
            this.scale.maxHeight = $(window).height();
            this.scale.maxWidth = 1250 * $(window).height() / 685;

        }

    },
    handleIncorrect: function(){
        $("#orientacion_incorrecta").hide();
    },
    
    handleCorrect: function(){
        $("#orientacion_incorrecta").show();
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
        this.scale.maxWidth = 1250 * this.scale.maxHeight / 685;
    },

  
};