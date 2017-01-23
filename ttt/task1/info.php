<?
	include("compare.php");		
	include("search.php");	
	include("upload.php");
	$HOST_OS_VAL = PHP_OS;
	
	/*
	 *  For Multiple OS Compatibility
	 *  If you're experiencing errors when running Linux, make sure you have
	 *  executed install.sh properly. If all else fails please contact the 
	 *  developers of the system.
	 * 
	 * */
	 
	if (compare(substr($HOST_OS_VAL, 0, 3), "LIN"))
	{
		uploadfile($_POST["uname"], "/var/www/upload/");
	}
	else
	{
		uploadfile($_POST["uname"], "upload/");
	}
		
	
?> 
