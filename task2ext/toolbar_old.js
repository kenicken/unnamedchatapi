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
							console.log(chatData);
							ToolbarExtension.messenger.data.friendRequest = chatData.friendRequest.Count;
							ToolbarExtension.messenger.properties.userList.sort();
							ToolbarExtension.messenger.process.friendList(chatData.friendList);
							ToolbarExtension.messenger.process.chatData(chatData.chatList);
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
				}
				catch (exception) {
					console.log(exception);
				}
			}
		}
	}
}

/*
 *
 */

var ToolbarExtension = {

	messenger: {

		properties: {

			extensionName: "messenger",
			divWidth:   0,
			divHeight:  0,
			firstInstance: false,
			lastFetchRequest: 0,

			minimized: false,
			requester: {

				ID: -1
			},

			target: {

				addTarget: function(idNumber) {

					var idarray = ToolbarExtension.messenger.properties.target.IDARRAY;
					var idstr	= ToolbarExtension.messenger.properties.target.ID;
					var found   = false;	

					for (var i = 0; i < idarray.length; i++) {

						if (idarray[i] == idNumber)
							found = true;
					}

					if (!found)
						idarray.push(idNumber);
				},

				removeTarget: function(idNumber) {

					var idarray = ToolbarExtension.messenger.properties.target.IDARRAY;
					var idstr	= ToolbarExtension.messenger.properties.target.ID;
					var index   = null;

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

					ToolbarExtension.messenger.properties.userList.userholder = new Array();
					for (var i = 0; i < jsonDataArray.list.length; i++) {

						var currentData = jsonDataArray.list[i];
						ToolbarExtension.messenger.properties.userList.add(currentData.ID, currentData.Name, 
																		   currentData.isOnline
						);
					}

					ToolbarExtension.messenger.properties.userList.sort();
					ToolbarExtension.messenger.updateUserDisplay();
				}
			},

			chatData: function(jsonDataArray){

				var mcJS   = ToolbarExtension.messengerChat.properties.chatJSON;
				console.log(jsonDataArray);
				for (var i = 0; i < jsonDataArray.list.length; i++) {

					var index  = -1;
					var target = jsonDataArray.list[i].ID;
					for (var j = 0; j < mcJS.length; j++) {

						//console.log(target + "  " + mcJS[j].id);
						if (target == mcJS[j].id || target == Toolbar.session.id) {

							index = j;
						}
					}

					if (index != -1) {

						console.log(mcJS[index].name + index +"_chat");
						get_e(mcJS[index].name + mcJS[index].id +"_chat").innerHTML += jsonDataArray.list[i].Message;
					}
				}
			}
		},

		manifest: function() {

			document.body.innerHTML += 

			"<div class='userlist' id='userlist' >" +
				"<div class='titleBar' id='titleBar'" +
				"onclick='ToolbarExtension.messenger.minimize()'>" +
					"  " +
				"</div>" + 
			"</div>" +
			"<div id='userlistExtensionChat'></div>";

			element.add('userlist', 'div');
			element.add('titleBar', 'div');
			element.add('userlistExtensionChat', 'div');

			element.access('titleBar').style.borderBottom = "1px solid black";
			element.access('titleBar').style.height = "30px";


			ToolbarExtension.messenger.resize();
			Toolbar.action.addElement(element.access('userlist'));
			EventHandler.resizeEvent.attachFunction(ToolbarExtension.messenger.properties.extensionName + "_redraw", 
				ToolbarExtension.messenger.resize);
			
		},

		updateUserDisplay: function() {

			var userholder = ToolbarExtension.messenger.properties.userList.userholder;

			if (!ToolbarExtension.messenger.properties.firstInstance) {

				var base 	  = get_e("userlist");
				base.innerHTML += 
					"<div class='friendlist_design' id='friendlist'></div>";
				ToolbarExtension.messenger.properties.firstInstance = true;
				element.add('friendlist', 'div');
			}
				
			var FF = !(window.mozInnerScreenX == null);
			var container = get_e("friendlist");
			container.innerHTML = "";

			if (FF) {
				element.access("friendlist").style.height = "95%";
			}
			else {
				element.access("friendlist").style.height = "94.5%";
			}

			for (var i = 0; i < userholder.length; i++) {

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

			element.access('userlist').style.width = ToolbarExtension.messengerChat.properties.userlist.width + "px";
			

			if (!ToolbarExtension.messenger.properties.minimized) {

				try {

					element.access('friendlist').style.display = "block";
				}
				catch (exception) {

				}
				
				if (parseInt(window.innerHeight) > 500) {

					element.access('userlist').style.height= "500px";
				}
				else {

					element.access('userlist').style.height= (parseInt(window.innerHeight) - 30) + "px";
				}
			}
			else {

				element.access('friendlist').style.display = "none";
				element.access('userlist').style.height= "30px";
			}

			element.access('userlist').style.border= "1px solid black";
			element.access('userlist').style.background = "white";
			
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

		addID: function(id, name) {

			if (this.properties.chatJSON.length > 0) {
				this.properties.chatJSON = new Array();
			}

			var instance = new this.properties.Instance(id, name);
			this.properties.chatJSON.push(instance);
			this.display();
		},

		calculateTop: function() {

			return (window.innerHeight - 370) + "px";
		},

		calculateLeft:function(index) {

			var dep_element = element.access("userlist").offsetWidth;
			return (dep_element + 10 + (330 * index)) + "px";
		},

		display: function() {

			var reference = this.properties.chatJSON;
			for (var i = 0; i < reference.length; i++) {

				if (reference[i].windowData == "") {

					element.access("userlistExtensionChat").innerHTML += 
					"<div id='" + reference[i].name + reference[i].id + "'></div>";
					reference[i].windowData = get_e(reference[i].name + reference[i].id);
					reference[i].windowData.style.height = "370px";
					reference[i].windowData.style.width  = "320px";
					reference[i].windowData.style.backgroundColor = "white";
					reference[i].windowData.style.border = "1px solid black";

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

					resizeEvent();
					EventHandler.resizeEvent.attachFunction(reference[i].name + reference[i].id + "_redraw", 
						resizeEvent);


					reference[i].windowData.innerHTML += "<div id='" + reference[i].name + reference[i].id + "_title' "
														+ 	"class='nameOfchat'>" + reference[i].name + "</div>" + 
														  "<div id='" + reference[i].name + reference[i].id + "_chat' "
														+   "class='chatData'></div>";

					get_e(reference[i].name + reference[i].id + "_title").style.border = "1px solid black";
					get_e(reference[i].name + reference[i].id + "_title").style.height = "20px";
					get_e(reference[i].name + reference[i].id + "_title").style.paddingTop = "5px";
					get_e(reference[i].name + reference[i].id + "_title").style.paddingBottom = "5px";

					get_e(reference[i].name + reference[i].id + "_chat").style.border = "1px solid black";
					get_e(reference[i].name + reference[i].id + "_chat").style.height = "335px";
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
	ToolbarExtension.messengerChat.manifest(ToolbarExtension.messenger);
	Toolbar.drawEvent.reposition();
	Toolbar.event.onload();
}

DomReady.ready(readyToolbar);
