/*
* *************************************************************
*  *														* *
	* Toolbar.js implements the javascript part of the      * *
	* messenger.                                            * *
	*                                                       * *
*  *														* *
* *************************************************************
*/


/*
 * Represents the toolbar holder as a whole
 */

var Toolbar = {

	colors: {

		purple: "rgba(181, 99, 175, 1)",
		red   : "rgba(253,  33,  86,  1)",
		orange: "rgba(215,  123,  44,  1)",
		yellow: "rgba(249,  251,  11,  1)",
		green:  "rgba(88,  253,  11,  1)",
		blue:   "rgba(37,  119,  245, 1)",
		brown: 	"rgba(72,  33,  16, 1)",
		violet: "rgba(72,  33,  136, 1)",
		black: 	"rgba(3,  6,  10,  1)",
		white: 	"rgba(222,  230,  230, 1)",
		pink: 	"rgba(216,  185,  226,  1)",
		cyan: 	"rgba(146,  230,  230, 1)",
		navy: 	"rgba(43,  64,  56,  1)",
		peach: 	"rgba(216,  185,  179,  1)",

		//Extra Colors

		yellowGreen: "rgba(173,  220,  56,  1)",
		skyBlue: 	 "rgba(29,  210,  251,  1)",

		array: [],
		userArray: [],
		initiated: false,
	},
	
	elements: new Array(),
	serverFunctionLoader: new Array(),
	session: {

		id: "",
		name: ""
	},

	// Determines the constant properties of the toolbar
	constant: {

		spacePerElement: 10, 	//The distance size that is set for each element
		height: 50,          	//The height of the toolbar
		update_limit_delay: 8,
		update_size_delay: 5
	},

	// Temporary global variables being used and shared by the toolbar's 
	// submodules. This is put here for documentation purposes.
	temporary: {

		totalSpaceConsumed: 0, 	//The
		update_count: 0,
		isBusy: false,
		has_fetched_data: false,
		last_msg_time_stamp: 0,
		last_diff_val: 0,
		update_limit: 1,
		resetTimer: false,
		ToolbarServerTimeOut: "",
		jsonDataSession: ""
	},

	action: {

		addElement: function (element) {

			element.style.display = "block";
			Toolbar.elements.push(element);
		}
	},

	initialize: {

		load: function() {

			document.body.innerHTML += "<div class='toolbar' id='toolbar'>" + 
				"</div>";

			element.add('toolbar', 'div');
			Toolbar.drawEvent.redraw();
			Toolbar.event.scrollEvent();
			var t = EventHandler.resizeEvent;
			t.attachFunction("Toolbar_reposition",Toolbar.drawEvent.reposition);
		},

		
	},

	drawEvent: {

		redraw: function() {

			element.access('toolbar').style.background = 
				"linear-gradient(to bottom," + 
				"rgba(238,238,238,1) 0%," + 
				"rgba(238,238,238,1) 100%)";

			element.access('toolbar').style.backgroundColor = "white";
			element.access('toolbar').style.border = "1px solid black";
			element.access('toolbar').style.borderTopLeftRadius="5px";
			element.access('toolbar').style.borderTopRightRadius="5px";
			element.access('toolbar').style.paddingTop = "3px";
			element.access('toolbar').style.width = "99.9%";
			element.access('toolbar').style.height = "100px";
			element.access('toolbar').style.height= Toolbar.constant.height + 
				"px";
			element.access('toolbar').style.marginLeft = "0px";
			element.access('toolbar').style.marginRight= "0px";
			element.access('toolbar').style.display = "none";
			element.access('toolbar').style.textAlign = "right";
		},

		reposition: function() {

			var height = document.documentElement.scrollTop ? 
			document.documentElement.scrollTop : document.body.scrollTop;

			var resY   = window.innerHeight - Toolbar.constant.height;
			element.access('toolbar').innerHTML = "[Top: " + height + "  Y: " + 
			(resY) + "  mix: " + (resY + height) + "]  ";

			element.access('toolbar').style.position = "fixed";
			element.access('toolbar').style.top = (resY)  + "px";


			Toolbar.temporary.totalSpaceConsumed = window.innerWidth - (ToolbarExtension.messengerChat.properties.userlist.width + 20);
			for (var i = 0; i < Toolbar.elements.length; i++) {

				var _tmpHeight = Toolbar.elements[i].offsetHeight;

				if (_tmpHeight < 30) {

					_tmpHeight += Toolbar.constant.height - 5;
				}
				var _resY = window.innerHeight - _tmpHeight - 8;
				//_resY = 0;
				Toolbar.elements[i].style.position = "fixed";

				if (Toolbar.temporary.totalSpaceConsumed == 0)
					Toolbar.temporary.totalSpaceConsumed = 3;

				Toolbar.elements[i].style.left = 
					Toolbar.temporary.totalSpaceConsumed + "px";
				Toolbar.elements[i].style.top = _resY + "px";

				console.log(Toolbar.elements[i].id + "  " + _resY + " " + window.innerHeight + " " + _tmpHeight);
				Toolbar.elements[i].style.zIndex = (i + 2) + "";

				Toolbar.temporary.totalSpaceConsumed += 
					Toolbar.elements[i].offsetWidth 
				+ Toolbar.constant.spacePerElement;

				element.access('toolbar').innerHTML += " Element #" + (i + 1) 
				  + " (" + (Toolbar.elements[i].offsetWidth)
				  + ", " + Toolbar.elements[i].offsetHeight + ", " 
				  + _tmpHeight + 
				  ")"
				;
			}
		}
	},

	event: {
		
		scrollEvent: function () {

			Toolbar.drawEvent.reposition();
		},

		serverLoad: function() {

			Toolbar.event.fetchData();
			if (Toolbar.temporary.has_fetched_data) {

				
				var diff = 0;
				if (Toolbar.temporary.last_msg_time_stamp != 0) {
					Date_r = new Date_php(Toolbar.temporary.last_msg_time_stamp);
					diff = COMPARE(Date_r.DATE);
				}

				if (diff >= 5 || Toolbar.temporary.update_count >= 5) {

					if (diff != Toolbar.temporary.last_diff_val || 
						Toolbar.temporary.update_count >= 
							Toolbar.constant.update_size_delay) {

						Toolbar.temporary.update_count = 0;
						Toolbar.temporary.update_limit *= 2;
						Toolbar.temporary.last_diff_val = diff;
						if (Toolbar.temporary.update_limit > 
								Toolbar.constant.update_limit_delay) {

							Toolbar.temporary.update_limit = 
								Toolbar.constant.update_limit_delay;
						}

					}
				}
				else if (Toolbar.temporary.resetTimer) {

					Toolbar.temporary.resetTimer = false;
					Toolbar.temporary.update_limit = 1;
				}

				Toolbar.temporary.ToolbarServerTimeOut = 
					setTimeout('Toolbar.event.serverLoad()', 
				Toolbar.temporary.update_limit * 1000);
			}
			else {

				Toolbar.temporary.ToolbarServerTimeOut = 
					setTimeout('Toolbar.event.serverLoad()', 1000);
			}
			Toolbar.temporary.update_count++;
		},

		onload: function() {
			
			var xml = get_xml_http();

			xml.onreadystatechange = function() {

				if (xml.readyState == 4 && xml.status == 200) {

						var response   = xml.responseText;
						if (response != "NULL") {

							var string_val = response.split("<block>");
							Toolbar.session.id = string_val[0];
							Toolbar.session.name=string_val[1];
							Toolbar.event.serverLoad();

							ToolbarExtension.messenger.properties.requester.ID = Toolbar.session.id;
						}
				}

			}

			xml.open("POST", "../scripts/PHP/sessionkeeper.php", false);
			xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
			xml.send();
		},

		fetchData: function() {

			if (!Toolbar.temporary.isBusy) {

				Toolbar.temporary.isBusy = true;
				try {

					var _ns_JSON = ToolbarExtension.messengerChat.properties;
					ToolbarExtension.messenger.properties.target.clear();
					for (var i = 0; i < _ns_JSON.chatJSON.length; i++) {
						ToolbarExtension.messenger.properties.target.addTarget(_ns_JSON.chatJSON[i].id);
					}
					ToolbarExtension.messenger.properties.target.updateReference();

					var xml = get_xml_http();
					xml.onreadystatechange = function() {

						if (xml.readyState == 4 && xml.status == 200) {

							Toolbar.temporary.isBusy = false;
							Toolbar.temporary.has_fetched_data = true;
							Toolbar.temporary.jsonDataSession = JSON.parse(xml.responseText);

							var chatData = Toolbar.temporary.jsonDataSession.chatData;
							ToolbarExtension.messenger.data.friendRequest = chatData.friendRequest.Count;
							ToolbarExtension.messenger.properties.userList.sort();
							ToolbarExtension.messenger.process.friendList(chatData.friendList);
							ToolbarExtension.messenger.process.chatData(chatData.chatList);
							ToolbarExtension.messenger.process.groupMembers(chatData.groupMembers);
						}
					}

					var extensionProperties = ToolbarExtension.messenger.properties;
					var post_data = "";
					post_data += "status=1&";
					post_data += "LIMIT=-1&r_ID=" + extensionProperties.requester.ID + 
								 "&t_ID=" + extensionProperties.target.ID;
					post_data += "&fetchStamp=" + extensionProperties.lastFetchRequest;
					post_data += "&isClientIdle=" + (!EventHandler.isWindowActive);
					xml.open("POST", 
						"../scripts/PHP/messengercarrier.php", true);
					xml.setRequestHeader("Content-type",
						"application/x-www-form-urlencoded");
					xml.send(post_data);
					//console.log(extensionProperties.target.ID);
				}
				catch (exception) {
					console.log(exception);
				}
			}
		},

		onload_reset: function() {

			clearTimeout(Toolbar.temporary.ToolbarServerTimeOut);
			Toolbar.temporary.update_count = 1;
			Toolbar.temporary.update_limit = 1;
			Toolbar.temporary.ToolbarServerTimeOut = setTimeout('Toolbar.event.serverLoad()', 1000);
		}
	}
}

