<?php
	
	include ('client.php');
	if (!isset($_SESSION)) {
	 	session_start();
	}

	$uname = "";
	$upass = "";

	echo "\"friendList\": {";
	try {

		if (isset($_SESSION["uname"]))
	 		$uname = $_SESSION["uname"];
	 	else
	 		throw new Exception ("Failed count error");

	 	if (isset($_SESSION["upass"]))
	 		$upass = $_SESSION["upass"];
	 	else
	 		throw new Exception ("Failed count error");
	 	
		echo "\"fetchStatus\": 1,";
		echo "\"list\": ";
		$CLIENT = new Client($uname, $upass);
		$list = $CLIENT->fetch_friends();
		$txt = "[ ";
		for ($i = 0; $i < count($list); $i++) {

			if ($i + 1 == count($list)) {

				$txt .= $list[$i];
			}
			else {

				$txt .= $list[$i] . ",";
			}
		}

		$groups = $CLIENT->fetch_groups();

		if (count($list) > 0 && count($groups) > 0) 
			$txt .= ",";

		for ($i = 0; $i < count($groups); $i++) {

			if ($i + 1 == count($groups)) {

				$txt .= $groups[$i];
			}
			else {

				$txt .= $groups[$i] . ",";
			}
		}

		$txt .= "]";
		echo $txt;

	}
	catch (Exception $ex) {

		echo "\"fetchStatus\": 0,";
		echo "\"list\": []";
	}

	echo "}";

?>