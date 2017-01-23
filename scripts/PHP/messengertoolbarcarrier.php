<?php

	echo "{\"chatData\": { ";
	include('login.php');
	echo ",";
	include ('friend_request_fetch.php');
	echo ",";
	include ('getfriends.php');
	echo ",";
	include ('gettoolbarchatlog.php');
	echo "}}";
?>