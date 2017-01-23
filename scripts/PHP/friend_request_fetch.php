<?php
	
	 if (!isset($_SESSION)) {
	 	session_start();
	 }

	 $uname = "";
	 $upass = "";
	 include ('client.php');

	 echo "\"friendRequest\": ";
	 try {

	 	if (isset($_SESSION["uname"]))
	 		$uname = $_SESSION["uname"];
	 	else
	 		throw new Exception ("Failed count error");

	 	if (isset($_SESSION["upass"]))
	 		$upass = $_SESSION["upass"];
	 	else
	 		throw new Exception ("Failed count error");
	 	
	 	$CLIENT = new Client($uname, $upass);
	 	echo  json_encode(array("Count" => intval($CLIENT->count_friend_request())));	
	 }
	 catch (Exception $ex) {

	 	echo  json_encode(array("Count" => -1));
	 }
	 
	
?>