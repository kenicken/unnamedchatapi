/*
	Some of the basic functions, objects and variables that 
	will be used by base.js will be defined here.

	Quick rule of thumb, always remember that each elements
	to be used in the program should be registered first and
	can be deleted by doing the same thing.
*/

////////////////////////////////////////////////////////////

/*
  * User Object -> This object is what
  * represents the User defined within
  * our database.
*/

function User (UID, UNAME, STATUS) {

	this.UID = UID;
	this.UNAME = UNAME;
	this.STATUS = parseInt(STATUS);

}

/*
  * Element Object -> This object is
  * what represents the elements in
  * the current webpage that can be
  * utilized by other programs.
*/

function Element (e_name, e_type) {

	this.ID   = e_name;	
	this.Type = e_type;

}

/*
  * MessageEntry Object -> It represents
  * the messagelogs within the client.
*/

function Message (UID, UNAME, MSG, TIME)
{
	this.UID = UID;
	this.UNAME = UNAME;
	this.MSG = MSG;
	this.TIME = TIME;
}

/*
  * Converts current PHP string to JS
  * implementation of Date. Handy for
  * long polling events implemented on
  * base.js
*/

function Date_php (STR) {

	if (STR != 0) {

		php_tmp = STR.split(" ");
		date = php_tmp[0];
		time = php_tmp[1];
		date = date.split("-");
		time = time.split(":");

		this.DATE = new Date();
		
		var YEAR  = parseInt(date[0]);
		var MONTH = parseInt(date[1]);
		var DAY   = parseInt(date[2]);

		var HOUR  = parseInt(time[0]);
		var MINUTE= parseInt(time[1]);
		var SECOND= parseInt(time[2]);

		this.DATE.setFullYear(YEAR);
		this.DATE.setMonth(MONTH);
		this.DATE.setDate(DAY);
		this.DATE.setHours(HOUR);
		this.DATE.setMinutes(MINUTE);
		this.DATE.setSeconds(SECOND);
	}
}

function Date_str () {

	var currDate = new Date();
	var month 	 = parseInt(currDate.getMonth()) + 1;

	if (parseInt(month) < 10) {
		month = "0" + month;
	}

	var curr_str = "" + currDate.getFullYear() + "-" + month + "-" + currDate.getDate();
	curr_str    += " " + currDate.getHours() + ":" + currDate.getMinutes() + ":" + currDate.getSeconds();

	return curr_str;	
}

/*
 * Compares current local date
 * and Date converted in Date_php
*/


function COMPARE  (DATE_PHP) {

	var today = new Date();
	var DIFF = today - DATE_PHP;
	var resu = new Date(DIFF);
	return resu.getMinutes();

}

function COMPARE_PRESENT_DATE (enteredDate) {
	return Math.round(Math.abs(new Date() - enteredDate) / 1000)
}


///////////////////////////////////////////////////////////



//Global Variables

var SPLIT_TOK1 = "[xcv9xcv980498zxcv98sd0f934kljsdas[dpo]]";
var SPLIT_TOK2 = "[xlzkvjzlxkcjvx[]sdfasfaifui34398190sdf]";
var SPLIT_TOK_CARRIER =  "[][][][]asdkokcsod)asodkxzcoko(";

//Global Functions

// Get Element Shortcut

function get_e (id_of_object) {

	return document.getElementById(id_of_object);

}

//Old Library Functions

function setOpacity(eID, opacityLevel) {
	var eStyle = get_e(eID).style;
	eStyle.opacity = opacityLevel / 100;
	eStyle.filter = 'alpha(opacity='+opacityLevel+')';
}

function fade(eID, startOpacity, stopOpacity, duration) {
	var speed = Math.round(duration / 100);
	var timer = 0;
	if (startOpacity < stopOpacity){
		for (var i=startOpacity; i<=stopOpacity; i++) {
			setTimeout("setOpacity('"+eID+"',"+i+")", timer * speed);
			timer++;
		} return;
	}
	for (var i=startOpacity; i>=stopOpacity; i--) {
		setTimeout("setOpacity('"+eID+"',"+i+")", timer * speed);
		timer++;
	}
}

function terminate(eID)
{
	var eStyle = get_e(eID).style;
	eStyle.display = "none";
}

