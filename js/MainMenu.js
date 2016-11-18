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

        ga('send', 'pageview', '/MainMenu');
        
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

        this.notocas = this.time.now + 10000;

        this.game.best_player_got = false;

    },

    get_creditos: function (){
        if(this.game.creditos_got){
            return;
        }
        this.menu_principal.visible = false;
        this.game.creditos_got = true;
        eljuego = this;
        $("#contiene_creditos").show();
    },

    cierra_creditos: function(){
        this.game.creditos_got = false;
        $("#contiene_creditos").hide();
        eljuego.menu_principal.visible = true;
    },


    get_best_players: function (pointer) {
        if(this.game.best_player_got){
            return;
        }
        this.game.best_player_got = true;
        eljuego = this;
        $.ajax({
            url: "best_players.php", 
            type: "GET",             
            contentType: false,   
            cache: false,      
            processData:false,    
            success: function(data){
                $("#mandapuntos").hide();
                $("#contiene_mandapuntos").show();
                $("#contiene_clasificacion").html("<dl id='titulo_nivel'></dl>");
                acho = JSON.parse(data);
                $.each(acho, function() {
                    var num = Number(this.tiempo);
                    var seconds = Math.floor(num / 1000);
                    var minutes = Math.floor(seconds / 60);
                    var seconds = seconds - (minutes * 60);
                    if (seconds<10){
                        seconds="0"+seconds;
                    }
                    var format = minutes + ':' + seconds;
                    $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<dl><dt>"+this.nombre+"</dt><dd>"+this.puntuacion+"("+format+")</dd></dl>");
                });
                $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<div style='text-align:center;'><input id='volver_menu' onclick='eljuego.cierra_best();' type='submit' value='volver' /></div>");
                eljuego.menu_principal.visible = false;
                $("#contiene_mandapuntos").css("top","120px");
                
            }
        });
    },

    cierra_best: function(){
        this.game.best_player_got = false;
        $("#contiene_mandapuntos").slideDown();
        $("#contiene_clasificacion").html('');
        $("#contiene_mandapuntos").css("top","4vw");
        this.menu_principal.visible = true;
    },


    update: function () {

        //CHECK TWITTER
        if(window.twitter_img){
            this.state.start('Menu1Player');
        }

        if(window.te_reto){
            this.state.start('GameMultiplayer');
        }

        
        //muevo el selector y salto al menu correspondiente

        if (this.time.now > this.notocas){
            this.state.start('Demo');
        }
        var juego = this;
        $(document).keyup(function(e) {
            juego.notocas = juego.time.now + 10000;
        });
        

        if ((this.cursors.down.isDown || this.mueveabajo) && this.cambia_menu<this.time.now){
            this.mueveabajo = false;
            this.cambia_menu = this.time.now + 200;
            if (this.menu_principal.frame<5){
                this.menu_principal.frame++;
            }
            else{
                this.menu_principal.frame = 0;
            }
        }
        if ((this.cursors.up.isDown || this.muevearriba) && this.cambia_menu<this.time.now){
            this.muevearriba = false;
            this.cambia_menu = this.time.now + 200;
            if (this.menu_principal.frame==0){
                this.menu_principal.frame = 5;
            }
            else{
                this.menu_principal.frame--;
            }
        }

        if(L.isDown || Z.isDown || ENTER.isDown){
            this.empieza();
        }

    },

    //CONTROL DEL SWIPE PARA SELECCIÓN
    empieza: function () {
        switch (this.menu_principal.frame){
            case this.UN_JUGADOR:
                //this.state.start('GameOnePlayer');
                this.state.start('Menu1Player');
                break;
            case this.DOS_JUGADORES:
                this.state.start('GameTwoPlayer');
                break;
            case this.JUGAR_ONLINE:
                this.state.start('GameMultiplayer');
                break;
            case this.ENTRENAMIENTO:
                this.state.start('Entrenamiento');
                break;
            case this.MEJORES_PUNTUACIONES:
                this.get_best_players();
                break;
            case this.CREDITOS:
                this.get_creditos();
                break;
        }
    }

};
