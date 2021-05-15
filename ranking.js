
window.onload = init;

function init() {
	document.addEventListener('keydown', key_pressed, false);
	create_ranking();
}

function key_pressed(e) {

	var key = e.keyCode ? e.keyCode : e.which;

	// Return --> key == 13
	// Espacio --> Key == 32
	if ((key == 13) | (key == 32)) {
		window.location.href = "tetris.html";
	}
}

function create_ranking(){
	// Se guardan todos los records hasta el momento en dict
	var dict = {};
	for (var i=0; i<localStorage.length; i++) {
		var key = localStorage.key(i);
		if (key.startsWith("tetris_")) {
			var pos = key.split("_")[1];
			var player_score = localStorage.getItem(key);	// "iker_50"
			dict[pos] = player_score;
		}
	}

	if (Object.keys(dict).length != 0) {
		// Se ordenan los jugadores por score en un Array
		var records = new Array(Object.keys(dict).length);
		for (var i=0; i<records.length; i++) {
			records[i] = dict[(i+1)];
		}

		var table = document.getElementById("ranking");
		for (var i=0; i<records.length; i++) {
			// Create an empty <tr> element and add it to the 1st position of the table:
			var row = table.insertRow(-1);

			// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
			var rank = row.insertCell(0);
			var player = row.insertCell(1);
			var score = row.insertCell(2);


			// Add some text to the new cells:
			rank.innerHTML = (i+1);
			player.innerHTML = records[i].split("_")[0];
			score.innerHTML = records[i].split("_")[1];
		}
		table.deleteRow(1);
	}
}