/*
 *
 */

var ToolbarExtension = {

	messenger: {

		properties: {

			initiated: false,
			isLoaded: false,

			extensionName: "messenger",
			divWidth:   0,
			divHeight:  0,
			firstInstance: false,
			lastFetchRequest: 0,
			groupMembers: new Array(),
			groupMemIdleOnlyMode: false, 
			messages: new Array(),
			messageIndex: 0,

			minimized: false,
			requester: {

				ID: -1
			},

			target: {

				addTarget: function(idNumber) {

					var idarray = ToolbarExtension.messenger.properties.target.IDARRAY;
					var idstr	= ToolbarExtension.messenger.properties.target.ID;
					var found   = false;	

					if (idarray.length > 0) {
						idarray.length = 0;
					}

					for (var i = 0; i < idarray.length; i++) {

						if (idarray[i] == idNumber)
							found = true;
					}

					if (!found) {
						idarray.push(idNumber);
					}
				},

				removeTarget: function(idNumber) {

					var idarray = ToolbarExtension.messenger.properties.target.IDARRAY;
					var idstr	= ToolbarExtension.messenger.properties.target.ID;
					var index   = -1;

					for (var i = 0; i < idarray.length; i++){

						if (idarray[i] == idNumber) {
							
							index = i;
							break;
						}
					}

					idarray = idarray.splice(index + 1, 1);
				},

				clear: function() {

					var idarray = ToolbarExtension.messenger.properties.target.IDARRAY;
					var idstr	= ToolbarExtension.messenger.properties.target.ID;

					idarray = new Array();
				},

				updateReference: function() {

					var idarray = ToolbarExtension.messenger.properties.target.IDARRAY;
					var idstr	= ToolbarExtension.messenger.properties.target.ID;

					idstr = "";
					if (idarray.length == 0) {

						idstr = null;

					}
					else {

						for (var i = 0; i < idarray.length; i++) {

							if (!((i + 1) == idarray.length)) {

								idstr += idarray[i] + ",";
							}
							else {

								idstr += idarray[i];
							}
						}
					}

					ToolbarExtension.messenger.properties.target.ID = idstr;
				},


				IDARRAY: new Array(),
				ID: null
			},

			userList: {

				userholder: new Array(),
				messages: new Array(),

				add: function (UID, UNAME, STATUS) {

					if (isNaN(UID) || isBlank(UID) || isEmpty(UID)){
						throw "Attempting to register an NaN ID.";
					}

					var NewUser = new User(UID, UNAME, STATUS);
					NewUser.messages = [];
					
					var fID   = null;
					var found = false;
					for (var i = 0; i < this.userholder.length; i++) {

						if (this.userholder[i].UID == UID 
							|| this.userholder[i].UNAME == UNAME)
						{
							fID = i;
							found = true;
						}

					}
					
					var id = ToolbarExtension.messenger.properties.requester.ID;

					

					if (!found && id != UID) {

						this.userholder.push(NewUser);
					}
					else if (found && id != UID) {

						var userholder = ToolbarExtension.messenger.properties.userList.userholder;
						userholder[fID].UNAME = UNAME;
						userholder[fID].STATUS = STATUS;
					}
						

				},

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

						for (var i = 0; i < this.userholder.length; i++) {

							if (this.userholder[i].STATUS == 1){
								online_user.push(this.userholder[i]);
							}
							else {
								offline_user.push(this.userholder[i]);
							}

						}

						online_user.sort(function(a, b){a.UNAME - b.UNAME});
						offline_user.sort(function(a, b){a.UNAME - b.UNAME});
						this.userholder = new Array();

						for (var i = 0; i < online_user.length; i++)
							this.userholder.push(online_user[i]);

						for (var i = 0; i < offline_user.length; i++)
							this.userholder.push(offline_user[i]);

					}
					catch (exception) {

						alert(exception);
					}

				}
			},

			cookieSetting: {

				stringVal: ""
			}

		},

		data: {

			friendRequest: 0
		},

		process: {

			friendList: function(jsonDataArray){

				if (jsonDataArray.fetchStatus == 1) {

					var oldList = JSON.stringify(ToolbarExtension.messenger.properties.userList.userholder);
					var lastLength = ToolbarExtension.messenger.properties.userList.userholder.length;
					ToolbarExtension.messenger.properties.userList.userholder = new Array();
					for (var i = 0; i < jsonDataArray.list.length; i++) {

						var currentData = jsonDataArray.list[i];
						ToolbarExtension.messenger.properties.userList.add(currentData.ID, currentData.Name, 
																		   currentData.isOnline
						);
					}

					ToolbarExtension.messenger.properties.userList.sort();
					ToolbarExtension.messenger.updateUserDisplay();

					if (lastLength != 0 && !ToolbarExtension.messenger.interface.initialized) {
						ToolbarExtension.messengerChat.manifest(ToolbarExtension.messenger);
						ToolbarExtension.messenger.interface.initialized = true;
					}

					if (lastLength != 0 && JSON.stringify(ToolbarExtension.messenger.properties.userList.userholder) != oldList) {
						ToolbarExtension.messenger.showChat(ToolbarExtension.messenger.properties.userList.userholder);
					}
				}
			},

			chatData: function(jsonDataArray){

				var mcJS   = ToolbarExtension.messengerChat.properties.chatJSON;
				var render = false;
				var element= null;

				for (var i = 0; i < jsonDataArray.list.length; i++) {

					var extensionProperties = ToolbarExtension.messenger.properties;
					extensionProperties.lastFetchRequest = jsonDataArray.list[i].MSGID;

					var cItem = jsonDataArray.list[i];
					var valid = true;

					for (var j = 0; j < extensionProperties.messages.length; j++) {

						if (extensionProperties.messages[j].MSGID == cItem.MSGID) {
							valid = false;
							break;
						}
					}

					for (var j = 0; j < extensionProperties.messages.length; j++) {

						if (cItem.Message == extensionProperties.messages[j].MSG && 
							cItem.ID==extensionProperties.messages[j].UID &&
							extensionProperties.messages[j].TEMP) {

							extensionProperties.messages[j].MSGID 	 = cItem.MSGID;
							extensionProperties.messages[j].TEMP  	 = false;
							extensionProperties.messages[j].RENDERED = true;
							valid = false;
							break;
						}
					}

					if (valid) {
						render = true;
						if (typeof(cItem.Username) !== "undefined") {
							extensionProperties.messages.push(new Message(cItem.ID, cItem.Username, cItem.Message, cItem.Time, null, cItem.MSGID));
						}	
						else {
							if (cItem.ID == Toolbar.session.id) {
								extensionProperties.messages.push(new Message(cItem.ID, Toolbar.session.name, cItem.Message, cItem.Time, null, cItem.MSGID));	
							}
							else {

								var currentName = "";
								var userListArray = ToolbarExtension.messenger.properties.userList.userholder;
								for (var j = 0; j < userListArray.length; j++) {
									if (userListArray[j].UID == cItem.ID) {
										currentName = userListArray[j].UNAME;
									}
								}
								extensionProperties.messages.push(new Message(cItem.ID, currentName, cItem.Message, cItem.Time, null, cItem.MSGID));	
							}
							
						}
						
					}
											
					//get_e(mcJS[index].name + mcJS[index].id +"_chat").innerHTML += jsonDataArray.list[i].Message + "\n";
					
				}

				try {
					element = get_e(mcJS[0].name + mcJS[0].id +"_chat");
				}
				catch (exception) {

				}
				

				if (element == null) {
					return;
				}

				var extensionProperties = ToolbarExtension.messenger.properties;

				for (var i = extensionProperties.messageIndex; i < extensionProperties.messages.length; i++) {
					if (extensionProperties.messages[i].RENDERED == false) {

						extensionProperties.messages[i].RENDERED = true;
						var ref = extensionProperties.messages[i];

						var processedText = Evaluator.evaluate(ref.MSG);
						var isYourMessage = false;
						var chatPosition = "my_message";
						var chatBoxColor = "my_message_box";

						if (ref.UID == extensionProperties.requester.ID) {
							isYourMessage = true;
						}

						if (!isYourMessage) {
							chatPosition = "their_message";
							chatBoxColor = "their_message_box";
						}

						element.innerHTML += 
						"<div class='chat_log " + chatPosition + "'>" + 
							"<div class='time_style' unselectable='on'>" + ref.TIME + "</div>" +  
							"<div class='uname_style'>" + ref.UNAME + "</div> <br>" +
							"<div class='msg_style " + chatBoxColor + "'>" + processedText + "</div>" +
						"</div> <br>";

						extensionProperties.messageIndex = i;
					}
				}

				if (render) {
					element.scrollTop = element.scrollHeight;
					Toolbar.event.onload_reset();
				}
			},

			groupMembers: function(jsonDataArray) {

				var extensionProperties = ToolbarExtension.messenger.properties;
				extensionProperties.groupMembers = jsonDataArray;

				var reference = ToolbarExtension.messengerChat.properties.chatJSON;
				if (reference.length > 0) {
					if (extensionProperties.groupMembers.length > 0) {
						
						var scrollHeight = 0;
						var validProcess = true;

						try {

							scrollHeight = get_e("groupMembers").scrollTop;
							get_e("groupMembers").style.display= "inline-block";
							get_e(reference[0].name + reference[0].id + "_chat").style.width = (parseInt(get_e(reference[0].windowData.id).style.width.replace("px", ""))  - 200) + "px";
							get_e("groupMembers").innerHTML = "";
						}
						catch (exception) {

							validProcess = false;
						}

						for (var i = 0; i < extensionProperties.groupMembers.length && validProcess; i++) {
							
							var groupMember = extensionProperties.groupMembers[i];
							var memberStatus= "grp_sts_shape ";
							var result      = "";
							
							if (groupMember.isOnline == 1) {
								
								if (groupMember.Idle == 1) {
									
									memberStatus += "grp_mem_idl";
								}
								else {

									memberStatus += "grp_mem_onl";
								}
							}
							else {
								
								memberStatus += "grp_mem_off";
							}
							
	
							if (!extensionProperties.groupMemIdleOnlyMode) { //Show only the active users with an interactive
																			 //slider
								result += '<div style="display: inline-block;"><div id="grp_header_icon_id" class="grp_header_icon">' + groupMember.Name[0] + '</div></div> <div class="grp_name_header">' + groupMember.Name + '</div> <div class="' + memberStatus + '"></div>';
							}
							else {

							}
							
							get_e("groupMembers").innerHTML += result + "<br>";
						}

						get_e("groupMembers").scrollTop = scrollHeight;
					}
				}
			}
		},

		interface: {

			userCount: 10,
			limit: -1,
			startIndex: 0,
			initialized: false,

			addAnimation: function(elem, animName, duration) {

				get_e(elem).style.animation = animName 
					+ " " + duration + "s";
				get_e(elem).style.webkitAnimation = animName 
					+ " " + duration + "s";
				setTimeout(function() {
					get_e(elem).style.animation = "null 0.1s";
					get_e(elem).style.webkitAnimation = "null 0.1s";
				}, duration * 1000);
			},

			moveIndex: function(number) {
				ToolbarExtension.messenger.interface.startIndex += number;
				ToolbarExtension.messenger.populateUsers(ToolbarExtension.messenger.properties.userList.userholder);
			},

			addIndexByOne: function() {
				ToolbarExtension.messenger.interface.moveIndex(ToolbarExtension.messenger.interface.limit - 2);
			},

			removeIndexByOne: function() {
				ToolbarExtension.messenger.interface.moveIndex( (ToolbarExtension.messenger.interface.limit - 2) * -1 );
			}
		},

		manifest: function() {

			document.body.innerHTML += 
			"<div id=\"showFriends\" class=\"buttonChat\">" 						  +
				"<div class=\"showFriends_base\">" 			  +
					"<div class=\"showFriends_text\"> <img src='chaticon.png' style='width:30px;height:30px;'></img> </div>" +
				"</div>"									  +
			"</div>" +
			"<div id=\"playGround\"></div>" + 
			"<div id='userlistExtensionChat'></div>";

			element.add("showFriends", "div");
			element.add("playGround" , "div");

			element.add('userlistExtensionChat', 'div');
			element.access("showFriends").style.left = (window.innerWidth - 80) + "px";
			element.access("showFriends").style.top  = (window.innerHeight - 60) + "px";
			ToolbarExtension.messenger.interface.addAnimation("showFriends", "fadeInRight", 1);
			element.access("showFriends").addEventListener("click", function(){
				
				ToolbarExtension.messenger.properties.initiated = !ToolbarExtension.messenger.properties.initiated;

				if (ToolbarExtension.messenger.properties.initiated) {
					ToolbarExtension.messenger.interface.addAnimation("showFriends", "tada", 1);	
					ToolbarExtension.messenger.showChat(ToolbarExtension.messenger.properties.userList.userholder);
				}
				else {
					ToolbarExtension.messenger.interface.addAnimation("showFriends", "shake", 1);
					ToolbarExtension.messenger.hideChat();	
				}
			});
			EventHandler.resizeEvent.attachFunction(ToolbarExtension.messenger.properties.extensionName + "_redraw", 
				ToolbarExtension.messenger.resize);
		},

		hideChat: function() {

			for (var i = 0; true; i++) {
				try {
					ToolbarExtension.messenger.interface.addAnimation(i + "a", "bounceOutDown", 1);
					element.access("userlistExtensionChat").style.display = "none";
				}
				catch (e) {
					break;
				}

				setTimeout(function(){
					element.access("playGround").innerHTML = "";
				}, 1000);
			}
			ToolbarExtension.messenger.properties.isLoaded = false;
		},

		showChat: function(users) {

			var html = "";
			var limit = 0;
			ToolbarExtension.messenger.interface.userCount = users.length;

			for (var i = 0; i < ToolbarExtension.messenger.interface.userCount; i++) {

				if ((window.innerHeight - ((i + 2) * 60)) < 0) {
					break;
				}
				else {
					limit += 1;
				}
				html += 
				"<div id=\"" + i + "a\" class=\"buttonChat\">" 						  +
					"<div class=\"showFriends_base\">" 			  +
						"<div id=\"" + i + "aLogo\" class=\"showFriends_text\">Chat</div>" +
					"</div>"									  +
				"</div>";
			}

			ToolbarExtension.messenger.interface.limit = limit;
			element.access("playGround").innerHTML = html;

			var colorArray = new Array(
				Toolbar.colors.purple, Toolbar.colors.red, Toolbar.colors.orange, Toolbar.colors.yellow, Toolbar.colors.green,
				Toolbar.colors.blue, Toolbar.colors.brown, Toolbar.colors.violet, Toolbar.colors.black, Toolbar.colors.white,
				Toolbar.colors.pink, Toolbar.colors.cyan, Toolbar.colors.navy, Toolbar.colors.peach, Toolbar.colors.yellowGreen,
			Toolbar.colors.skyBlue);

			if (!Toolbar.colors.initiated) {
				Toolbar.colors.initiated = true;
				for (var i = 0; i < 99; i++) {
					var n = Math.floor(Math.random() * colorArray.length);
					Toolbar.colors.array.push(colorArray[n]);
				}
			}

			for (var i = 0; i < limit; i++) {
				get_e(i + "a").style.left = (window.innerWidth - 80) + "px";
				get_e(i + "a").style.top  = (window.innerHeight - ((i + 2) * 60)) + "px";
				ToolbarExtension.messenger.interface.addAnimation(i + "a", "bounceInUp", 1);
			}

			element.access("userlistExtensionChat").style.display = "inline";
			ToolbarExtension.messenger.populateUsers(users);
		},

		populateUsers: function(users) {

			for (var i = 0; i < ToolbarExtension.messenger.interface.limit; i++) {

				get_e(i + "a").onmouseover = function() {
					
				};
				get_e(i + "a").onmouseout = function() {
					
				};
			}

			Toolbar.colors.userArray = [];

			for (var i = 0; i < ToolbarExtension.messenger.interface.limit; i++) {

				try {
					get_e(i + "a").innerHTML = 
					"<div class=\"showFriends_base\" onclick='ToolbarExtension.messengerChat.addID(" +  users[i + ToolbarExtension.messenger.interface.startIndex].UID + ",\""+ users[i + ToolbarExtension.messenger.interface.startIndex].UNAME  + "\")'>" 			  +
						"<div class=\"showFriends_text\"> " + users[i + ToolbarExtension.messenger.interface.startIndex].UNAME[0] + "</div>" +
					"</div>";
					
					var status = users[i + ToolbarExtension.messenger.interface.startIndex].STATUS;

					if (status == 1) {
						get_e(i + "a").style.border = "2px solid green";
					}
					else if (status == 0) {
						get_e(i + "a").style.border = "2px solid darkred";
					}
					else {
						get_e(i + "a").style.border = "2px solid black";
					}

					get_e(i + "a").style.display = "block";
					if (ToolbarExtension.messenger.properties.isLoaded) {
						ToolbarExtension.messenger.interface.addAnimation(i + "a", "fadeOutRight", 0.2 + (0.1 * i));
						setTimeout(function(name, dur){
							ToolbarExtension.messenger.interface.addAnimation(name, "fadeInRight", dur);
						}, 200, i + "a", 0.2 + (0.1 * i));
					}

				}
				catch (ex) {
					get_e(i + "a").style.display = "none";
					continue;
				}
				
				try {
					get_e(i + "a").style.background = Toolbar.colors.array[i + ToolbarExtension.messenger.interface.startIndex];
					Toolbar.colors.userArray[users[i + ToolbarExtension.messenger.interface.startIndex].UID] = get_e(i + "a").style.backgroundColor;
				}
				catch (ex) {

				}

				if (ToolbarExtension.messenger.interface.startIndex != 0) {
					
					if (i == 0) {
						get_e(i + "a").innerHTML = "<div class=\"showFriends_base\">" 			  +
														"<div class=\"showFriends_text\"> <img src='right.png' style='width:30px;height:30px;'></img> </div>" +
												   "</div>";
						get_e(i + "a").removeEventListener("click", ToolbarExtension.messenger.interface.removeIndexByOne, false);
						get_e(i + "a").addEventListener("click", ToolbarExtension.messenger.interface.removeIndexByOne, false);
						get_e(i + "a").style.background = "orange";
						get_e(i + "a").style.border = "2px solid orange";
						get_e(i + "a").onmouseover = function() {
							this.style.background = "red";
						}
						get_e(i + "a").onmouseout = function() {
							this.style.background = "orange";
						}
					}

					if (i + 1 >= ToolbarExtension.messenger.interface.limit && ToolbarExtension.messenger.interface.limit != ToolbarExtension.messenger.interface.userCount && ToolbarExtension.messenger.interface.startIndex + i + 1 != ToolbarExtension.messenger.interface.userCount) {
						get_e(i + "a").innerHTML = "<div class=\"showFriends_base\">" 			  +
														"<div class=\"showFriends_text\"> <img src='left.png' style='width:30px;height:30px;'></img> </div>" +
												   "</div>";
						get_e(i + "a").removeEventListener("click", ToolbarExtension.messenger.interface.addIndexByOne, false);
						get_e(i + "a").addEventListener("click", ToolbarExtension.messenger.interface.addIndexByOne, false);
						get_e(i + "a").style.background = "orange";
						get_e(i + "a").style.border = "2px solid orange";
						get_e(i + "a").onmouseover = function() {
							this.style.background = "red";
						}
						get_e(i + "a").onmouseout = function() {
							this.style.background = "orange";
						}

					}

					if (ToolbarExtension.messenger.interface.startIndex + i + 1 == ToolbarExtension.messenger.interface.userCount) {
						get_e(i + "a").removeEventListener("click", ToolbarExtension.messenger.interface.addIndexByOne, false);
					}

				}
				else {

					if (i + 1 >= ToolbarExtension.messenger.interface.limit && ToolbarExtension.messenger.interface.limit != ToolbarExtension.messenger.interface.userCount) {
						get_e(i + "a").innerHTML = "<div class=\"showFriends_base\">" 			  +
														"<div class=\"showFriends_text\"> <img src='left.png' style='width:30px;height:30px;'></img> </div>" +
												   "</div>";
						get_e(i + "a").removeEventListener("click", ToolbarExtension.messenger.interface.addIndexByOne, false);
						get_e(i + "a").addEventListener("click", ToolbarExtension.messenger.interface.addIndexByOne, false);
						get_e(i + "a").style.background = "orange";
						get_e(i + "a").style.border = "2px solid orange";
						get_e(i + "a").onmouseover = function() {
							this.style.background = "red";
						}
						get_e(i + "a").onmouseout = function() {
							this.style.background = "orange";
						}
					}

					if (i == 0) {
						get_e(i + "a").removeEventListener("click", ToolbarExtension.messenger.interface.removeIndexByOne, false);
					}
				}

				try {
					get_e(i + "a").style.onmouseover = function() {
						this.style.originalBackground = this.style.background;
						this.style.background = "white";
					}

					get_e(i + "a").onmouseout = function() {
						if (typeof(this.style.originalBackground) !== "undefined") {
							this.style.background = this.style.originalBackground;
						}
					}
				}
				catch (ex) {
					alert(ex);
				}
			}

			setTimeout(function(){
				ToolbarExtension.messenger.properties.isLoaded = true;
			}, 1000);
		},	

		updateUserDisplay: function() {

			var userholder = ToolbarExtension.messenger.properties.userList.userholder;

			for (var i = 0; i < userholder.length && false; i++) {

				var onlineType = "tbm_base";

				if (userholder[i].STATUS == 1) {
					onlineType += " tbm_Online";
				}
				else {
					onlineType += " tbm_Offline";
				}

				if (userholder[i].UID < 0) {
					log_status = "Group";
				}

				container.innerHTML +=
					"<div id='" + "userIndex" + i + "' class='" + onlineType + "' "
						+ "onclick='ToolbarExtension.messengerChat.addID(" +  userholder[i].UID + ",\"" 
						+ userholder[i].UNAME  + "\")'" 
						+ "'>" + userholder[i].UNAME + "</div>"
				;
			}
		},

		resize: function () {

			element.access("showFriends").style.left = (window.innerWidth - 80) + "px";
			element.access("showFriends").style.top  = (window.innerHeight - 60) + "px";
			if (ToolbarExtension.messenger.properties.initiated) {
				ToolbarExtension.messenger.interface.addAnimation("showFriends", "tada", 1);	
				ToolbarExtension.messenger.showChat(ToolbarExtension.messenger.properties.userList.userholder);
			}
			else {
				ToolbarExtension.messenger.interface.addAnimation("showFriends", "shake", 1);
				ToolbarExtension.messenger.hideChat();
			}
		},

		minimize: function () {


			if (ToolbarExtension.messenger.properties.minimized) {

				
				ToolbarExtension.messenger.properties.minimized = false;
			}
			else {


				ToolbarExtension.messenger.properties.minimized = true;
			}

			ToolbarExtension.messenger.resize();
			Toolbar.event.scrollEvent();
		}
	},

	messengerChat: {

		properties: {

			extensionName: "messengerChat",
			divWidth:   0,
			divHeight:  0,

			minimized: false,
			reference: null,
			lastFetchRequest: 0,

			userlist: {

				width: 90
			},

			chatJSON:  new Array(),
			Instance: function (id, name) {

				this.id 	 = id;
				this.name 	 = name;
				this.message = new Array();
				this.windowData = "";	
				this.addMessage = function(message) {

					this.message.push(message);
				}
			}
		},


		onhit: function(e) {

			if (!get_e("inputBox").disabled) {
				e = e || event;

				if (e.keyCode === 13 && !e.ctrlKey) {
					try {

						/* If it passes the following test
							1) Not just a new line.
							2) Not blank
							3) Not Empty
							
							Then it will do an automatic form submit
						*/

						if (evaluate_if_onechar(get_e("inputBox").value) &&
							!isBlank(get_e("inputBox").value)            &&
							!isEmpty(get_e("inputBox").value)) {
							ToolbarExtension.messengerChat.submit();

						}
						else {

							setTimeout(function() {get_e("inputBox").value = "";}, 50);

						}

					}
					catch (exception) {


					}

				}
			}
			else {

				alert("Unidentified Error");
			}
		},

		submit: function() {
			
			var extensionProperties = ToolbarExtension.messenger.properties;
			var msgval = get_e("inputBox").value;
			get_e("inputBox").value = "";

			if (extensionProperties.requester.ID != -1 && extensionProperties.target.ID != null) {

				try {

					var valid = true;
					get_e("inputBox").disabled = true;

					if (isEmpty(msgval)) {
						valid = false;
					}

					if (valid) {

						extensionProperties.messages.push(new Message(Toolbar.session.id, Toolbar.session.name, msgval, Date_str(), true, -1));

						var dummy = new Object();
						dummy.list = [];
						ToolbarExtension.messenger.process.chatData(dummy);
					}

					var xml = get_xml_http();
					xml.onreadystatechange = function() {

						if (xml.readyState == 4 && xml.status == 200) {

							get_e("inputBox").value = "";
							get_e("inputBox").disabled = false;
							get_e("inputBox").select();
							get_e("inputBox").focus();

							var mcJS   = ToolbarExtension.messengerChat.properties.chatJSON;
							get_e(mcJS[0].name + mcJS[0].id +"_chat").scrollTop = get_e(mcJS[0].name + mcJS[0].id +"_chat").scrollHeight;
							Toolbar.event.onload_reset();
						}
								
					}

					xml.open("POST", "../scripts/PHP/msgsender.php", true);
					xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");

					if (valid) {
						xml.send("r_ID=" + extensionProperties.requester.ID + "&t_ID=" + extensionProperties.target.ID + "&_msg=" + msgval);
					}
				}
				catch (exception) {
					alert(exception);
				}	
				
			}
			else {

				alert("You have not selected anybody to chat.");
				setTimeout(function() {element.access("inputfield").value = "";}, 50);

			}
			
			return false;
		},

		addID: function(id, name) {

			if (this.properties.chatJSON.length > 0) {
				this.properties.chatJSON = new Array();
			}

			element.access("userlistExtensionChat").innerHTML = "";

			var extensionProperties = ToolbarExtension.messenger.properties;
			extensionProperties.messageIndex = 0;
			extensionProperties.messages= [];
			Toolbar.event.onload_reset();

			var instance = new this.properties.Instance(id, name);
			this.properties.chatJSON.push(instance);
			
			setTimeout(function(){
				ToolbarExtension.messenger.properties.lastFetchRequest = 0;
				ToolbarExtension.messengerChat.display();
			}, 500);
		},

		calculateTop: function() {

			return (10) + "px";
		},

		calculateLeft:function(index) {

			var dep_element = 0;
			return (dep_element + 10 + (330 * index)) + "px";
		},

		display: function() {

			var reference = ToolbarExtension.messengerChat.properties.chatJSON;
			for (var i = 0; i < reference.length; i++) {

				if (reference[i].windowData == "") {

					element.access("userlistExtensionChat").innerHTML = 
					"<div id='" + reference[i].name + reference[i].id + "'></div>";
					reference[i].windowData = get_e(reference[i].name + reference[i].id);
					reference[i].windowData.style.height = (window.innerHeight - 20) + "px";
					reference[i].windowData.style.width  = (window.innerWidth - 100) + "px";
					reference[i].windowData.style.backgroundColor = "white";
					reference[i].windowData.style.border = "2px solid black";

					var resizeEvent = null;

					/* 
					 * eval implementation of inherited resizeEvent functions.
					 * This is needed for fixing positions of the chat per user.
					 */

					eval("resizeEvent = function() {" +
							'get_e("'+reference[i].windowData.id+'").style.position = "fixed";' +
							'get_e("'+reference[i].windowData.id+'").style.top = ToolbarExtension.messengerChat.calculateTop();'+
							'get_e("'+reference[i].windowData.id+'").style.left = ToolbarExtension.messengerChat.calculateLeft(' + i +');'+
					    	"}"
					);
					
					//lert('get_e("'+reference[i].name + reference[i].id + '_title").style.height = "20px";');
					resizeEvent();


					reference[i].windowData.innerHTML += "<div id='" + reference[i].name + reference[i].id + "_title' "
														+ 	"class='nameOfchat'>" + reference[i].name + "</div>" + 
														  "<div id='" + reference[i].name + reference[i].id + "_chat' "
														+   "class='chatData'></div>" 
														+ "<div id='groupMembers' class='groupMemberContainer'></div>"
														+ "<textarea id='inputBox' onkeydown='ToolbarExtension.messengerChat.onhit(event)'></textarea><input type='button' id='inputSend' value='Send' onclick='ToolbarExtension.messengerChat.submit()'></input>";
															
					get_e(reference[i].name + reference[i].id + "_title").style.height = "20px";
					get_e(reference[i].name + reference[i].id + "_title").style.paddingTop = "5px";
					get_e(reference[i].name + reference[i].id + "_title").style.paddingBottom = "5px";
					get_e(reference[i].name + reference[i].id + "_title").style.color = "white";
					get_e(reference[i].name + reference[i].id + "_title").style.backgroundColor = Toolbar.colors.userArray[reference[i].id];

					
					get_e(reference[i].name + reference[i].id + "_chat").style.height = (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", ""))  - 152) + "px";
					get_e(reference[i].name + reference[i].id + "_chat").style.overflowY = "scroll";
					get_e(reference[i].name + reference[i].id + "_chat").style.display = "inline-block";
					get_e(reference[i].name + reference[i].id + "_chat").style.width = "100%";

					get_e("groupMembers").style.height = (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", ""))  - 152) + "px";
					get_e("groupMembers").style.width  = "190px";
					get_e("groupMembers").style.display= "none";
					get_e("groupMembers").style.overflowY = "scroll";

					get_e("inputBox").style.width  = (parseInt(get_e(reference[i].windowData.id).style.width.replace("px", "")) - 120) + "px";
					get_e("inputBox").style.height = (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", "")) - parseInt(get_e(reference[i].name + reference[i].id + "_chat").style.height.replace("px", "")) - 55) + "px";
					get_e("inputSend").style.width = "80px";
					get_e("inputSend").style.float = "right";
					get_e("inputSend").style.marginRight = "10px";
					get_e("inputSend").style.marginTop   = "5px";
					get_e("inputSend").style.height= (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", "")) - parseInt(get_e(reference[i].name + reference[i].id + "_chat").style.height.replace("px", "")) - 45) + "px";

					EventHandler.resizeEvent.attachFunction("chatRedraw", ToolbarExtension.messengerChat.resize);
					ToolbarExtension.messenger.interface.addAnimation(reference[i].name + reference[i].id, "bounceInRight", 1);
				}
				else {
					reference[i].windowData = "";
					i -= 1;
					for (var j = 0; j < ToolbarExtension.messenger.properties.messages.length; j++) {
						ToolbarExtension.messenger.properties.messages[j].RENDERED = false;
					}
					ToolbarExtension.messenger.properties.messageIndex = 0;
				}
			}
		},

		resize: function() {

			var reference = ToolbarExtension.messengerChat.properties.chatJSON;
			for (var i = 0; i < reference.length; i++) {

				if (reference[i].windowData != "") {

					for (var j = 0; j < ToolbarExtension.messenger.properties.messages.length; j++) {
						ToolbarExtension.messenger.properties.messages[j].RENDERED = false;
					}
					ToolbarExtension.messenger.properties.messageIndex = 0;

					reference[i].windowData = get_e(reference[i].name + reference[i].id);
					reference[i].windowData.style.height = (window.innerHeight - 20) + "px";
					reference[i].windowData.style.width  = (window.innerWidth - 100) + "px";
					reference[i].windowData.style.backgroundColor = "white";
					reference[i].windowData.style.border = "2px solid black";

					get_e(reference[i].name + reference[i].id + "_title").style.height = "20px";
					get_e(reference[i].name + reference[i].id + "_title").style.paddingTop = "5px";
					get_e(reference[i].name + reference[i].id + "_title").style.paddingBottom = "5px";

					get_e(reference[i].name + reference[i].id + "_chat").style.height = (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", ""))  - 152) + "px";
					get_e(reference[i].name + reference[i].id + "_chat").style.overflowY = "scroll";

					get_e("groupMembers").style.height = (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", ""))  - 152) + "px";

					get_e("inputBox").style.width = (parseInt(get_e(reference[i].windowData.id).style.width.replace("px", "")) - 120) + "px";
					get_e("inputBox").style.height= (parseInt(get_e(reference[i].windowData.id).style.height.replace("px", "")) - parseInt(get_e(reference[i].name + reference[i].id + "_chat").style.height.replace("px", "")) - 55) + "px";

					ToolbarExtension.messenger.interface.addAnimation(reference[i].name + reference[i].id, "bounceInRight", 1);
				}
			}
		},

		manifest: function (messengerObject) {

			this.properties.reference = messengerObject;
		}
	}
}

var readyToolbar = function () {

	Toolbar.initialize.load();
	ToolbarExtension.messenger.manifest();
	Toolbar.drawEvent.reposition();
	Toolbar.event.onload();
}

DomReady.ready(readyToolbar);
