
<?php

session_start(); 
require "../vendor/autoload.php";
use Abraham\TwitterOAuth\TwitterOAuth;

$descripcion = "Dude Volley - The game!";
$titulo = "Dude Volley";
$img_share = "http://dudevolley.com/img_share/share_dudevolley.png";

define("CONSUMER_KEY", "Imviwz5oC86qaucxGMZKusx9T");
define("CONSUMER_SECRET", "8ZphEwd64bCie4mf70nSlRxEBMsJ2LUJEnpKdbHoCJBB363VwW");

define('OAUTH_CALLBACK', 'http://www.dudevolley.com/juega_twitter.php');

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

//$_SESSION['oauth_token'] = $request_token['oauth_token'];
//$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
setcookie("oauth_token", $request_token['oauth_token'], time()+3600,"/","dudevolley.com");
setcookie("oauth_token_secret", $request_token['oauth_token_secret'], time()+3600,"/","dudevolley.com");

$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));

//header('Location: '.$url);
//exit;

?>

<!DOCTYPE HTML>
<html style="margin:0 !important;">
<head>
    <meta charset="UTF-8" />
    <title>Dude Volley</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <meta name="description" content="<?php echo $descripcion?>">
    <meta name="keywords" content="dude volley, indiegame, gamedev">
    <meta property="og:url" content="https://www.dudevolley.com" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@dude_volley">
    <meta name="twitter:creator" content="@dude_volley">
    <meta property="og:title" content="<?php echo $titulo?>" />
    <meta name="twitter:title" content="<?php echo $titulo?>">
    <meta property="og:description" content="<?php echo $descripcion?>" />
    <meta name="twitter:description" content="<?php echo $descripcion?>">
    <meta property="og:image" content="<?php echo $img_share?>" />
    <meta name="twitter:image" content="<?php echo $img_share?>">
</head>
<body>
    <script>
        window.setTimeout( function(){
                 window.location = "<?php echo $url;?>";
             }, 1000 );
    </script>
</body>
</html>
