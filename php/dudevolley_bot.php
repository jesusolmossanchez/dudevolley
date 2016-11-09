<?php

if(!isset($argv[1]) || 	$argv[1] != "trololo"){
	echo PHP_EOL."ho ho ho, no dijiste la palabra mágica".PHP_EOL;
	exit;
}

require "../vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

$access_token = "704788839357943809-FgY3Z8uTIEnfKkOoPd06Ji7TUmhUVDn";
$access_token_secret = "EVGWRBKcgvPLLdotItNW35NhooA6bzfSzYXexAAPjQ1er";
define("CONSUMER_KEY", "Imviwz5oC86qaucxGMZKusx9T");
define("CONSUMER_SECRET", "8ZphEwd64bCie4mf70nSlRxEBMsJ2LUJEnpKdbHoCJBB363VwW");

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);


$statues = $connection->post("statuses/update", ["status" => "hello world"]);

var_dump($statues);
exit;