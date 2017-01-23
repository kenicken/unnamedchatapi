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
	
	$Accman = new AccountManager;

	if (is_numeric($t_ID)) {

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
		 	
		 	$Accman->setIdleFlag($idle, $uname);
		 	$Accman->update_activity($uname);
			$CLIENT = new Client($uname, $upass, $r_ID, $t_ID);
			$list = $CLIENT->fetch_log($LIMIT, 0, $ftch);
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
	}
	else {

		try {

			$t_ID = explode(',', $t_ID);
			echo "\"chatList\": [";

			for ($j = 0; $j < count($t_ID); $j++) {

				echo "{";
				try {
					
					if (isset($_SESSION["uname"]))
				 		$uname = $_SESSION["uname"];
				 	else
				 		throw new Exception ("Failed count error");

				 	if (isset($_SESSION["upass"]))
				 		$upass = $_SESSION["upass"];
				 	else
				 		throw new Exception ("Failed count error");
				 	
					if (!$idle) {
				 		$Accman->update_activity($uname);
				 	}

					$CLIENT = new Client($uname, $upass, $r_ID, $t_ID[$j]);
					$list = $CLIENT->fetch_log($LIMIT, 0, $ftch);
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
					echo "\"requesterID\": $r_ID,";
					echo "\"targetID\": $t_ID[$j],";
					echo "\"fetchStatus\": 1,";
					echo "\"list\": $txt";
				}
				catch (Exception $ex) {

					echo "\"fetchStatus\": 0,";
					echo "\"list\": []";
				}
				echo "}";

				if ($j + 1 < count($t_ID)) {
					echo ",";
				}
			}
			echo "]";
		}
		catch (Exception $ex) {
			
		}
	}
?>