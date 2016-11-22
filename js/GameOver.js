
DudeVolley.GameOver = function (game) {



};

DudeVolley.GameOver.prototype = {

    create: function () {

        ga('send', 'pageview', '/GameOver');

        var rutajuagdor = this.game.ruta_jugador;

        relacion = $(window).height()/$(window).width();
        //relacion = 1-relacion;
        if (relacion < 1){
            //relacion=relacion+1.5;
            letra1 = $(window).height()/9;
            letra2 = $(window).height()/14;
            letra3 = $(window).height()/20;

            borde = $(window).height()/40;
            ancho = $(window).height()/2;

            $("#puntos").css("font-size",letra1+"px");

            $("#texto_fin").css("font-size",letra2+"px");
            $("#envia_tus_puntos").css("font-size",letra2+"px");

            $("#inputtunombre").css("font-size",letra2+"px");
            $("#inputtunombre").css("padding",borde+"px");
            $("#inputtunombre").css("width",ancho+"px");
            $("#inputtunombre").css("border",borde+"px solid #f5f823");
            $("#envia_tu_nombre").css("font-size",letra2+"px");
            $("#envia_tu_nombre").css("padding",borde+"px");
            $("#envia_tu_nombre").css("border",borde+"px solid #f5f823");

            $("#contiene_mandapuntos").css("font-size",letra3+"px");
            $("#contiene_clasificacion").css("font-size",letra3+"px");

        }            
        

        this.input.keyboard.removeKey(Phaser.Keyboard.D);
        this.input.keyboard.removeKey(Phaser.Keyboard.R);
        this.input.keyboard.removeKey(Phaser.Keyboard.F);
        this.input.keyboard.removeKey(Phaser.Keyboard.G);
        this.input.keyboard.removeKey(Phaser.Keyboard.Z);
        this.input.keyboard.removeKey(Phaser.Keyboard.L);
        
        this.add.sprite(0, 0, 'game_over_back');


        var diferencia = this.game.puntosPlayer1 - this.game.puntosPlayer2;
        var puntuacion = this.game.puntosPlayer1+" - "+this.game.puntosPlayer2;

        
        
        if(this.game.unplayer){
            var tiempofinal = this.time.now - this.game.empieza;
            var resultado;
            var level;
            if(this.game.hasperdio == true){
                resultado = "perdido";
            }
            else{
                resultado = "ganado";

                if (rutajuagdor != false){
                    var post_data= {
                        rutaplayer: rutajuagdor,
                        token: window.token
                    }
                    $.post("cambia_imagen_winner.php", post_data)
                        .done(function( data ) {
                            console.log(data);
                    });
                }

            }


            if (this.game.level == 0){
                level = "chupao";
            }
            else if (this.game.level == 1){
                level = "normalico";
            }
            else if (this.game.level == 2){
                level = "jodio";
            }


            var cri = cricri(diferencia+puntuacion+tiempofinal+window.token);
            
            if(window.twitter_img){
                $("#envia_tu_nombre").hide();
                $("#inputtunombre").hide();
                $("#envia_tus_puntos").hide();

                var post_data= {
                                    nombre: window.twitter_name,
                                    diferencia: diferencia,
                                    puntuacion: puntuacion,
                                    tiempo: tiempofinal,
                                    level: level,
                                    token: window.token,
                                    cri: cri
                                }
                $.post( "registrapuntos.php", post_data)
                    .done(function( data ) {
                        window.setTimeout(function(){
                            $("#mandapuntos").slideUp();
                            $("#contiene_clasificacion").slideDown();
                            //console.log( "Data Loaded: " + data );
                            acho = JSON.parse(data);
                            $.each(acho, function() {
                                var num = Number(this.tiempo);
                                var seconds = Math.floor(num / 1000);
                                var minutes = Math.floor(seconds / 60);
                                var seconds = seconds - (minutes * 60);
                                if (seconds<10){
                                    seconds="0"+seconds;
                                }
                                var format = minutes + ':' + seconds
                                $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<dl><dt>"+this.nombre+"</dt><dd>"+this.puntuacion+"("+format+")</dd></dl>");
                            });
                        },5000);
                });

            }
            
            $("#mandapuntos").show();
            $("#contiene_mandapuntos").fadeIn();
            $("#contiene_mandapuntos").focus();
            $("#texto_fin").text("Has "+resultado);
            $("#puntos").text(this.game.puntosPlayer1+" - "+this.game.puntosPlayer2);

            var cri = cricri(diferencia+puntuacion+tiempofinal+window.token);

            window.entra = 0;
            $("#envia_tu_nombre").click(function(e){
                e.preventDefault();
                if (window.entra < 1){
                    //window.entra = 1;
                    
                    
                    var post_data= {
                                        nombre: $("#inputtunombre").val(),
                                        diferencia: diferencia,
                                        puntuacion: puntuacion,
                                        tiempo: tiempofinal,
                                        level: level,
                                        token: window.token,
                                        cri: cri
                                    }
                    $.post( "registrapuntos.php", post_data)
                        .done(function( data ) {
                            console.log(data);
                            $("#mandapuntos").slideUp();
                            $("#contiene_clasificacion").slideDown();
                            //console.log( "Data Loaded: " + data );
                            acho = JSON.parse(data);
                            $.each(acho, function() {
                                var num = Number(this.tiempo);
                                var seconds = Math.floor(num / 1000);
                                var minutes = Math.floor(seconds / 60);
                                var seconds = seconds - (minutes * 60);
                                if (seconds<10){
                                    seconds="0"+seconds;
                                }
                                var format = minutes + ':' + seconds
                                //$("#titulo_nivel").html("Nivel: "+level);
                                $("#contiene_clasificacion").html($("#contiene_clasificacion").html()+"<dl><dt>"+this.nombre+"</dt><dd>"+this.puntuacion+"("+format+")</dd></dl>");
                                //use obj.id and obj.name here, for example:
                            });
                            //DudeVolley.scale.refresh();
                    });
                }
            });
        }

        else{
            var nombreGanador;
            
            var elotrosehapirao = "";
            if (this.game.multiplayer){
                nombreGanador = this.game.nombre_ganador;
                socket.emit("disconect");
                if (this.game.desconectado){
                    var elotrosehapirao = "</br>...el otro se ha pirao";
                }
            }
            else if(this.game.hasperdio){
                nombreGanador = "Player2";
            }
            else{
                nombreGanador = "Player1";
            }
            $("#contiene_mandapuntos").show();
            //$("#contiene_mandapuntos").css("top","20vw");
            $("#mandapuntos").show();
            $("#envia_tus_puntos").hide();
            $("#inputtunombre").hide();
            $("#envia_tu_nombre").hide();
            $("#texto_fin").html("Ganador: "+nombreGanador+elotrosehapirao);
            $("#puntos").text(this.game.puntosPlayer1+" - "+this.game.puntosPlayer2);
        }
        
        

        
        
        
        //var palizaca = this.cache.getImage('palizaca');
        //this.palizaca = this.add.sprite(this.world.centerX - palizaca.width/2.0, 150, 'palizaca');

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.ganador = this.add.sprite(32, this.world.height - 250, this.game.ganador.key);
        this.perdedor = this.add.sprite(this.world.width/2, this.world.height - 250, this.game.perdedor.key);

        this.ganador.anchor.setTo(0.5, 0.5);
        this.perdedor.anchor.setTo(0.5, 0.5);

        //Fisica de jugadores y this.pelota
        this.physics.arcade.enable(this.ganador);
        this.physics.arcade.enable(this.perdedor);

        //Fisica del jugador
        this.ganador.body.bounce.y = 0;
        this.ganador.body.gravity.y = 800;
        this.ganador.body.collideWorldBounds = true;

        this.perdedor.body.bounce.y = 0;
        this.perdedor.body.gravity.y = 800;
        this.perdedor.body.collideWorldBounds = true;

        this.pelota = this.add.sprite(300, this.world.height - 130, 'pelota');
        this.pelota.anchor.setTo(0.5, 0.5);
        this.pelota.angle = Math.floor((Math.random() * 180) + 1); 
        this.explota = this.add.sprite(300, this.world.height - 150, 'explota');

        //animaciones de movimiento
        this.ganador.animations.add('semueve', [0, 1], 7, true);
        this.perdedor.animations.add('semueve2', [0, 1], 7, true);
        this.ganador.animations.add('senfada', [2, 3], 7, true);
        this.perdedor.animations.add('senfada2', [2, 3], 7, true);


        if(window.twitter_img){
	    	var img_share_resultado = game.canvas.toDataURL();
	    	console.log(img_share_resultado);

            xmlhttp = new XMLHttpRequest();

            var params = "imagen="+img_share_resultado+"&usuario="+window.twitter_name+"&puntos1="+this.game.puntosPlayer1+"&puntos2="this.game.puntosPlayer2;
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    if(xmlhttp.status == 200){
                        
                    }
                    else{
                        //controlar error
                    }
                }
            }

            xmlhttp.open("POST", "sube_img_tw.php", true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
            xmlhttp.send(params);

        }


        var play_again = this.cache.getImage('volver_a_jugar');
        this.play_again = this.add.sprite(this.world.centerX - play_again.width/2.0,470,'volver_a_jugar');
        this.play_again.inputEnabled = true;
        this.play_again.input.sprite.events.onInputDown.add(this.empieza, this);

        


    },

    update: function () {
        if (this.ganador.body.x >= (this.world.width-180))
        {
            this.ganador.body.velocity.x = -150;
        }
        if(this.ganador.body.x <= 140){
            this.ganador.body.velocity.x = 150;
        }
        this.ganador.animations.play('semueve');
        this.perdedor.animations.play('senfada');
        this.perdedor.body.rotation = 90;
        if (this.ganador.body.y > (this.world.height-190))
        {
            this.ganador.body.velocity.y = -550;
        }
        if (this.perdedor.body.y > (this.world.height-180))
        {
            this.perdedor.body.velocity.y = 0;
            this.perdedor.body.y = this.world.height-180;
        }
        
        if(SUPERPIKA.isDown || SUPERPIKA2.isDown){
            this.state.start('Preloader');
        } 

    },

    empieza: function(){
        location.reload();
    }

};


