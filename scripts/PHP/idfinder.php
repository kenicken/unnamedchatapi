<?php

	ob_start();
	include('user.php');
	$AccMan = new AccountManager;
	session_start();
	$ID = $AccMan->get_id_of_user($_SESSION["uname"]);
	ob_end_clean();
	
	echo $ID;

?>
