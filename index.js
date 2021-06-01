const Discord = require("discord.js"); //discord.js
const config = require("./config.json"); //config file
const fs = require("fs"); //file system
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Read strings from file

const commandsDesc = fs.readFileSync("commands.txt");
const changelog = fs.readFileSync("changelog.txt");
const insults = fs.readFileSync("insults.txt").toString(`utf-8`);
const insultsArray = insults.split(`&&&`);
const susASCII1 = fs.readFileSync("imposter1.txt").toString(`utf-8`);
const susASCII2 = fs.readFileSync("imposter2.txt").toString(`utf-8`);

//Discord client defs 

const client = new Discord.Client(); //starts client
client.login(config.BOT_TOKEN); //grabs token from config.json and logs in 

client.on("ready", function(ready) { //runs the following code when the bot is fully logged in and ready
    client.user.setActivity("?help", { //sets activity status
        "type": "PLAYING"
    });
    console.log("Bot is ready");
});

//
//Runtime function definitions
//

function makeRequest(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest;
        xhr.open("GET", url);
        function resolvePromise () {
            //if (status == 200) { //status isnt defined anywhere. This throws an error and script ends without error message cuz node does node things
            resolve(JSON.parse(xhr.responseText));
            //} else {
            reject(); //not sure if this works. need to check
            //};
        };
        xhr.addEventListener("load", resolvePromise);
        xhr.send();
        
    });     
};

async function redditRequest(subreddit, postNumber) { //temporarily dont allow postFilters cuz i cba and im sick of this shit just make it stop please just make it stop im losing my fucking mind here please just make it stop
    //need to properly validate postFilter because it will matter later
    let postFilter = "top"; //TEMP - see above
    let redditURL = (`https://www.reddit.com/r/${subreddit}/${postFilter}.json`);
    let result = await makeRequest(redditURL);
    if (typeof postNumber == Number) {postNumber -= 1};
    if (postNumber == "r" || postNumber == "rand" || postNumber == "random" || postNumber == undefined || postNumber > 24 || postNumber < 0 || typeof postNumber != Number) {
        postNumber = (Math.floor((Math.random() * 25) + 1)) - 1;
    };
    let postData = result["data"]["children"][postNumber]["data"];
    if (postData.selftext == "") {
        return (`**${postData.title}**:\n\n${postData.url}`);
    } else if (postData.hasOwnProperty("selftext")) { //only text posts have the selftext property.
        return (`**${postData.title}**:\n\n${postData.selftext}\n\n${postData.url}`);
    } else {
        return ("Unknow error. Please try again later");
    }; 
};

function calculate(calculationPassed) {
    let calculation = calculationPassed
    let calculationSplit = calculation.split(" ");
    calculation = calculationSplit.join();
    calculation = calculation.replace(/,/g, ""); // '/,/g' is regex for "match every occourence of ','"
    let total;
    let splitCalc; 
    try { 
    if (calculation.indexOf("**") > -1) {
        splitCalc = calculation.split("**");
        total = parseFloat(splitCalc[0]) ** parseFloat(splitCalc[1])
        return total;
    }; 
    if (calculation.indexOf("//") > -1) { //make else if to reduce compute load //dont do this bad idea.
        splitCalc = calculation.split("//");
        total = Math.pow(parseFloat(splitCalc[0]), 1/parseFloat(splitCalc[1]));
        return total;
    }; 
    if (calculation.indexOf("+") > -1) {
        splitCalc = calculation.split("+");
        total = parseFloat(splitCalc[0]) + parseFloat(splitCalc[1]);
        return total;
    };
    if (calculation.indexOf("-") > -1) {
        splitCalc = calculation.split("-");
        total = parseFloat(splitCalc[0]) - parseFloat(splitCalc[1]);
        return total;
    };
    if (calculation.indexOf("/" > -1)) { //I have no fucking clue why but this only works if placed above the multiply section
        splitCalc = calculation.split("/");
        total = parseFloat(splitCalc[0]) / parseFloat(splitCalc[1]);
        return total;
    };
    console.log("test8"); //doesnt get down here
    if (calculation.indexOf("*" > -1)) {
        splitCalc = calculation.split("*");
        total = parseFloat(splitCalc[0]) * parseFloat(splitCalc[1]);
        return total;
    };
    return 'INVALID CALCULATION. Do the "calchelp" command for help.';
    } catch (error) {
        console.log(error);
        return 'INVALID CALCULATION. Do the "calchelp" command for help.';
    };
};


