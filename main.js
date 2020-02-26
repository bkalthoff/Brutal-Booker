const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require("node-fetch");

const data = {
    username: 'username',
    password: 'password'
};

const server_password = 'password'

var lastbooker = "1337";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async (message) => {
    if(message.content == "!book"){
        var result = await book();
        console.log(result)
        if(result == "You already have an active booking"){
            message.channel.send("Server already booked")
        }
        else {
            message.channel.send("Server Booked. Waiting 30 seconds before posting invite...")
            message.author.send("steam://connect/" + result.ip + ":" + result.ports.game + "/" + result.csgo_settings.password + " rcon = " + result.csgo_settings.rcon);
            await sleep(30000);
            message.channel.send("steam://connect/" + result.ip + ":" + result.ports.game + "/" + result.csgo_settings.password);
            lastbooker = message.author.id;
            console.log(message.author.id)
        }
    }
    else if(message.content == "!unbook"){
        if(message.author.id == lastbooker || message.author.id == "128534851283451904"){
            let logindata = await fetch("https://brutalcs.nu/backend/login", {"credentials":"omit","headers":{"accept":"application/json, text/plain, */*","accept-language":"en,en-US;q=0.9,sv;q=0.8,de;q=0.7","content-type":"application/x-www-form-urlencoded;charset=UTF-8","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://brutalcs.nu/start","referrerPolicy":"no-referrer-when-downgrade","body":"username="+data.username+"&password="+data.password,"method":"POST","mode":"cors"})
            logindata = await logindata.json()
            let unbook = await fetch("https://brutalcs.nu/backend/unbook_warserver?session_id=" + logindata.sessionId, {"credentials":"omit","headers":{"accept":"application/json, text/plain, */*","accept-language":"en,en-US;q=0.9,sv;q=0.8,de;q=0.7","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://brutalcs.nu/warserver","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"POST","mode":"cors"});
            if(unbook.status == 200)
                message.channel.send("Successfully unbooked the server.")
            else
                message.channel.send("Failed to unbook the server. Is a server booked?")
        }
        else
            message.channel.send("You may only unbook servers booked by you.")
    }
});

async function book(){
    let logindata = await fetch("https://brutalcs.nu/backend/login", {"credentials":"omit","headers":{"accept":"application/json, text/plain, */*","accept-language":"en,en-US;q=0.9,sv;q=0.8,de;q=0.7","content-type":"application/x-www-form-urlencoded;charset=UTF-8","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://brutalcs.nu/start","referrerPolicy":"no-referrer-when-downgrade","body":"username="+data.username+"&password="+data.password,"method":"POST","mode":"cors"})
    logindata = await logindata.json()
    console.log(logindata.sessionId)
    let bookdata = await fetch("https://brutalcs.nu/backend/book_warserver?session_id=" + logindata.sessionId, {"credentials":"omit","headers":{"accept":"application/json, text/plain, */*","accept-language":"en,en-US;q=0.9,sv;q=0.8,de;q=0.7","content-type":"application/x-www-form-urlencoded;charset=UTF-8","sec-fetch-mode":"cors","sec-fetch-site":"same-origin"},"referrer":"https://brutalcs.nu/warserver","referrerPolicy":"no-referrer-when-downgrade","body":"anticheat=vac&country=stockholm&duration=2&gametype=classic_competitive&password="+server_password + Math.floor(Math.random()*(999-100+1)+100) +"&rconpassword="+Math.random().toString(36).substring(5),"method":"POST","mode":"cors"})
    if(await bookdata.status != 200)
        return await bookdata.text();
    if(await bookdata.status == 200)
        return await bookdata.json();    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.login("Discord Token");
