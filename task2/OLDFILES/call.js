/*****************************************************************/
//		call.js -> AJAX file for private chat messages			 //
/*****************************************************************/

/***************************************/
var session_id = 0;
var last_session_id = 0;

var _uname_id = 0;
var _targ_id = 0;

var uname_str = 0;
var targt_str = 0;

var tmp_uname_id = 0;
var tmp_targ_id = 0;

var _reqid = 0;
var _tarid = 0;
var _textid = 0;

/****************************************/

function getXMLHttp ()
{
	var x;
	
	/*
	 * For Firefox, Opera 8.0+, Chrome, Safari
	 **/
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
		 * 
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

function getElm (id_of_object)
{
	return document.getElementById(id_of_object);
}

function isEmpty(str) 
{
    return (!str || 0 === str.length);
}

function isBlank(str) 
{
    return (!str || /^\s*$/.test(str));
}

function UpdateList (uname_field, targ_field)
{
	var tmp1 = getElm(targ_field).value;
	var tmp2 = getElm(uname_field).value;

	if (!isEmpty(tmp1) && !isEmpty(tmp2))
	{
		_targ_id = tmp1;
		_uname_id = tmp2;
	}
	else
	{
		getElm(targ_field).value = 0;
		getElm(uname_field).value = 0;
	}
		
	setTimeout("updateList(" + uname_field + ", " + targ_field + ")", 1000);
}

function evaluate ()
{
	return ( _targ_id == _uname_id );
}

// notifyidchange() & notifytargchange() -> Debug tools for the
// implemented PM system. DO NOT REMOVE	

function notifyidchange (id_of_textarea, uname_field, uname_id)
{
	tmp_targ_id = _targ_id;
	_targ_id = getElm(uname_id).value;
	if (!evaluate())
	{
		var obj = getElm(id_of_textarea);
		var xml = getXMLHttp();

		xml.onreadystatechange = function()
		{
			if (xml.readyState == 4 && xml.status == 200)
			{
				var obj = getElm(uname_field);
				var str = xml.responseText + "";
				if (isEmpty(str))
				{
					alert("No User with that ID is found.");
					_targ_id = tmp_targ_id;
					getElm(uname_id).value = _targ_id;
				}
				else
				{
					//getElm(id_of_textarea).value += "You are now chatting as " + str + ".\n";
					obj.value = str;
					uname_str = str;
					updateField(_reqid, _tarid, _textid);
				}	
			}
		}
		
		var ID = getElm(uname_id).value;		
		xml.open("POST", "getuname.php?", false);
		xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xml.send("id=" + ID);
	}
	else
	{
		var obj = getElm(id_of_textarea);
		obj.value += "You're not allowed to chat yourself\n";
		_targ_id = tmp_targ_id;
		getElm(uname_id).value = _targ_id;
	}
}

function notifytargchange (id_of_textarea, target_id)
{
	tmp_uname_id = _uname_id;
	_uname_id = getElm(target_id).value;
	if (!evaluate())
	{
		var obj = getElm(id_of_textarea);
		var chat_targ = "";
		var targ_id = getElm(target_id).value;
		var xml = getXMLHttp();

		xml.onreadystatechange = function()
		{
			if (xml.readyState == 4 && xml.status == 200)
			{
				chat_targ = xml.responseText + "";
				if (isEmpty(chat_targ))
				{
					alert("No User with that ID is found.");
					_uname_id = tmp_uname_id;
					getElm(target_id).value = _uname_id;
				}
				else
				{
					//obj.value = "You have are chatting with " + chat_targ + ".\n";
					targt_str = chat_targ;
					updateField(_reqid, _tarid, _textid);
				}
			}
		}

		xml.open("POST", "getuname.php", false);
		xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
		xml.send("id=" + targ_id);
	}
	else
	{
		var obj = getElm(id_of_textarea);
		obj.value += "You're not allowed to chat yourself\n";
		_uname_id = tmp_uname_id;
		getElm(target_id).value = _uname_id;
	}
}	

// appendText() -> Appends text to messageboard, listing username
// and the user's message.

function appendText (id_of_textarea, uname, msg)
{
	var obj = getElm(id_of_textarea);

	if (_uname_id == 0 || _targ_id == 0)
	{
		obj.value += "An unset ID has been detected, 0 is not a valid ID\n";
		return;
	}
	
	if (evaluate())
	{
	
		obj.value += "You're not allowed to chat yourself\n";
		return;	
	}
	
	obj.value += uname + " : " + msg + "\n";
}

// PMfunc() -> Creates a table between requester id and target
// (or uses the current one) as a means of

function PMfunc (uname_id, target_id, msg_id)
{
	appendText("msglistfield", getElm("unamefield").value, getElm(msg_id).value);
	var xml = getXMLHttp();

	xml.onreadystatechange = function()
	{
		if (xml.readyState == 4 && xml.status == 200)
		{
			var str_tok = xml.responseText + "";
			if (isEmpty(str_tok) == false)
				alert(str_tok);
		}
	}
	var str = "msger.php";
	xml.open("POST", str, false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
	xml.send("req_id=" + getElm(uname_id).value + "&tar_id=" + getElm(target_id).value + "&msg=" + getElm(msg_id).value);


	getElm(msg_id).value = "";
	return false;
}

/*
	Switch target and user IDs
	(This is only done client sidedly)
	(Since this chat program relies on 2 IDs)
*/
function SWfunc (id_1, id_2, un_id)
{
	var tmp = getElm(id_1).value;
	getElm(id_1).value = getElm(id_2).value;
	getElm(id_2).value = tmp;
	_targ_id  = getElm(id_1).value;
	_uname_id = getElm(id_2).value;

	tmp = uname_str;
	uname_str = targt_str;
	targt_str = tmp;

	getElm(un_id).value= uname_str;
}


function moveCaretToEnd(el) 
{
    if (typeof el.selectionStart == "number") 
    {
        el.selectionStart = el.selectionEnd = el.value.length;
    }
    else if (typeof el.createTextRange != "undefined") 
    {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

/* Onload Event (This one will fetch) */
/* the logs upon load thus giving the */
/* user a quick summary of the chat   */
/* They have off					  */

function updateField (id_1, id_2, id_tf)
{
	var xml = getXMLHttp();
	var str = 0;
	xml.onreadystatechange = function()
	{
		if (xml.readyState == 4 && xml.status == 200)
		{
			str = xml.responseText + "";
			var textarea = getElm(id_tf);
			textarea.value = str;
		}
	}
	xml.open("POST", "getchatlog.php", false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xml.send("RQ_ID=" + getElm(id_1).value + "&TG_ID=" + getElm(id_2).value);
}

/* Long Polling event handles		  */
/* For updating content dynamically   */


var cnt = 0;

function dailypoll ()
{
	updateField(_reqid, _tarid, _textid);
	cnt += 1;
	getElm("cnt").innerHTML = cnt;
	setTimeout("dailypoll()", 1000);
}

function start (req_id, tar_id, tex_id)
{
	UpdateList(req_id, tar_id);
	_reqid = req_id;
	_tarid = tar_id;
	_textid = tex_id;
	dailypoll();
}