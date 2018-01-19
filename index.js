const discord = require('discord.js');
const melon = require('melon-chart-api');
const moment = require('moment');
const ytsearch = require('youtube-search');
const bot = new discord.Client();
const anagram = require('./anagrams/module_anagram');
const cipher = require('./ciphers/module_cipher');
const TOKEN = require('./config');

const PREFIX1 = 'kpop ';
const PREFIX2 = 'osrs ';
const osrs = require('./osrs');

const DISCORD_SECRET = TOKEN.TOKEN.DISCORD_TOKEN;
const ytsearch_options = {
	maxResults: 1,
  	key: TOKEN.TOKEN.YOUTUBE_KEY
};

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
				let data = chartData['data'];
				// loop through the data and populate these arrays
				let display_rank = new Array();
				let display_title = new Array();
				let display_artist = new Array();
				let keywords = new Array();
				for (i=0; i <= data.length-1; i++) {
					display_rank = display_rank.concat(data[i]['rank']);
					display_title = display_title.concat(data[i]['title']);
					display_artist = display_artist.concat(data[i]['artist']);
					keywords = keywords.concat(data[i]['title']+' by '+data[i]['artist']);
				}
				return new Promise(function(resolve, reject){
					// resolve the three arrays after 1 s
					setTimeout(function() {
						let display_data = {
							rank: display_rank,
							title: display_title,
							artist: display_artist,
							keywords: keywords
						};
						resolve(display_data);
					}, 1000)
				});
			}).then(function (result) {
				// continue the chain of promises
				// loop through data and populate this array
				let youtube_link = new Array();
				let keywords = result['keywords'];
				for (i=0; i<= keywords.length-1; i++) {
					// find the youtube link based on title and artist
					ytsearch(keywords[i], ytsearch_options, function(err, results) {
					  // return the link for the video based on keywords and concat to array
					  // IMPORTANT THIS RESULTS ISNT REALTED TO OUR PROMISE CHAIN
					  console.log(results);
					  let scrapped_link = results[0]['link'];
					  console.log(scrapped_link);
					  youtube_link = youtube_link.concat(scrapped_link);
					});
				}
				return new Promise(function(resolve, reject) {
					// resolve the youtube links array after 2 s
					setTimeout(function() {
						console.log(youtube_link);
						console.log(keywords);
						let display_data = {
							rank: result['rank'],
							title: result['title'],
							artist: result['artist'],
							keywords: keywords,
							link: youtube_link
						};
						resolve(display_data)
					}, 5000)
				});
			}).then(function (result) {
				// last promise in the chain - finally ready to disp data
				let rank = result['rank'];
				for (i=0; i<= rank.length-1; i++) {
					// extract information from the result obj and display on disco
					let kpop_embed = new discord.RichEmbed()
						.addField('Rank', result['rank'][i], true)
						.addField('Title', result['title'][i], true)
						.addField('Artist', result['artist'][i], true);
					message.channel.send(kpop_embed);
					message.channel.send(result['link'][i]);
				}
			});
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

bot.login(DISCORD_SECRET);