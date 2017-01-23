<html>	
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link rel="stylesheet" type="text/css" href="../../css/misc.css">
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<script type="text/javascript" src="../JS/utility.js"></script>
<body>

<?php
	session_start();
	include('user.php');
	if (isset($_SESSION["uname"]))
		$UNAME = $_SESSION["uname"];

	echo "<div id='info'><div id='text'>Logging out...</div></div>";
	echo "<script>fade('info', 0, 100, 500)</script>";

	if (isset($_SESSION["uname"])) {

		$Accman = new AccountManager;
		try {
			$Accman->adjust_status($UNAME, 0);
			$Accman->erase_token($UNAME);
		}
		catch (Exception $ex) {
			echo $ex;
		}
	}

	$type = $_GET["type"];
	$red1 = "";
	$red2 = "";

	switch ($type) {

		case "uploader":
			$red1 = "../../task1/uploadtester.html";
			$red2 = "../../task1/login.html";
			break;
		case "messenger":
			$red1 = "../../task2/.html";
			$red2 = "../../task2/login.html";
			break;
		case "messengertoolbar":
			$red1 = "../../task2ext/test.html";
			$red2 = "../../task2ext/login.html";
			break;
		case "filemanager":
			$red1 = "../../task4/filemanager.html";
			$red2 = "../../task4/login.html";
			break;
		case "accountmanager":
			$red1 = "../../util/accmanager.html";
			$red2 = "../../util/";
			break;
		case "messengertb":
			$red1 = "../../task2ext/test.html";
			$red2 = "../../task2ext/login.html";
			break;
		default:
			$red1 = "../../task2/msger.html";
			$red2 = "../../task2/login.html";
			break;
	}

	session_destroy();
	echo "<meta http-equiv=\"refresh\" content=\"1; url={$red2}\">";
?>

</body>
</html>