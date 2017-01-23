<?php

/*
  ==============================================================================================

  Warning: This php file should not be included on it's own, it must be REFFERED to by user.php
  or else any enum constants it relies on will be missing and the script itself will not work.

  ----------------------------------------------------------------------------------------------
  ==============================================================================================


  Variable Descriptions [Those that has the modifiable tag can have their values modified]
  						[Those that has the global tag are variables/function that are not inside a class]
    
    $dbcon = The variable that holds the connection of the database
    
    
    $USER_DATABASE (modifiable) (global)  = the variable that tells what will be the name of
                  the database that manages that holds info about the users.
    
    $TRANSACTION_DATABASE (modifiable) (global) = the variable that tells what will be the name
                  of the database that holds the transaction records between user to user.
	
	$ROOT_UNAME (modifiable) (global) = this variable holds the username of the root user of the mysql database 
	that the system will run on.

	$ROOT_PASS (modifiable) (global)  = this variable holds the password of the root password of the mysql database
	that the system will run on.

	$portable  (modifiable) (global)  = this variable determines how the system will manage the database.

	$localOnly (modifiable) (global)  = this variable determines if the IP address that should be inserted in the 
	mysqli_connect is the requester's IP address or override it with localhost value.

  
  
 Class Functions and Descriptions
===================================================================================================
  ----------------------------------------[Account Manager]-------------------------------------
  Description:
	Account Manager is a class that has functions that only the root user is capable of doing, such as
	checking all databases inside a server, adding/deleting and anything account related. A lot of classes
	rely on the Account Manager because most of the low level workings are done here and other classes act
	as an interface of it.

  Functions:

  	[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
  	[]										P U B L I C              	                      []
    [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]


    [public] __construct() 				= The constructor of the class. On construction.
   										  This class logs in as a root user, then implements a routine check.
    
    [public] __destruct () 				= The destructor of the class. It closes the connection that was
   										 created upon creating the class.
	
	[public] accept_friend_req (<requester_username>, <id>)
										= Accepts a friend request

	[public] add_friend_req (<requester_username>, <id>)
										= Adds a friend request notification to the targeted user based on the
										given id.

   	[public] adjust_status (<username>, <status>)
   										= Adjusts the status of a given user's status
   										[Status refers to if user is Online, Offline or Busy]
	
	[public] create_user (<username>, <password>, <previlage>, Default <isHashed> = False )
										= Creates a user with the given username, password and previlage level.
										The isHashed variable dictates if the password is already hashed and
										and by default is set to false. Which means that it will be hashed by the
										sha_algo() function.

	[public] del_friend_req (<requester_username>, <id>)
										= Deletes a friend request found in the list of the targeted user based
										on the given id.

	[public] erase_token (<username>)	= Erases the token that is stored within the user.

	[public] fetch_token (<username>)	= Fetches the token that is stored within the user.

	[public] fetch_friends_list (<username>, <id_of_user>)
										= Fetches the list of friends that the current user has.

	[public] fetch_user_list (<username>, <id_of_user>, Default <fetch_type> = fetchType.User)
										= Fetches the list of users depending on the fetch_type Value.

										-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
										  If the fetch_type value is User, then it will list all the users
										  that isn't on the user's friend list.

										  If the fetch_type value is All, then it will list the all the users
										  regardless if they're on his friends list or not.
										-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

	[public] fetch_request_list (<username>, <id_of_user>)
										= Fetches the list of users that has currently made a request to add those users.

	
	[public] friend_request_count (<username>)
										= Counts the amount of users that the has made a friend request to the user.


	[public] grant_access_create (<databaseName>, <tableName>, <username>, <password>)
										= Allows a specific user to access a specific table in a database.

	[public] generate_randomString (<length>) : Default <length> = 15
										= Generates a random string (ASCII) with a specified length.
	[public] generate_token (<username>) 
										= Generates a token using generate_randomString(15) then pushes it to
										  the current user.


	[public] get_id_of_user (<username>)= Gets the id of the user based on the given username

	[public] get_previlage (<username>) = Gets the previlage of the current user.

	[public] get_un_of_id (<id>)		= Gets the username of a given id

	[public] obtain_status (<username>) = Obtains the status of the user

	[public] obtain_status_withID (<id>)= Obtains the status of the user directly with an ID 
										  instead of asking the user
	
	[public] register_group(<groupName>, <id>)
										= Registers a particular group and bind it to a user.

	[public] join_group(<groupID>, <id>)
										= Makes the user join a particular group

	[public] sha_algo (<stringval>, <optionalval>)		
										= Returns a hashed string value of SHA algorithm + salted.
										  second parameter is optional but is recommended to be use
										  to ensure that passwords that is hashed remains unique despite
										  having the same password value. 

	[public] update_activity (<username>)
										= Updates the user's activity timestamp to the most present one
										(The timestamp is based on server time)
	
	[public] validate_if_inactive (<username>)
										= Compares the last timestamp activity of the user and the current
										  timestamp and see if the user has pass the 5 minute inactive mark.
	
	

	[public] verify_login (<username>, <password>, <isHashed> (optional))
										= Verifies if the given username and password is valid, the 3rd parameter
										is optional and by default is set to false. The hash parameter determines
										if the password to be compared is already hashed or not.

	[public] get_groupName(<id>)
										= Obtains the group name given by a specific id. Input recieved
										is usually negative in order to separate group chat target from
										private messaging


	[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
  	[]										P R I V A T E              	                      []
    [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]

	[private] add_default_users ()      = Adds the default users (NULL and ROOT) to the system.
	[private] check_table (<tableName>) = This function checks if a table exists within a selected database    
    [private] check_database ()			= This function checks if the require database exists and creates one
    									  if not found.
    [private] check_default_tables ()	= Checks if the default tables (User_Table and Usern_Table) exists and
    									  creates one if not found.

    

*/
  
