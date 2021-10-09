require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("?reddithelp", { type: "PLAYING" });
});

const sendReplies = async (message, args, data) => {
  if (args) {
    let nsfw = data.memes[0].nsfw;

    if (nsfw) {
      if (!message.channel.nsfw) {
        message.reply("This command can only be used in channels marked nsfw.");
        return;
      }
    }

    Object.keys(data.memes).forEach(function (key) {
      let postLink = data.memes[key]["postLink"];
      let postTitle = data.memes[key]["title"];
      let postAuthor = data.memes[key]["author"];
      let postImageURL = data.memes[key]["url"];

      const help_embed = new Discord.MessageEmbed()
        .setColor("#149EF0")
        .setTitle(postTitle)
        .setURL(postLink)
        .setImage(postImageURL)
        .setAuthor(postAuthor)
        .setTimestamp()
        .setFooter("Made by eliac7#5541");
      message.reply({ embeds: [help_embed] });
      return;
    });
  } else {
    let nsfw = data.nsfw;

    if (nsfw) {
      if (!message.channel.nsfw) {
        message.reply("This command can only be used in channels marked nsfw.");
        return;
      }
    }
    let postImageURL = data.url;
    let postLink = data.postLink;
    let postTitle = data.title;
    let postAuthor = data.author;

    const help_embed = new Discord.MessageEmbed()
      .setColor("#149EF0")
      .setTitle(postTitle)
      .setURL(postLink)
      .setImage(postImageURL)
      .setAuthor(postAuthor)
      .setTimestamp()
      .setFooter("Made by eliac7#5541");
    message.reply({ embeds: [help_embed] });
    return;
  }
};

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("?")) {
    let command = message.content.substring(1).split(" ")[0];
    let args = message.content.substring(2 + command.length);
    if (command == "reddithelp") {
      const help_embed = new Discord.MessageEmbed()
        .setColor("#ff4500")
        .setTitle("Reddit-Bot Commands")
        .addFields({
          name: "How does it work?",
          value:
            ' We use the prefix "?" to trigger our bot. With the command "?subreddit" we get one picture from this subreddit, eg: ?wallpapers. If we need more than one image, we can type "?subreddit X", where X is a number between 2 and 50',
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
