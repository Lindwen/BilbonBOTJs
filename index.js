const Discord = require("discord.js");
const config = require("./config.json");
const { get } = require("snekfetch");
const weather = require('weather-js');
const bot = new Discord.Client();
var prefix = config.prefix;
var randnum = 0;



bot.on('error', console.error);



bot.on("ready", () => {
	var servers = bot.guilds.array().map(g => g.name).join(',');
	console.log(`---------------------`);
    console.log(`Pseudo : ${bot.user.username}`)
    console.log(`Compte : ${bot.user.tag}`)
    console.log(`Prefix: "${prefix}"`)
    console.log(`Id: ${bot.user.id}`)
    console.log(`Servers: ${bot.guilds.size}`)
	console.log(`---------------------`)
	bot.user.setActivity(`se promener dans ${bot.guilds.size} villages.`);
});



//Quand le bot rejoint un serveur
bot.on("guildCreate", guild => {
	console.log(`J'ai rejoins un nouveau serveur : ${guild.name} (id: ${guild.id}). Il y a ${guild.memberCount} membres !`);
	bot.user.setActivity(`se promener dans ${bot.guilds.size} villages.`);
});
  
  
  
//Quand le bot part d'un serveur
bot.on("guildDelete", guild => {
	console.log(`J'ai été exclu d'un serveur : ${guild.name} (id: ${guild.id})`);
	bot.user.setActivity(`se promener dans ${bot.guilds.size} villages.`);
});
	


//bienvenue
bot.on('guildMemberAdd', member => {
	const channel = member.guild.channels.find(ch => ch.name === "bienvenue");
	if (!channel) return;
	let embed = new Discord.RichEmbed()
		.setTitle(`**:white_check_mark: ${member.user.username}#${member.user.discriminator}** a rejoint **${member.guild.name}**.`)
		.setDescription(`Membres : **${member.guild.memberCount}**`)
		.setColor(config.color)
		.setThumbnail(member.user.avatarURL)
		.setTimestamp()
		.setImage("https://media.giphy.com/media/mIZ9rPeMKefm0/giphy.gif")
		.setFooter(member.guild.name)
	channel.send(embed)
});



//aurevoir
bot.on('guildMemberRemove', member => {
	const channel = member.guild.channels.find(ch => ch.name === "bienvenue");
	if (!channel) return;
	let embed = new Discord.RichEmbed()
		.setTitle(`**:x: ${member.user.username}#${member.user.discriminator}** a quitté **${member.guild.name}**.`)
		.setDescription(`Membres : **${member.guild.memberCount}**`)
		.setColor(config.color)
		.setThumbnail(member.user.avatarURL)
		.setTimestamp()
		.setImage("https://media.giphy.com/media/TydZAW0DVCbGE/giphy.gif")
		.setFooter(member.guild.name)
	channel.send(embed)
});
	


