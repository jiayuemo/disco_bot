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
	part: 'snippet',
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

			// Create functions
			// https://stackoverflow.com/questions/41020872/javascript-promises-chain-same-promise-n-times-then-do-something-else
/*			function createmsg(content) {
				let query = new Promise(function(resolve,reject) {
					let keywords = content[0]['keywords'];
					ytsearch(keywords, ytsearch_options, function(err, search_results) {
					  	if(err) return console.log(err);
				  		// return the link for the video based on keyword
				  		let scrapped_link = search_results[0]['link'];
					  	let specific_display = {
					  		rank: this.content[0]['rank']
							title: this.content[0]['title'],
							artist: this.content[0]['artist'],
							keywords: keywords,
							link: scrapped_link
					  	};
					  	resolve(specific_display);
					});
				}).then(function (result) {
					// last promise in the chain - finally ready to disp data
					// extract information from the result obj and display on disco
					let kpop_embed = new discord.RichEmbed()
						.addField('Rank', result['rank'], true)
						.addField('Title', result['title'], true)
						.addField('Artist', result['artist'], true);
					message.channel.send(kpop_embed);
					message.channel.send(result['link']);
				});
				// END OF PROMISE CHAIN;
				return query;
			};

			function createmultiplemsg(current_iteration,target_iteration,all_content) {
				if (current_iteration == target_iteration) {
					return Promise.resolve(); // finally done with every iteration
				}
				return createmsg(specific_content).then(function() {
					return createmultiplemsg(current_iteration+1, 5, content);
				})
			};*/

			

			// utilize melon-chart-api to recieve a jspromise of rankings
			// https://github.com/hyunchel/melon-chart-api
			let top5 = melon(today, { cutLine: 5 }).daily();
			top5.then(function(chartData) {
				let data = chartData['data'];
				let all_content = new Array();
				for (i=0; i<=data.length-1; i++) {
					all_content = all_content.concat({
						rank: data[i]['rank'],
						title: data[i]['title'],
						artist: data[i]['artist'],
						keywords: data[i]['title']+' by '+data[i]['artist']
					});
					if (i==data.length-1) {
						return new Promise(function(resolve, reject){
							resolve(all_content);
						});
					}
				};
			}).then(function(all_content) {
				// iterator then, where we implement our functions
				// createmultiplemsg is the function that manages our "loop"
				function createmultiplemsg(current_iteration,target_iteration,all_content) {
					if (current_iteration == target_iteration) {
						return Promise.resolve(); // finally done with every iteration
					}
					// more iterations to come
					return createmsg(all_content[current_iteration]).then(function() {
						return createmultiplemsg(current_iteration+1, 5, all_content);
					})
				};
				// createmsg is the single function that api req yt and prints msg
				function createmsg(content) {
					let query = new Promise(function(resolve,reject) {
						let keywords = content['keywords'];
						ytsearch(keywords, ytsearch_options, function(err, search_results) {
						  	if(err) return console.log(err);
					  		// return the link for the video based on keyword
					  		let scrapped_link = search_results[0]['link'];
						  	let specific_display = {
						  		rank: content['rank'],
								title: content['title'],
								artist: content['artist'],
								keywords: keywords,
								link: scrapped_link
						  	};
						  	resolve(specific_display);
						});
					}).then(function (result) {
						// last promise in the chain - finally ready to disp data
						// extract information from the result obj and display on disco
						let kpop_embed = new discord.RichEmbed()
							.addField('Rank', result['rank'], true)
							.addField('Title', result['title'], true)
							.addField('Artist', result['artist'], true);
						message.channel.send(kpop_embed);
						message.channel.send(result['link']);
					});
					// END OF A SINGLE PROMISE CHAIN
					return query;
				};
				// end of functions implementation
				console.log(all_content[0]);
				createmultiplemsg(0,5,all_content).then(function(){
					console.log('Finally done');
				});

			});


			// Because we want five sets of messages displayed
			// wrap our promise chain in a for loop which iterates 5 times
/*			for (i=0; i <= 4; i++) {
				console.log(i);
				// BEGIN of promise chain
				top5.then(function(chartData) {
					let data = chartData['data'];
					let keywords = data[i]['title']+' by '+data[i]['artist'];
					return new Promise(function(resolve, reject){
						ytsearch(keywords, ytsearch_options, function(err, search_results) {
					  		if(err) return console.log(err);
					  		// return the link for the video based on keyword
					  		let scrapped_link = search_results[0]['link'];
						  	let specific_display = {
						  		rank: data[i]['rank'],
								title: data[i]['title'],
								artist: data[i]['artist'],
								keyword: keywords,
								link: scrapped_link
						  	};
						  	console.log(specific_display);
						  	resolve(specific_display);
						});
					});
				}.bind(this))*//*.then(function (result) {
					// last promise in the chain - finally ready to disp data
					// extract information from the result obj and display on disco
					let kpop_embed = new discord.RichEmbed()
						.addField('Rank', result['rank'], true)
						.addField('Title', result['title'], true)
						.addField('Artist', result['artist'], true);
					message.channel.send(kpop_embed);
					message.channel.send(result['link']);
				});
				// END OF PROMISE CHAIN
			};*/

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