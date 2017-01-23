var metaData = {

	ID: 0,
	UNAME: "",
	fetchDone: false
}

var get_session = function () {
			
	var xml = get_xml_http();

	xml.onreadystatechange = function() {

		if (xml.readyState == 4 && xml.status == 200) {

				var response   = xml.responseText;
				var string_val = response.split("<block>");

				if (response != "NULL") {

					metaData.ID = string_val[0];
					metaData.UNAME = string_val[1];
					metaData.fetchDone = true;
				}

				if (isNaN(metaData.ID)) {

					try {
								
						redirect(metaData.ID, 
							"", 
							"../scripts/PHP/erase_session.php?type=uploader");
					}
					catch (exception) {
						redirect(0, "", "../scripts/PHP/logout.php?type=uploader");
					}
				}

		}

	}

	xml.open("POST", "../scripts/PHP/sessionkeeper.php", false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
	xml.send();
}

var post_status = function () {

	var xml = get_xml_http();

	xml.onreadystatechange = function() {

		if (xml.readyState == 4 && xml.status == 200) {

			var response = xml.responseText;
			response = "{sessionData: {" + response + "}}";
			response = JSON.parse(response);
		}
	}

	xml.open("POST", "../scripts/PHP/login.php", false);
	xml.setRequestHeader("Content-type","application/x-www-form-urlencoded")
	xml.send("status=1");
}