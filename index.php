<?php
	session_start();
	$token = md5(rand(1000,9999));
	$_SESSION['token'] = $token;
	$_SESSION['puntos_registrados'] = 0;
	$_SESSION['suebeajax1'] = 0;
	$_SESSION['suebeajax2'] = 0;
	$_SESSION['winner_cambiado'] = 0;
?>
<!DOCTYPE HTML>
<html style="margin:0 !important;">
<head>
	<meta charset="UTF-8" />
	<title>Dude Volley</title>
	<meta name="viewport" content="width=device-width, user-scalable=no">

	<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
	<script src="js/phaser.min.js"></script>
	<script src="http://localhost:8080/socket.io/socket.io.js"></script>
	<script src="js/socketiop2p.min.js"></script>
	<script src="js/jquery.Jcrop.min.js"></script>

	<script src="js/Boot.js"></script>
	<script src="js/Preloader.js"></script>
	<script src="js/MainMenu.js"></script>
	<script src="js/MovilMainMenu.js"></script>
	<script src="js/Menu1Player.js"></script>
	<script src="js/PreOnePlayer.js"></script>
	<script src="js/GameOnePlayer.js"></script>
	<script src="js/Player.js"></script>
	<script src="js/Joystick.js"></script>
	<script src="js/Entrenamiento.js"></script>
	<script src="js/GameTwoPlayer.js"></script>
	<script src="js/Demo.js"></script>
	<script src="js/GameOver.js"></script>
	<script src="js/GameMultiplayer.js"></script>


	<link rel="stylesheet" type="text/css" href="css/style.css" />
	<link rel="stylesheet" type="text/css" href="css/jquery.Jcrop.css" />
	<link rel="stylesheet" type="text/css" href="fonts/ArcadeClassic.woff" />
	<link rel="stylesheet" type="text/css" href="fonts/ArcadeClassic.svg#ArcadeClassic" />
	<link rel="stylesheet" type="text/css" href="fonts/ArcadeClassic.eot" />
	<link rel="stylesheet" type="text/css" href="fonts/ArcadeClassic.eot?#iefix" />

</head>
<body style="background-color:rgb(0,0,0); margin:0 !important;">
<div class="fontPreload" style="font-family: ArcadeClassic;">.</div>
<div id="gameContainer" style="margin:auto;">
</div>

<form id="subefoto" action="sube2.php" method="post" enctype="multipart/form-data" style="display:none;">
	<div id="explica_sube">
		<span>Sube</span><span>tu</span><span>imagen</span><span>para</span><span>crear</span><span>tu</span><span>jugador.</span>
		<br/>
		<span>Si</span><span>le</span><span>ganas</span><span>a</span><span>la</span><span>maquina,</span>
		<br/>
		<span>juagara</span><span>con</span><span>tu</span><span>imagen</span>

	</div>
    <label for="fileToUpload">
    	<div id="fakeinput"><span>Subir imagen</span>
    		<img src="assets/sube.png" style="margin: -1vw 0 -1vw 2vw; width:15%;"></div>
    </label>
    <input type="file" name="fileToUpload" id="fileToUpload" style="display:none"><br/><br/>
    <input type="hidden" name="token" id="token" value="<?=$token?>">
    <input id="inputsubefoto" type="submit" value="Aceptar" name="submit" style="display:none">
</form>

<div id="contiene_foto_subida" style="max-width:600px;">
    <div id="explica_sube"><span>Selecciona</span><span>el</span><span>area</span><span>a</span><span>recortar</span></div>
</div>

<div id="contiene_mandapuntos" style="">

	<form id="mandapuntos">
		<p id="texto_fin"></p>
		<p id="puntos"></p>
		<p id="envia_tus_puntos">Send  your  score:</p>
		<input id="inputtunombre" type="text" name="tu_nombre" maxlength="10"/>
		<button id="envia_tu_nombre"> Enviar </button> 
	</form>
	<ul id="contiene_clasificacion">
		<dl id="titulo_nivel"></dl>
	</ul>
</div>

<div id="socket_overlay">
	<div id="socket_overlay_inner">
		<label id="volley_label"><span> Pon </span><span> tu </span><span> nombre </span></label>
		<div id="botonera_socket">
			<input class="volley_button" type="text" id="socket_nombre" maxlength="10"/>
			<button id="socket_empezar"> Empezar </button>
		</div>
		<div id="reta_a_un_colega">
			<div class="botonera_socket">
				<button id="reta_a_un_colega_button"><span>Retar</span><span>a</span><span>un</span><span>colega</span></button>
			</div>
			<div class="botonera_socket">
				<button id="juega_con_quien_sea"><span>Jugar</span><span>con</span><span>cualquiera</span></button>
			</div>
			<div id="pasa_el_enlace">
				<span>Pasa</span><span>a</span><span>alguien</span><span>este</span><span>enlace:</span><span>http://projects.local/dudevolley?te_reto</span>
			</div>
			<div id="esperando_oponente">
				<span>Esperando</span><span>oponente...</span>
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">

window.onload = function() {
	
	window.token = '<?php echo $token;?>';

	//creo el objeto del juego
	var game = new Phaser.Game(800, 685, Phaser.AUTO, 'gameContainer');

	//añado las 'pantallas'
	game.state.add('Boot', DudeVolley.Boot);
	game.state.add('Preloader', DudeVolley.Preloader);
	game.state.add('MainMenu', DudeVolley.MainMenu);
	game.state.add('Menu1Player', DudeVolley.Menu1Player);
	game.state.add('MovilMainMenu', DudeVolley.MovilMainMenu);
	game.state.add('PreOnePlayer', DudeVolley.PreOnePlayer);
	game.state.add('GameOnePlayer', DudeVolley.GameOnePlayer);
	game.state.add('Entrenamiento', DudeVolley.Entrenamiento);
	game.state.add('GameTwoPlayer', DudeVolley.GameTwoPlayer);
	game.state.add('Demo', DudeVolley.Demo);
	game.state.add('GameMultiplayer', DudeVolley.GameMultiplayer);
	game.state.add('GameOver', DudeVolley.GameOver);
	
	//empieza
	game.state.start('Boot');


};

</script>

</body>
</html>