<?php

	include('client.php');
	include('user.php');
	if (!isset($_SESSION)) {
	 	session_start();
	}

	$LIMIT = $_POST["LIMIT"];
	$r_ID  = $_POST["r_ID" ];
	$t_ID  = $_POST["t_ID" ];
	$ftch  = $_POST["fetchStamp"];
	$idle  = $_POST["isClientIdle"] === 'true' ? true : false;
	//$ftch  = "2015-10-21 11:26:25";
	$uname = "";
	$upass = "";

	if ($t_ID === "null") {
		$t_ID = -1;
	}

	if (is_numeric($t_ID)) {

		try {

			if (isset($_SESSION["uname"]))
		 		$uname = $_SESSION["uname"];
		 	else
		 		throw new Exception ("Failed count error");

		 	if (isset($_SESSION["upass"]))
		 		$upass = $_SESSION["upass"];
		 	else
		 		throw new Exception ("Failed count error");

		 	$CLIENT = new Client($uname, $upass, $r_ID, $t_ID);
			$list = $CLIENT->fetch_users_of_group();
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
			echo "\"groupMembers\": $txt";
		}
		catch (Exception $ex) {
			echo "\"groupMembers\": []";
		}
	}
?>