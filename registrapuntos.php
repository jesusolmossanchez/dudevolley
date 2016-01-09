<?php
	session_start();
    if ($_SESSION['puntos_registrados'] === 1) {
	    echo "Puntos ya registrados!!";
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
      	echo "ho ho ho, no dijiste la palabra mágica";
      	exit;
    }
    
    

    if($_POST['cri'] !== md5($_POST['diferencia'].$_POST['puntuacion'].$_POST['tiempo'].$_POST['token'])){
    	echo "ho ho ho, no dijiste la palabra mágica";
      	exit;
    }
    $token = $_POST["token"];
	$dif = intval($_POST['diferencia']);
	$tiempo = intval($_POST['tiempo']);
	$level = $_POST['level'];
	
	$registro = array(
				'nombre' => $_POST['nombre'],
				'diferencia' => $dif,
				'puntuacion' => $_POST['puntuacion'],
				'tiempo' => $tiempo,
				'fecha' => date("Y-m-d H:i:s")
			);
	// Configuration
	$dbhost = 'localhost';
	$dbname = $level;
	$m = new Mongo("mongodb://$dbhost");
	// Connect to test database
	$db = $m->$dbname;
	// Get the users collection
	$punticos = $db->puntuaciones;
	// Insert this new document into the users collection
	$punticos->save($registro);
	
	$cursor = $punticos->find()->sort(array('diferencia' => -1, 'tiempo' => 1))->limit(9);
	foreach ( $cursor as $valor )
	{
		$devuelve[] = $valor;
	    
	}
	$_SESSION['puntos_registrados'] = 1;
	$encoded = json_encode($devuelve);
	print_r($encoded);