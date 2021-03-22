// JavaScript Code for game.html
// var answers dictates the entries or items in the game
// parts of the code were adapted from CommonLounge - Hands-on Project: "4 Pics 1 Word " Game
// major modifications were added [i.e score board, styling, conditions, entries, levels, mechanics]
// 2 hints are offered per level
// functions and processes are defined in the succeeding codes
var answers = {
	1 : "DATA",
	2 : "PYTHON",
	3 : "BUG",
	4 : "SCRIPT",
	5 : "MEMORY",
	6 : "MAMMAL",
	7 : "FUNGUS",
	8 : "VIRUS",
	9 : "BIOME",
	10 : "BOTANY"
}

var count = 0; // counter or score
var levels = 10; // number of levels
var current = 1; // current level [starting level is 1]

// answer stores characters that are not yet added
// but should be part of the actual item
var entry = answers[current];

var hintsNum = 2; // number of hints [2 per item]

var options = {
	0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
}

var blanks = {} // for blanks [characters in a string]

var letters = {} // for letters [actual characters to be used by the player]

var frequency = {} // freq of occurrence of a letter in the item [answers]

var tempfreq = {} // freq of occurrence of a letter in the current entry [submission]


function main() {
	// the main function
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var answer = answers[current];
	for (var i = 0; i < 26; ++i) {
		// freq count = 0
		frequency[alphabets[i]] = 0;
		tempfreq[alphabets[i]] = 0;
	}
	for (var i = 0; i < answer.length; ++i)
		frequency[answer[i]] += 1; // count the freq of characters in the answer string

	addimages(current); // add images for the current level
	// fullView(defined in images.js) expands the clicked image
	// when each image is clicked, when button "Go Back" is pressed,
	// it will zoom out [viewing 4 images]
	$(".imagehint").attr("onclick", "fullView(this)");
	addblanks(current); // add blanks for this current level
	addoptions(current); // add letter options for this current level
}

///////////////////////////////////////////////////////////////////////////////
// to check if the current entry is correct

function getsubmission() {
	var x = ""; 
	$(".blank").each(function(item, element) {
		x += element.innerHTML; // add all characters from blanks [entry; works like concatenation]
	});

	return x;
}

function checkifcorrect(level) {
	var submission = getsubmission();
	if (submission === answers[level]) {
		// increase of 25 if the submission is correct
		count = count + 25;
		// change the innerHTML of the id "counter" in the score section
		document.getElementById("counter").innerHTML = count;
		// show alert box for correct answer
		alert("Hey, Player! You got it right! The answer is " + answers[level]);
		return true;
}	
	// if the current entry is incorrect, return false
	// show alert box for incorrect
	alert("Please try again!");
	return false;
}

///////////////////////////////////////////////////////////////////////////////
// To add images

function addimages(level) {
	$("#imgSmall").empty(); // clear the #imgSmall div
	var dir = "./img/level" + level + "/"; // url to retrieve photos and imgs

	// add image elements
	for (var i = 1; i <= 2; ++i) {
		var imagelocation = dir + i + ".jpg" ; // specifies that images must be in .jpg [does not accept .png or other types]
		$("#imgSmall").append("<img src=" + imagelocation + " class='imagehint'>");
	}
	$("#imgSmall").append("<br>");
	for (var i = 3; i <= 4; ++i) {
		var imagelocation = dir + i + ".jpg" ;
		$("#imgSmall").append("<img src=" + imagelocation + " class='imagehint'>");
	}
}

///////////////////////////////////////////////////////////////////////////////
// To add blanks

function addblanks(level) {
	$("#blanks").empty(); // clear the #blanks div
	var answer = answers[level];
	for (var i = 0; i < answer.length; ++i) {
		$("#blanks").append("<span class='blank' onclick='deselect(\"" + i + "\")'>_</span>"); // helps deselect a character when clicked
		blanks[i] = null;
	}

	// add a hint button
	// change style of hint icon by changing i class
	$("#blanks").append("<div id='hintbutton' onclick='hint(" + level + ")'><i class='fas fa-lightbulb' style='font-size: 60px;'></i><br><span id='hintsNum'></span></div><br><br>")
	$("#hintsNum")[0].innerHTML = hintsNum + " hint(s) remaining"; // indicates the remaining number of hints for the specific level
}

///////////////////////////////////////////////////////////////////////////////
// To add options

