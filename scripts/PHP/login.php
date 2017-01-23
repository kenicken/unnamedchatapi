<?php
	
	if (!isset($_SESSION)) {
	 	session_start();
	}

	include('user.php');

	if (!isset($_POST["status"])) {

		if (isset($_SESSION["uname"])) {
			echo "<meta http-equiv=\"refresh\" content=\"1; url={$red1}\">";
		}
		else {
			echo "<meta http-equiv=\"refresh\" content=\"1; url={$red2}\">";
		}

	}
	else {

		$Accman = new AccountManager;

		echo "\"sessionStatus\":";
									  //Commented the token because we dont need it anymore
		if (isset($_SESSION["uname"]) /*&& $_SESSION["token"] == $Accman->fetch_token($_SESSION["uname"]) */) {

			$str_val = json_encode(array("ID" => 1));
			echo $str_val;
		}
		else {
			
			$str_val = json_encode(array("ID" => 0));
			echo $str_val;
		}
		echo "";
	}
?>