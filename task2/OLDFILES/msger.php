<?php
	include("dbsearchfunc.php");
	include("msgprocessor.php");
		
	$req_id = $_POST["req_id"];
	$tar_id = $_POST["tar_id"];
	$msg_vl = $_POST[ "msg"  ];

	/*
						  Since we disallowed chatting by itself client sidedly.
			We should do the same server sidedly (Just in case some tool tried to modify the client).
	*/

	if ($req_id == $tar_id || ($tar_id == 0 || $req_id == 0))
	{
		echo "You're not allowed to chat yourself.";
	}
	else
	{
		$chatsession = lesser($req_id, $tar_id) . "to" . greater($req_id, $tar_id);
		$sql = "";

		$con = mysqli_connect("127.0.0.1", "root", "asdasdwcr"); //Test
		mysqli_select_db($con, "_UMSYSTRANS");					 //Transaction Table :)
		$sql = "INSERT INTO " . $chatsession . " VALUES(" . $req_id . ", '" . $msg_vl . "');";
		if (!mysqli_query($con, $sql))
		{
			$sql1 = "CREATE TABLE " . $chatsession . " (UID INTEGER, UMSG VARCHAR(255), FOREIGN KEY (UID) REFERENCES _UMSYS.User_Table(UID));";
			if (mysqli_query($con, $sql1))
			{
				$sql2 = "INSERT INTO " . $chatsession . " VALUES(" . $req_id . ", '" . $msg_vl . "');";
				if (!mysqli_query($con, $sql2))
				{
					echo "ERROR:[INS] " . mysqli_error($con) . "\n";
				}
			}
			else
			{
				echo "ERROR:[CRT] " . mysqli_error($con) . "\n";
			}
		}

		echo "";
		
	}
	
?>
