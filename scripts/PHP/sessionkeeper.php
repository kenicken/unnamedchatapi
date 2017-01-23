<?php

	ob_start();
	include('user.php');
	$AccMan = new AccountManager;
	session_start();
	if (isset($_SESSION["uname"])) {
		$ID = $AccMan->get_id_of_user($_SESSION["uname"]);
		$UNAME = $_SESSION["uname"];
	}
	else {
		$ID = 0;
		$UNAME = "";
	}
	
	ob_end_clean();
	
	echo $ID . "<block>" . $UNAME;

?>
