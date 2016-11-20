<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

/***/
class CircleCrop{
    private $src_img;
    private $src_w;
    private $src_h;
    private $dst_img;
    private $dst_w;
    private $dst_h;
    public function __construct($img)
    {
        $this->src_img = $img;
        $this->src_w = imagesx($img);
        $this->src_h = imagesy($img);
        $this->dst_w = imagesx($img);
        $this->dst_h = imagesy($img);
    }
    public function __destruct()
    {
        if (is_resource($this->dst_img))
        {
            imagedestroy($this->dst_img);
        }
    }
    public function display()
    {
        header("Content-type: image/png");
        imagepng($this->dst_img);
        return $this;
    }
    public function reset()
    {
        if (is_resource(($this->dst_img)))
        {
            imagedestroy($this->dst_img);
        }
        $this->dst_img = imagecreatetruecolor($this->dst_w, $this->dst_h);
        imagecopy($this->dst_img, $this->src_img, 0, 0, 0, 0, $this->dst_w, $this->dst_h);
        return $this;
    }
    public function size($dstWidth, $dstHeight)
    {
        $this->dst_w = $dstWidth;
        $this->dst_h = $dstHeight;
        return $this->reset();
    }
    public function save($destino)
    {
        imagepng($this->dst_img,$destino);
    }
    public function crop()
    {
        // Intializes destination image
        $this->reset();
        // Create a black image with a transparent ellipse, and merge with destination
        $mask = imagecreatetruecolor($this->dst_w, $this->dst_h);
        $maskTransparent = imagecolorallocate($mask, 255, 0, 255);
        imagecolortransparent($mask, $maskTransparent);
        imagefilledellipse($mask, $this->dst_w / 2, $this->dst_h / 2, $this->dst_w*0.8, $this->dst_h, $maskTransparent);
        imagecopymerge($this->dst_img, $mask, 0, 0, 0, 0, $this->dst_w, $this->dst_h, 100);
        // Fill each corners of destination image with transparency
        $dstTransparent = imagecolorallocate($this->dst_img, 255, 0, 255);
        imagefill($this->dst_img, 0, 0, $dstTransparent);
        imagefill($this->dst_img, $this->dst_w - 1, 0, $dstTransparent);
        imagefill($this->dst_img, 0, $this->dst_h - 1, $dstTransparent);
        imagefill($this->dst_img, $this->dst_w - 1, $this->dst_h - 1, $dstTransparent);
        imagecolortransparent($this->dst_img, $dstTransparent);
        return $this;
    }
}


