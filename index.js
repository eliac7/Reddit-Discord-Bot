require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("!reddithelp", { type: "LISTENING" });
});

const sendReplies = async (message, args, data) => {
  if (args) {
    let nsfw = data.memes[0].nsfw;

    if (nsfw) {
      if (!message.channel.nsfw) {
        message.channel.send(
          "This command can only be used in channels marked nsfw."
        );
        return;
      }
    }

    Object.keys(data.memes).forEach(function (key) {
      let url = data.memes[key]["url"];

      message.reply(url);
      return;
    });
  } else {
    let nsfw = data.nsfw;

    if (nsfw) {
      if (!message.channel.nsfw) {
        message.channel.send(
          "This command can only be used in channels marked nsfw."
        );
        return;
      }
    }
    message.reply(data.url);
    return;
  }
};

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!")) {
    let command = message.content.substring(1).split(" ")[0];
    let args = message.content.substring(2 + command.length);

    if (command == "reddithelp") {
      const help_embed = new Discord.MessageEmbed()
        .setColor("#ff4500")
        .setTitle("Reddit-Bot Commands")
        .addFields({
          name: "Πως δουλεύει;",
          value:
            "Χρησιμοποιούμε την εντολή !(θαυμαστικό) + όνομα ενός subreddit. Π.χ.: Για να πάρουμε φωτογραφίες από το subreddit του /r/greece, πληκτρολογούμε !greece. Αν θέλουμε να πάρουμε περισσότερες από μια φωτογραφίες, χρησιμοποιούμε !greece 2 (ένα νούμερο από το 2-50). ",
        })
        .setFooter("Made by eliac7#5541");
      message.reply({ embeds: [help_embed] });
      return;
    } else {
      try {
        const res = await axios.get(
          `https://meme-api.herokuapp.com/gimme/${command}/` +
            (args ? parseInt(args) : "")
        );

        sendReplies(message, args, res.data);
      } catch (err) {
        message.reply(err.response.data.message);
        return;
      }
    }
  }
});

client.login(process.env.CLIENT_TOKEN);
