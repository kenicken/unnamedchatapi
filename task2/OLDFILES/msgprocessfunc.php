<?php
	
	include("dbsearchfunc.php");
	/*
	 *	ROOT ONLY function.
	 */
	
	
	function get_uname ($ID)
	{
		$con = mysqli_connect("127.0.0.1", "root", "asdasdwcr");
		if (mysqli_connect_errno($con))
		{
			return false;
		}
	
		mysqli_select_db($con, "_UMSYS");
		if (table_exists('User_Table', $con) == true && table_exists('Usern_Table', $con) == true)
		{
			$sql = "SELECT Usern_Table.Uname, User_Table.UPASS FROM Usern_Table INNER JOIN User_Table ON User_Table.UID = Usern_Table.UID WHERE Usern_Table.UID =" . $ID . ";";
			$rS    = mysqli_query($con, $sql);
			$row   = mysqli_fetch_array($rS);
			$UNAME = $row["Uname"];
			mysqli_close($con);
			return $UNAME;		
		}

		mysqli_close($con);
		return false;		
	}	
?>
