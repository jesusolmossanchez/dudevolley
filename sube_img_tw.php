<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require "vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

if (isset($_POST['imagen'])){
	$imagen64 = $_POST['imagen'];

	$id = uniqid();

	$filename_path = $id.".png"; 

	$img = str_replace('data:image/png;base64,', '', $imagen64);
	$img = str_replace(' ', '+', $img);
	$data = base64_decode($img);

	file_put_contents("img_share/".$filename_path, $data);

	echo "img_share/".$filename_path;
	
	
	$access_token = "704788839357943809-FgY3Z8uTIEnfKkOoPd06Ji7TUmhUVDn";
	$access_token_secret = "EVGWRBKcgvPLLdotItNW35NhooA6bzfSzYXexAAPjQ1er";
	define("CONSUMER_KEY", "Imviwz5oC86qaucxGMZKusx9T");
	define("CONSUMER_SECRET", "8ZphEwd64bCie4mf70nSlRxEBMsJ2LUJEnpKdbHoCJBB363VwW");
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);

	
	$post_data = array('media_data' => $data);

	$media = $connection->post("media/upload", $post_data);

	$post_data2 = array('status' => 'Le estoy dando palpelo a alguien', 'media_id' => $media->media_id, );

	$media = $connection->post("statuses/update", $post_data2);
	

}
