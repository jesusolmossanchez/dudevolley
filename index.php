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
<html style="margin:0 !important;height: 100vh;">
<head>
	<meta charset="UTF-8" />
	<title>Dude Volley</title>
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<meta name="description" content="<?php echo $descripcion?>">
    <meta name="keywords" content="dude volley, indiegame, gamedev">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
	<meta property="og:url" content="https://www.dudevolley.com" />
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


    <script type="text/javascript">
    <?php
    	if(isset($_GET["nuevo_modo"])){
    		if($_GET["nuevo_modo"] == "chico_chica"){
				echo 'window.tipo_jugador_1 = 1;';
				echo 'window.tipo_jugador_2 = 2;';
    		}
    		if($_GET["nuevo_modo"] == "chica_chica"){
				echo 'window.tipo_jugador_1 = 2;';
				echo 'window.tipo_jugador_2 = 2;';
    		}
    		if($_GET["nuevo_modo"] == "chica_chico"){
				echo 'window.tipo_jugador_1 = 2;';
				echo 'window.tipo_jugador_2 = 1;';
    		}
	}
	else{
		echo 'window.tipo_jugador_1 = 1;';
                echo 'window.tipo_jugador_2 = 1;';
	}
	?>
	console.log(window.tipo_jugador_2);
    </script>

	<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
	<script src="js/lib/phaser_dudevolley.min.js"></script>
	<!-- <script src="http://localhost:8080/socket.io/socket.io.js"></script> -->
	<!-- <script src="http://188.166.12.42:8080/socket.io/socket.io.js"></script> -->
<!-- 	<script src="https://dudevolley.com:8080/socket.io/socket.io.js"></script> -->
	<script src="js/lib/socket.io-1.4.5.js"></script>
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
			echo '<script src="js/GamePartyMode.js"></script>';
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

</head>
<body style="background-color:rgb(0,0,0); margin:0 !important;height: 100vh;">
<div class="fontPreload" style="font-family: ArcadeClassic;">.</div>
<div id="gameContainer" style="margin:auto;height: 100vh;">
</div>
<div id="usa_flechas">USA LAS TECLAS PARA JUGAR<span id="cierra_usaflechas">x</span></div>
<?php include ("sube_foto.php"); ?>
<?php include ("socket.php"); ?>
<?php include ("party.php"); ?>
<?php include ("manda_puntos.php"); ?>
<?php include ("creditos.php"); ?>

<div id="orientacion_incorrecta">
	Gira el movil!!
</div>
<a href="javascript:void(0);" onclick="requestFullScreen()" style="position: fixed; z-index: 9999; top: 10px; right: 10px; width: 50px; height: 50px;"> 
	<img id="img_full_screen" src="assets/full_screen.png" style="width:100%;height: 100%;">
</a>


<script type="text/javascript">

window.full_screen = 0;
function launchIntoFullscreen(element) {
  	if(element.requestFullscreen) {
    	element.requestFullscreen();
  	} else if(element.mozRequestFullScreen) {
    	element.mozRequestFullScreen();
  	} else if(element.webkitRequestFullscreen) {
    	element.webkitRequestFullscreen();
  	} else if(element.msRequestFullscreen) {
    	element.msRequestFullscreen();
  	}
}

function exitFullscreen() {
  	if(document.exitFullscreen) {
    	document.exitFullscreen();
  	} else if(document.mozCancelFullScreen) {
    	document.mozCancelFullScreen();
  	} else if(document.webkitExitFullscreen) {
    	document.webkitExitFullscreen();
  	}
}

function requestFullScreen() {
	if(window.full_screen == 0){
		launchIntoFullscreen(document.documentElement);
		window.full_screen = 1;
		var img_full = document.getElementById("img_full_screen");
		img_full.src = "assets/full_screen_KO.png"
	}
	else{
		exitFullscreen();
		window.full_screen = 0;
		var img_full = document.getElementById("img_full_screen");
		img_full.src = "assets/full_screen.png"
	}
}

window.onload = function() {
	
	window.token = '<?php echo $token;?>';

	<?php
		if(isset($_GET["te_reto"])){
			echo 'window.te_reto = "'.$_GET["te_reto"].'"';
		}

		if(isset($_GET["modo"])){
			echo 'window.modo = "'.$_GET["modo"].'"';
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
	game.state.add('GamePartyMode', DudeVolley.GamePartyMode);
	game.state.add('GameOver', DudeVolley.GameOver);
	
	//empieza
	game.state.start('Boot');


};

    contador_fav = 1;
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    window.setInterval(function () {
	var nuevo_href = 'data:image/png;base64,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'
	if(contador_fav % 2 == 0){
	    nuevo_href = 'data:image/png;base64,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';
	}
        link.href = nuevo_href;

        contador_fav++;

    }, 240);

</script>

</body>
</html>
