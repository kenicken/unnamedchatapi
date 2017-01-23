<?php
	function search ($file, $file_array)
	{
		for ($i = 0; $i < sizeof($file_array); $i++)
		{
			if (compare($file, substr($file_array[$i], 1)))
			{
				return true;
			}
		}

		return false;
	}
?>
