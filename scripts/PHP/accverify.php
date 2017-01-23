<?php
	session_start();
	include('user.php');
	$UNAME = $_POST["uname"];
	$UPASS = $_POST["pass"];

	$type = $_SESSION["type"];
	$red1 = "";
	$red2 = "";

	switch ($type) {

		case "messenger":
			$red1 = "../../task2/msger.html";
			$red2 = "../../task2/login.html";
			break;
		case "filemanager":
			$red1 = "../../task4/filemanager.html";
			$red2 = "../../task4/login.html";
			break;
		default:
			$red1 = "../../task2/msger.html";
			$red2 = "../../task2/login.html";
			break;
	}

	$AccMan = new AccountManager;
	try {

		$AccMan->create_user($UNAME, $UPASS , previlage::Normal);
		echo "<meta http-equiv=\"refresh\" content=\"1; url={$red2}\">";
		
	}
	catch (Exception $e) {

		echo "Existing Username Found " . $e;
		echo "<meta http-equiv=\"refresh\" content=\"1; url={$red2}\">";

	}
	

?>
