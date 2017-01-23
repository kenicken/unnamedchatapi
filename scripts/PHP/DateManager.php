<?php

if (!defined('datamanager_php_included')) {

	define('datemanager_php_included', true);

	class FormatType {

		const Numeric = 0;
		const Textual = 1;
	}

	class TimeFormat {

		const Military = 0;
		const OClock   = 1;
	}

	class DateManager {

		private $dateHold = "";

		public function __construct ($dateHold) {

			$this->setDate($dateHold);
		}

		public function setDate ($dateHold) {

			$this->dateHold = strtotime($dateHold);
		}

		public function getDayofWeek($formatType) {

			switch ($formatType) {

				case FormatType::Numeric:
					return (date("N", $this->dateHold));
				case FormatType::Textual:
					return (date("l", $this->dateHold));
				default:
					throw new Exception("Format Type not supported exception occured");
			}
			
		}

		public function getMonth ($formatType) {

			switch ($formatType) {

				case FormatType::Numeric:
					return (date("m", $this->dateHold));
				case FormatType::Textual:
					return (date("F", $this->dateHold));
				default:
					throw new Exception("Format Type not supported exception occured");
			}
		}

		public function getDayofMonth () {

			return (date("d", $this->dateHold));
		}

		public function getYear () {

			return (date("Y", $this->dateHold));
		}

		public function getTime ($timeFormat) {

			switch ($timeFormat) {

				case TimeFormat::Military: 
					return (date("H:i", $this->dateHold));
				case TimeFormat::OClock:
					return (date("g:i A", $this->dateHold));
				default:
					throw new Exception("Format Type not supported exception occured");
			}
		}
	}
}	

?>