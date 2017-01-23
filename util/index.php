<html>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
<script type="text/javascript" src="utility.js"></script>
<script>
	
	var repeat = 0;

	function continuous () {

		redirect_if_session_notfound("accmanager.html");
		repeat++;
		if (repeat < 10)
			setTimeout('continuous()', 10000);
	}

	continuous();

</script>

<body>

	

	<center>
	<a href="../">Back to Localhost</a> <br>
	<p>Login Account Manager</p>
	<form action="verify.php" method="post" enctype="multipart/form-data">
		<input type="text" name="uname" id="uname_id" placeholder="Username"></input>		<br>
		<input type="password" name="upass" id="upass_id" placeholder="Password"></input>  <br><br>
		<input type="submit" name="submit" id="submit_id" value="Login"></input>
	</form>

	<a href="accverifier.html">Do not have an account? <br> Click here to add one</a>
	<br><br><br><p>Change Log</p>
	<iframe src="changelog.html">
	</iframe>

	</center>

</body>
</html>