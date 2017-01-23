<html>
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<link rel="stylesheet" type="text/css" href="../../css/misc.css">
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<script type="text/javascript" src="../JS/utility.js"></script>
<body>

	<?php
		session_start();
		include('user.php');

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

		try {
			$Accman = new AccountManager;
			$UNAME = $_POST["uname"];
			$UPASS = $_POST["upass"];

			if (!isset($_SESSION["uname"])) {

				$LOGIN = $Accman->verify_login($UNAME, $UPASS);
				if ($LOGIN) {
						
					$_SESSION["uname"] = $UNAME;
					$_SESSION["upass"] = $UPASS;
					$Accman->adjust_status($UNAME, 1);
					$Accman->update_activity($UNAME);

					//**    
					//
					//$Accman->generate_token($UNAME);
					//$_SESSION["token"] = $Accman->fetch_token($UNAME);
					//echo $_SESSION["token"];
					//
					echo "<div id='info_good'><div id='text'>Congratulations! You have successfully logged in</div></div>";
					echo "<script>fade('info_good', 0, 100, 500)</script>";
					echo "<meta http-equiv=\"refresh\" content=\"1; url={$red1}\">";

				}
				else {
							
					echo "<div id='info_bad'><div id='text'>Invalid Username or Password</div></div>";
					echo "<script>fade('info_bad', 0, 100, 500)</script>";
					echo "<meta http-equiv=\"refresh\" content=\"1; url={$red2}\">";

				}

			}
			else {
				echo "<div id='info'><div id='text'>Redirecting...</div></div>";
				echo "<script>fade('info', 0, 100, 500)</script>";
				echo "<meta http-equiv=\"refresh\" content=\"1; url={$red1}\">";
			}
		}
		catch (Exception $ex) {
			echo "<div id='info_warn'><div id='text'>" . $ex->getMessage() . "</div></div>";
			echo "<script>fade('info_warn', 0, 100, 500)</script>";
		}

		?>

</body>
</html>
