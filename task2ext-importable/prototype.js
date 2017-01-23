var colors = {

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
};

var users = [
	{name: "Alex", id: 1},
	{name: "Sylvia", id: 2},
	{name: "Saphoro", id: 3},
	{name: "Creda", id: 4},
	{name: "Mephis", id: 5},
	{name: "Samson", id: 6},
	{name: "Sam", id: 7},
	{name: "Zea", id: 8},
	{name: "Tina", id: 9},
	{name: "Fhea", id: 10},
	{name: "Farah", id: 11}
];

var Prototype = {

	properties: {
		initiated: false,
		isLoaded: false,
	},

	interface: {

		userCount: 10,
		limit: -1,
		startIndex: 0,

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
			Prototype.interface.startIndex += number;
			Prototype.populateUsers(users);
		},

		addIndexByOne: function() {
			Prototype.interface.moveIndex(Prototype.interface.limit - 2);
		},

		removeIndexByOne: function() {
			Prototype.interface.moveIndex( (Prototype.interface.limit - 2) * -1 );
		}
	},

	manifest: function() {

		document.body.innerHTML += 
		"<div id=\"showFriends\" class=\"buttonChat\">" 						  +
			"<div class=\"showFriends_base\">" 			  +
				"<div class=\"showFriends_text\"> <img src='chaticon.png' style='width:30px;height:30px;'></img> </div>" +
			"</div>"									  +
		"</div>" +
		"<div id=\"playGround\"></div>";

		element.add("showFriends", "div");
		element.add("playGround" , "div");
		element.access("showFriends").style.left = (window.innerWidth - 70) + "px";
		element.access("showFriends").style.top  = (window.innerHeight - 60) + "px";
		Prototype.interface.addAnimation("showFriends", "fadeInRight", 1);
		element.access("showFriends").addEventListener("click", function(){
			

			Prototype.properties.initiated = !Prototype.properties.initiated;

			if (Prototype.properties.initiated) {
				Prototype.interface.addAnimation("showFriends", "tada", 1);	
				Prototype.showChat(users);
			}
			else {
				Prototype.interface.addAnimation("showFriends", "shake", 1);
				Prototype.hideChat();
			}
		});
	},

	hideChat: function() {

		for (var i = 0; true; i++) {
			try {
				Prototype.interface.addAnimation(i + "a", "bounceOutDown", 1);
			}
			catch (e) {
				break;
			}

			setTimeout(function(){
				element.access("playGround").innerHTML = "";
			}, 1000);
		}
		Prototype.properties.isLoaded = false;
	},

	showChat: function(users) {

		var html = "";
		var limit = 0;
		Prototype.interface.userCount = users.length;

		for (var i = 0; i < Prototype.interface.userCount; i++) {

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

		Prototype.interface.limit = limit;
		element.access("playGround").innerHTML = html;

		var colorArray = new Array(
			colors.purple, colors.red, colors.orange, colors.yellow, colors.green,
			colors.blue, colors.brown, colors.violet, colors.black, colors.white,
			colors.pink, colors.cyan, colors.navy, colors.peach, colors.yellowGreen,
		colors.skyBlue);

		if (!colors.initiated) {
			colors.initiated = true;
			for (var i = 0; i < 99; i++) {
				var n = Math.floor(Math.random() * colorArray.length);
				colors.array.push(colorArray[n]);
			}
		}

		for (var i = 0; i < limit; i++) {
			get_e(i + "a").style.left = (window.innerWidth - 70) + "px";
			get_e(i + "a").style.top  = (window.innerHeight - ((i + 2) * 60)) + "px";
			Prototype.interface.addAnimation(i + "a", "bounceInUp", 1);
		}

		Prototype.populateUsers(users);
	},

	populateUsers: function(users) {

		for (var i = 0; i < Prototype.interface.limit; i++) {

			get_e(i + "a").onmouseover = function() {
				
			};
			get_e(i + "a").onmouseout = function() {
				
			};
		}

		for (var i = 0; i < Prototype.interface.limit; i++) {

			try {
				get_e(i + "a").innerHTML = 
				"<div class=\"showFriends_base\">" 			  +
					"<div class=\"showFriends_text\"> " + users[i + Prototype.interface.startIndex].name[0] + "</div>" +
				"</div>";
		
				get_e(i + "a").style.display = "block";
				if (Prototype.properties.isLoaded) {
					Prototype.interface.addAnimation(i + "a", "fadeOutRight", 0.2 + (0.1 * i));
					setTimeout(function(name, dur){
						Prototype.interface.addAnimation(name, "fadeInRight", dur);
					}, 200, i + "a", 0.2 + (0.1 * i));
				}

			}
			catch (ex) {
				get_e(i + "a").style.display = "none";
				continue;
			}
			
			try {
				get_e(i + "a").style.background = colors.array[i + Prototype.interface.startIndex];
			}
			catch (ex) {

			}

			if (Prototype.interface.startIndex != 0) {
				
				if (i == 0) {
					get_e(i + "a").innerHTML = "<div class=\"showFriends_base\">" 			  +
													"<div class=\"showFriends_text\"> <img src='right.png' style='width:30px;height:30px;'></img> </div>" +
											   "</div>";
					get_e(i + "a").removeEventListener("click", Prototype.interface.removeIndexByOne, false);
					get_e(i + "a").addEventListener("click", Prototype.interface.removeIndexByOne, false);
					get_e(i + "a").style.background = "orange";
					get_e(i + "a").onmouseover = function() {
						this.style.background = "red";
					}
					get_e(i + "a").onmouseout = function() {
						this.style.background = "orange";
					}
				}

				if (i + 1 >= Prototype.interface.limit && Prototype.interface.limit != Prototype.interface.userCount && Prototype.interface.startIndex + i + 1 != Prototype.interface.userCount) {
					get_e(i + "a").innerHTML = "<div class=\"showFriends_base\">" 			  +
													"<div class=\"showFriends_text\"> <img src='left.png' style='width:30px;height:30px;'></img> </div>" +
											   "</div>";
					get_e(i + "a").removeEventListener("click", Prototype.interface.addIndexByOne, false);
					get_e(i + "a").addEventListener("click", Prototype.interface.addIndexByOne, false);
					get_e(i + "a").style.background = "orange";
					get_e(i + "a").onmouseover = function() {
						this.style.background = "red";
					}
					get_e(i + "a").onmouseout = function() {
						this.style.background = "orange";
					}

				}

				if (Prototype.interface.startIndex + i + 1 == Prototype.interface.userCount) {
					get_e(i + "a").removeEventListener("click", Prototype.interface.addIndexByOne, false);
				}
			}
			else {

				if (i + 1 >= Prototype.interface.limit && Prototype.interface.limit != Prototype.interface.userCount) {
					get_e(i + "a").innerHTML = "<div class=\"showFriends_base\">" 			  +
													"<div class=\"showFriends_text\"> <img src='left.png' style='width:30px;height:30px;'></img> </div>" +
											   "</div>";
					get_e(i + "a").removeEventListener("click", Prototype.interface.addIndexByOne, false);
					get_e(i + "a").addEventListener("click", Prototype.interface.addIndexByOne, false);
					get_e(i + "a").style.background = "orange";
					get_e(i + "a").onmouseover = function() {
						this.style.background = "red";
					}
					get_e(i + "a").onmouseout = function() {
						this.style.background = "orange";
					}
				}

				if (i == 0) {
					get_e(i + "a").removeEventListener("click", Prototype.interface.removeIndexByOne, false);
				}
			}
		}

		setTimeout(function(){
			Prototype.properties.isLoaded = true;
		}, 1000);
	}
};

var readyToolbar = function () {

	Prototype.manifest();
	EventHandler.resizeEvent.attachFunction("Prototype resize", function(){
		element.access("showFriends").style.left = (window.innerWidth - 70) + "px";
		element.access("showFriends").style.top  = (window.innerHeight - 60) + "px";
		if (Prototype.properties.initiated) {
			Prototype.interface.addAnimation("showFriends", "tada", 1);	
			Prototype.showChat(users);
		}
		else {
			Prototype.interface.addAnimation("showFriends", "shake", 1);
			Prototype.hideChat();
		}
	});
};

DomReady.ready(readyToolbar);