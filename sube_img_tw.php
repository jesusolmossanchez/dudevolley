<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
if (isset($_POST['imagen'])){
	$imagen64 = $_POST['imagen'];

	$id = uniqid();

	$filename_path = $id.".png"; 

	$img = str_replace('data:image/png;base64,', '', $imagen64);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);

	file_put_contents("img_share/".$filename_path, $data);

	echo "img_share/".$filename_path;

}
