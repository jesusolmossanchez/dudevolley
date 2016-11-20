
<?php

session_start(); 
require "../vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

define("CONSUMER_KEY", "Imviwz5oC86qaucxGMZKusx9T");
define("CONSUMER_SECRET", "8ZphEwd64bCie4mf70nSlRxEBMsJ2LUJEnpKdbHoCJBB363VwW");

define('OAUTH_CALLBACK', 'http://www.dudevolley.com/juega_twitter.php');

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

setcookie("oauth_token", $request_token['oauth_token'], time()+3600,'/');
setcookie("oauth_token_secret", $request_token['oauth_token'], time()+3600,'/');

$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));

header('Location: '.$url);

exit;