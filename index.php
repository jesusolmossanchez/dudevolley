<?php

	//COSAS CONTRA EL PIRATEO
	session_start();
	$token = md5(rand(1000,9999));
	$_SESSION['token'] = $token;
	$_SESSION['puntos_registrados'] = 0;
	$_SESSION['suebeajax1'] = 0;
	$_SESSION['suebeajax2'] = 0;
	$_SESSION['winner_cambiado'] = 0;

	//SOCIALS
	$descripcion = "Dude Volley - The game!";
	$titulo = "Dude Volley";
	$img_share = "http://dudevolley.com/img_share/share_dudevolley.png";

	function isMobile() {
	    return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
	}

?>
<!DOCTYPE HTML>
<html style="margin:0 !important;">
<head>
	<meta charset="UTF-8" />
	<title>Dude Volley</title>
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<meta name="description" content="<?php echo $descripcion?>">
    <meta name="keywords" content="dude volley, indiegame, gamedev">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
	<meta property="og:url" content="http://www.dudevolley.com" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@dude_volley">
    <meta name="twitter:creator" content="@dude_volley">
    <meta property="og:title" content="<?php echo $titulo?>" />
    <meta name="twitter:title" content="<?php echo $titulo?>">
    <meta property="og:description" content="<?php echo $descripcion?>" />
    <meta name="twitter:description" content="<?php echo $descripcion?>">
    <meta property="og:image" content="<?php echo $img_share?>" />
    <meta name="twitter:image" content="<?php echo $img_share?>">

    <link rel="shortcut icon" href="assets/favicon.ico">


	<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
	<script src="js/lib/phaser_dudevolley.min.js"></script>
	<!-- <script src="http://localhost:8080/socket.io/socket.io.js"></script> -->
	<script src="http://188.166.12.42:8080/socket.io/socket.io.js"></script>
	<script src="js/lib/socketiop2p.min.js"></script>
	<script src="js/lib/jquery.Jcrop.min.js"></script>

	<?php
	if($_SERVER['SERVER_NAME'] == "dudevolley.com" || $_SERVER['SERVER_NAME'] == "www.dudevolley.com"){
		if(isMobile()){
			echo '<script src="js/dist/dudevolley_mobile.min.js"></script>';
		}
		else{
			echo '<script src="js/dist/dudevolley.min.js"></script>';
		}
		echo '<link rel="stylesheet" type="text/css" href="css/dist/dudevolley.min.css" />';
	}
		
	else{
		if(isMobile()){
			echo '<script src="js_mobile/Boot.js"></script>';
			echo '<script src="js_mobile/Preloader.js"></script>';
			echo '<script src="js_mobile/MainMenu.js"></script>';
			echo '<script src="js_mobile/Menu1Player.js"></script>';
			echo '<script src="js_mobile/MovilMainMenu.js"></script>';
			echo '<script src="js_mobile/PreOnePlayer.js"></script>';
			echo '<script src="js_mobile/GameOnePlayer.js"></script>';
			echo '<script src="js_mobile/Entrenamiento.js"></script>';
			echo '<script src="js_mobile/GameTwoPlayer.js"></script>';
			echo '<script src="js_mobile/Demo.js"></script>';
			echo '<script src="js_mobile/GameMultiplayer.js"></script>';
			echo '<script src="js_mobile/GameOver.js"></script>';
			echo '<script src="js_mobile/Player.js"></script>';
			echo '<script src="js_mobile/Joystick.js"></script>';
		}
		else{
			echo '<script src="js/Boot.js"></script>';
			echo '<script src="js/Preloader.js"></script>';
			echo '<script src="js/MainMenu.js"></script>';
			echo '<script src="js/Menu1Player.js"></script>';
			echo '<script src="js/MovilMainMenu.js"></script>';
			echo '<script src="js/PreOnePlayer.js"></script>';
			echo '<script src="js/GameOnePlayer.js"></script>';
			echo '<script src="js/Entrenamiento.js"></script>';
			echo '<script src="js/GameTwoPlayer.js"></script>';
			echo '<script src="js/Demo.js"></script>';
			echo '<script src="js/GameMultiplayer.js"></script>';
			echo '<script src="js/GameOver.js"></script>';
			echo '<script src="js/Player.js"></script>';
			echo '<script src="js/Joystick.js"></script>';
		}
		

		echo '<link rel="stylesheet" type="text/css" href="css/style.css" />';
		echo '<link rel="stylesheet" type="text/css" href="css/jquery.Jcrop.css" />';
	}


	?>



	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-66368910-2', 'auto');
		ga('send', 'pageview', '/Index');
	</script>
	
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.woff" />
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.svg#ArcadeClassic" />
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.eot" />
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.eot?#iefix" />

</head>
<body style="background-color:rgb(0,0,0); margin:0 !important;">
<div class="fontPreload" style="font-family: ArcadeClassic;">.</div>
<div id="gameContainer" style="margin:auto;">
</div>
<div id="usa_flechas">USA LAS TECLAS PARA JUGAR<span id="cierra_usaflechas">x</span></div>
<?php include ("sube_foto.php"); ?>
<?php include ("socket.php"); ?>
<?php include ("manda_puntos.php"); ?>
<?php include ("creditos.php"); ?>

<div id="orientacion_incorrecta">
	Gira el movil!!
</div>
<a href="javascript:void(0);" onclick="requestFullScreen()" style="display:none; position: fixed; z-index: 9999; top: 10px; right: 10px; width: 50px; height: 50px;"> 
	<img src="assets/full_screen.png" style="width:100%;height: 100%;">
</a>


<script type="text/javascript">


function requestFullScreen() {

	var el = document.body;

	// Supports most browsers and their versions.
	var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
	|| el.mozRequestFullScreen || el.msRequestFullScreen;

	if (requestMethod) {

		// Native full screen.
		requestMethod.call(el);

	} 
	else if (typeof window.ActiveXObject !== "undefined") {

		// Older IE.
		var wscript = new ActiveXObject("WScript.Shell");

		if (wscript !== null) {
  			wscript.SendKeys("{F11}");
		}
	}
}

window.onload = function() {
	
	window.token = '<?php echo $token;?>';

	<?php
		if(isset($_GET["te_reto"])){
			echo 'window.te_reto = "'.$_GET["te_reto"].'"';
		}
	?>

	//creo el objeto del juego
	<?php
	 if(isMobile()){
	?>
	 	var game = new Phaser.Game(1250, 685, Phaser.AUTO, 'gameContainer');
	<?php
	}
	else{
	?>
		var game = new Phaser.Game(800, 685, Phaser.AUTO, 'gameContainer');
	<?php
		}
	?>

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
