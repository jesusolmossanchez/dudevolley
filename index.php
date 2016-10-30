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
	$img_share = "img_share/share_dudevolley.png";
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
    <meta name="twitter:image" content="<?php echo $img_share?>" />

    <link rel="shortcut icon" href="assets/favicon.ico">


	<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
	<script src="js/lib/phaser_dudevolley.min.js"></script>
	<!-- <script src="http://localhost:8080/socket.io/socket.io.js"></script> -->
	<script src="http://188.166.12.42:8080/socket.io/socket.io.js"></script>
	<script src="js/lib/socketiop2p.min.js"></script>
	<script src="js/lib/jquery.Jcrop.min.js"></script>

	<script src="js/src/out.min.js"></script>


	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-66368910-2', 'auto');
		ga('send', 'pageview', '/Index');
	</script>

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

<?php include ("sube_foto.php"); ?>
<?php include ("manda_puntos.php"); ?>
<?php include ("creditos.php"); ?>



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
