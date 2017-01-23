<?php

	include('client.php');
	include('user.php');

	if (!isset($_SESSION)) {
	 	session_start();
	}

	$LIMIT = -1;
	$r_ID  = 2;
	$t_ID  = "3,4";
	$uname = "";
	$upass = "";
	
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
				 	
					$Accman->update_activity($uname);

					$CLIENT = new Client($uname, $upass, $r_ID, $t_ID[$j]);
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