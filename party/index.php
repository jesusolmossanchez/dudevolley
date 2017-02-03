<?php

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
	<?php
		if($_SERVER['SERVER_NAME'] == "dudevolley.com" || $_SERVER['SERVER_NAME'] == "www.dudevolley.com"){
	 		echo '<script src="http://188.166.12.42:8081/socket.io/socket.io.js"></script>';
	 	}
	 	else{
			echo '<script src="http://localhost:8081/socket.io/socket.io.js"></script>';
	 	}
	?>
	<script src="js/lib/socketiop2p.min.js"></script>

	<?php
	/*
	if($_SERVER['SERVER_NAME'] == "dudevolley.com" || $_SERVER['SERVER_NAME'] == "www.dudevolley.com"){
		//TODO: crear el minificado para el controller
		echo '<script src="js/dist/dudevolley_controller.min.js"></script>';
		echo '<link rel="stylesheet" type="text/css" href="css/dist/dudevolley.min.css" />';
	}
		
	else{
	*/	
		if(isMobile()){
			echo '<script src="js_mobile/Boot.js"></script>';
			echo '<script src="js_mobile/Preloader.js"></script>';
			echo '<script src="js_mobile/GamePartyController.js"></script>';
			echo '<script src="js_mobile/Joystick.js"></script>';
		}
		else{
			//TODO: hacer algo si entra alguien aqui sin movil....
		}
		

		echo '<link rel="stylesheet" type="text/css" href="css/style.css" />';
		echo '<link rel="stylesheet" type="text/css" href="css/jquery.Jcrop.css" />';
	//}


	?>

	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-66368910-2', 'auto');
		ga('send', 'pageview', '/PartyController');
	</script>
	
	<link rel="stylesheet" type="text/css" href="../css/fonts/ArcadeClassic.woff" />
	<link rel="stylesheet" type="text/css" href="../css/fonts/ArcadeClassic.svg#ArcadeClassic" />
	<link rel="stylesheet" type="text/css" href="../css/fonts/ArcadeClassic.eot" />
	<link rel="stylesheet" type="text/css" href="../css/fonts/ArcadeClassic.eot?#iefix" />

</head>
<body style="background-color:rgb(0,0,0); margin:0 !important;">
<div class="fontPreload" style="font-family: ArcadeClassic;">.</div>


<div id="socket_overlay"> 
	<form id="socket_overlay_form" style="text-align: center; padding-top: 50px;">
		<input type="numbre" name="input_codigo_partida" id="input_codigo_partida" placeholder="Codigo" style="border: 2vw solid #f5f823; color: #f5f823; background: none; padding: 20px;font-size: 3vw; display: block; margin:auto;">
		<input type="text" name="input_nombre_jugador" id="input_nombre_jugador" placeholder="Tu nombre" style="border: 2vw solid #f5f823; color: #f5f823; background: none; padding: 20px;font-size: 3vw; display: block; margin: 10px auto;">
		<input type="submit" id="socket_empezar" name="socket_empezar" value="Empezar">
	</form>

</div>

<div id="gameContainer" style="margin:auto;">
</div>

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
		
		<?php
			if(isset($_GET["modo"])){
				echo 'window.modo = "'.$_GET["modo"].'"';
			}
		?>

		//creo el objeto del juego
		var game = new Phaser.Game(1250, 685, Phaser.AUTO, 'gameContainer');
		
		//añado las 'pantallas'
		game.state.add('Boot', DudeVolley.Boot);
		game.state.add('Preloader', DudeVolley.Preloader);
		game.state.add('GamePartyController', DudeVolley.GamePartyController);
		
		//empieza
		game.state.start('Boot');


	};

</script>

</body>
</html>
