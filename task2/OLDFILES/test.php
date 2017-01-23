<?php
	$con = mysqli_connect("127.0.0.1", "root", "asdasdwcr");
	
	if (mysqli_connect_errno($con))
	{
		echo "Failed to connect to MySQL: " . mysqli_connect_error($con) . "<br>";
	}
	
	// Create database
	$sql = "CREATE DATABASE IF NOT EXISTS my_dbmd";
	
	if (mysqli_query($con,$sql))
	{
		echo "Database my_dbmd created successfully";
	}
	else
	{
		echo "Error creating database: " . mysqli_error($con);
	}
	
	mysqli_close($con);
?>
