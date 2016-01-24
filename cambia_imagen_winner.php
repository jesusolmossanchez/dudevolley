<?php
	session_start();
	
    if ($_SESSION['winner_cambiado'] === 1) {
        echo "Ya lo has cambiado";
        exit;
    }
    
    if($_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
      header('Location: http://jesusolmos.es');
    }
    /*
    if(!@isset($_SERVER['HTTP_REFERER']) && $_SERVER['HTTP_REFERER']=="http://projects.local/tuvolley/index.php"){
      header('Location: http://jesusolmos.es');
    }*/
    if($_POST['token'] != $_SESSION['token']) {
      header('Location: http://jesusolmos.es');
    }
    $token = $_POST["token"];
	$img_player = $_POST['rutaplayer'];

	$top_image = imagecreatefrompng($img_player);
	$merged_image = "cpu_player/cpu_player.png";
	imageflip($top_image,IMG_FLIP_HORIZONTAL);
	$cambio = imagepng($top_image, $merged_image);
	
	$_SESSION['winner_cambiado'] = 1;
	echo $cambio;