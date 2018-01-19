const discord = require('discord.js');
const melon = require('melon-chart-api');
const moment = require('moment');
const bot = new discord.Client();
const anagram = require('./anagrams/module_anagram');
const cipher = require('./ciphers/module_cipher');
const TOKEN = require('./config');

const PREFIX1 = 'kpop ';
const PREFIX2 = 'osrs ';
const osrs = require('./osrs');

const SECRET = TOKEN.TOKEN;

// function to run on bot startup
bot.on('ready', function() {
	console.log('GFS_bot running');
});

// event listenser, function(messsage) is the callback function with input messages
bot.on('message', function(message) {

	if (message.content.startsWith(PREFIX1)) {
		// Korean music code

		// create an array list of args delinated by spaces after our prefix
		let args = message.content.substring(PREFIX1.length).split(" ");
		if (args[0].toLowerCase() == 'chart') {

			// get the date of today
			let today = moment(new Date()).format('MM/DD/YYYY');

			// utilize melon-chart-api to recieve a jspromise of rankings
			// https://github.com/hyunchel/melon-chart-api
			let top5 = melon(today, { cutLine: 5 }).daily();

			// act on the promise
			top5.then(function(chartData) {
				let disp = chartData['data'];
				// loop through the data and build embeds
				for (i=0; i <= disp.length-1; i++) {
					// extract information from the object to a variable
					let kpop_embed = new discord.RichEmbed()
						.addField('Rank', disp[i]['rank'], true)
						.addField('Title', disp[i]['title'], true)
						.addField('Artist', disp[i]['artist'], true);
					// display the information
					message.channel.send(kpop_embed);
				}
			});
			// end of kpop chart disp
		} else {
			message.channel.send('Invalid command');
		}
	}
	

	if (message.content.startsWith(PREFIX2)) {
		// osrs code
		// create a substring starting from right after our prefix ends
		// create an array list of args from this substring delinated by periods
		// not using spaces as deliminters because most anagram and cipher contain spaces
		let args = message.content.substring(PREFIX2.length).split(".");
		if ((args[0].toLowerCase() == 'a') || (args[0].toLowerCase() == 'c')) {
			// zeroth argument is valid
			if (args[1]) {		
				// first argument exists
				if (args[0].toLowerCase() == 'a') {
					// solve for an anagram
					let clue = args[1].toLowerCase();
					let valid_start = anagram['anagram']['valid_start'];
					// iterate through and try to find a solution
					for (let i = 0; i <= valid_start.length-1; i++) {
						if (clue[0] == valid_start[i]) {
							// the first letter matches the first letter of a set of anagrams
							// solve the anagram using a promise
							let anagram_solution = new Promise(function(resolve, reject) {
								// run the function 
								let solved = osrs.solve.anagram(args[1].toLowerCase(), anagram);
								// resolve it after 1 sec
								setTimeout(function () {
									resolve(solved);
								},1000);
							});
							
							// act on the promise
							anagram_solution.then(function(result) {
								// extract information from the object to a variable
								let anagram_embed = new discord.RichEmbed()
									.setTitle('Here is your anagram solution')
									.addField('User Input', clue)
									.addField('Anagrams', result['result']['display_anagram'], true)
									.addField('Solutions', result['result']['display_solution'], true)
									.addField('Locations', result['result']['display_location'], true)
									.addField('Challenges', result['result']['display_challenge']);
								// display the information
								message.channel.send(anagram_embed);
								// end of solving anagram
							});

							// end the loop we are done
							break;
						} else {
							if (i == valid_start.length-1) {
								// no match has been found on last iteration
								message.channel.send('No anagrams start with that letter');
							} else {
								// no match has been found but there are more iterations 
								continue;
							}
						}
					}
					// END OF ANAGRAM solve
				} else {
					// solve for a cipher 
					let clue = args[1].toLowerCase();
					let valid_start = cipher['cipher']['valid_start'];
					// iterate through and try to find a solution
					for (let i = 0; i <= valid_start.length-1; i++) {
						if (clue[0] == valid_start[i]) {
							// the first letter matches the first letter of a cipher
							// solve the cipher using a promise
							let cipher_solution = new Promise(function(resolve, reject) {
								// run the function
								let solved = osrs.solve.cipher(args[1].toLowerCase(), cipher); 
								// resolve it after 1 sec
								setTimeout(function () {
									resolve(solved);
								},1000);
							});

							// act on the promise
							cipher_solution.then(function(result) {
								// extract information from the object to a variable
								let cipher_embed = new discord.RichEmbed()
									.setTitle('Here is your cipher solution')
									.addField('User Input', clue)
									.addField('Ciphers', result['result']['display_cipher'], true)
									.addField('Solutions', result['result']['display_solution'], true)
									.addField('Locations', result['result']['display_location'], true)
									.addField('Challenges', result['result']['display_challenge']);
								// display the information
								message.channel.send(cipher_embed);
								// end of solving anagram
							});
							
							// end the loop we are done
							break;
						} else {
							if (i == valid_start.length-1) {
								// no match has been found on last iteration
								message.channel.send('No ciphers start with that letter');
							} else {
								// no match has been found but there are more iterations 
								continue;
							}
						}
					}
					// END OF CIPHER solve
				}
			} else {
				message.channel.send('Need 2nd argument, ironman btw');
			}
		} else {
			message.channel.send('Invalid command, ironman btw');
		}
	}

});

bot.login(SECRET);