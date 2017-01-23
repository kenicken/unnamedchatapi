<?php
	
	session_start();

	$ACTION;
	$ERROR = false;

	switch ($_POST["option"]) {
		case "Accept":

			$ACTION = true;
			break;

		case "Decline":

			$ACTION = false;
			break;

		default:

			$ACTION = false;
			$ERROR  = false;
			break;
	}
		

	if (isset($_SESSION["uname"])) {

		$uname = $_SESSION["uname"];
		$upass = $_SESSION["upass"];
		$id    = $_POST["list_requester"];
		include ('../scripts/PHP/client.php');

		try {
			$CLIENT = new Client($uname, $upass);
			if ($ACTION == true) {
				try {

					$CLIENT->accept_user_request($id);
					echo "User with ID #: {$id} is accepted as friends!";
					echo "<meta http-equiv=\"refresh\" content=\"5; url=msger.html\">";

				}
				catch (Exception $ex) {

					echo "Error: $ex";
					
				}
			}
			else {

				if ($ERROR == true) {
					echo "ERROR: POST VALUE IS INVALID, DECLARING ACTION DEFAULT: {$ERROR}. <br>
						  Please make sure that form values are correct. <br>";
				}

				try {
					$CLIENT->del_user_request($id);
					echo "User with ID #: {$id} is deleted successfuly!";
					echo "<meta http-equiv=\"refresh\" content=\"5; url=msger.html\">";
				}
				catch (Exception $ex) {

					echo "Error: $ex";

				}
				

			}
			
		}
		catch (Exception $ex) {
			echo $ex;
		}
		

	}

?>