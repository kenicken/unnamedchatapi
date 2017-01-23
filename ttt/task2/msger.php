<?php
	include("dbsearchfunc.php");
	include("msgprocessor.php");
		
	$req_id = $_POST["req_id"];
	$tar_id = $_POST["tar_id"];
	$msg_vl = $_POST[ "msg"  ];

	/*
		Since we disallowed chatting by itself client sidedly.
			We should do the same server sidedly.
	*/

	if ($req_id == $tar_id || ($tar_id == 0 || $req_id == 0))
	{
		echo "FALSE\n" . "ID:" .$req_id . "\n" . "TARGET:" . $tar_id;
	}
	else
	{
		$chatsession = lesser($req_id, $tar_id) . "to" . greater($req_id, $tar_id);
		$sql = "";

		echo $chatsession;
	}
	
?>
