<?php

/*
  ==============================================================================================

  Warning: This php file should not be included on it's own, it must be "REFFERED" by client.php
  or else any enum constants and global variables that it relies on will be missing and the 
  script itself will not work.

  ----------------------------------------------------------------------------------------------
  ==============================================================================================
 
  
  Class Function and Descriptions

  --------------------------------------------[Client]------------------------------------------
  Description:
	
	Client is a class that acts as a bridge between the base.js and user.php.

  Functions:
  	[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
  	[]										P U B L I C              	                      []
    [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
	
	[public] accept_user_request (<id>)		= Accepts a friend request base on the target id.

    [public] add_user_requester(<id>)		= Adds a friend request to the targeted user.

    [public] count_user_requester ()		= Counts the amount of friend requests the user has.

    [public] create_table ()				= Creates a table with a name base on which the 
    										  parameters given by the greater() and lesser() 
    										  function.

    [public] create_log (<message>)			= Inserts a message base on the table that was created
    										 by create_table().

    [public] del_user_request (<id>)		= Deletes a friend request base on the target id.
	
	[public] fetch_log (<usersplit>, <nextlinesplit>, <limit>, <start_at>)
											= Fetches logs from tables that where created by the
											create_table() function.

	[public] fetch_friends ()				= Fetches the list of friends the user has
	[public] fetch_requester ()				= Fetches the list of users that has requested to be
											added as a friend.
	
	[public] fetch_users ()					= Fetches the list of users that the user has not added
											yet.				


  	[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]
  	[]										P R I V A T E              	                      []
    [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]

    [private] check_table (<tablename>)		= Checks the table if it exists
    [private] greater ()					= Returns the ID which ID has a greater value between 
    										  the target and the requester.
    [private] lesser ()						= Returns the ID which ID has a lesser value between 
    										  the target and the requester.

 */