function addoptions(level) {
	 // create a string containing the answer mixed with random alphabets
	var s = createstring(level);
	for (var i = 0; i < 18; ++i) {
		letters[i] = s[i];
	}
	$("#letters").empty(); // empty the #letters div
	// add elements to the #letters div
	for (var i = 0; i < 9; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
	$("#letters").append("<br>");
	for (var i = 9; i < 18; ++i)
		$("#letters").append("<span class='letter' onclick='addletter(\"" + s[i] + "\", " + i + ")'>" + s[i] + "</span>");
}

// random shuffling
String.prototype.shuffle = function() {

	var that = this.split("");
	var len = that.length, t, i;
	while(len) {
		i = Math.random() * len-- | 0;
		t = that[len], that[len] = that[i], that[i] = t;
	}
	return that.join("");
}

/*
creates string by padding the answer string with
random letter that are not already in the answer
string. Then returns the shuffled string in the end.
*/
function createstring(level) {
	var answer = answers[level];
	var numberremaining = 18 - answer.length;
	var s = answer;
	var alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var possible = "";
	for (var i = 0; i < alphabets.length; ++i) {
		if (answer.indexOf(alphabets[i]) == -1)
			possible += alphabets[i];
	}
	possible = possible.shuffle();
	for (var i = 0; i < numberremaining; ++i)
		s += possible[i];
	s = s.shuffle();
	return s;
}

///////////////////////////////////////////////////////////////////////////////

// updates the entry variable which stores
// the characters that are in the current level's answer
// but not in the current submission by the user.
// entry [blanks] will be used to add hints
function updateentry() {
	var answer = answers[current];
	var s = "";
	$(".blank").each(function(item, element){
		var xxx = element.innerHTML;
		if (xxx === "_" || xxx != answer[item]) {
			s += answer[item];
		}
	});
	entry = s;
}

///////////////////////////////////////////////////////////////////////////////
// adding letters to the entry

function allfilled() {
	// check if all blanks are currently filled
	var isempty = false;
	$(".blank").each(function(item, element) {
		if (element.innerHTML == "_")
			isempty = true;
	});

	return !isempty;
}

function findfirstvacant() {
	// functions to find the first empty blank to add the clicked letters [first container to be recognized as blank]
	var returnElement;
	var index;
	var blanks = document.getElementsByClassName("blank");
	for (var i = 0; i < blanks.length; ++i) {
		if (blanks[i].innerHTML == "_") {
			index = i;
			returnElement = blanks[i];
			break;
		}
	}
	// return the first empty html element(of class blank) and the index
	// of that element in the array containing elements of class blank
	return [returnElement, index];
}

function addletter(letterAdd, index) {
	// function to add letter to the current submission
	// called when one of the letters in the list of alphabets is clicked
	if (options[index] == false) {
		// if letter is already used, do nothing and return
		return;
	}
	else {
		// find first empty blank
		// functions to recognize an empty blank
		// able to store new character when letter is clicked
		var vacant = findfirstvacant();
		var element = vacant[0];
		var elindex = vacant[1];

		element.innerHTML = letterAdd; // changes the item inside an empty blank
		options[index] = false; // mark the clicked option as false

		// set onclick to null and change styles
		$(".letter")[index].onclick = null;
		$(".letter")[index].style.cursor = "not-allowed";
		$(".letter")[index].style.background = "green";

		// store a reference to the letter option which was clicked to add
		// to this(first empty) blank. This will be used to deselect this option
		blanks[elindex] = index;
		updateentry(); // update the entry variable
		tempfreq[letterAdd] += 1;

		// if all blanks have been filled check whether the submission
		// is correct or not. 
		// Call nextmove(). to proceed to new level
		if (allfilled())
			nextmove();
	}
}

///////////////////////////////////////////////////////////////////////////////
// Deselection of a character

function deselect(elindex) {
	// function to deselect a letter option by clicking on the
	// corresponding blank
	if ($(".blank")[elindex].innerHTML == "_") {
		// if the clicked blank is already blank ("_")
		return;
	}

	var removeLetter = $(".blank")[elindex].innerHTML;
	tempfreq[removeLetter] -= 1; // reduce the freq count by one [decrement]
	$(".blank")[elindex].innerHTML = "_"; // .blank element's innerHTML
	var index = blanks[elindex]; // get index of the option to deselect
	options[index] = true; // enable the option
	$(".letter")[index].onclick = function() { // set onclick attribute
		addletter(letters[index], index);
	};
	// set the styles of the deselected option
	$(".letter")[index].style.cursor = "pointer"; // pointer/cursor 
	$(".letter")[index].style.background = "#222"; // change color of the letter boxes here
	$(".blank").css("color", "black"); // color of blanks [empty]
	updateentry(); // update entry variable
}

///////////////////////////////////////////////////////////////////////////////
// Next Moves

function nextmove() {
	if (checkifcorrect(current)) {
		// if current submission is correct

		if (current === levels) {
			// if the answer for the last level is correct
			// redirect to congratulations page
			window.location = "end.html"; // once levels have been completed, proceed to end.html for extra remarks
		}

		// show next level
		current++;
		entry = answers[current];

		// reset everything
		// reset levels and starts the game from the beginning
		options = {
			0 : true, 1 : true, 2 : true, 3 : true, 4 : true, 5 : true, 6 : true, 7 : true, 8 : true, 9 : true, 10 : true, 11 : true, 12 : true, 13 : true, 14 : true, 15 : true, 16 : true, 17 : true
		}

		blanks = {
		}

		letters = {
		}

		hintsNum = 2;
		main(); // call main to update images, blanks and letter options when game restarts
	}

	else {
		// current submission is incorrect, mark incorrect.
		markincorrect(); // if final submission is incorrect, mark as incorrect w/o proceeding to end.html
	}
}


function markincorrect() {
	// set color to red when submission is incorrect
	$(".blank").css("color", "red"); // change the color *optional: for styling*
}

///////////////////////////////////////////////////////////////////////////////
// HINT
// add hint letter to certain position [position in the answer/item]

function findLetter(letter) {
	// function to return the index of the letter option element
	// which will be marked as selected when the hint letter is added
	var index;
	$(".letter").each(function(item, element) {
		if (element.innerHTML == letter) {
			index = item;
		}
	});
	return index;
}

function getRandomLetter() {
	// function to get one letter from the entry string
	// this letter is chosen at random
	var position = Math.floor(Math.random() * entry.length); // randomn index [position]
	var letter = entry.charAt(position); // get character at index position [specified]

	// remove this letter from the entry string
	entry = entry.substr(0, position) + entry.substr(position + 1, entry.length);
	var pos; // store the index where the hint letter should be added
	var answer = answers[current]; // get current level's entry
	for (var i = 0; i < answer.length; ++i) {
		if (answer[i] == letter && $(".blank")[i].innerHTML != letter) {
			pos = i;
			break;
		}
	}

	return [letter, pos]; // return the hint letter and its position in the final answer string
}

function addhint(letterAdd, index, position) {
	// add hint from the hint letter at the specified position in the answer
	// marks the letter as selected in the list when hint is used
	var answer = answers[current];
	if (tempfreq[letterAdd] == frequency[letterAdd]) {
		/*
		if the hint letter appears the same number of times in both
		the current submission and the answer string, we need to remove
		one of these letter from the current submission (since we already
		know that one of the hint letter is not in its correct position
		in the current submission).
		*/
		var firstfound;
		for (var i = 0; i < answer.length; ++i) {
			if ($(".blank")[i].innerHTML == letterAdd) {
				firstfound = i;
				break;
			}
		}

		deselect(firstfound);
		tempfreq[letterAdd] -= 1;
	}

	// get the blank at index = position
	var element = $(".blank")[position];
	var elindex = position;

	if (element.innerHTML != "_")
		deselect(position);

	// add the hint letter in the blank [specified position]
	element.innerHTML = letterAdd;
	options[index] = false; // disable the letter option at the given index when hint is given
	$(".letter")[index].onclick = null; // disable the click event handler

	// the same code as addletter() method above that functions to add letter to the current submission
	// called when one of the letters in the list of alphabets is clicked
	$(".letter")[index].style.cursor = "not-allowed";
	$(".letter")[index].style.background = "green"; // color style of the given hint letter when used
	blanks[elindex] = index;
	$(".blank")[elindex].onclick = null;
	$(".blank")[elindex].style.cursor = "not-allowed";
	tempfreq[letterAdd] += 1; // increment
	if (allfilled())
		nextmove(); // calls on the next move
}

/////////////////////////////////////////////////////////////////////////////////
// WHEN HINTS ARE USED UP
function hint() {
	// function for adding hints
	if (hintsNum <= 0) {
		// if all hints were used, return
		return;
	}
	var grl = getRandomLetter(); // get the hint letter from entry string by randomizing the specified letter to be used
	var letter = grl[0];
	var position = grl[1];
	var index = findLetter(letter); // finding hint letter from the roster of letters
	hintsNum--; // decrement by one
	addhint(letter, index, position); // show hint
	$("#hintsNum")[0].innerHTML = hintsNum + " hint(s) remaining"; // change the innerHTML with the number of hints remaining
}

///////////////////////////////////////////////////////////////////////////////