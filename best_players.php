<?php
	
	// Configuration
	$dbhost = 'localhost';
	$dbname = 'jodio';
	$m = new Mongo("mongodb://$dbhost");
	// Connect to test database
	$db = $m->$dbname;
	// Get the users collection
	$punticos = $db->puntuaciones;
	
	$cursor = $punticos->find()->sort(array('diferencia' => -1, 'tiempo' => 1))->limit(8);
	foreach ( $cursor as $valor )
	{
		$devuelve[] = $valor;
	    
	}
	$encoded = json_encode($devuelve);
	print_r($encoded);