bot.on('message', message => {

	//help
	if(message.content.startsWith(prefix + "help")){
		let embed = new Discord.RichEmbed()
			.setColor(config.color)
			.setAuthor("Liste des commandes :","https://image.noelshack.com/fichiers/2019/07/5/1550246195-book-png-open-book-png-image-2186.png")
			.setDescription(`
				**• ${prefix}help** → Afficher la liste des commandes\n
				**• ${prefix}userinfo <pseudo>** → Affiche les informations utilisateur\n
				**• ${prefix}serveurinfo** → Affiche les informations serveur\n
				**• ${prefix}botinfo** → Affiche les informations du bot\n
				**• ${prefix}liste** → Affiche la liste des serveurs du bot\n
				**• ${prefix}codes** → Affiche aide mise en page\n
				**• ${prefix}uptime** → Affiche le temps de connexion du bot\n
				**• ${prefix}avatar <pseudo>** → Affiche l'avatar\n
				**• ${prefix}meow** → Envoie un chat de la Comté\n
				**• ${prefix}gchat <texte>** → Envoie un message dans le tchat global\n
				**• ${prefix}meteo <ville>** → Envoie la météo\n
				**• ${prefix}dé 4** → Lancer un dé 4 faces\n
				**• ${prefix}dé 6** → Lancer un dé 6 faces\n
				**• ${prefix}dé 8** → Lancer un dé 8 faces\n
				**• ${prefix}dé 20** → Lancer un dé 20 faces\n
				**• ${prefix}dé 100** → Lancer un dé 100 faces\n
			`)
			.setThumbnail("https://image.noelshack.com/fichiers/2019/07/6/1550350618-lo-hobbit-png-3.png")
		message.channel.send(embed);
	}

	//info serveur
	else if(message.content.startsWith(prefix + "serveurinfo")){
		let embed = new Discord.RichEmbed()
			.setColor(config.color)
			.setAuthor(bot.user.username, bot.user.avatarURL)
			.setDescription("Information du serveur")
			.addField("Propriétaire du serveur", message.guild.owner.user.tag)
			.addField("Nom du serveur", message.guild.name)
			.addField("Créer le", message.guild.createdAt)
			.addField("Utilisateurs sur le discord", message.guild.memberCount)
			.addField("Nombre de salons", message.guild.channels.size)
			.addField("Nombre de rôles", message.guild.roles.size)
			.addField("Liste des rôles", message.guild.roles.map(r => r.name).length > 900 ? "Trop de rôles" : message.guild.roles.map(r => r.name))
			.addField("Humains", message.guild.members.filter(member => !member.user.bot).size)
			.addField("Bots", message.guild.members.filter(member => member.user.bot).size)
			.addField("Region", message.guild.region)
			.setThumbnail(message.guild.iconURL)
		message.channel.send(embed);
	}


	//botinfo
	else if(message.content.startsWith(prefix + "botinfo")){ 
		let embed = new Discord.RichEmbed()
			.setAuthor(`BotInfo`, "https://image.noelshack.com/fichiers/2019/07/5/1550246822-ap-550x550-12x12-1-transparent-t-u1.png")
			.setColor(config.color)
			.setDescription("**•** J'ai été créé par **Lindwen#2522**\n**•** Pour m'inviter → https://discordapp.com/oauth2/authorize?client_id=531767205667536896&scope=bot&permissions=8")
		message.channel.send(embed);
	}

	//liste
	else if(message.content.startsWith(prefix + "liste")){ 
		message.channel.send(bot.guilds.map(r => r.name + "|`"+ `${r.memberCount}` + " membres`"))
	}

	//roll 4
	else if(message.content.startsWith(prefix + "dé 4")){ 
		var result = Math.floor((Math.random() * 4)+ 1)
		let embed = new Discord.RichEmbed()
			.setAuthor(`${message.author.username} lance un dé 4 faces`, "https://image.noelshack.com/fichiers/2019/07/5/1550244514-1f3b2.png")
			.setColor(config.color)
			.setDescription("Le dé tombe sur **" + result + "**.")
		message.channel.send(embed);
	}

	//roll 6
	else if(message.content.startsWith(prefix + "dé 6")){ 
		var result = Math.floor((Math.random() * 6)+ 1)
		let embed = new Discord.RichEmbed()
			.setAuthor(`${message.author.username} lance un dé 6 faces`, "https://image.noelshack.com/fichiers/2019/07/5/1550244514-1f3b2.png")
			.setColor(config.color)
			.setDescription("Le dé tombe sur **" + result + "**.")
		message.channel.send(embed);
	}

	//roll 8
	else if(message.content.startsWith(prefix + "dé 8")){ 
		var result = Math.floor((Math.random() * 8)+ 1)
		let embed = new Discord.RichEmbed()
			.setAuthor(`${message.author.username} lance un dé 8 faces`, "https://image.noelshack.com/fichiers/2019/07/5/1550244514-1f3b2.png")
			.setColor(config.color)
			.setDescription("Le dé tombe sur **" + result + "**.")
		message.channel.send(embed);
	}

	//roll 20
	else if(message.content.startsWith(prefix + "dé 20")){ 
		var result = Math.floor((Math.random() * 20)+ 1)
		let embed = new Discord.RichEmbed()
			.setAuthor(`${message.author.username} lance un dé 20 faces`, "https://image.noelshack.com/fichiers/2019/07/5/1550244514-1f3b2.png")
			.setColor(config.color)
			.setDescription("Le dé tombe sur **" + result + "**.")
		message.channel.send(embed);
	}

	//roll 100
	else if(message.content.startsWith(prefix + "dé 100")){ 
		var result = Math.floor((Math.random() * 100)+ 1)
		let embed = new Discord.RichEmbed()
			.setAuthor(`${message.author.username} lance un dé 100 faces`, "https://image.noelshack.com/fichiers/2019/07/5/1550244514-1f3b2.png")
			.setColor(config.color)
			.setDescription("Le dé tombe sur **" + result + "**.")
		message.channel.send(embed);
	}

	//userinfo
	else if(message.content.startsWith(prefix + "userinfo")){
		if(message.mentions.members.size == 1) {
			let member = message.mentions.members.first()
				let embed = new Discord.RichEmbed()
				.setTitle(`**${member.user.username}**`)
				.setColor(config.color)
				.addField("Pseudonyme", `${member.user.username}#${member.user.discriminator}` ,true)
				.addField('Mention', member, true)
				.addField("ID", member.user.id ,true)
				.addField("Créé le", member.user.createdAt ,true)
				.addField('Status', member.presence.status, true)
				.setThumbnail(member.user.avatarURL)
			message.channel.send(embed);
		}
		else {
			let embed = new Discord.RichEmbed()
				.setTitle(`**${message.author.username}**`)
				.setColor(config.color)
				.addField("Pseudonyme", `${message.author.username}#${message.author.discriminator}` ,true)
				.addField('Mention', message.author, true)
				.addField("ID", message.author.id ,true)
				.addField("Créé le", message.author.createdAt ,true)
				.addField('Status', message.author.presence.status, true)
				.setThumbnail(message.author.avatarURL)
			message.channel.send(embed);
		}
	}

	//avatar
	else if(message.content.startsWith(prefix + "avatar")){
		if(message.mentions.members.size == 1) {
			let member = message.mentions.members.first()
				let embed = new Discord.RichEmbed()
				.setTitle(`**${member.user.username}**`)
				.setImage(member.user.avatarURL)
				.setColor(config.color)
			message.channel.send(embed);
		} else {
			let embed = new Discord.RichEmbed()
				.setTitle(`**${message.author.username}**`)
				.setImage(message.author.avatarURL)
				.setColor(config.color)
			message.channel.send(embed);
		}
	}

	//codes
	else if(message.content.startsWith(prefix + "codes")){
		let embed = new Discord.RichEmbed()
			.setAuthor(bot.user.username, "https://cdn.discordapp.com/app-icons/450353599365644288/4ac094e935782b098d7919e1332f954c.png?size=256")
			.setColor(config.color)
			.setDescription("Discord Mise en page")
			.addField("```*italics*```","*italics*")
			.addField("```**bold**```","**bold**")
			.addField("```~~strikeout~~```","~~strikeout~~")
			.addField("```__underline__```","__underline__")
			.addField("```***bold italics***```","***bold italics***")
			.addField("```__*underline italics*__```","__*underline italics*__")
			.addField("```__**underline bold**__```","__**underline bold**__")
			.addField("```__~~underline strikeout~~__```","__~~underline strikeout~~__")
			.addField("```**~~bold strikeout~~**```","**~~bold strikeout~~**")
			.addField("```__***underline bold italics***___```","__***underline bold italics***__")
			.addField("```__***~~underline bold italics stikeout~~***__```","__***~~underline bold italics stikeout~~***__")
		message.channel.send(embed);
	}

	//uptime
	else if(message.content.startsWith(prefix + "uptime")) {
		let totalSeconds = (bot.uptime / 1000);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		let uptime = `${hours} heures, ${minutes} minutes et ${seconds} secondes`;
		let embed = new Discord.RichEmbed()
			.setAuthor(bot.user.username, "https://image.noelshack.com/fichiers/2019/07/6/1550297409-7607571f.png")
			.setColor(config.color)
			.setDescription(`Je suis connecté depuis :\n${uptime}`)
		message.channel.send(embed);
	}

	//meow
	else if(message.content.startsWith(prefix + 'meow')) {
		get('https://aws.random.cat/meow').then(res => {
			const embed = new Discord.RichEmbed()
				.setDescription(`${message.author.username}, voici un chat de la Comté !`)
				.setImage(res.body.file)
				.setColor(config.color)
			message.channel.send(embed);
		});
	}

	else if (message.content.startsWith(prefix + 'meteo')) {
		let cont = message.content.slice(prefix.length).split(" ");
		let args = cont.slice(1); 
        weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) { 
            if (err) message.channel.send(err);
            var current = result[0].current;
            var location = result[0].location;
            const embed = new Discord.RichEmbed()
                .setAuthor(`Météo pour ${current.observationpoint}`)
                .setThumbnail(current.imageUrl)
                .setColor(config.color)
                .addField('Fuseau horaire',`UTC${location.timezone}`, true)
                .addField('Température',`${current.temperature} °C`, true)
                .addField('Ressentie', `${current.feelslike} °C`, true)
                .addField('Vents',current.winddisplay, true)
                .addField('Humidité', `${current.humidity}%`, true)
            message.channel.send({embed});
        });
	}
	
	else if (message.content.startsWith(prefix + 'gchat')) {
		message.delete()
		let hoargs = message.content.split(" ").slice(1);
		let ho03 = hoargs.join(" ")
		var ho02 = message.guild.channels.find('name', 'global');
		if(!ho02) return message.reply("Le channel global est introuvable.")
		if(message.channel.name !== 'global') return message.reply("Commande a effectué dans #global.")
		if(!ho03) return message.reply("Merci d'écrire un message.")
		const embed = new Discord.RichEmbed()
			.setColor(config.color)
			.setAuthor(message.author.username + "#" + message.author.discriminator)
			.setDescription(ho03)
			.setTimestamp()
			.setFooter(message.guild.name)
			.setThumbnail(message.author.avatarURL)
		bot.channels.findAll('name', 'global').map(channel => channel.send(embed))
	}

});

bot.login(config.token)