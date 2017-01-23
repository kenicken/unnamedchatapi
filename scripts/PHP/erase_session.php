<?php

	session_start();
	session_destroy();

	$type = $_GET["type"];
	$red1 = "";
	$red2 = "";

	switch ($type) {

		case "uploader":
			$red1 = "../../task1/uploadtester.html";
			$red2 = "../../task1/login.html";
			break;
		case "messenger":
			$red1 = "../../task2/msger.html";
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

	echo "<meta http-equiv=\"refresh\" content=\"1; url={$red2}\">";	
?>