function fade_terminate(eID, startOpacity, stopOpacity, duration) {
	var eStyle = get_e(eID).style;
	var speed = Math.round(duration / 100);
	var timer = 0;
	if (startOpacity < stopOpacity){
		for (var i=startOpacity; i<=stopOpacity; i++) {
			setTimeout("setOpacity('"+eID+"',"+i+")", timer * speed);
			timer++;
		} return;
	}
	for (var i=startOpacity; i>=stopOpacity; i--) {
		setTimeout("setOpacity('"+eID+"',"+i+")", timer * speed);
		timer++;
	}

	setTimeout("terminate('"+eID+"')", timer * speed);
}



// Checks if the string is empty

function isEmpty(str) {
	
    return (0 == str.length);

}

// Check if the string is blank

function isBlank(str) {

    return (!str || /^\s*$/.test(str));

}

// Evaluates if the user is just pressing enter
// all over again, this will prevent the server
// from sending at fast rates.

function evaluate_if_onechar (txt_str) {

	if (txt_str == '\n')
		return false;
	return true;

}

/*
 * Checks if the variable is a valid number
 */

function isNumber(n) {

	return !isNaN(parseFloat(n)) && isFinite(n);
}

/*	Converts all the string that are numeric in an array
 *	to it's integer equivalents 
 *	NOTE: This only works in one dimensional array.
 */


function Convert_ArrayInt (array) {

	if (array instanceof Array) {

		for (var i = 0; i < array.length; i++) {

			if (isNumber(array[i])) {

				array[i] = parseInt(array[i]);
			}
		}

	}
	else {
		throw "Variable is not an array exception occured.";
	}

}


/*
 * PHP ONLY [REQUIRES LOGIN.PHP ON THE SAME DIRECTORY]
 * Checks if the current user session is enabled
 * if not, the user will be redirect to url1 
 * (Leave it blank if you don't want to redirect)
 *
 * else the user will be redirected to url2
 * (Again, leave it blank if you don't want to redirect)
*/

function redirect_if_session_notfound (url1, url2) {
	var xml = get_xml_http();
	xml.onreadystatechange = function () {

		if (xml.readyState == 4 && xml.status == 200) {

			var status = xml.responseText;

			if (isNumber(status)) { 
				var id  = parseInt(status);

				if (id == 1 && (!isBlank(url1) && !isEmpty(url1))) {
					window.location = url1;
				}
				else if (id == 0 && (!isBlank(url2) && !isEmpty(url2))) {
					window.location = url2;
				}
			}
			else
			{
				throw "Server thrown an invalid status exception occured";
			}
		}

	}

	xml.open("POST", "login.php", true);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
	xml.send("status=1");
}

function redirect (status, url1, url2) {

	if (isNumber(status)) {

		status = parseInt(status);

		if (status == 1 && (!isBlank(url1) && !isEmpty(url1))) {

			window.location = url1;
		}
		else if (status == 0 && (!isBlank(url2) && !isEmpty(url2))) {
			
			window.location = url2;
		}
	}
	else {

		throw "Variable :status: is not a valid status exception occured " + status;
	}
}

// GetXMLHttp() -> 
// 
//

function get_xml_http ()
{
	var x;
	
	/******************************************
	 * For Firefox, Opera 8.0+, Chrome, Safari*
	 ******************************************/
	try
	{
		x = new XMLHttpRequest();
	}
	catch (exception)
	{
		/*
		 * ActiveX check using Microsoft xml2 and xmlhttp engine
		 * If it isn't compatible with both, then the RIA will
		 * terminate automatically. 
		 */

		try
		{
			x = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (exception2)
		{
			try
			{
				x = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (exception3)
			{
				alert("Your browser is incompatible with this program. Please try revisiting the " +
				"this website using the latest versions of these browsers.\n\n1.) Microsoft Internet Explorer"+
				"\n2.) Google Chrome\n3.) Mozilla Firefox\n4.) Opera");
				document.write("<html><title>Error</title><body><h1>Your browser is not compatible with this program</h1></body></html>");
			}
		}
	}
	
	return x;
}

//Global Objects

// Element objects holds the list of elements
// registered in the program

var element = {

	list: new Array(),

	add: function(e_name, e_type){

		var NewElement = new Element(e_name, e_type);
		this.list.push(NewElement);

	},

	find: function (e_name) {
		
		var index = -1;
		for (var i = 0; i < this.list.length; i++) {

			if (this.list[i].ID == e_name) {
				index = i;
				break;
			}

		}

		return index;

	},

	access: function (e_name) {


		var index = element.find(e_name);
		if (index != -1) {
			
			var obj = get_e(e_name);

			if (obj == null)
				throw "Element undefined exception occured";

			return obj;

		}

		throw "Not Found exception occured";

	}

}

