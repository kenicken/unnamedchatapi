<?php
	function uploadfile ($uname_rq, $file_dir = "upload/", $file_filter = "file_list.txt")
	{
		// Error Trapping
		if (strlen($uname_rq) <= 0) 		//If no username is entered
		{									//An exception is thrown
			throw new Exception("uploadfile() function requested without a username.");
		}
		
		//	If there is no filter list, it will generate a new one
		if (!file_exists($file_filter))
		{
			$new_file = fopen($file_filter, "x+");
			fprintf($new_file, "********************************************************\n");
			fprintf($new_file, "*  This file represents the list of file  extensions   *\n");
			fprintf($new_file, "*  the file uploader will recognize and be allowed to  *\n");
			fprintf($new_file, "*  be used.                                            *\n");
			fprintf($new_file, "*                                                      *\n");
			fprintf($new_file, "*  Example                                             *\n");
			fprintf($new_file, "*                                                      *\n");
			fprintf($new_file, "*    BEGIN                                             *\n");
			fprintf($new_file, "*		.txt                                           *\n");
			fprintf($new_file, "*       .doc                                           *\n");
			fprintf($new_file, "*       .docx                                          *\n");
			fprintf($new_file, "*       .xls 										   *\n");
			fprintf($new_file, "*       .pdf    						               *\n");
			fprintf($new_file, "*	 END                                               *\n");
			fprintf($new_file, "*                                                      *\n");
			fprintf($new_file, "********************************************************\n");
			fprintf($new_file, "********************************************************\n\n");
			fprintf($new_file, "BEGIN\n");
			fprintf($new_file, "	.txt\n");
			fprintf($new_file, "	.doc\n");
			fprintf($new_file, "	.docx\n");
			fprintf($new_file, "	.xls\n");
			fprintf($new_file, "	.pdf\n");
			fprintf($new_file, "END\n");
			fclose($new_file);
		}
		
		$file_ext = array();
		$file_reader = fopen($file_filter, "r");
		$last_str = "";	
		$ignore   =  true;

		// File reading mechanism
			$Start = false; 	// Start represents if
								// the file should end
								// or begin the listing
								// of file extensions. 
			
		// Begin change
		while (!feof($file_reader))
		{
			$curr = fgets($file_reader);
			$curr = substr($curr, 0, strlen($curr) - 1);
		
			if (strcmp($last_str, "*") != 0  && compare($curr, "BEGIN"))
			{
				$ignore = false;
				continue;
			}

			if (!$ignore)
			{
				if (compare($curr, "END"))
				{
					$ignore = true;
					continue;
				}
				else
				{
					$file_ext[] = $curr;
				}
			}
			
			$last_str = $curr;
		}	
		fclose($file_reader);	
		$list_size = sizeof($file_ext);
		
		// Display File Information.

		$ext_f = "." . end(explode(".", $_FILES["file"]["name"])); //Extension of the file

		if (search($ext_f, $file_ext))	//If the file uploaded belongs to the list
		{
			echo "" . $_POST["uname"] . "<br>";					
			echo "File Extension Name: " . $ext_f . "<br>";
			echo "File Upload Information: <br>";
			if ($_FILES["file"]["error"] > 0)
			{
				 echo "Error: " . $_FILES["file"]["error"] . "<br>";
			}
			else
			{
				echo "Upload: " . $_FILES["file"]["name"] . "<br>";
				echo "Type: " . $_FILES["file"]["type"] . "<br>";
				echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
				echo "Temp Name: " . $_FILES["file"]["tmp_name"];
			}
			
			echo "<p style='size: 12pt; color: red;'>Upload Information</p><br>";
			
			
			$rootdir = $file_dir;
			
			if (!is_dir($rootdir))
			{
				if (!mkdir($rootdir))
				{
					$Last_Error = error_get_last();
					echo "Error in creating root upload directory.  Reason: " . $Last_Error["message"] . "<br>";
				}
			}
			
			$dir = $rootdir . $uname_rq . "/";
			if (!is_dir($dir))
			{
				if (!mkdir($dir))
				{
					$Last_Error = error_get_last();
					echo "Error in creating directory.  Reason: " . $Last_Error["message"] . "<br>";
				}
			}
			echo "Directory: " . $dir . "<br>";	

			if (file_exists($dir . $_FILES["file"]["name"]))
			{
				echo "File Exists <br>";
			}
			else
			{		

				if (move_uploaded_file($_FILES["file"]["tmp_name"], $dir . $_FILES["file"]["name"]))
				{
					echo "Stored at: " . $dir . $_FILES["file"]["name"];	
				}
				else
				{
					echo "Error uploading file";
				}
			}

		}
		else
		{
			echo "<p style='color:red'> Invalid File Format  </p>";
		}
	}
?>
