<?php
	
	//ob_start();
	include('client.php');
	session_start();

	$r_ID  = $_POST["r_ID"];
	$t_ID  = $_POST["t_ID"];
	$_msg  = $_POST["_msg"];
	$uname = $_SESSION["uname"];
	$upass = $_SESSION["upass"];

	try {

		$CLIENT = new Client($uname, $upass, $r_ID, $t_ID);
		$CLIENT->create_log(htmlspecialchars($_msg, ENT_QUOTES));

	}
	catch (Exception $ex) {

		echo "ERROR [Client Error Fault] " . $ex;

	}
	//ob_end_clean();

	// SELECT STR_TO_DATE('2013-04-12 20:36:16', '%Y-%m-%d %H:%i:%s');	
?>
