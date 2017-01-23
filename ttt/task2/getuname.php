<?php
	include("msgprocessfunc.php");
	$ID = $_POST["id"];
	$UNAME = get_uname($ID);
	if (empty($UNAME))
		echo "";
	else
		echo $UNAME;
?>
