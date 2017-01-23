/*
 * Example implementation of User list
 * which would list down the current users
 * who did not have you on their friend's list
 * and those who sent you a friend request.
*/

/*
 * Class friend holds the name and ids of the
 * users that is fetched by the function base()
*/

var friend = {

	name: new Array(),
	id  : new Array(),

	add : function (id, name) {
		this.name.push(name);
		this.id.push  (id);
	},

	access : function (index) {
		var return_val = new Array();
		return_val[0] = this.name[index];
		return_val[1] = this.id  [index];
		return return_val; 
	},

	length : function () {
		return this.name.length - 1;
	}

}

/*
 * Ajax function for listing down 
 * the current users who didn't add
 * you and those who made a request
 *
 * val signifies if which among the
 * two should it list down. Where:
 *
 * 0 = People who you don't have on their
 *	friends list and vice versa.
 *
 * 1 = People who sent you a friend request
 *	and vice versa.
*/

function base (val)
{

	var xml = get_xml_http();

	xml.onreadystatechange = function () {

		if (xml.readyState == 4 && xml.status == 200) {

			var friends          = JSON.parse(xml.responseText);
			var users 			 = "";

			for (var i = 0; i < friends.length; i++) {

				friends[i] = JSON.parse(friends[i]);
			}

			// Update phase

			try {

				for (var i = 0; i < friends.length; i++) {

					users += "<option value=\"" + friends[i].ID + "\" >" + friends[i].Name + "</option>";
				}

				switch (val){
					case 0:
						element.access("list_friend").innerHTML = users;
						break;
					case 1:
						element.access("list_requester").innerHTML = users;
						break;
					default:
						break;
				}
				

			} 
			catch (exception) {

			}

		}

	}

	xml.open("POST", "../scripts/PHP/user_lister.php", false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
	xml.send("req=" + val);

}

// Alias function

function fetch_friends () {
	base(0);
}

function fetch_friends_request () {
	base(1);
}