if (!defined('client_definition_included')) {

	define('client_definition_included', '');


	class Client {

		private $r_ID = -1;
		private $t_ID = -1;
		private $tb_n = "";
		private $dbcon;
		private $uname;
		private $psswd;
		private $groupMode = false;

		private $USER_DATABASE = "";
  		private $TRANSACTION_DATABASE = "";

	//Modifiers and Creators  ----------------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		private function check_table ($tablename) {

			$qry = "SHOW TABLES LIKE '" . $tablename . "'";
			$table = mysqli_query($this->dbcon, $qry);
			$res = mysqli_num_rows($table);
			return $res > 0 ? true: false;
		
		}

		private function greater () {

			if ($this->r_ID > $this->t_ID)
				return $this->r_ID;
			return $this->t_ID;

		}

		private function lesser  () {

			if ($this->r_ID < $this->t_ID)
				return $this->r_ID;
			return $this->t_ID;

		}

		public function create_table () {

			if ($this->r_ID != $this->t_ID) {
				if ($this->t_ID >= 0) {
					$this->tb_n = $this->lesser() . "to" . $this->greater();
					$this->groupMode = false;
				}
				else {
					$accountManager = new AccountManager;
					$this->tb_n 	= $accountManager->get_groupName($this->t_ID);
					$this->groupMode= true;
				}
			}
			else
				throw new Exception ("ERROR [RECURSIVE REQUEST] : You're not allowed to talk to yourself!");

		}


		public function create_log ($MESSAGE) {

			if (!$this->check_table($this->tb_n)) {

				/*
					If the table does not exist, Then it will ask root to give the current user  the appropriate
					permission to create the specified table. 
				*/
					
				$GRANTACCESS = new AccountManager;
				$GRANTACCESS->grant_access_create($this->TRANSACTION_DATABASE, $this->tb_n, $this->uname, $this->psswd, true);

				/*
					After that, proceeds in creating the table.
				*/

				$sql = "CREATE TABLE {$this->tb_n} (MSGID INTEGER NOT NULL AUTO_INCREMENT, POSTDATE TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UID INTEGER, 
					UMSG LONGTEXT, PRIMARY KEY(MSGID), FOREIGN KEY (UID) REFERENCES {$this->USER_DATABASE}.User_Table(UID));";
				
				if (!mysqli_query($this->dbcon, $sql)) {

					throw new Exception ("ERROR [CREATING TABLE REQUEST]: " . mysqli_error($this->dbcon) ." with query: " . $sql);
				}

				$sql = "INSERT INTO $this->tb_n(UID, UMSG) VALUES(?, ?);";
				$stm = mysqli_prepare($this->dbcon, $sql);
				mysqli_stmt_bind_param($stm, "ss", $this->r_ID, $MESSAGE);
				mysqli_stmt_execute($stm);
				mysqli_stmt_close($stm);
				$GRANTACCESS->update_activity($this->uname);

			}
			else {
				
				$ACCUPDATE = new AccountManager;
				$sql = "INSERT INTO $this->tb_n(UID, UMSG) VALUES(?, ?);";
				$stm = mysqli_prepare($this->dbcon, $sql);
				mysqli_stmt_bind_param($stm, "ss", $this->r_ID, $MESSAGE);
				mysqli_stmt_execute($stm);
				mysqli_stmt_close($stm);
				$ACCUPDATE->update_activity($this->uname);

			}
		}

		public function fetch_log ($LIMIT = -1, $STARTAT = 0, $MSGID = "") {

			if ($this->check_table($this->tb_n)) {

				$chatArray = array();

				$mid_r;
				$uid_r;
				$msg_r;
				$time_r;
				$uname_r;

				$tmp_SRA = 0;
				$count = 0;
				$sql = "";
				
				if ($MSGID == "") {

					if ($this->groupMode) {
						$sql = "SELECT MSGID, UNAME, POSTDATE, {$this->tb_n}.UID, UMSG FROM {$this->tb_n}
									INNER JOIN {$this->USER_DATABASE}.Usern_Table ON {$this->USER_DATABASE}.Usern_Table.UID = {$this->tb_n}.UID 
								ORDER BY MSGID ASC
						";
					}
					else {
						$sql = "SELECT * FROM $this->tb_n ORDER BY MSGID ASC";
					}
					
				}
				else {
					
					if ($this->groupMode) {
						$sql = "SELECT MSGID, UNAME, POSTDATE, {$this->tb_n}.UID, UMSG FROM {$this->tb_n}
									INNER JOIN {$this->USER_DATABASE}.Usern_Table ON {$this->USER_DATABASE}.Usern_Table.UID = {$this->tb_n}.UID 
								WHERE MSGID >= {$MSGID} ORDER BY MSGID ASC
						";
					}
					else {
						$sql = "SELECT * FROM $this->tb_n WHERE MSGID >= {$MSGID} ORDER BY MSGID ASC";
					}
				}	
				
				$stm = mysqli_prepare($this->dbcon, $sql);

				mysqli_stmt_execute($stm);

				if ($this->groupMode) {
					mysqli_stmt_bind_result($stm, $mid_r, $uname_r, $time_r, $uid_r, $msg_r);
				}
				else {
					mysqli_stmt_bind_result($stm, $mid_r, $time_r, $uid_r, $msg_r);
				}
				
				include_once('DateManager.php');
				$DateManager = new DateManager("");

				while (mysqli_stmt_fetch($stm)) {

					$DateManager->setDate($time_r);
					$time_r = $DateManager->getMonth(FormatType::Textual) . " " . $DateManager->getDayofMonth() . ", "
							  . $DateManager->getYear() . " " . $DateManager->getTime(TimeFormat::OClock);
							  
					$msg_r = htmlspecialchars_decode($msg_r, ENT_QUOTES);

					if ($tmp_SRA == $STARTAT) {

						if ($LIMIT > 0) {

							if ($this->groupMode) {
								array_push($chatArray, json_encode(array("MSGID" => $mid_r, "Time" => $time_r, "ID" => $uid_r, 
								"Username" => $uname_r, "Message" => $msg_r)));
							}
							else {
								array_push($chatArray, json_encode(array("MSGID" => $mid_r, "Time" => $time_r, "ID" => $uid_r, 
								"Message" => $msg_r)));
							}
							

							if ($count >= $LIMIT)
								break;
							$count++;
							
						}
						else {

							if ($this->groupMode) {
								array_push($chatArray, json_encode(array("MSGID" => $mid_r, "Time" => $time_r, "ID" => $uid_r, 
								"Username" => $uname_r, "Message" => $msg_r)));
							}
							else {
								array_push($chatArray, json_encode(array("MSGID" => $mid_r, "Time" => $time_r, "ID" => $uid_r, 
								"Message" => $msg_r)));
							}
						}

					}
					else {

						$tmp_SRA++;

					}
				}

				mysqli_stmt_close($stm);
				return $chatArray;

			}
			else {

				throw new Exception ("ERROR [FETCHING AN NON-EXISTENT TABLE] $this->tb_n ");

			}

		}

		public function add_user_request ($id) {

			$USER = new AccountManager;
			$USER->add_friend_req($this->uname, $id);

		}

		public function count_friend_request () {
			$USER = new AccountManager;
			return $USER->friend_request_count($this->uname);
		}

		public function accept_user_request ($id) {

			$USER = new AccountManager;
			$USER->accept_friend_req($this->uname, $id);
		}

		public function del_user_request ($id) {

			$USER = new AccountManager;
			$USER->del_friend_req($this->uname, $id);
		}

		public function create_group($groupName) {
			
			$USER = new AccountManager;
			$id = $USER->get_id_of_user($this->uname);
			$USER->register_group($groupName, $id);
		}

	//<>>------

	//Fetchers -------------------------------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		public function fetch_friends () {

			$tbname = "Usern_Table";
			if (!$this->check_table($tbname)) {

				$FRNGET = new AccountManager;
				return $FRNGET->fetch_friends_list($this->uname, $this->r_ID);

			}
			else {

				throw new Exception ("ERROR [FETCHING AN NON-EXISTENT TABLE]");
			}
		}

		public function fetch_requester () {

			$FRNGET = new AccountManager;
			return $FRNGET->fetch_request_list($this->uname);

		}

		public function fetch_users () {

			$FRNGET = new AccountManager;
			return $FRNGET->fetch_user_list($this->uname, $this->r_ID);
		}

		public function fetch_users_of_group () {

			$FRNGET = new AccountManager;
			if ($this->t_ID < 0)
				return $FRNGET->fetch_userlist_from_group(abs($this->t_ID));
			else
				return $FRNGET->fetch_userlist_from_group(0);
		}

		public function fetch_groups() {
			
			$FRNGET = new AccountManager;
			return $FRNGET->fetch_groups_involved($this->r_ID);
		}

	//<>>------

	//Constructors and Destructors -----------------------------------------------------------------------------------//
	//----------------------------------------------------------------------------------------------------------------//
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		public function __construct($uname, $upass, $r_ID = 0, $t_ID = 1) {

			if (is_numeric($r_ID) && is_numeric($t_ID)) {

				global $portable;
				global $localOnly;

				$ip = "";
				$this->r_ID = intval($r_ID);
				$this->t_ID = intval($t_ID);
				$this->create_table();

				$IDGETTER 	= new AccountManager;
				$this->USER_DATABASE = $IDGETTER->USER_DATABASE;
				$this->TRANSACTION_DATABASE = $IDGETTER->TRANSACTION_DATABASE;

				// Mysqli connect
				if ($localOnly)
        			$ip = "localhost";
        		else
        			$ip = $_SERVER['REMOTE_ADDR'];

				if (!$portable) {

					$this->dbcon = mysqli_connect($ip, $uname, $upass);
				}
				else {

					global $ROOT_UNAME;
        			global $ROOT_PASS;
        			$this->dbcon = mysqli_connect($ip, $ROOT_UNAME, $ROOT_PASS);
				}
				
				mysqli_select_db($this->dbcon, $this->TRANSACTION_DATABASE );
				$this->uname = $uname;
				$this->psswd = $upass;

				$this->r_ID = $IDGETTER->get_id_of_user($this->uname);

				if (mysqli_connect_errno($this->dbcon)) {

					mysqli_close($this->dbcon);
					throw new Exception ("Failed to connect to MySQL: " . mysqli_connect_error());

				}

			}
			else {
				
				mysqli_close($this->dbcon);
				throw new Exception ("ERROR [INVALID VALUE INSERTION]");
			}

		}

		public function __destruct() {

			mysqli_close($this->dbcon);

		}

	}
}

?>
