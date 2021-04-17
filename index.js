const Discord = require("discord.js"); //discord.js
const config = require("./config.json"); //config file
const fs = require("fs"); //file system

const commandsDesc = fs.readFileSync("commands.txt");
const insults = fs.readFileSync("insults.txt").toString(`utf-8`);
const insultsArray = insults.split(`&&&`);
const susASCII1 = fs.readFileSync("imposter1.txt").toString(`utf-8`);
const susASCII2 = fs.readFileSync("imposter2.txt").toString(`utf-8`);

const client = new Discord.Client(); //starts client
client.login(config.BOT_TOKEN); //grabs token from config.json and logs in

client.on("ready", function(ready) { //runs the following code when the bot is fully logged in and ready
    client.user.setActivity("?help", { //sets activity status
        "type": "PLAYING"
    });
    console.log("Bot is ready");
});

const database = JSON.parse(fs.readFileSync("database.json"));//grabs database from file
function save() {
    let backup = JSON.stringify(database); //you cant save an instance of an object (aka databse). You must convert it to JSON first
    setTimeout(function(){ //runs this code every 5 minutes.
         fs.writeFile("database.json", backup, function writeJSON(err) { //writes the database var to database.json
            if (err) {
                console.log(`Couldnt complete backup at ${Date.now()}`);
            } else {
                console.log(`Succesfully completed backup at ${Date.now()}`);
            } 
        });
        
    }, 360000); //5 minutes
    let a = 0
    if (a = 0) {
        save(); //reruns the code after its done, restarting the timer until next backup.
    }
};
save(); //runs function for the first time

client.on("message", function(message) { //sets event listener for messages sent in a server    
    if (message.author.bot) return; //checks if user is a bot, and returns nothing if true

    if (message.mentions.users.first() != null) { //checks if the message contains any mentions
        if (message.mentions.users.first().username == "BionicBot321" && message.mentions.users.first().bot == true) { //checks if the mentioned user has username "BionicBot321" and is a bot
            message.reply('What the fuck did you just fucking say about me, you little bitch? I will have you know I graduated top of my class in the Navy Seals, and I have been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I am the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You are fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that is just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you could not, you did not, and now you are paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You are fucking dead, kiddo.');
        };
    } //The guy who wrote the code above is an idiot
    
    let guild = message.guild.id; //guild = the guild id of the message
    if (!database.hasOwnProperty(guild)) {
        guild = "!default"; //if the guildid isnt in the database, default values are used instead.
    };

    if (!message.content.startsWith(database[guild].prefix)) return; //returns the function if it doesnt start with the prefix

    function sendMessage(messageContent) {
        if (content = undefined) return;
        message.channel.send(messageContent);
    };

    const commandBody = message.content.slice((database[guild].prefix).length);
    const args = commandBody.split(` `);
    const command = args.shift().toLowerCase();

    switch(command) {
        case "ping":
            message.reply("beep boop I am working");
        break;
        case "sum":
            const numArgs = args.map(x => parseFloat(x));
            const sum = numArgs.reduce((counter, x) => counter += x);
            message.reply(`the sum of the arguments you provided is ${sum}!`);
        break;
        case "69":
            message.reply(`<:PogU:797801524737736724> ***N I C E*** <:PogU:797801524737736724>`);
        break;
        case "random":
            if (args === undefined) {
              message.reply(Math.floor((Math.random() * 10) + 1));  
            } else {
                let min = parseFloat(args[0]);
                let max = parseFloat(args[1]);
                message.reply(Math.floor(Math.random() * (max - min + 1) + min));//allows for mins other than 1, and more complex sets of min/max values
            };
        break;
        case "annoyme":
            let i;
            for (i=0; i < 10; i++) {
                message.reply(`Is this annoying?`);
            };
        break;
        case "annoy":
            if (message.mentions.users.first() == null) {
                sendMessage("you must mention someone to annoy them");
                return;
            };
            let channel = message.channel;
            let annoyUser = message.mentions.users.first();
            annoyUser = annoyUser.id;
            let I;
            for (I=0; I < 10; I++) {
                channel.send("<@" + annoyUser + ">");
            };
        break;
        case "help":
            sendMessage(`**If I was just added to your server, please get an admin to run the "setup" command**\n\n${commandsDesc}`);
        break;
        case "setup":
            if (message.member.hasPermission("ADMINISTRATOR")) {
                if (database.hasOwnProperty(guild)) {
                    sendMessage("Setup has already been completed")
                    return;
                } else {
                    database[guild] = {
                        "prefix": "?"
                    };
                sendMessage("Setup is now complete. You can now change custom settings for your server.");
                };
            } else return;
        break;
        case "changeprefix":
            if (message.member.hasPermission("ADMINISTRATOR")) {
                database[guild]["prefix"] = args[0];
                sendMessage("Prefix changed successfully")
            } else {
                sendMessage("Only administrators can use this command")
            };
        break;
        case "revertprefix":
            if (message.member.hasPermission("ADMINISTRATOR")) {
                database[guild]["prefix"] = database["!default"]["prefix"];
            } else {
                sendMessage("Only administrators can use this command");
            }
        break;
        //default:
            //sendMessage(`That command is not recognised. Run the "help" command to see all availible commands`);
       //break;
        case "insult":
            if (message.mentions.users.first() == null) {
                sendMessage("you must mention someone to insult them");
                return;
            };
            let insultedUser = message.mentions.users.first();
            if (insultedUser.id === message.author.id) {
                sendMessage("You shouldnt insult yourself.");
                return;
            }
            let insultNumber = Math.floor((Math.random() * insultsArray.length) + 1) - 1;
            sendMessage("Hey <@" + insultedUser.id + ">, " + insultsArray[insultNumber]);
        break;
        case "voteout":
            if (message.mentions.users.first() == null) {
                sendMessage("You must mention the sus imposter to vote them out!");
                return;
            }
            let susUser = message.mentions.users.first();
            sendMessage(susASCII1 + `　ﾟ　　 <@${susUser.id}> was An Impostor.　 。\n` + susASCII2);
        break;
    };
});
