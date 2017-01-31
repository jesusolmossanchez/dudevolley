
DudeVolley.GamePartyController = function (game) {

};

DudeVolley.GamePartyController.prototype = {

    init: function () {

        ga('send', 'pageview', '/GamePartyController');

        //alias para el objeto del juego
        eljuego = this;

        /***********************************************************************
        ***********************************************************************
                        START -- MANEJO DE SOCKET
        ***********************************************************************
        ***********************************************************************/

        if (typeof io == "undefined"){
            //TODO: Hacer algo... no funciona el socket
        }

        //conecto con socket
        //socket = io.connect("http://188.166.12.42:8081", {port: 8081, transports: ["websocket"]});
        socket = io.connect("http://localhost:8081", {port: 8081, transports: ["websocket"]});

        //llamo a la función que maneja los mensajes recibidos
        setEventHandlers();

        function onSocketConnected() {
            $("#socket_overlay").show();
            $("#socket_room").focus();

            var id_socket = this.id;
            window.id_socket = id_socket;

            //Cambiar por submit?
            $("#socket_empezar").click(function(){
                window.room = $("#input_codigo_partida").val();
                socket.emit("new_controller", {id: window.id_socket, id_room: window.room});
            });
        }


        // En desconexión ¿Hacer algo?
        function onSocketDisconnect() {

        }

        //TODO: Partida completa, mostrar algo o hacer algo (¿Rey de la pista?)
        function onPartidaCompleta() {

        }




        //manejador de eventos
        function setEventHandlers() {
            // Socket connection successful
            socket.on("connect", onSocketConnected);
            // Socket disconnection
            socket.on("disconnect", onSocketDisconnect);

            // TODO: Partida llena
            socket.on("partida_completa", onPartidaCompleta);
            
        }


        /***********************************************************************
        ***********************************************************************
                        END -- MANEJO DE SOCKET
        ***********************************************************************
        ***********************************************************************/

        //TODO: Colocar el joystick en su sitio y tamaño
        this.joy = new Joystick(this.game, 120, this.world.height - 100);

        this.movil_accion = this.add.sprite(this.world.width - 100, this.world.height - 100, 'pika');
        this.movil_accion.anchor.setTo(0.5, 0.5);
        this.movil_accion.inputEnabled = true;
        this.movil_accion.input.sprite.events.onInputDown.add(this.entra_movil_accion, this);
        this.movil_accion.input.sprite.events.onInputUp.add(this.sal_movil_accion, this);
        

        /***********************************************************************
        ***********************************************************************
                        START -- INICIALIZACIÓN DE COSAS IMPORTANTES
        ***********************************************************************
        ***********************************************************************/


        this.muevederecha = false;
        this.mueveizquierda = false;
        this.muevearriba = false;
        this.mueveabajo = false;

        /***********************************************************************
        ***********************************************************************
                        END -- INICIALIZACIÓN DE COSAS IMPORTANTES
        ***********************************************************************
        ***********************************************************************/


    },



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///

    entra_movil_accion: function (){
        this.click_accion = true;
    },

    sal_movil_accion: function (){
        this.click_accion = false;
    },

    update: function () {

        /***********************************************************************
        ***********************************************************************
                        START -- MOVIMIENTOS JUGADORES
        ***********************************************************************
        ***********************************************************************/                      

       

            //MOVIMIENTOS PLAYER1
            if(this.click_accion){
                socket.emit("accion_pulsado", {id: window.id_socket, room: window.room});
            }
            else{
                socket.emit("accion_suelto", {id: window.id_socket, room: window.room});
            }


            this.joy.update();
            this.joy.holder.events.onMove.add(this.procesaDragg, this);
            this.joy.holder.events.onUp.add(this.paraDragg, this);
            


            var l = 0;
            var r = 0;
            var u = 0;
            var d = 0;
            var p = 0;

            if (this.mueveizquierda){
                l=1;
            }
            else if(this.muevederecha){
                r=1;
            }
            else{
                p=1;
            }

            if (this.muevearriba){
                u=1;
            }
            if(this.mueveabajo){
                d=1;
            }

            socket.emit("teclas", {id: window.id_socket, L:l, R:r, U:u, D:d, P:p, room: window.room});
            

        

        /***********************************************************************
        ***********************************************************************
                        END -- MOVIMIENTOS JUGADORES
        ***********************************************************************
        ***********************************************************************/  

        
    },

    paraDragg: function (pointer) {

        this.mueveizquierda = false;
        this.muevederecha = false;
        this.muevearriba = false;
        this.mueveabajo = false;

    },

    procesaDragg: function (a, distance, radianes) {
        var angulo = radianes*180/Math.PI;

        if (distance < 30){
            //Si no lo he movio, todo a false y return
            this.mueveizquierda = false;
            this.muevederecha = false;
            this.muevearriba = false;
            this.mueveabajo = false;
            return;
        }

        if (angulo > -90 && angulo < 90){
            //Derecha
            this.mueveizquierda = false;
            this.muevederecha = true;
        }
        if (angulo > 90 || angulo < -90){
            //Izquierda
            this.mueveizquierda = true;
            this.muevederecha = false;
        }
        
        //Arriba
        if (angulo > -135 && angulo < -45){
            this.muevearriba = true;
        }
        else{
            this.muevearriba = false;
        }
        
        //Abajo
        if (angulo < 135 && angulo > 45){
            this.mueveabajo = true;
        }
        else{
            this.mueveabajo = false;
        }


    },

};