if (!defined('accman_definition_included')) {
    
  	define('accman_definition_included', '');
  
 	//The contents inside these variables are modifiable. Any changes inside these variables
  	//will affect how the system runs.
  	$USER_DATABASE = "_UMSYS";
  	$TRANSACTION_DATABASE = "_UMSYSTRANS";
  	$ROOT_UNAME = "root";
  	$ROOT_PASS  = "";
  	$portable   = true;
  	$localOnly  = true;
  
  	class AccountManager {

    // The contents inside these variables are not modifiable.
  	// Any changes inside these variables will NOT affect anything.
  		
	    private $dbcon = "";
	    public $USER_DATABASE = "";
	    public $TRANSACTION_DATABASE = "";

	//Generators -----------------------------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    	public function sha_algo ($stringval, $uname_val = "") {

			$length = strlen($stringval);
			$pass_hash_salt_beg = "49a9k12s0dk2";
			$pass_hash_salt_mid = "fjs0349f0skz";
			$pass_hash_salt_end = "zkxid0w02d9x";
			$final_hash_val = $stringval . $uname_val;
			$pass_hash_val = hash("sha512", $final_hash_val);
			$pass = $pass_hash_salt_beg . substr($pass_hash_val, 0, $length / 2) . $pass_hash_salt_mid . 
				substr($pass_hash_val, $length / 2) . $pass_hash_salt_end;

			return $pass;

		}

		public function erase_token ($username) {

			$tokval = "";
			$id  = $this->get_id_of_user($username);
			$sql = "UPDATE User_Table SET TOKEN=? WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "si", $tokval, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

		public function erase_token_withID ($id) {

			$tokval = "";
			$sql = "UPDATE User_Table SET TOKEN=? WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "si", $tokval, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

		private function generate_randomString($length = 10) {
		    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		    $randomString = '';
		    for ($i = 0; $i < $length; $i++) {
		        $randomString .= $characters[rand(0, strlen($characters) - 1)];
		    }
		    return $randomString;
		}

		public function generate_token ($username) {

			$tokval = $this->sha_algo($this->generate_randomString());
			$id  = $this->get_id_of_user($username);
			$sql = "UPDATE User_Table SET TOKEN=? WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "si", $tokval, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

	//<>>------
		
	//Checkers and Validators ----------------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		private function check_table ($tablename) {

			$qry = "SHOW TABLES LIKE '" . $tablename . "'";
			$table = mysqli_query($this->dbcon, $qry);
			$res = mysqli_num_rows($table);
			return $res > 0 ? true : false;
		
		}

		private function check_database () {

			$sql1 = "CREATE DATABASE IF NOT EXISTS $this->USER_DATABASE;"; 
			$sql2 = "CREATE DATABASE IF NOT EXISTS $this->TRANSACTION_DATABASE;";

			if (!mysqli_query($this->dbcon, $sql1) || !mysqli_query($this->dbcon, $sql2))
				throw new Exception ("There was an error in the create database query. Please check if root is " .
                             "accessible or the variables $USER_DATABASE and $TRANSACTION_DATABASE have proper " .
                             "contents.\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "");


		}

		private function check_default_tables () {

			if ($this->check_table('User_Table') == false && $this->check_table('Usern_Table') == false &&
				$this->check_table('Group_Table')== false && $this->check_table('Groupmem_Table') == false) {
				
				if (!$this->check_table('User_Table')) {

					$sql = "CREATE TABLE User_Table (UID INTEGER NOT NULL AUTO_INCREMENT, 
                                           UPRL INTEGER, UPASS VARCHAR(175), 
                                           FRIEND_REQ INTEGER DEFAULT 0, 
                                           ONLINE TINYINT(1) NOT NULL DEFAULT 0, 
                                           IDLE   TINYINT(1) NOT NULL DEFAULT 0,
                                           LASTACTIVITY TIMESTAMP, 
                                           TOKEN VARCHAR(175),
                                           DIRECTORY VARCHAR(175),
                                           PRIMARY KEY(UID));";
                                           
					if (!mysqli_query($this->dbcon, $sql)) {
						throw new Exception ("There was an error in creating User_Table table, please check if root " .
                                 "is accessible\n\n<br><br>\n" .
                                 "DEBUG: " . mysqli_error($this->dbcon) . "<br>");
        			}

				}

				if (!$this->check_table('Usern_Table')) {

					$sql = "CREATE TABLE Usern_Table (UID INTEGER, 
                                            UNAME VARCHAR(15), 
                                            PRIMARY KEY(UNAME), 
                                            FOREIGN KEY (UID) REFERENCES User_Table(UID));";
                                            
					if (!mysqli_query($this->dbcon, $sql)) {
						throw new Exception ("There was an error in creating Usern_Table table, please check if root " .
                                 "is accessible\n\n<br><br>\n" .
                                 "DEBUG: " . mysqli_error($this->dbcon) . "<br>");
          			}
				}

				if (!$this->check_table("Group_Table")) {

					$sql = "CREATE TABLE Group_Table (GID INTEGER NOT NULL AUTO_INCREMENT, 
                                           Owner INTEGER,
                                           Name VARCHAR(175),
                                           PRIMARY KEY(GID),
                                           FOREIGN KEY (Owner) REFERENCES User_Table(UID)
                            );";
                                            
					if (!mysqli_query($this->dbcon, $sql)) {
						throw new Exception ("There was an error in creating Group_Table table, please check if root " .
                                 "is accessible\n\n<br><br>\n" .
                                 "DEBUG: " . mysqli_error($this->dbcon) . "<br>");
          			}
				}

				if (!$this->check_table("Groupmem_Table")) {

					$sql = "CREATE TABLE Groupmem_Table (GID INTEGER, 
                                            MEMID INTEGER,
                                            FOREIGN KEY (GID) REFERENCES Group_Table(GID),
                                            FOREIGN KEY (MEMID) REFERENCES User_Table(UID));";
                                            
					if (!mysqli_query($this->dbcon, $sql)) {
						throw new Exception ("There was an error in creating Groupmem_Table table, please check if root " .
                                 "is accessible\n\n<br><br>\n" .
                                 "DEBUG: " . mysqli_error($this->dbcon) . "<br>");
          			}
				}

				return true;	
			}
			return false;

		}

		public function verify_login ($username, $password, $isHashed = false) {

			if (!$isHashed) {
				$password = $this->sha_algo($password, $username);
			}
			
			$sql = "SELECT Usern_Table.UNAME, User_Table.UPASS FROM Usern_Table 
              INNER JOIN User_Table ON User_Table.UID = Usern_Table.UID 
              WHERE Usern_Table.UNAME = '" . $username . "';";
			
			$rS = mysqli_query($this->dbcon, $sql);		

			while ($row = mysqli_fetch_array($rS)) {

				$UN = $row["UNAME"];
				$UP = $row["UPASS"];
				
				if ($username == $UN) {

					if ($password == $UP) {
						return true;
					}
					return false;
				}

			}

			return false;
		}

		public function validate_if_inactive($username) {

			$_rS = "";
			$id  = $this->get_id_of_user($username);
			$sql = "SELECT User_Table.LASTACTIVITY FROM User_Table WHERE UID = ?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm,"i", $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $_rS);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);

			/*
			 *	Evaluate if the value returned is value;
			 *	If not, throws an Exception.
			*/

			if ($_rS == "")
				throw new Exception ("VALUE IS UNDEFINED");
			else if ($_rS == "NULL")
				throw new Exception ("VALUE IS NULL.");

			/*
			 *	Fetches the current date and converts it to date variable.
			 *	Same thing happens to the date fetched from the database
			 *	then subtract the difference between both date.
			 *
			 *	Get the minute difference and if it exceeds 5 minutes then
			 *	return that user is inactive. 
			*/
			
			$_CURR_TIME = date("Y-m-d H:i:s");
			$_CURR_TIME = date_create_from_format("Y-m-d H:i:s" ,$_CURR_TIME);
			$_LAST_TIME = date_create_from_format("Y-m-d H:i:s" ,$_rS);
			$_DIFF_TIME = date_diff($_CURR_TIME, $_LAST_TIME);				
			
			/*
			 *	Conversion Phase
			*/

			$MIN = $_DIFF_TIME->format("%i");
			$HRS = intval($_DIFF_TIME->format("%H"));
			$MIN = intval($MIN) + ($HRS * 60);

			if ($MIN > 5)
				return true;
			else
				return false;

		}

		public function validate_if_inactive_withID ($id) {

			$_rS = "";
			$sql = "SELECT User_Table.LASTACTIVITY FROM User_Table WHERE UID = ?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm,"i", $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $_rS);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);

			/*
				Evaluate if the value returned is value;
				If not, throws an Exception.
			*/

			if ($_rS == "")
				throw new Exception ("VALUE IS UNDEFINED");
			else if ($_rS == "NULL")
				throw new Exception ("VALUE IS NULL.");

			/*
				Fetches the current date and converts it to date variable.
				Same thing happens to the date fetched from the database
				then subtract the difference between both date.

				Get the minute difference and if it exceeds 5 minutes then
				return that user is inactive. 
			*/
			
			$_CURR_TIME = date("Y-m-d H:i:s");
			$_CURR_TIME = date_create_from_format("Y-m-d H:i:s" ,$_CURR_TIME);
			$_LAST_TIME = date_create_from_format("Y-m-d H:i:s" ,$_rS);
			$_DIFF_TIME = date_diff($_CURR_TIME, $_LAST_TIME);				
			
			/*
				Conversion Phase
			*/

			$MIN = $_DIFF_TIME->format("%i");
			$HRS = intval($_DIFF_TIME->format("%H"));
			$MIN = intval($MIN) + ($HRS * 60);

			if ($MIN > 5)
				return true;
			else
				return false;
		}

		public function validate_if_req_found ($requester, $id) {

			$res = -1;

			$sql = "SELECT UID FROM {$requester}_FRIENDS_REQ WHERE UID = ?;";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);
			

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_bind_result($stm, $res);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);

			return $res;
		}

	//<>>------
	
	//Modifiers and Creators  ----------------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		public function grant_access_create ($database, $table_name, $user, $upass) {

			$sql = "GRANT CREATE ON $database.$table_name TO '$user'@'localhost' IDENTIFIED BY '$upass'";

			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

			$sql = "GRANT CREATE ON $database.$table_name TO '$user'@'%' IDENTIFIED BY '$upass'";
			
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

		}

		private function add_default_users () {

			/* Unprevilage Phase */

			global $ROOT_UNAME;
        	global $ROOT_PASS;

			$sql = "INSERT INTO User_Table (UPRL, UPASS) VALUES(" . previlage::Invalid . ", 'NOTVALID');";

			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");;
			$sql = "UPDATE User_Table SET UID = 0 WHERE UID = 1";
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

			$sql = "INSERT INTO Usern_Table VALUES(0, 'NULL');";
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

			/* Reset Count from 2 back to 1, since the previous one with an id property of 1 */
			/* is altered back to 0. */

			$sql = "ALTER TABLE `User_Table` AUTO_INCREMENT = 1;";
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");
 
			/* Root User */

			$sql = "INSERT INTO User_Table(UPRL, UPASS, DIRECTORY) VALUES(" . previlage::Root . ", '" . 
				$this->sha_algo($ROOT_PASS, $ROOT_UNAME) . "', 'root/');";

			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

			$sql = "INSERT INTO Usern_Table VALUES(1, '{$ROOT_UNAME}');";
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

			$sql = "CREATE TABLE {$ROOT_UNAME}_FRIENDS (UID INTEGER, 
                                         UNIQUE(UID), 
                                         FOREIGN KEY (UID) REFERENCES User_Table(UID) )";
                                         
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

			$sql = "CREATE TABLE {$ROOT_UNAME}_FRIENDS_REQ (UID INTEGER, 
                                             REQUESTOR TINYINT(1), 
                                             UNIQUE(UID), 
                                             FOREIGN KEY (UID) REFERENCES User_Table(UID))";
                                             
			if (!mysqli_query($this->dbcon, $sql))
				throw new Exception ("A permission issue has been thrown, please check if root is accessible. " .
					"\n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

		}
		

		public function create_user ($username, $password, $previlage, $isHashed = false) {

			/*
				Register the user on the Usern_Table list
				with the id set to 0 (Unprevilaged) 
			*/
			$success = false;
			$pass    = "";
			global $portable;

			if (strlen($username) > 15)
			{
				throw new Exception ("Entered username is beyond the 15 character limit.");
				return;
			}

			$sql = "INSERT INTO Usern_Table VALUES(0, '" . $username  ."');";

			if (!$isHashed) {

				$pass = $this->sha_algo($password, $username);
			}
			else {
				$pass = $password;
			}

			echo $isHashed;

			if (mysqli_query($this->dbcon, $sql)) {

				/*
					If the previous action was a success then
					create a new UID having the assigned previlage
					and password intact.
				*/			

				$sql1 = "INSERT INTO User_Table(UPRL, UPASS) VALUES(". $previlage  .", '". $pass ."');";

				if (mysqli_query($this->dbcon, $sql1)) {

					/*
						After that, get the new UID and change the previous
						id in the Usern_Table with the one generated from
						the User_Table.
					*/
					
					global $ROOT_UNAME;
					$sql2 = "SELECT MAX(UID) FROM User_Table WHERE UPASS = '" . $pass  . "';";				
					$rS   = mysqli_query($this->dbcon, $sql2);
					$row  = mysqli_fetch_array($rS);
					$UID  = $row["MAX(UID)"];
					$sql3 = "UPDATE Usern_Table SET UID = ". $UID ." WHERE UNAME='". $username  ."';";
					
					if (mysqli_query($this->dbcon, $sql3)) {

						$UNAME = $username;
						$UPASS = $password;

						if (!$portable) {

							$sql1 = "CREATE USER '" . $UNAME . "'@'localhost' IDENTIFIED BY '" . $UPASS . "';";
							$sql2 = "CREATE USER '" . $UNAME . "'@'%' IDENTIFIED BY '" . $UPASS . "';";
							$sql3 = "GRANT CREATE, SELECT, INSERT ON {$this->TRANSACTION_DATABASE}.* TO '" 
									. $UNAME . "'@'localhost'";
							$sql4 = "GRANT CREATE, SELECT, INSERT ON {$this->TRANSACTION_DATABASE}.* TO '" 
									. $UNAME . "'@'%'";

							if (!mysqli_query($this->dbcon, $sql1))
								throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql1");

							if (!mysqli_query($this->dbcon, $sql2))
								throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql2");

							if (!mysqli_query($this->dbcon, $sql3))
								throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql3");

							if (!mysqli_query($this->dbcon, $sql4))
								throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql4");
						}
							
       
						$sql = "CREATE TABLE {$UNAME}_FRIENDS (UID INTEGER, 
															   UNIQUE(UID), 
															   FOREIGN KEY (UID) REFERENCES User_Table(UID));";

						if (!mysqli_query($this->dbcon, $sql))
							throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql");

						$sql = "CREATE TABLE {$UNAME}_FRIENDS_REQ (UID INTEGER, 
																   REQUESTOR TINYINT(1), 
																   UNIQUE(UID), 
																   FOREIGN KEY (UID) REFERENCES User_Table(UID));";
						if (!mysqli_query($this->dbcon, $sql))
							throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql");

						$sql = "UPDATE User_Table SET DIRECTORY='upload/{$UNAME}' WHERE UID = $UID";
						if (!mysqli_query($this->dbcon, $sql))
							throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql");

						$sql = "INSERT INTO " . $UNAME . "_FRIENDS VALUES(1);";
						if (!mysqli_query($this->dbcon, $sql))
							throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql");

						$sql = "INSERT INTO {$ROOT_UNAME}_FRIENDS VALUES($UID)";
						if (!mysqli_query($this->dbcon, $sql))
							throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br> $sql");

						$success = true;

					}
					
					if (!$success) {

						throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");

					}

				}
				else {

					throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");
				}

			}
			else {

				throw new Exception ("A permission issue has been thrown, please check if root is " .
									"accessible. \n\n<br><br>\n DEBUG: " . mysqli_error($this->dbcon) . "<br>");
			}

			return $success;

		}

		public function adjust_status ($username, $status) {

			$id  = $this->get_id_of_user($username);
			$sql = "UPDATE User_Table SET ONLINE=? WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "ii", $status, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);

		}

		public function adjust_status_withID ($id, $status) {

			$sql = "UPDATE User_Table SET ONLINE=? WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "ii", $status, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

		public function setIdleFlag ($flag, $username) {

			$id = $this->get_id_of_user($username);
			$sql= "UPDATE User_Table SET IDLE = ? WHERE UID = ?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "ii", $flag, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

		public function update_activity ($username) {
			
			$_CURR_TIMESTAMP = date("Y-m-d H:i:s");
			$id = $this->get_id_of_user($username);
			$sql = "UPDATE User_Table SET LASTACTIVITY = STR_TO_DATE(? ,'%Y-%m-%d %H:%i:%s') WHERE UID=?;";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "si", $_CURR_TIMESTAMP, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

		public function update_activity_withID ($id) {

			$_CURR_TIMESTAMP = date("Y-m-d H:i:s");
			$sql = "UPDATE User_Table SET LASTACTIVITY = STR_TO_DATE(? ,'%Y-%m-%d %H:%i:%s') WHERE UID=?;";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "si", $_CURR_TIMESTAMP, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_close($stm);
		}

		public function add_friend_req ($requester, $id) {


			$sql = "INSERT INTO {$requester}_FRIENDS_REQ(UID, REQUESTOR) VALUES(?, 0);";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_close($stm);

			$new_unm = $this->get_un_of_id($id);
			$new_uid = $this->get_id_of_user($requester);
			$sql = "INSERT INTO {$new_unm}_FRIENDS_REQ(UID, REQUESTOR) VALUES(?, 1);";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $new_uid);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_close($stm);

		}

		public function del_friend_req ($requester, $id) {

			$sql = "DELETE FROM {$requester}_FRIENDS_REQ WHERE UID = ?;";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			$new_unm = $this->get_un_of_id($id);
			$new_uid = $this->get_id_of_user($requester);
			$sql = "DELETE FROM {$new_unm}_FRIENDS_REQ WHERE UID = ?;";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $new_uid);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_close($stm);

		}

		

		public function accept_friend_req($requester, $id) {

			$result = $this->validate_if_req_found($requester, $id);
			if ($result != -1) {

				$sql = "INSERT INTO {$requester}_FRIENDS(UID) VALUES(?);";
				$stm1 = mysqli_prepare($this->dbcon, $sql);
				mysqli_stmt_bind_param($stm1, "i", $id);

				if ($stm1 == FALSE)
					throw new Exception (mysqli_error($this->dbcon));

				if (!mysqli_stmt_execute($stm1)) {
					throw new Exception (mysqli_error($this->dbcon));
				}

				$friend_requester = $this->get_un_of_id($result);
				$friend_id		  = $this->get_id_of_user($requester);
				$sql  = "INSERT INTO {$friend_requester}_FRIENDS(UID) VALUES(?);";
				$stm2 = mysqli_prepare($this->dbcon, $sql);
				mysqli_stmt_bind_param($stm2, "i", $friend_id);

				if ($stm2 == FALSE)
					throw new Exception (mysqli_error($this->dbcon));

				if (!mysqli_stmt_execute($stm2)) {
					throw new Exception (mysqli_error($this->dbcon));
				}

				$this->del_friend_req($requester, $id);

				mysqli_stmt_close($stm1);
				mysqli_stmt_close($stm2);

			}

		}

	//<>>------
		
	//Fetchers -------------------------------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		

		public function get_id_of_user($username) {

			$sql = "SELECT Usern_Table.UID FROM Usern_Table WHERE Usern_Table.UNAME = '$username'";
			
			$rS = mysqli_query($this->dbcon, $sql);
			while ($row = mysqli_fetch_array($rS)) {

				return $row["UID"];
			}

			throw new Exception ("USERNAME SEARCH NULL EXCEPTION $username");

		}

		public function get_un_of_id($ID) {

			$sql = "SELECT Usern_Table.UNAME FROM Usern_Table 
              WHERE Usern_Table.UID = '$ID';";

			$rS = mysqli_query($this->dbcon, $sql);
			while ($row = mysqli_fetch_array($rS)) {

				$UID = $row["UNAME"];
				return $UID . "";

			}

			throw new Exception ("ID SEARCH NULL EXCEPTION");

		}

		

		public function obtain_status ($username) {

			$id  = $this->get_id_of_user($username);
			$status = 0;
			$sql = "SELECT ONLINE FROM User_Table WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $status);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);
			return $status;

		}

		public function obtain_status_withID ($id) {

			$status = 0;
			$sql = "SELECT ONLINE FROM User_Table WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $status);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);
			return $status;
		}

		public function register_group ($groupName, $id) {

			$un = get_un_of_id($id);
			$sql = "INSERT INTO Group_Table (Name, Owner) VALUES(?, ?);";
			$stmt = mysqli_prepare($this->dbcon, $sql);
			mysqli_bind_param($stmt, "si", $groupName, $id);

			if ($stmt == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stmt)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_close($stmt);
		}		

		public function join_group ($gid, $id) {

			$gName = get_groupName($gid);
			if ($gName != "") {
				$sql = "INSERT INTO Groupmem_Table(GID, MEMID) VALUES(?, ?)";
				$stmt = mysqli_prepare($this->dbcon, $sql);
				mysqli_bind_param($stmt, "ii", $gid, $id);

				if ($stmt == FALSE)
					throw new Exception (mysqli_error($this->dbcon));

				if (!mysqli_stmt_execute($stmt)) {
					throw new Exception (mysqli_error($this->dbcon));
				}
				mysqli_stmt_close($stmt);
			}
			else {
				throw new Exception("Cannot find group exception occured!");
			}
		}

		public function fetch_token ($username) {

			$id  = $this->get_id_of_user($username);
			$ip  = "";
			$sql = "SELECT TOKEN FROM User_Table WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $ip);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);
			return $ip;
		}

		public function fetch_token_withID ($id) {

			$ip  = "";
			$sql = "SELECT TOKEN FROM User_Table WHERE UID=?";
			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $ip);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);
			return $ip;
		}


		public function fetch_friends_list ($requester, $id) {

			$array = array();

			$name;
			$id;
			$online;
			$friend_request;
			$idle;

			$sql = "SELECT Usern_Table.UID, Usern_Table.UNAME, User_Table.ONLINE, User_Table.IDLE
					FROM Usern_Table 
						INNER JOIN {$requester}_FRIENDS ON {$requester}_FRIENDS.UID = Usern_Table.UID
						INNER JOIN User_Table ON User_Table.UID = Usern_Table.UID 
					WHERE Usern_Table.UID != ? AND Usern_Table.UID > 1 ;";


			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_bind_result($stm, $id, $name, $online, $idle);
			$VALIDATOR= new AccountManager;

			while (mysqli_stmt_fetch($stm)) {

				if (strlen($name) == 0)
					continue;

				//$list .= sprintf ("%d,%s,%s\n", $id, $name, $online);

				array_push($array, json_encode(array("ID" => $id, "Name" => $name, "isOnline" => $online, "Idle" => $idle)));

				try {

					$INACTIVE = $VALIDATOR->validate_if_inactive_withID($id);

					if ($INACTIVE) {

						$VALIDATOR->adjust_status_withID($id, 0);
						$VALIDATOR->erase_token_withID($id);
					}

				}
				catch (Exception $ex) {				
					
					echo "$ex";
				}
			}

			mysqli_stmt_close($stm);
			return $array;

		}

		public function fetch_request_list ($requester) {
			
			$array = array();
			$name = "";

			$sql = "SELECT Usern_Table.UID, Usern_Table.UNAME
					FROM Usern_Table
					INNER JOIN {$requester}_FRIENDS_REQ ON {$requester}_FRIENDS_REQ.UID = Usern_Table.UID
					WHERE {$requester}_FRIENDS_REQ.REQUESTOR = 1";

			$stm = mysqli_prepare($this->dbcon, $sql);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_bind_result($stm, $id, $name);

			while (mysqli_stmt_fetch($stm)) {

				if (strlen($name) == 0)
					continue;

				array_push($array, json_encode(array("ID" => $id, "Name" => $name)));
			}

			mysqli_stmt_close($stm);
			return $array;
		}

		/*************************************************************************************
		 * $fetchType refers to fetch class in user.php, value 0 refers to the User value.
		 * While the $searchString refers to the critieria or keyword that the fetch will
		 * be looking for. By default it has no criteria or keyword to look for.
		 *
		 *	TO DO:
		 *	Finish Fetch Type All and search base on searchString functions.
		 *************************************************************************************
		 */

		public function fetch_user_list ($requester, $id, $fetchType = fetch::User, $searchString = "") {

			$name;
			$array = array();

			if ($fetchType == fetch::User) {

				if ($id == 1) {
					$sql = "SELECT Usern_Table.UID, Usern_Table.UNAME 
							FROM Usern_Table 
							WHERE 
							(Usern_Table.UID) NOT IN (SELECT {$requester}_FRIENDS.UID FROM {$requester}_FRIENDS) AND
							(Usern_Table.UID) NOT IN (SELECT {$requester}_FRIENDS_REQ.UID FROM {$requester}_FRIENDS_REQ)
							AND Usern_Table.UID > 0 AND Usern_Table.UID != ?";
				}
				else {

					$sql = "SELECT Usern_Table.UID, Usern_Table.UNAME 
							FROM Usern_Table 
							WHERE
							(Usern_Table.UID) NOT IN (SELECT {$requester}_FRIENDS.UID FROM {$requester}_FRIENDS) AND
							(Usern_Table.UID) NOT IN (SELECT {$requester}_FRIENDS_REQ.UID FROM {$requester}_FRIENDS_REQ)
							AND Usern_Table.UID > 1 AND Usern_Table.UID != ?";
				}
			}
			else if ($fetchType == fetch::All) {

				if ($id == 1) {

					$sql = "SELECT Usern_Table.UID, Usern_Table.UNAME
							FROM Usern_Table
							WHERE Usern_Table.UID > 0 AND Usern_Table.UID != ?";
				}
				else {

					$sql = "SELECT Usern_Table.UID, Usern_Table.UNAME
							FROM Usern_Table
							WHERE Usern_Table.UID > 1 AND Usern_Table.UID != ?";
				}

			}

			if ($searchString != "") {

				$sql .= " AND INSTR('Usern_Table.UNAME','{$searchString}')";
			}

			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm, "i", $id);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_bind_result($stm, $id, $name);

			while (mysqli_stmt_fetch($stm)) {

				if (strlen($name) == 0)
					continue;

				array_push($array, json_encode(array("ID" => $id, "Name" => $name)));

			}

			mysqli_stmt_close($stm);
			return $array;

		}

		public function fetch_userlist_from_group($id) {

			$array = array();
			$uid = 0;
			$unm = "";
			$onl = 0;
			$idle= "";

			$sql = "SELECT ID, Name, ONLINE, IDLE FROM (
						SELECT Owner AS 'ID', UNAME AS 'Name', ONLINE, IDLE FROM Group_Table 
							INNER JOIN Usern_Table ON Usern_Table.UID = Group_Table.Owner 
                            INNER JOIN User_Table ON User_Table.UID = Group_Table.Owner
                        WHERE GID = ?
					) Groups
						UNION
					SELECT ID, Name, ONLINE, IDLE FROM (
						SELECT MEMID AS 'ID', UNAME AS 'Name', ONLINE, IDLE FROM Groupmem_Table 
							INNER JOIN Usern_Table ON Usern_Table.UID = Groupmem_Table.MEMID 
                            INNER JOIN User_Table ON User_Table.UID = Groupmem_Table.MEMID
                        WHERE GID = ?
					) Members;

			";

			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm,"ii", $id, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $uid, $unm, $onl, $idle);

			while (mysqli_stmt_fetch($stm)) {

				array_push($array, json_encode(array("ID" => $uid, "Name" => $unm, "isOnline" => $onl, "Idle" => $idle)));
			}

			mysqli_stmt_close($stm);
			return $array;
		}

		public function fetch_groups_involved($id) {

			$array = array();
			$groupID = 0;
			$groupName = "";

			$sql = "SELECT GID, Name FROM (
						SELECT GID, Name FROM Group_Table WHERE Owner = ?
					) Groups
						UNION
					SELECT GID, Name FROM (
						SELECT Groupmem_Table.GID, Name FROM Groupmem_Table INNER JOIN Group_Table ON
						Group_Table.GID = Groupmem_Table.GID WHERE MEMID = ?
					) Members;
			";

			$stm = mysqli_prepare($this->dbcon, $sql);
			mysqli_stmt_bind_param($stm,"ii", $id, $id);
			mysqli_stmt_execute($stm);
			mysqli_stmt_bind_result($stm, $groupID, $groupName);

			while (mysqli_stmt_fetch($stm)) {

				array_push($array, json_encode(array("ID" => intval($groupID) * -1, "Name" => $groupName)));
			}

			mysqli_stmt_close($stm);
			return $array;
		}

		public function friend_request_count ($requester) {

			$count;
			$sql = "SELECT COUNT(UID) AS REF_COUNT 
					FROM {$requester}_FRIENDS_REQ 
					WHERE {$requester}_FRIENDS_REQ.REQUESTOR = 1;";

			$stm = mysqli_prepare($this->dbcon, $sql);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_bind_result($stm, $count);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);
			return $count;

		}

		public function get_previlage ($requester) {

			$id = $this->get_id_of_user ($requester);
			$sql = "SELECT UPRL FROM User_Table WHERE UID = $id";
		}

		public function get_groupName($id) {
			$id = abs($id);
			$name = "";
			$sql = "SELECT Name FROM Group_Table WHERE GID = $id";
			$stm = mysqli_prepare($this->dbcon, $sql);

			if ($stm == FALSE)
				throw new Exception (mysqli_error($this->dbcon));

			if (!mysqli_stmt_execute($stm)) {
				throw new Exception (mysqli_error($this->dbcon));
			}

			mysqli_stmt_bind_result($stm, $name);
			mysqli_stmt_fetch($stm);
			mysqli_stmt_close($stm);
			return $name;
		}


	//<>>------
		
	//Constructors and Destructors -----------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		public function __construct () {

			try {
        		
        		$ip = "";

        		global $USER_DATABASE;
        		global $TRANSACTION_DATABASE;
        		global $ROOT_UNAME;
        		global $ROOT_PASS;
        		global $localOnly;

        		if ($localOnly)
        			$ip = "localhost";
        		else
        			$ip = $_SERVER['REMOTE_ADDR'];

       	 		$this->USER_DATABASE =& $USER_DATABASE;
        		$this->TRANSACTION_DATABASE =& $TRANSACTION_DATABASE;
    
        		// The function below shows the AccountManager logging as root   //
				$this->dbcon = mysqli_connect($ip, $ROOT_UNAME, $ROOT_PASS);     //
       	 		// Modify the line above if the username and password of your    //
        		// root is different.
        
				$this->check_database();
				mysqli_select_db($this->dbcon, $this->USER_DATABASE );
				if ($this->check_default_tables()) {
					$this->add_default_users();
				}
			}
			catch (Exception $ex) {
   
				mysqli_close($this->dbcon);
				throw new Exception ("Cannot connect to root user exception.\n\n<br><br>\nDetail: $ex");
			}

		}

		public function __destruct () { 

			mysqli_close($this->dbcon);

		}

	}
    
}
?>