/***/


	session_start(); 
	require "vendor/autoload.php";
	use Abraham\TwitterOAuth\TwitterOAuth;

	define("CONSUMER_KEY", "Imviwz5oC86qaucxGMZKusx9T");
	define("CONSUMER_SECRET", "8ZphEwd64bCie4mf70nSlRxEBMsJ2LUJEnpKdbHoCJBB363VwW");

	$request_token = [];
	$request_token['oauth_token'] = $_SESSION['oauth_token'];
	$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

	if (isset($_REQUEST['oauth_token']) && $request_token['oauth_token'] !== $_REQUEST['oauth_token']) {
	  // Abort! Something is wrong.
	}


	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);

	$access_token = $connection->oauth("oauth/access_token", ["oauth_verifier" => $_REQUEST['oauth_verifier']]);

	$_SESSION['access_token'] = $access_token;

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$user = $connection->get("account/verify_credentials");

	$remote_foto = str_replace("_normal", "", $user->profile_image_url);
	list($ancho_original, $alto_original) = getimagesize($remote_foto);

	$user_name = $user->screen_name;

	$targ_h = 60;
    $targ_w = $targ_h*0.8;

    $img_r = imagecreatefromjpeg($remote_foto);

    $dst_r = ImageCreateTrueColor( $targ_w, $targ_h );

    imagecopyresampled($dst_r,$img_r,0,0,0,0,$targ_w,$targ_h,$ancho_original,$alto_original);

    $nombre = uniqid();

    $crop = new CircleCrop($dst_r);

    $crop->crop();
    $crop->save("img_2/".$nombre.".png");

    $base_image = imagecreatefrompng('img_2/jugador1.png');
    $top_image = imagecreatefrompng("img_2/".$nombre.".png");
    $merged_image = "img_3/".$nombre.".png";
    imagesavealpha($top_image, true);
    imagealphablending($top_image, true);
    imagecopy($base_image, $top_image, 25, 0, 0, 0, $targ_w, $targ_h);
    imagepng($base_image, $merged_image);
    $merged_image2 = "img_4/".$nombre.".png";
    $merged_image = imagecreatefrompng($merged_image);
    imageflip($top_image,IMG_FLIP_HORIZONTAL);
    imagecopy($merged_image, $top_image, 105, 0, 0, 0, $targ_w, $targ_h);
    imagepng($merged_image, $merged_image2);
    imageflip($top_image,IMG_FLIP_HORIZONTAL);
    imagecopy($merged_image, $top_image, 185, 0, 0, 0, $targ_w, $targ_h);
    imagepng($merged_image, $merged_image2);
    imageflip($top_image,IMG_FLIP_HORIZONTAL);
    imagecopy($merged_image, $top_image, 265, 0, 0, 0, $targ_w, $targ_h);
    imagepng($merged_image, $merged_image2);

    //CONTRAPIRATEO
    $token = md5(rand(1000,9999));
	$_SESSION['token'] = $token;
	$_SESSION['puntos_registrados'] = 0;
	$_SESSION['suebeajax1'] = 0;
	$_SESSION['suebeajax2'] = 0;
	$_SESSION['winner_cambiado'] = 0;

?>
<!DOCTYPE HTML>
<html style="margin:0 !important;">
<head>
    <meta charset="UTF-8" />
    <title>Dude Volley</title>
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <meta name="description" content="<?php echo $descripcion?>">
    <meta name="keywords" content="dude volley, indiegame, gamedev">
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=0">
    <meta property="og:url" content="http://www.dudevolley.com" />
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@dude_volley">
    <meta name="twitter:creator" content="@dude_volley">
    <meta property="og:title" content="<?php echo $titulo?>" />
    <meta name="twitter:title" content="<?php echo $titulo?>">
    <meta property="og:description" content="<?php echo $descripcion?>" />
    <meta name="twitter:description" content="<?php echo $descripcion?>">
    <meta property="og:image" content="<?php echo $img_share?>" />
    <meta name="twitter:image" content="<?php echo $img_share?>">

    <link rel="shortcut icon" href="assets/favicon.ico">


    <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="js/lib/phaser_dudevolley.min.js"></script>
    <!-- <script src="http://localhost:8080/socket.io/socket.io.js"></script> -->
    <script src="http://188.166.12.42:8080/socket.io/socket.io.js"></script>
    <script src="js/lib/socketiop2p.min.js"></script>
    <script src="js/lib/jquery.Jcrop.min.js"></script>

    <?php
    if($_SERVER['SERVER_NAME'] == "dudevolley.com" || $_SERVER['SERVER_NAME'] == "www.dudevolley.com"){
        if(isMobile()){
            echo '<script src="js/dist/dudevolley_mobile.min.js"></script>';
        }
        else{
            echo '<script src="js/dist/dudevolley.min.js"></script>';
        }
        echo '<link rel="stylesheet" type="text/css" href="css/dist/dudevolley.min.css" />';
    }
        
    else{
        if(isMobile()){
            echo '<script src="js_mobile/Boot.js"></script>';
            echo '<script src="js_mobile/Preloader.js"></script>';
            echo '<script src="js_mobile/MainMenu.js"></script>';
            echo '<script src="js_mobile/Menu1Player.js"></script>';
            echo '<script src="js_mobile/MovilMainMenu.js"></script>';
            echo '<script src="js_mobile/PreOnePlayer.js"></script>';
            echo '<script src="js_mobile/GameOnePlayer.js"></script>';
            echo '<script src="js_mobile/Entrenamiento.js"></script>';
            echo '<script src="js_mobile/GameTwoPlayer.js"></script>';
            echo '<script src="js_mobile/Demo.js"></script>';
            echo '<script src="js_mobile/GameMultiplayer.js"></script>';
            echo '<script src="js_mobile/GameOver.js"></script>';
            echo '<script src="js_mobile/Player.js"></script>';
            echo '<script src="js_mobile/Joystick.js"></script>';
        }
        else{
            echo '<script src="js/Boot.js"></script>';
            echo '<script src="js/Preloader.js"></script>';
            echo '<script src="js/MainMenu.js"></script>';
            echo '<script src="js/Menu1Player.js"></script>';
            echo '<script src="js/MovilMainMenu.js"></script>';
            echo '<script src="js/PreOnePlayer.js"></script>';
            echo '<script src="js/GameOnePlayer.js"></script>';
            echo '<script src="js/Entrenamiento.js"></script>';
            echo '<script src="js/GameTwoPlayer.js"></script>';
            echo '<script src="js/Demo.js"></script>';
            echo '<script src="js/GameMultiplayer.js"></script>';
            echo '<script src="js/GameOver.js"></script>';
            echo '<script src="js/Player.js"></script>';
            echo '<script src="js/Joystick.js"></script>';
        }
        

        echo '<link rel="stylesheet" type="text/css" href="css/style.css" />';
        echo '<link rel="stylesheet" type="text/css" href="css/jquery.Jcrop.css" />';
    }


    ?>

	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-66368910-2', 'auto');
		ga('send', 'pageview', '/JuegaTwitter');
	</script>

	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.woff" />
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.svg#ArcadeClassic" />
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.eot" />
	<link rel="stylesheet" type="text/css" href="css/fonts/ArcadeClassic.eot?#iefix" />

