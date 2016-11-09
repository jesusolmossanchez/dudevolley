<?php


session_start(); 
require "../vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

define("CONSUMER_KEY", "Imviwz5oC86qaucxGMZKusx9T");
define("CONSUMER_SECRET", "8ZphEwd64bCie4mf70nSlRxEBMsJ2LUJEnpKdbHoCJBB363VwW");

$request_token['oauth_token'] = $_SESSION['oauth_token'];
$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);

$user = $connection->get("account/verify_credentials");

var_dump($user);
exit;