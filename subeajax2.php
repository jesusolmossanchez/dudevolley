<?php 
    session_start();
    if ($_SESSION['suebeajax2'] === 1) {
        echo "Ya lo has subido";
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
      header('Location: http://jesusolmos.es');
    }
    $token = $_POST["token"];
class CircleCrop
{
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
$targ_h = 60;
$targ_w = $targ_h*0.8;
$src = 'img/'.$_POST["nombre"].".".$_POST["extension"];
if ($_POST["extension"] == "jpg" || $_POST["extension"] == "jpeg"){
    $img_r = imagecreatefromjpeg($src);
}
else if($_POST["extension"] == "png"){
    $img_r = imagecreatefrompng($src);
}
else if($_POST["extension"] == "gif"){
    $img_r = imagecreatefromgif($src);
}
$dst_r = ImageCreateTrueColor( $targ_w, $targ_h );
imagecopyresampled($dst_r,$img_r,0,0,$_POST['x'],$_POST['y'],$targ_w,$targ_h,$_POST['w'],$_POST['h']);
//$img = imagecreatefromjpeg("test4.jpg");
$crop = new CircleCrop($dst_r);
//$crop->crop()->display();
$crop->crop();
$crop->save("img_2/".$_POST["nombre"].".png");
$base_image = imagecreatefrompng('img_2/jugador1.png');
$top_image = imagecreatefrompng("img_2/".$_POST["nombre"].".png");
$merged_image = "img_3/".$_POST["nombre"].".png";
imagesavealpha($top_image, true);
imagealphablending($top_image, true);
imagecopy($base_image, $top_image, 25, 0, 0, 0, $targ_w, $targ_h);
imagepng($base_image, $merged_image);
$merged_image2 = "img_4/".$_POST["nombre"].".png";
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
$_SESSION['suebeajax2'] = 1;