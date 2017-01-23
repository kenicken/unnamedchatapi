<?php

	include ("msgprocessfunc.php");
	include ("msgprocessor.php");

	function getchatlog ($tb_name)
	{
		$con = mysqli_connect("127.0.0.1", "root", "asdasdwcr");	//Temporary For Now
		$strbuff = "";
		if (mysqli_connect_errno($con))
		{
			return false;
		}

		mysqli_select_db($con, "_UMSYSTRANS");
		if (table_exists($tb_name, $con) == true)
		{
			$sql = "SELECT * FROM " . $tb_name . ";";
			$rS  = mysqli_query($con, $sql);
			while ($row = mysqli_fetch_array($rS))
			{
				$UID = $row["UID"];
				$MSG = $row["UMSG"];
				$UNM = get_uname($UID);
				$strbuff .= $UNM . " : " . $MSG . "\n";
			}
		}

		mysqli_close($con);
		return $strbuff;
	}

	$_ID1 = $_POST["RQ_ID"];
	$_ID2 = $_POST["TG_ID"];
	$_TB_NAME = lesser($_ID1, $_ID2) . "to" . greater($_ID1, $_ID2);

	echo getchatlog($_TB_NAME);
?>