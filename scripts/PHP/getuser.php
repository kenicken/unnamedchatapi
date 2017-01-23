<?php
	
	ob_start();
	include('user.php');
	$POST_ID = $_POST["r_ID"];
	$AccMan = new AccountManager;
	$UNAME = $AccMan->get_un_of_id($POST_ID);
	ob_end_clean();

	echo $UNAME;
	
	
?>