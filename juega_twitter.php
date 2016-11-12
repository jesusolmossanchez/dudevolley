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

	$targ_h = 60;
    $targ_w = $targ_h*0.8;

    $img_r = imagecreatefromjpeg($remote_foto);

    $dst_r = ImageCreateTrueColor( $targ_w, $targ_h );

    imagecopyresampled($dst_r,$img_r,0,0,0,0,$targ_w,$targ_h,256,256);

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

    echo $merged_image2;














//****