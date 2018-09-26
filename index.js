function shuffle(array) {
	          var currentIndex = array.length, temporaryValue, randomIndex;

	          while (0 !== currentIndex) {
			                randomIndex = Math.floor(Math.random() * currentIndex);
			                currentIndex -= 1;
			                temporaryValue = array[currentIndex];
			                array[currentIndex] = array[randomIndex];
			                array[randomIndex] = temporaryValue;
			            }

	          return array;
}

function standup_list() {
	        var arr = ['phil', 'scott h', 'charlie', 'jon', 'aaron', 'tom', 'wilson', 'aj', 'john k', 'jesse', 'manoj', 'clyde', 'will', 'david', 'peter'];
	        arr = shuffle(arr);
	        console.log(arr.join(","));
	        return arr.join(", ");
}

function tih() {
	var request = require("request");
    var url = "https://www.history.com/this-day-in-history/rss";
       request(url, function(err, res, body) {
	   return(body)
	});     
}

function onInstallation(bot, installer) {
    if (installer) {
        bot.startPrivateConversation({user: installer}, function (err, convo) {
            if (err) {
                console.log(err);
            } else {
                convo.say('I am a bot that has just joined your team');
                convo.say('You must now /invite me to a channel so that I can be of use!');
            }
        });
    }
}

/**
 * Configure the persistence options
 */

var config = {};
if (process.env.MONGOLAB_URI) { var BotkitStorage = require('botkit-storage-mongo');
    config = {
        storage: BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
    };
} else {
    config = {
        json_file_store: ((process.env.TOKEN)?'./db_slack_bot_ci/':'./db_slack_bot_a/'), //use a different name if an app or CI
    };
}

/**
 * Are being run as an app or a custom integration? The initialization will differ, depending
 */

if (process.env.TOKEN || process.env.SLACK_TOKEN) {
    //Treat this as a custom integration
    var customIntegration = require('./lib/custom_integrations');
    var token = (process.env.TOKEN) ? process.env.TOKEN : process.env.SLACK_TOKEN;
    var controller = customIntegration.configure(token, config, onInstallation);
} else if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.PORT) {
   console.log(process.env.CLIENT_ID);
    //Treat this as an app
    var app = require('./lib/apps');
    var controller = app.configure(process.env.PORT, process.env.CLIENT_ID, process.env.CLIENT_SECRET, config, onInstallation);
} else {
    console.log('Error: If this is a custom integration, please specify TOKEN in the environment. If this is an app, please specify CLIENTID, CLIENTSECRET, and PORT in the environment');
    process.exit(1);
}


/**
 * A demonstration for how to handle websocket events. In this case, just log when we have and have not
 * been disconnected from the websocket. In the future, it would be super awesome to be able to specify
 * a reconnect policy, and do reconnections automatically. In the meantime, we aren't going to attempt reconnects,
 * WHICH IS A B0RKED WAY TO HANDLE BEING DISCONNECTED. So we need to fix this.
 *
 * TODO: fixed b0rked reconnect behavior
 */
// Handle events related to the websocket connection to Slack
controller.on('rtm_open', function (bot) {
    console.log('** The RTM api just connected!');
});

controller.on('rtm_close', function (bot) {
    console.log('** The RTM api just closed');
    // you may want to attempt to re-open
});


/**
 * Core bot logic goes here!
 */
// BEGIN EDITING HERE!

controller.on('bot_channel_join', function (bot, message) {
    bot.reply(message, "I'm here!")
});

controller.hears('hello', 'direct_message', function (bot, message) {
    bot.reply(message, 'Hello!');
});

controller.hears("weekend", 'ambient', function(bot, message) {
    bot.reply(message, "WEEKEND!!!! YEAH!!! :taco: and :beer:");
});

controller.hears("monday", 'ambient', function(bot, message) {
    bot.reply(message, "Mondays are horrible, so have some more :Coffee:!");
});

controller.hears("today in history", 'ambient', function(bot, message) {
	var request = require("request");
	var striptags = require("striptags");
        var url = "https://www.history.com/this-day-in-history/rss";
        request(url, function(err, res, body) {
		var parser = require('xml2json');
		var json = parser.toJson(body);
		var parsedJson = JSON.parse(json);
		var rss = parsedJson.rss;
		var channel = rss.channel;
		var title = channel.item.title + "\n";
		var description = channel.item.description;
		if (description.length > 140) {
			var resultarray = description.split("</p>");
		        var link = "Want to know more? https://www.history.com/this-day-in-history";
			var result = resultarray[0] + "\n " + link; 
			bot.reply(message, title + striptags(result));
		} else {
	       		bot.reply(message, title + striptags(description)); 
		}
	});
});

controller.hears("tuesday", 'ambient', function(bot, message) {
    bot.reply(message, ":taco::taco::taco::taco::taco::taco::taco::taco::taco:");
});

controller.hears("Vacation", 'ambient', function(bot, message) {
    bot.reply(message, "Just make sure you come back.");
});

controller.hears("Flexion", 'ambient', function(bot, message) {
    bot.reply(message, "Flexion, Value Forward!");
});

controller.hears(
	    ['hello', 'hi', 'greetings'],
	    ['direct_mention', 'mention', 'direct_message'],
	        function(bot,message) {
		        bot.reply(message,'Hello!');
			    }
);


controller.hears(["standup_list"], ['ambient'], function(bot, message) {
	list = standup_list();
	console.log(list);
	bot.reply(message, list);
});

controller.hears(
	    ['tableflip'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "http://tableflipper.com/IRX2.gif");
});


controller.hears(
	    ['fistbump'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "https://gph.is/2aYNzSb");
});


controller.hears(
	    ['love coffee'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "https://gph.is/19womaE");
});

