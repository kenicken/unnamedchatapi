<?php

	session_start();

	$CODE_LIST = $_POST["req"];

	if (isset($_SESSION["uname"])) {

		$uname = $_SESSION["uname"];
		$upass = $_SESSION["upass"];
		include ('client.php');

		try {
			$CLIENT = new Client($uname, $upass);

			switch ($CODE_LIST) {
				case 0:
					echo json_encode($CLIENT->fetch_users());
					break;
				case 1:
					echo json_encode($CLIENT->fetch_requester());
					break;
				default:
					break;
			}
			
		}
		catch (Exception $ex) {
			echo $ex;
		}
		

	}		

?>