<?php
	session_start();
	$_SESSION["type"] = $_GET["type"];
	//echo $_SESSION["type"];
?>

<html>
<body>
	
	<form action="../scripts/PHP/accverify.php" method="post" enctype="multipart/form-data" >

		<label for="uname"> Access modifier: </label>
		<input type="text" name="uname" id="unamefield" placeholder="Username you wish to elevate access" size = "27" ></input><br>
		<label for="pass"> Pass of user: </label>
		
		&nbsp &nbsp &nbsp 
		
		<input type="password" name="pass" id="passfield" placeholder="Password of the user" size = "27" ></input><br><br>
		
		&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 
		&nbsp &nbsp &nbsp &nbsp &nbsp

		<input type="submit" name="submit" value="Submit" style="width: 100px;"  ></input>

	</form>

</body>
</html>
