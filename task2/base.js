/*
* *************************************************************
*  *														* *
	* Base javascript object Client that implements			* *
	* the client side of the messenger, the other part   	* *
	* is implemented in php.								* *
	*														* *
	* [Messenger Javascript - PHP combo]					* *
	* Note: Include msghandle.js first before using this    * *
	* implementation layer. msghandle.js contains the core  * *
	* components of this layer								* *
*  *														* *
* *************************************************************
*/

var Client = {

	isBusy: false,
	lastFetchRequest: 0,
	fetchDateInitialize: false,

	hideSubmitButton: function (animate) {

		try {
			if (animate == null || animate == "yes") {
				if (Client.option.element != null) {

					Client.option.element.disabled = true;
					if (Client.option.element.checked) {

						Client.inputfield("maximize", "98", "90", "%");			
					}
					else {

						Client.inputfield("minimize", "90", "98", "%");
					}
				}
			}
			else if (animate != "yes") {

				if (Client.option.element.checked) {

					element.access("inputfield").style.width = "98%";
					element.access("submitbutton").style.display = "none";		
				}
				else {

					element.access("inputfield").style.width = "90%";
					element.access("submitbutton").style.display = "block";
				}
			}
		}
		catch (exception) {

			
		}

	},

	inputfield: function (action, unit, curr_unit, measurement) {

		try {

			var elem = element.access("inputfield");
			
			if (action == "minimize") {

				unit = parseInt(unit);
				curr_unit = parseInt(curr_unit) - 1;
				elem.style.width = curr_unit + measurement;
				if (unit != curr_unit) {

					setTimeout(function() {Client.inputfield(action, unit, curr_unit, measurement);}, 50);
				}
				else {

					setTimeout(function() {Client.option.element.disabled = false;}, 50);
					element.access("submitbutton").style.display = "block";
					fade("submitbutton", 0, 100, 100);
				}
			}
			else if (action == "maximize") {

				unit = parseInt(unit);
				curr_unit = parseInt(curr_unit) + 1;
				elem.style.width = curr_unit + measurement;
				fade_terminate("submitbutton", 100, 0, 100);
				if (unit != curr_unit) {

					setTimeout(function() {Client.inputfield(action, unit, curr_unit, measurement);}, 50);
				}
				else {

					setTimeout(function() {Client.option.element.disabled = false;}, 50);
				}
			}

		}
		catch (exception) {

			alert("ERROR" + exception);
		}
	},

	userlist: {

		/* userholder holds the list of users
		 * that is connected to the current
		 * user's network.
		 */

		userholder: new Array(),

		reset: function() {

			this.userholder = new Array();
		},

		/* add adds a new user to the userholder
		 * list.
		 */


		add: function (UID, UNAME, STATUS) {

			if (isNaN(UID) || isBlank(UID) || isEmpty(UID)){
				throw "Attempting to register an NaN ID.";
			}

			var NewUser = new User(UID, UNAME, STATUS);
			var found = false;
			for (var i = 0; i < this.userholder.length; i++) {

				if (this.userholder[i].UID == UID 
					|| this.userholder[i].UNAME == UNAME)
				{
					found = true;
				}

			}
			
			if (!found && Client.requester.ID != UID) {

				this.userholder.push(NewUser);

			}
				

		},

		/*
		 * Finds if the listed ID is on the user list
		 * and then returns the index the index of the user.
		 * It returns -1 if it didn't find any.
		 */

		find: function (UID) {

			for (var i = 0; i < this.userholder.length; i++) {

				if (this.userholder[i].UID == UID) {

					return i;

				}

			}

			return -1;

		},

		sort: function () {

			try {

				var online_user = new Array();
				var offline_user = new Array();

				for (var i = 0; i < Client.userlist.userholder.length; i++) {

					if (Client.userlist.userholder[i].STATUS == 1){
						online_user.push(Client.userlist.userholder[i]);
					}
					else {
						offline_user.push(Client.userlist.userholder[i]);
					}

				}

				online_user.sort(function(a, b){a.UNAME - b.UNAME});
				offline_user.sort(function(a, b){a.UNAME - b.UNAME});
				Client.userlist.userholder = new Array();

				for (var i = 0; i < online_user.length; i++)
					Client.userlist.userholder.push(online_user[i]);

				for (var i = 0; i < offline_user.length; i++)
					Client.userlist.userholder.push(offline_user[i]);

			}
			catch (exception) {

				alert(exception);
			}

		},

		/*
		 * Updates the userfield list on the browser's client.
		 * with the new set of logs fetched within the server.
		 */

		update: function () {

			try {

				var obj = element.access("userfield");
				var mid_str = "";
				var log_status = "";

				if (Client.userlist.userholder.length <= 0) {

					obj.innerHTML = "<table class=\"friend_req\"> \
					                	<tr><td>   \
					                		<a unselectable=\"on\" id=\"friendrequest\" href=\"friendrequester.html\">"
					                		+" Friend Request: " + Client.notifier.friend_request + 
					                		"</a>  \
					                	</td></tr> \
					                	<tr><td unselectable=\"on\" class=\"friendrequest\"> \
					                		Don't have friends? <br>\
					                		<a href=\"friendadd.html\">Click here</a><br>\
					                		to add one!\
					                	</td></tr>\
					                	<tr class=\"friend_req\"><td colspan=\"2\"><a href=\"friendadd.html\">\
											Create a Group</a></td></tr>\
					                </table>";

				} 
				else {

					mid_str += "<tr class=\"friend_req\"><td colspan=\"2\">\
									<a id=\"friendrequest\" href=\"friendrequester.html\"> \
									Friend Request: " + Client.notifier.friend_request + " \
									</a></td> \
								</tr>";

					mid_str += "<tr class=\"friend_req\"><td colspan=\"2\"><a href=\"friendadd.html\">" 
								+ "Add a Friend</a></td></tr>";

					mid_str += "<tr class=\"friend_req\"><td colspan=\"2\"><a href=\"friendadd.html\">" 
								+ "Create a Group</a></td></tr>";

					for (var i = 0; i < Client.userlist.userholder.length; i++) {

						

						if (Client.userlist.userholder[i].STATUS == 1) {
							log_status = "Online";
						}
						else if (Client.userlist.userholder[i].STATUS == 0) {
							log_status = "Offline";
						}

						if (Client.userlist.userholder[i].UID < 0) {
							log_status = "Group";
						} 

						var log_status_color = log_status;

						if (Client.userlist.userholder[i].UID == Client.target.ID)
							log_status_color = "Selected";

						mid_str += " <tr class=\"" + log_status_color + "\" onclick=\"\
										Client.target.set_ID \
											('" + Client.userlist.userholder[i].UID +"')\"> \
										<td unselectable=\"on\" class=\"user_field\"> " 
											+ Client.userlist.userholder[i].UNAME +
					     				"</td> \
					    				 <td unselectable=\"on\" class=\"status_field\"> " + log_status +  
					    				 " </td> </tr>";

					}
					

					obj.innerHTML = "<table class=\"friend_class\" >" + mid_str + "</table>";

				}

			}

			catch (exception) {

				alert("ERROR " + exception);

			}

		}

	},

	notifier: {

		/*
		 * Variable Holder for counting new messages
		 * [Not yet Implemented]
		 */
		new_messages : 0,

		/*
		 * Variable holder for new messages
		 * [Not yet implemented]
		 */

		user_new_message_holder: new Array(),

		/*
		 * Variable holder for friend requests
		 */

		friend_request: 0,

		/*
		 * Function for fetching the amount of
		 * friend requests on that current user.
		 */

		friend_request_fetch : function () {

			var xml = get_xml_http();
			xml.onreadystatechange = function () {

				if (xml.readyState == 4 && xml.status == 200) {

					Client.notifier.friend_request = parseInt(xml.responseText);

				}

			}

			xml.open("POST", "../scripts/PHP/friend_request_fetch.php", true);
			xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
			xml.send();
			

		}


	},

	option: {

		element  :    null, // Element name holder

		/* Chooses an element from what is registered
		 * in the elements list holder. If the
		 * name of the element is not found in 
		 * the list, then the operation is canceled.
		*/

		choose_element: function(e_name) {

			try {

				this.element = element.access(e_name);

			}
			catch (exception) {


			}
			
		}

	},

	requester: {

		// ID of Requester

		ID : -1,

		// Username of Requester

		UNAME : "",

		// Set the ID request of the token.

		set_ID : function (id_val) {

			if (!isNaN(id_val)) {
				this.ID = parseInt(id_val);
			}


		}

	},

	// Target {Using the PM <Personal Message> Function}

	target: {

		ID : null,

		set_ID : function (id_val) {

			Client.lastFetchRequest = 0;
			Client.fetchDateInitialize = false;

			Client.message.force_update();
			if (!isNaN(id_val)) {

				Client.message.reset();
				this.ID = parseInt(id_val);
			}

			Client.response_action.onload_activity_reset();
			setTimeout(Client.response_action.onload_activity(), 60);
			
		}

	},

	message: {

		timeout_req: 1,				// Timeout request as the client requests the server for
									// new messages. Slowly increments till it reaches 8

		msg_holder: new Array(),    // holder of the message
		hasReceiveNewMessage: false,// boolean holder indicating the new 
		lastMsgHolderRendered: 0,   // indicates the last message index

		// add() -> Adds a new messages
		// to the messenger screen
		// update works in the same
		// way.

		reset: function () {

			Client.message.msg_holder = new Array();
			Client.message.hasReceiveNewMessage = false;
			element.access("chatfield").innerHTML = "";
			Client.lastFetchRequest = 0;
			Client.message.lastMsgHolderRendered = 0;
		},

		add: function(UID, MSG, TIME, TEMP, MSGID, USERNAME) {

			if (typeof(TEMP) === "undefined") {
				TEMP = false;
			}

			var valid = true;

			if (typeof(MSGID) === "undefined") {
				valid = false;
			}



			for (var i = 0; i < Client.message.msg_holder.length && valid; i++) {

				if (Client.message.msg_holder[i].MSGID == MSGID) {
					valid = false;
				}
			}

			if (UID == Client.requester.ID && valid) {

				var tmp = new Message(Client.requester.ID, Client.requester.UNAME, MSG, TIME, TEMP, MSGID);
				this.msg_holder.push(tmp);

			}
			else if (valid) {

				var index = -1;

				for (var i = 0; i < Client.userlist.userholder.length;
						i++) {

					if (Client.userlist.userholder[i].UID == UID)
						index = i;	

				}



				if (index != -1 || Client.target.ID < 0) {

					var ref = Client.userlist.userholder[index];
					var tmp = null;
					if (Client.target.ID < 0) {
						tmp = new Message(UID, USERNAME, MSG, TIME, TEMP, MSGID);
					}
					else {
						tmp = new Message(ref.UID, ref.UNAME, MSG, TIME, TEMP, MSGID);
					}
					
					this.msg_holder.push(tmp);

				}
			}
			
		},

		/*
			Renders the current messages that were not received by the client earlier.
			This means this is the function responsible for loading the messages to the
			browser window.
		*/
		
		update: function () {

			var newMessageFlag = false;
			try {

				var middle_str = "";
				var lastIndex = Client.message.lastMsgHolderRendered;

				for (var i = lastIndex; i < Client.message.msg_holder.length; i++) {

					if (Client.message.msg_holder[i].RENDERED == false) {

						Client.message.msg_holder[i].RENDERED = true;
						var ref = Client.message.msg_holder[i];
						
						// I tried looking for a library or a code strip of a function that extracts urls and links from
						// a string but since regex is fucking shit and slow, i just wrote my own one.

						var processedText = Evaluator.evaluate(ref.MSG);
						var isYourMessage = false;
						var chatPosition = "my_message";
						var chatBoxColor = "my_message_box";

						if (ref.UNAME == Client.requester.UNAME) {
							isYourMessage = true;
						}

						if (!isYourMessage) {
							chatPosition = "their_message";
							chatBoxColor = "their_message_box";
						}

						middle_str += 
						"<div class='chat_log " + chatPosition + "'>" + 
							"<div class='time_style' unselectable='on'>" + ref.TIME + "</div>" +  
							"<div class='uname_style'>" + ref.UNAME + "</div> <br>" +
							"<div class='msg_style " + chatBoxColor + "'>" + processedText + "</div>" +
						"</div> <br>";
						Client.message.lastMsgHolderRendered = i;
						newMessageFlag = true;
					}
				}

				if (Client.message.lastMsgHolderRendered != lastIndex) {
					Client.message.hasReceiveNewMessage = true;
				}
				else {
					Client.message.hasReceiveNewMessage = false;
				}

				if (!isEmpty(middle_str)) {

					element.access("chatfield").innerHTML += middle_str;
					element.access("chatfield").scrollTop = element.access("chatfield").scrollHeight;
				}
			}
			catch (exception) {
				
			}

			return newMessageFlag;
		},

		/*
			 Message submit function to request.php
		*/

		submit: function() {
			
			var msgval = element.access("inputfield").value;
			element.access("inputfield").value = "";

			if (Client.requester.ID != -1 && Client.target.ID != null) {

				try {

					var valid = true;
					element.access("inputfield").disabled = true;

					if (element.access("inputfield").disabled != false && isEmpty(msgval)) {
						valid = false;
					}

					if (valid) {
						
						//Client.message.add(Client.requester.ID, htmlspecialchars(msgval, 'ENT_QUOTES'), Date_str(), true, -1);
						Client.message.add(Client.requester.ID, msgval, Date_str(), true, -1);
						Client.message.update();
					}

					var xml = get_xml_http();
					xml.onreadystatechange = function() {

						if (xml.readyState == 4 && xml.status == 200) {

							element.access("inputfield").value = "";
							Client.response_action.reset_timer = true;
							element.access("inputfield").disabled = false;
							Client.response_action.reset_timer = true;
							element.access("inputfield").select();
							element.access("inputfield").focus();
						}
								
					}

					xml.open("POST", "../scripts/PHP/msgsender.php", true);
					xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");

					if (valid) {
						xml.send("r_ID=" + Client.requester.ID + "&t_ID=" + Client.target.ID + "&_msg=" + msgval);
					}
				}
				catch (exception) {

				}	
				
			}
			else {

				alert("You have not selected anybody to chat.");
				setTimeout(function() {element.access("inputfield").value = "";}, 50);

			}
			
			return false;
		},

		// Ready makes the client not fetch update from the server
		// allowing users to be able to freely 

		ready: function () {
			Client.response_action.time_last_key_press = new Date();
		},

		force_update: function () {

			Client.response_action.time_last_key_press = new Date(0);
		},

		// Onhit event that would virtualized the
		// set of preshortcut keys within the
		// messenger.

		onhit: function(e) {

			if (!element.access("inputfield").disabled) {
				e = e || event;

				Client.response_action.time_last_key_press = new Date();

				if (Client.option.element != null) {

					var v = Client.option.element.checked;

					if (e.keyCode === 13 && !e.ctrlKey && v) {
						try {

							/* If it passes the following test
								1) Not just a new line.
								2) Not blank
								3) Not Empty
								
								Then it will do an automatic form submit
							*/

							if (evaluate_if_onechar(element.access("inputfield").value) &&
								!isBlank(element.access("inputfield").value)            &&
								!isEmpty(element.access("inputfield").value)) {
								Client.message.submit();

							}
							else {

								setTimeout(function() {element.access("inputfield").value = "";}, 50);

							}

						}
						catch (exception) {


						}

					}

				}
			}
			else {

				alert("Unidentified Error");
			}
		}

	},

	response_action: {

		// Function that will be used from time to time;
		// These functions are what makes this messenger
		// real time.

		limit: 1,
		update: true,
		update_cnt: 0,
		last_msg_stamp: 0,
		last_diff_val: 0,
		timeout_hold: null,
		reset_timer: false,

		// Variables for determining if the user is trying to
		// do something and this will determine what the client
		// will do at that time.

		time_last_key_press: new Date(),

		// Variables that determine if the client has already
		// fetched the data first before ignoring other conditions

		has_fetch_data: false,

		// This is what makes the client alive despite the user
		// not having any action. This is also responsible for
		// updating the new messages.

		onload_activity: function () {

			Client.fetch.messenger_data();

			if (Client.response_action.has_fetch_data) {
				
				if (Client.requester.ID != -1 && Client.target.ID != null) {

					try {

						element.access("inputfield").disabled = false;
						element.access("submitbutton").disabled = false;
					}
					catch (exception) {

					}

					var diff = 0;
					if (Client.response_action.last_msg_stamp != 0) {
						Date_r = new Date_php(Client.response_action.last_msg_stamp);
						diff = COMPARE(Date_r.DATE);
					}

					if (diff >= 5 || Client.response_action.update_cnt >= 5) {

						if (diff != Client.response_action.last_diff_val || Client.response_action.update_cnt >= 5) {

							Client.response_action.update_cnt = 0;
							Client.response_action.limit *= 2;
							Client.response_action.last_diff_val = diff;
							if (Client.response_action.limit >= 8)
								Client.response_action.limit = 8;
						}

					}

					else if (Client.response_action.reset_timer) {

						Client.response_action.limit = 1;
						Client.response_action.reset_timer = false;
					}
				}
				else {

					try {

						element.access("inputfield").disabled = true;
						element.access("submitbutton").disabled = true;

						if (Client.response_action.update_cnt >= 5) {

							Client.response_action.update_cnt = 0;
							Client.response_action.limit *= 2;
							if (Client.response_action.limit >= 8)
								Client.response_action.limit = 8;
						}	

					}
					catch (exception) {

					}

				}

				Client.response_action.update_cnt++;	
				Client.response_action.timeout_hold = setTimeout('Client.response_action.onload_activity()', 
					Client.response_action.limit * 1000);
			}
			else {

				Client.response_action.timeout_hold = setTimeout('Client.response_action.onload_activity()', 1000);
			}
		},

		/*
		 * Resets the current onload activity
		 * effectively forcing all poll timers
		 * and timeouts to refresh.
		*/

		onload_activity_reset: function () {

			clearTimeout(Client.response_action.timeout_hold);
			Client.response_action.update_cnt = 1;
			Client.response_action.limit = 1;

		}

	},

	fetch: {

		/* Fetches and updates the messenger data
		 *
		 */

		messenger_data : function () {

			if (!Client.isBusy) {

				Client.isBusy = true;
				try {

					var xml = get_xml_http();
					xml.onreadystatechange = function() {

						if (xml.readyState == 4 && xml.status == 200) {

							Client.response_action.has_fetch_data = true;
							Client.isBusy = false;
							
							var dataJS = JSON.parse(xml.responseText);
							
							/*
							* 
							*
							*******************************************************************
							try {
								
								redirect(dataJS.chatData.sessionStatus.ID, 
									"",
									"../scripts/PHP/erase_session.php?type=messenger");
							}
							catch (exception) {
								alert(exception);
								redirect(0, "", "../scripts/PHP/logout.php?type=messenger");
							}	
							********************************************************************
							*/
							
							Client.notifier.friend_request = dataJS.chatData.friendRequest.Count;
							Client.process.friend_list(dataJS.chatData.friendList);
							Client.process.chat_log(dataJS.chatData.chatList);
							
							if (Client.fetchDateInitialize) {

								if (Client.message.msg_holder.length != 0)
									Client.lastFetchRequest = Client.message.msg_holder[Client.message.msg_holder.length - 1].MSGID;
							}
							else {

								if (Client.target.ID != 0) {
									Client.fetchDateInitialize = true;

									if (Client.message.msg_holder.length != 0)
										Client.lastFetchRequest = Client.message.msg_holder[Client.message.msg_holder.length - 1].MSGID;
								}
							}

						}
					}

					var post_data = "";
					post_data += "status=1&";
					post_data += "LIMIT=-1&r_ID=" + Client.requester.ID + "&t_ID=" + Client.target.ID;
					post_data += "&fetchStamp=" + Client.lastFetchRequest;
					post_data += "&isClientIdle=" + (!EventHandler.isWindowActive);
					xml.open("POST", "../scripts/PHP/messengercarrier.php", true);
					xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					xml.send(post_data);

				}
				catch (exception) {

				}
			}
		},

		/* Fetches the user's ID and Username stored in it's session.
		 * 
		 */

		session_fetch_done: false,

		session: function () {
			
			var xml = get_xml_http();

			xml.onreadystatechange = function() {

				if (xml.readyState == 4 && xml.status == 200) {

						var response   = xml.responseText;
						var string_val = response.split("<block>");
						if (response != "NULL") {

							Client.requester.set_ID (string_val[0]);
							Client.requester.UNAME = string_val[1];
							Client.fetch.session_fetch_done = true;
						}

				}

			}

			xml.open("POST", "../scripts/PHP/sessionkeeper.php", true);
			xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
			xml.send();
		}

	},

	process: {

		friend_list: function(jsonObject) {

			Client.userlist.reset();

			for (var i = 0; i < jsonObject.list.length; i++) {

				
				try {

					Client.userlist.add(jsonObject.list[i].ID, 
										jsonObject.list[i].Name,
										jsonObject.list[i].isOnline);
				}
				catch (exception) {

				}

			}

			Client.userlist.sort();
			Client.userlist.update();
		
		},

		chat_log: function (jsonObject) {

			if (jsonObject.fetchStatus != 0) {

				for (var i = 0; i < jsonObject.list.length; i++) {
					
					if (!isEmpty(jsonObject.list[i].Time) && !isBlank(jsonObject.list[i].Time))
						Client.response_action.last_msg_stamp = jsonObject.list[i].Time;

					Client.message.add(jsonObject.list[i].ID, jsonObject.list[i].Message, jsonObject.list[i].Time, false, jsonObject.list[i].MSGID, jsonObject.list[i].Username);
				}

				for (var i = 0; i < Client.message.msg_holder.length; i++) {
					if (Client.message.msg_holder[i].TEMP == true) {
						for (var j = i + 1; j < Client.message.msg_holder.length; j++) {

							if (
								Client.message.msg_holder[j].MSG  == Client.message.msg_holder[i].MSG  &&
								Client.message.msg_holder[j].UNAME== Client.message.msg_holder[i].UNAME
							) {
								Client.message.msg_holder[i].MSGID = Client.message.msg_holder[j].MSGID;
								Client.message.msg_holder[i].TEMP = false;
								Client.message.msg_holder[i].RENDERED = true;
								Client.message.msg_holder.splice(j, 1);
								break;
							}
						}
					}
				}

				if (Client.message.update()) {
					element.access("chatfield").scrollTop = element.access("chatfield").scrollHeight;
				}
				//
			}
			else {
				element.access("chatfield").innerHTML = "";
			}
		
		}

	}

}