</head>
<body style="background-color:rgb(0,0,0); margin:0 !important;">
<div class="fontPreload" style="font-family: ArcadeClassic;">.</div>
<div id="gameContainer" style="margin:auto;">
</div>
<div id="usa_flechas">USA LAS TECLAS PARA JUGAR<span id="cierra_usaflechas">x</span></div>

<?php include ("manda_puntos.php"); ?>
<?php include ("creditos.php"); ?>

<div id="orientacion_incorrecta">
    Gira el movil!!
</div>


<script type="text/javascript">

window.onload = function() {
    
    window.token = '<?php echo $token;?>';

    <?php
        if(isset($_GET["te_reto"])){
            echo 'window.te_reto = "'.$_GET["te_reto"].'"';
        }
    ?>

    //creo el objeto del juego
    <?php
     if(isMobile()){
    ?>
        var game = new Phaser.Game(1250, 685, Phaser.AUTO, 'gameContainer');
    <?php
    }
    else{
    ?>
        var game = new Phaser.Game(800, 685, Phaser.AUTO, 'gameContainer');
    <?php
        }
    ?>

    //añado las 'pantallas'
    game.state.add('Boot', DudeVolley.Boot);
    game.state.add('Preloader', DudeVolley.Preloader);
    game.state.add('MainMenu', DudeVolley.MainMenu);
    game.state.add('Menu1Player', DudeVolley.Menu1Player);
    game.state.add('MovilMainMenu', DudeVolley.MovilMainMenu);
    game.state.add('PreOnePlayer', DudeVolley.PreOnePlayer);
    game.state.add('GameOnePlayer', DudeVolley.GameOnePlayer);
    game.state.add('Entrenamiento', DudeVolley.Entrenamiento);
    game.state.add('GameTwoPlayer', DudeVolley.GameTwoPlayer);
    game.state.add('Demo', DudeVolley.Demo);
    game.state.add('GameMultiplayer', DudeVolley.GameMultiplayer);
    game.state.add('GameOver', DudeVolley.GameOver);
    
    //empieza
    game.state.start('Boot');


};

</script>

</body>
</html>