controller.hears(
	    ['taco'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "http://gph.is/2961YfG");
});

controller.hears(
	    ['cowbell'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "http://gph.is/1a6B565");
});

controller.hears(
	    ['beer'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "https://gph.is/XKR6Yn");
});


controller.hears(
	    ['awesome'], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "Team Awesome Sauce, brought to you by :coffee: and :beer:");
});


controller.hears(
	    ['free bird', "freebird"], ['ambient'], 
	        function(bot, message) {
			bot.reply(message, "AND THIS :bird: YOU CANNOT CHANGE!!!! ");
});

controller.hears(
	    ['flexibot help'], ['ambient'],
		function(bot, message) {
			bot.reply(message, "to save type 'flexibot save urls name url', to list urls type 'flexibot list urls'  "); 
});

controller.hears(
	    ['roll'], ['ambient'],
	        function(bot, message) {
			var roll_var = message.text.split(" ");
			var dice = roll_var[1];
			var Roll = require('roll'),
			roll = new Roll();
			var Die = roll.roll(dice);
			console.log(Die.result);
});



controller.hears(
	    ['flexibot save'], ['ambient'],
		function(bot, message) {
			var ta = message.text.split(" ");
			var type = ta[2];
			var name = ta[3];
			var item = ta[4];
			console.log("logging info type:" + type + ", item:" + item + ", name: " + name);
			var json_to_store="{ \"item\": \"" + item + "\" , \"name\": \"" + name + "\"}";
			var MongoClient = require('mongodb').MongoClient;
			var url = "mongodb://localhost:27017/";
			MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
				  console.log("Connected correctly to server");
				  if (err) throw err;
				  var dbo = db.db("flexibot");
				  dbo.collection(type).insertOne(JSON.parse(json_to_store), function(err, res) {
					      if (err) throw err;
					      	console.log("1 document inserted");
					      db.close();
				    });
			});
			console.log("JSON: " + json_to_store);
			bot.reply(message, "Flexibot has stored item of type: " + type);
});


controller.hears(
	    ['flexibot list'], ['ambient'],
	        function(bot, message) {
			var ta = message.text.split(" ");
			var type = ta[2];
			console.log("type is " + type);
			var MongoClient = require('mongodb').MongoClient;
			assert = require('assert');
			var url = "mongodb://localhost:27017/";
			MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
				console.log("Connected correctly to server");
				if (err) throw err;
				var dbo = db.db("flexibot");
				dbo.collection(type).find().toArray(function( err, results) {
					assert.equal(err, null);
					assert.notEqual(results.length, 0);
					results.forEach(function(result) {
						console.log( result.name + "," + result.item ); 
						bot.reply(message, "url: " + result.item + ", name: " + result.name)
					});
				});
			});
});


controller.hears(
	    ['flexibot dbtest'], ['ambient'],
                function(bot, message) {
			var MongoClient = require('mongodb').MongoClient;
			var url = "mongodb://localhost:27017/";
			MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			      console.log("Connected correctly to server");
			      bot.reply(message, "Connected to DB");
			});
});

controller.hears(
	    ['flexibot remind me'], ['ambient'],
                function(bot, message) {
			var ta = message.text.split(" ");
			var type = ta[3];
			var name = ta[4];
		        var MongoClient = require('mongodb').MongoClient;
			assert = require('assert');
			var url = "mongodb://localhost:27017/";
			MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
			           console.log("Connected correctly to server");
			           if (err) throw err;
			           var dbo = db.db("flexibot");
				   var query = " { \"name\": \"" + name + "\"} "
				   var fields = "{ \"name\": true }";
				   console.log(query);
				   dbo.collection(type).find(JSON.parse(query) , [fields]).toArray( function (err, results) {
					   assert.equal(err, null);
					   assert.notEqual(results.length, 0);
					   results.forEach(function(result) {
						   console.log (result.name + "," + result.item );
					   	   bot.reply(message, result.item)
					   });
				   });
			});
});

controller.hears(
	    ['wisconsin'], ['ambient'],
	        function(bot, message) {
			bot.createConversation(message, function(err, convo) {
			    // create a path for when a user says YES
			    convo.addMessage({
			        text: 'You said yes! How wonderful.',
				},'yes_thread');
				
				// create a path for when a user says NO
				convo.addMessage({
				      text: 'You said no, that is too bad.',
				},'no_thread');
			
			        // create a path where neither option was matched
				// this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
				    convo.addMessage({
				          text: 'Sorry I did not understand.',
				          action: 'default',
				          },'bad_response');

				// Create a yes/no question in the default thread...
				convo.addQuestion('Do you like cheese?', [
				     {
				       pattern: 'yes',
				       callback: function(response, convo) {
				convo.gotoThread('yes_thread');
				     },
				     },
				      {
				            pattern: 'no',
				   callback: function(response, convo) {
				convo.gotoThread('no_thread');
				     },
				      },
				 {
				         default: true,
				 callback: function(response, convo) {
				       convo.gotoThread('bad_response');
				         },
				       }
				 ],{},'default');

                                     convo.activate();
                             });
                     });



/**
 * AN example of what could be:
 * Any un-handled direct mention gets a reaction and a pat response!
 */
controller.on('direct_message,mention,direct_mention', function (bot, message) {
    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function (err) {
        if (err) {
            console.log(err)
        }
        bot.reply(message, 'I heard you loud and clear boss.');
    });
});

controller.middleware.receive.use(function(bot, message, next) {
     console.log('RECEIVED: ', message);
     message.logged = true;
     next();
});
controller.middleware.send.use(function(bot, message, next) {
     console.log('SENT: ', message);
     message.logged = true;
     next();
});






