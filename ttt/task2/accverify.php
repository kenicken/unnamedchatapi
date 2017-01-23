<?php
	// Accverify.php
	// Log-in as root user
	include("dbsearchfunc.php");
	
	$con = mysqli_connect("127.0.0.1", "root", "");
	if (mysqli_connect_errno($con))
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error($con) . "<br>";
	}
	
	$sql = "CREATE DATABASE IF NOT EXISTS _UMSYS;"; 		// For username and password
	if (!mysqli_query($con, $sql))
	{
		echo "ERROR: " . mysqli_error($con) . "<br>";
	}
	
	$sql = "CREATE DATABASE IF NOT EXISTS _UMSYSTRANS;";	// For transaction purposes
	if (!mysqli_query($con, $sql))							
	{
		echo "ERROR: " . mysqli_error($con) . "<br>";
	}
	
	mysqli_select_db($con, "_UMSYS");

	/* END */

	/*
		Fetch data before it is lost (PHP does that sometimes).
	*/

	$UNAME = $_POST["uname"];
	$UPASS = $_POST["pass"];
	
	if (table_exists('User_Table', $con) == true && table_exists('Usern_Table', $con) == true) 
	{
		
		/*
			If both of these tables exist, then proceed to inserting username and password to database.
		*/

		if (create_user($con, $UNAME, $UPASS, 4, false))
		{
			echo "Registration Success! <br>";
			$sql1 = "CREATE USER '" . $_POST["uname"] . "'@'%' IDENTIFIED BY '" . $_POST["pass"] . "';";		// Create a user with 'any' hostname wildcard
			$sql4 = "CREATE USER '" . $_POST["uname"] . "'@localhost IDENTIFIED BY '" . $_POST["pass"] . "';";  // This one is for localhost accesss
			$sql2 = "GRANT SELECT ON _UMSYS.* TO '" . $_POST["uname"] . "'@'%';";							    // The previlages it is only allowed to access.
			$sql3 = "GRANT SELECT ON _UMSYSTRANS.* TO '" . $_POST["uname"] . "'@'%';";							// ^^
			
			/* EXECUTE QUERY  */
			
			if (!mysqli_query($con, $sql1))							
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>";
			}
			if (!mysqli_query($con, $sql2))							
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>";
			}
			if (!mysqli_query($con, $sql3))
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>"; 
			}
			if (!mysqli_query($con, $sql4))
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>";
			}
		}
		else
		{
			echo "Registration Failure! [Existing Username] <br>";
		}
			

		
	}
	else
	{
		/*
			User_Table holds the ID of that User, previlage and its' password, while the Usern_Table references the ID of that user
			and stores the username of that User. It also makes the username unique.
			
			First phase. Creates a user ROOT with all previlages available for it.
				Creates and indexes User ID and Password but not the username itself.
		*/
		$sql = "CREATE TABLE User_Table (UID INTEGER NOT NULL AUTO_INCREMENT, UPRL INTEGER, UPASS VARCHAR(20), PRIMARY KEY(UID));";
		if (!mysqli_query($con, $sql))
			echo "ERROR [CREATING TABLE] : " . mysqli_error($con) . "<br>";
		$sql = "INSERT INTO User_Table VALUES(1, 1, '123456');";
		if (!mysqli_query($con, $sql))
			echo "ERROR [INSERTING DATA] : " . mysqli_error($con) . "<br>";
			
		/*
			Second phase, Creates a reference of User ID from User_Table and then
				stores the desired username from their.

			Note: "THERE'S A SEPERATE ALGORITHM FOR INSERTING A NON ROOT ACCOUNT"
		*/
		$sql = "CREATE TABLE Usern_Table (UID INTEGER, UNAME VARCHAR(15), PRIMARY KEY(UNAME), FOREIGN KEY (UID) REFERENCES User_Table(UID));";
		if (!mysqli_query($con, $sql))
			echo "ERROR [CREATING TABLE] : " . mysqli_error($con) . "<br>";
		$sql = "INSERT INTO Usern_Table VALUES(1, 'root');";
		if (!mysqli_query($con, $sql))
			echo "ERROR [INSERTING DATA] : " . mysqli_error($con) . "<br>";
		
		/*
			Third phase, Creates a user named NULL with no previlagles
		*/

		$sql = "INSERT INTO User_Table (UPRL, UPASS) VALUES(0, 'NOTVALID');";
		if (!mysqli_query($con, $sql))
			echo "ERROR [INSERTING DATA] : " . mysqli_error($con) . "<br>";
		$sql = "UPDATE User_Table SET UID = 0 WHERE UID = 2";
		if (!mysqli_query($con, $sql))
			echo "ERROR [INSERTING DATA] : " . mysqli_error($con) . "<br>";

		$sql = "INSERT INTO Usern_Table VALUES(0, 'NULL');";
		if (!mysqli_query($con, $sql))
			echo "ERROR [INSERTING DATA] : " . mysqli_error($con) . "<br>";
		
			
		if (create_user($con, $UNAME, $UPASS, 4, false))
		{
			echo "Registration Success! <br>";
			$sql1 = "CREATE USER '" . $_POST["uname"] . "'@'%' IDENTIFIED BY '" . $_POST["pass"] . "';";		// Create a user with 'any' hostname wildcard
			$sql4 = "CREATE USER '" . $_POST["uname"] . "'@localhost IDENTIFIED BY '" . $_POST["pass"] . "';";  // This one is for localhost accesss
			$sql2 = "GRANT SELECT ON _UMSYS.* TO '" . $_POST["uname"] . "'@'%';";							    // The previlages it is only allowed to access.
			$sql3 = "GRANT SELECT ON _UMSYSTRANS.* TO '" . $_POST["uname"] . "'@'%';";							// ^^
			
			/* EXECUTE QUERY  */
			
			if (!mysqli_query($con, $sql1))							
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>";
			}
			if (!mysqli_query($con, $sql2))							
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>";
			}
			if (!mysqli_query($con, $sql3))
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>"; 
			}
			if (!mysqli_query($con, $sql4))
			{
				echo "ERROR [QRY ERR]: " . mysqli_error($con) . "<br>";
			}
		}
		else
		{
			echo "Registration Failure! <br>";
		}
			
	}
 
	mysqli_close($con);	
?>
