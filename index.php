<!DOCTYPE HTML>
<html style="margin:0 !important;">
<head>
	<meta charset="UTF-8" />
	<title>Dude Volley</title>
	<meta name="viewport" content="width=device-width, user-scalable=no">
	<script src="js/phaser.min.js"></script>
	<script src="js/Boot.js"></script>
	<script src="js/Preloader.js"></script>
	<script src="js/MainMenu.js"></script>



</head>
<body style="background-color:rgb(0,0,0); margin:0 !important;">
<div id="gameContainer" style="margin:auto;">
</div>

<script type="text/javascript">

window.onload = function() {

	//creo el objeto del juego
	var game = new Phaser.Game(800, 685, Phaser.AUTO, 'gameContainer');

	//añado las 'pantallas'
	game.state.add('Boot', DudeVolley.Boot);
	game.state.add('Preloader', DudeVolley.Preloader);
	game.state.add('MainMenu', DudeVolley.MainMenu);
	
	//empieza
	game.state.start('Boot');


};

</script>

</body>
</html>