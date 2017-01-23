<?php

if (!defined('class_php_included')) {

	/*
		Client class implementation in the
		server side, this one will enact the
		server side activities of the Client class
		in base.js.

	*/

	define ('class_php_included', '');
		
	if (!defined('user_php_included')) {
	
		include('user.php');		
	}

	include('client_definition.php');
}

?>
