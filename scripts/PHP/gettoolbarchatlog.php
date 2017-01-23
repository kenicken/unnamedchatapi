<?php

	include('client.php');
	include('user.php');
	if (!isset($_SESSION)) {
	 	session_start();
	}

	$LIMIT = $_POST["LIMIT"];
	$r_ID  = $_POST["r_ID" ];
	$t_ID  = $_POST["t_ID" ];
	$uname = "";
	$upass = "";
	
	$Accman = new AccountManager;

	echo "\"chatList\": {";
	try {
		
		if (isset($_SESSION["uname"]))
	 		$uname = $_SESSION["uname"];
	 	else
	 		throw new Exception ("Failed count error");

	 	if (isset($_SESSION["upass"]))
	 		$upass = $_SESSION["upass"];
	 	else
	 		throw new Exception ("Failed count error");
	 	
		$Accman->update_activity($uname);
		$CLIENT = new Client($uname, $upass, $r_ID, $t_ID);
		$list = $CLIENT->fetch_log($LIMIT);
		$txt = "[ ";
		for ($i = 0; $i < count($list); $i++) {

			if ($i + 1 == count($list)) {

				$txt .= $list[$i];
			}
			else {

				$txt .= $list[$i] . ",";
			}
		}

		$txt .= "]";

		echo "\"fetchStatus\": 1,";
		echo "\"list\": $txt";
	}
	catch (Exception $ex) {

		echo "\"fetchStatus\": 0,";
		echo "\"list\": []";
	}
	echo "}";
	
?>