function cricri(str) {

  var xl;

  var rotateLeft = function(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  var addUnsigned = function(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  var _F = function(x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function(x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function(x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function(x, y, z) {
    return (y ^ (x | (~z)));
  };

  var _FF = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _GG = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _HH = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _II = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var convertToWordArray = function(str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  var wordToHex = function(lValue) {
    var wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  var x = [],
    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  str = utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
};

function utf8_encode ( argString ) {

    if (argString === null || typeof argString === 'undefined') {
        return '';
      }

      // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      var string = (argString + '');
      var utftext = '',
        start, end, stringl = 0;

      start = end = 0;
      stringl = string.length;
      for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
          end++;
        } else if (c1 > 127 && c1 < 2048) {
          enc = String.fromCharCode(
            (c1 >> 6) | 192, (c1 & 63) | 128
          );
        } else if ((c1 & 0xF800) != 0xD800) {
          enc = String.fromCharCode(
            (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
          );
        } else {
          // surrogate pairs
          if ((c1 & 0xFC00) != 0xD800) {
            throw new RangeError('Unmatched trail surrogate at ' + n);
          }
          var c2 = string.charCodeAt(++n);
          if ((c2 & 0xFC00) != 0xDC00) {
            throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
          }
          c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
          enc = String.fromCharCode(
            (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
          );
        }
        if (enc !== null) {
          if (end > start) {
            utftext += string.slice(start, end);
          }
          utftext += enc;
          start = end = n + 1;
        }
      }

      if (end > start) {
        utftext += string.slice(start, stringl);
      }

      return utftext;
}