const database = JSON.parse(fs.readFileSync("database.json"));
function save() {
    let backup = JSON.stringify(database);
    setTimeout(function(){
        fs.writeFile("database.json", backup, function writeJSON(err) {
            if (err) {
                console.log(`Couldnt complete backup at ${Date.now()}`);
            } else {
                console.log(`Successfully completed backup at ${Date.now()}`)
            }
        });
        save()
    }, 360000);
};
save();

//
//Message response def
//

client.on("message", function(message) { //sets event listener for messages sent in a server    
    if (message.author.bot) return; //checks if user is a bot, and returns nothing if true

    if (message.mentions.users.first() != null) { //checks if the message contains any mentions
        if (message.mentions.users.first().username == "bionicbot321" && message.mentions.users.first().bot == true) { //checks if the mentioned user has username "BionicBot321" and is a bot
            message.reply('What the fuck did you just fucking say about me, you little bitch? I will have you know I graduated top of my class in the Navy Seals, and I have been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I am the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You are fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that is just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you could not, you did not, and now you are paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You are fucking dead, kiddo.');
        }; //move this to a text file
    } //The guy who wrote the code above is an idiot
    
    let guild = message.guild.id; //guild = the guild id of the message
    if (!database.hasOwnProperty(guild)) {
        guild = "!default"; //if the guildid isnt in the database, default values are used instead.
    };

    if (!message.content.startsWith(database[guild].prefix)) return; //returns the function if it doesnt start with the prefix

    function sendMessage(messageContent) {
        if (content = undefined) return;
        message.channel.send(messageContent, { split: true });
    };

    function mention() {
        let mention = message.mentions.users.first()
        if (mention == null) return null;
        return mention;
    }

    function isAdmin() {
        let isAdmin = message.member.hasPermission("ADMINISTRATOR")
        if (isAdmin == true) return true;
        return false;
    }

    const commandBody = message.content.slice((database[guild].prefix).length);
    const args = commandBody.split(` `);
    const command = args.shift().toLowerCase();

    switch(command) {
        case "ping":
            sendMessage("beep boop I am working");
        break;
        case "sum":
            const numArgs = args.map(x => parseFloat(x));
            const sum = numArgs.reduce((counter, x) => counter += x);
            sendMessage(`the sum of the numbers you provided is ${sum}!`);
        break;
        case "69":
            sendMessage(`<:PogU:797801524737736724> ***N I C E*** <:PogU:797801524737736724>`);
        break;
        case "420":
            sendMessage("https://www.youtube.com/watch?v=U1ei5rwO7ZI");
        break;
        case "random":
            if (args === undefined) {
              sendMesssage("Your random number is: " + Math.floor((Math.random() * 10) + 1));  
            } else {
                let min = parseFloat(args[0]);
                let max = parseFloat(args[1]);
                sendMessage("Your random number is: " + Math.floor(Math.random() * (max - min + 1) + min));//allows for mins other than 1, and more complex sets of min/max values
            };
        break;
        case "annoyme":
            let i;
            for (i=0; i < 10; i++) {
                message.reply(`Is this annoying?`);
            };
        break;
        case "annoy+": //haven't even released this and I already regret making this
        if (mention() == null) {
            sendMessage("you must mention someone to annoy them");
            return;
        };
        let tempArgsTwo = args;
        let annoyNumber = tempArgsTwo[1]; //this will definitely need to be restricted or moved to a worker thread
        if (annoyNumber > 9999) {sendMessage("Wow you really hate them, huh! For the sake of everyone's sanity this command is capped at 9999")};
        tempArgsTwo.shift();
        tempArgsTwo.shift();
        let joinedArgsTwo = tempArgsTwo.join(" ")
        if (joinedArgsTwo != "") {
            for (let I=0; I < annoyNumber; I++) {
                sendMessage("<@" + mention().id + ">, " + joinedArgsTwo);
            };
        } else {
            for (let I=0; I < annoyNumber; I++) {
                sendMessage("<@" + mention().id + ">");
            };
        };
    break;
        case "annoy":
            if (mention() == null) {
                sendMessage("you must mention someone to annoy them");
                return;
            };
            let tempArgs = args;
            tempArgs.shift();
            let joinedArgs = tempArgs.join(" ")
            if (joinedArgs != "") {
                for (let I=0; I < 10; I++) {
                    sendMessage("<@" + mention().id + ">, " + joinedArgs);
                };
            } else {
                for (let I=0; I < 10; I++) {
                    sendMessage("<@" + mention().id + ">");
                };
            };
        break;
        case "help":
            sendMessage(`**If I was just added to your server, please get an admin to run the "setup" command**\n\n${commandsDesc}`);
        break;
        case "changelog":
            sendMessage(`**You can find my source code at https://github.com/bionicbob321/bionicbot321**\n\n${changelog}`);
        break;
        case "setup":
            if (isAdmin()) {
                if (database.hasOwnProperty(guild)) {
                    sendMessage("Setup has already been completed")
                    return;
                } else {
                    database[guild] = {
                        "prefix": "?"
                    };
                sendMessage("Setup is now complete. You can now change custom settings for your server.");
                };
            } else {
                sendMessage("you must be an administrator to use this command")
            }
        break;
        case "changeprefix":
            if (isAdmin()) {
                database[guild]["prefix"] = args[0];
                sendMessage("Prefix changed successfully")
            } else {
                sendMessage("Only administrators can use this command")
            };
        break;
        case "revertprefix":
            if (isAdmin()) {
                database[guild]["prefix"] = database["!default"]["prefix"];
            } else {
                sendMessage("Only administrators can use this command");
            }
        break;
        case "insult":
            if (mention() == null) {
                sendMessage("you must mention someone to insult them");
                return;
            };
            let insultedUser = mention();
            if (insultedUser.id === message.author.id) {
                sendMessage("You shouldnt insult yourself.");
                return;
            }
            let insultNumber = Math.floor((Math.random() * insultsArray.length) + 1) - 1;
            sendMessage("Hey <@" + insultedUser.id + ">, " + insultsArray[insultNumber]);
        break;
        case "voteout":
            if (mention() == null) {
                sendMessage("You must mention the sus imposter to vote them out!");
                return;
            }
            let susUser = mention();
            sendMessage(susASCII1 + `　ﾟ　　 <@${susUser.id}> was An Impostor.　 。\n` + susASCII2);
        break;
        case "meme":
            function sendMeme() {
                let randInt = (Math.floor((Math.random() * 25) + 1)) - 1;
                meme = JSON.parse(meme.responseText);
                meme = meme["data"]["children"][randInt]["data"]; //top.json returns 25 top posts. access them via children[0] - children[24]. No need for meme[0] with top, only random
                sendMessage(meme.title + "\n" + meme.url);
            };
            let meme = new XMLHttpRequest();
            meme.addEventListener("load", sendMeme);
            meme.open("GET", "https://www.reddit.com/r/memes/top.json"); //top.json doesnt return inside an array. dont use [0] with top.json
            meme.send();
        break;
        case "wholesome":
            function sendWholesome() {
                let randInt = (Math.floor((Math.random() * 25) + 1)) - 1;
                wholesome = JSON.parse(wholesome.responseText);
                wholesome = wholesome["data"]["children"][randInt]["data"]; //top.json returns 25 top posts. access them via children[0] - children[24]. No need for meme[0] with top, only random
                sendMessage(wholesome.title + "\n" + wholesome.url);
            };
            let wholesome = new XMLHttpRequest();
            wholesome.addEventListener("load", sendWholesome);
            wholesome.open("GET", "https://www.reddit.com/r/wholesomememes/top.json"); //top.json doesnt return inside an array. dont use [0] with top.json
            wholesome.send();
        break;
        case "sourcecode":
            sendMessage("The source code for this project can be viewed at:\nhttps://github.com/bionicbob321/bionicbot321");
        break;
        case "reddit":
            async function redditRequestSendMessage() { //This is the most scuffed piece of code I have ever written but it works so idc
                sendMessage(await redditRequest(args[0], args[1]));
            };
            redditRequestSendMessage(); 
        break;
        case "calc":
            sendMessage(calculate(commandBody.slice(5)));
        break;
        case "calculate":
            sendMessage(calculate(commandBody.slice(10)));
        break;
            
    };
});