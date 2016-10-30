<form id="subefoto" action="sube2.php" method="post" enctype="multipart/form-data" style="display:none;">
	<div id="explica_sube">
		Sube tu imagen para crear tu jugador. 
		<br/>
		Si le ganas a la maquina, 
		<br/>
		juagara con tu imagen 

	</div>
    <label for="fileToUpload">
    	<div id="fakeinput"><span>Subir imagen</span>
    		<img src="assets/sube.png" style="margin: -1vw 0 -1vw 2vw; width:15%;"></div>
    </label>
    <input type="file" name="fileToUpload" id="fileToUpload" style="display:none"><br/><br/>
    <input type="hidden" name="token" id="token" value="<?=$token?>">
    <input id="inputsubefoto" type="submit" value="Aceptar" name="submit" style="display:none">
</form>

<div id="contiene_foto_subida" style="max-width:600px;">
    <div id="explica_sube">Selecciona el area a recortar</div>
</div>