<?php

	function table_exists ($tablename, $connection) {

		$qry = "SHOW TABLES LIKE '" . $tablename . "';";
		$table = mysqli_query($connection, $qry);
		return ($table != false) ? true : false;
		
	}

	/*
		Previlage Legend:

		0 = No Previlage
		1 = ROOT
		2 = ADMIN
		3 = MOD
		4 = USER
	*/

	function create_user ($con, $username, $password, $Previlage, $debug = false) {


		/*
			Register the user on the Usern_Table list
			with the id set to 0 (Unprevilaged) 
		*/
		$success = false;
		$sql = "INSERT INTO Usern_Table VALUES(0, '" . $username  ."');";

		if (mysqli_query($con, $sql)) {

			/*
				If the previous action was a success then
				create a new UID having the assigned previlage
				and password intact.
			*/			

			$sql1 = "INSERT INTO User_Table(UPRL, UPASS) VALUES(". $Previlage  .", '". $password  ."');";
			if (mysqli_query($con, $sql1)) {

				/*
					After that, get the new UID and change the previous
					id in the Usern_Table with the one generated from
					the User_Table.
				*/
				
				$sql2 = "SELECT MAX(UID) FROM User_Table WHERE UPASS = '" . $password  . "';";				
				$rS   = mysqli_query($con, $sql2);
				$row  = mysqli_fetch_array($rS);
				$UID  = $row["MAX(UID)"];
				$sql3 = "UPDATE Usern_Table SET UID = ". $UID ." WHERE UNAME='". $username  ."'";
				
				if (mysqli_query($con, $sql3)) {

					$success = true;

				}
				
				if (!$success && $debug) {

					echo "ERROR [CREATING USER] : " . mysqli_error($con)  . "<br>";

				}	
			}
			else if ($debug) {

				echo "ERROR [CREATING USER] : " . mysqli_error($con) . "<br>";

			}
		}
		else if ($debug) {

			echo "ERROR [CREATING USER] : " . mysqli_error($con) . "<br>";

		}

		return $success;

	}
?>
