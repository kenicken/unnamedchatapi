<?php
	function compare ($str1, $str2)
	{
		$strl1 =  strtolower($str1);
		$strl2 =  strtolower($str2);
		if (strcmp($strl1, $strl2) == 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
?>
