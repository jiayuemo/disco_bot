function solve_anagram (arg1, anagram) {
	// the first arg is the anagram to solve
	let input_anagram = arg1;
	// navigate to possible_answers based on first letter
	// this structure of the dictionary of dictionaries is a bit difficult
	let firstletter = input_anagram[0];
	let index = 'anagram_'+firstletter;
	let possible_anagrams = anagram['anagram']['anagram'][firstletter][index];
	// list out possible anagrams that start with the first letter of user input
	// unique keys have been defined as unique anagrams in our data structure
	let possible_keys = Object.keys(possible_anagrams);

	// Promise code
	let anagram_promise = new Promise(function(resolve, reject) {

		// display arrays where answers will be populated
		let display_anagram = new Array();
		let display_solution = new Array();
		let display_location = new Array();
		let display_challenge = new Array();

		// Solving logic
		// loop through all possible_keys and seek the ones that match user input
		for (let i = 0; i <= possible_keys.length-1; i++) {
			if (possible_keys[i].substring(0,input_anagram.length) == input_anagram) {
				// if there is a match append information to solution display information
				display_anagram = display_anagram.concat(possible_keys[i]);
				display_solution = display_solution.concat(possible_anagrams[possible_keys[i]]['solution']);
				display_location = display_location.concat(possible_anagrams[possible_keys[i]]['location']);
				display_challenge = display_challenge.concat(possible_anagrams[possible_keys[i]]['challenge']);
			}
		}

		// we have something to display
		let solution = {
			display_anagram: display_anagram,
			display_solution: display_solution,
			display_location: display_location,
			display_challenge: display_challenge
		};
		resolve(solution);

	});
	// End of promise

	// Act on that promise - this return is the function's return
	return anagram_promise.then(function(result) {
		// this return is the promise syntax's return
		return {result};
	});

	// end of function
};


function solve_cipher (arg1, cipher) {
	// the first arg is the cipher to solve 
	let input_cipher = arg1;
	// navigate to possible_answers
	// simpler data structure compared to anagrams
	let possible_ciphers = cipher['cipher']['cipher'];
	// list out possible ciphers that start with the first letter of user input
	// unique keys have been defined as unique ciphers in our data structure
	let possible_keys = Object.keys(possible_ciphers);

	// Promise code
	let cipher_promise = new Promise(function(resolve, reject) {

		// display arrays where answers will be populated
		let display_cipher = new Array();
		let display_solution = new Array();
		let display_location = new Array();
		let display_challenge = new Array();

		// Solving logic 
		// loop through all possible_keys and seek the ones that match user input
		for (let i = 0; i <= possible_keys.length-1; i++) {
			if (possible_keys[i].substring(0,input_cipher.length) == input_cipher) {
				// if there is a match append information to solution display information
				display_cipher = display_cipher.concat(possible_keys[i]);
				display_solution = display_solution.concat(possible_ciphers[possible_keys[i]]['solution']);
				display_location = display_location.concat(possible_ciphers[possible_keys[i]]['location']);
				display_challenge = display_challenge.concat(possible_ciphers[possible_keys[i]]['challenge']);
			}
		}

		// we have something to display
		let solution = {
			display_cipher: display_cipher,
			display_solution: display_solution,
			display_location: display_location,
			display_challenge: display_challenge
		};
		resolve(solution);

	});
	// End of promise

	// Act on that promise - this return is the function's return
	return cipher_promise.then(function(result) {
		// this return is the promise syntax's return
		return {result};
	});

	// end of function
};

module.exports.solve = {
	anagram: solve_anagram,
	cipher: solve_cipher
};

