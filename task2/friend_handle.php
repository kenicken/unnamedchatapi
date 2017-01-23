<?php
	
	session_start();

	if (isset($_SESSION["uname"])) {

		include ('../scripts/PHP/client.php');
		$id = $_POST["list_friend"];
		$uname = $_SESSION["uname"];
		$upass = $_SESSION["upass"];

		try {

			$CLIENT = new Client($uname, $upass);
			$CLIENT->add_user_request($id);
			echo "<meta http-equiv=\"refresh\" content=\"1; url=msger.html\">";

		}
		catch (Exception $ex) {

			echo "ERROR $ex";
			echo "<meta http-equiv=\"refresh\" content=\"5; url=msger.html\">";

		}
	}
	

	
?>