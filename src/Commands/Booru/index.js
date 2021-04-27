const haruna = require("haruna-js");
const konacchi = new haruna();
const { resultBed, FillBed } = require("./Embed/konachan");
module.exports = {
  name: "booru",
  description: "A booru ani-board based searches",
  permission: ["SEND_MESSAGES"],
  args: true,
  usage: "<type> <keyword>",
  type: ["konachan", "yandere"],
  category: "Features",

  async execute(message, args, prefix, owner, colors) {
    const arg = message.content.slice(
      prefix.length + 1 + this.name.length + 1 + args[0].length
    );
    let mode;
    if (args[0] === "konachan" || args[0] === "-k") {
      mode = 1;
    }
    if (args[0] === "yandere" || args[0] === "-y") {
      mode = 2;
    }
    await konacchi
      .posts(mode, arg, 1, 5, 1, 4)
      .then((data) =>
        message.channel
          .send({ embed: resultBed(data, colors.konachan, mode) })
          .then((lastmessage) => {
            const filter = (secmessage) =>
              secmessage.author.id === message.author.id;
            const collector = message.channel.createMessageCollector(filter, {
              time: 15000,
              max: 1,
            });
            collector.on("collect", (mess) => {
              const number = parseInt(mess.content);
              if (isNaN(number)) message.reply("Command canceled.");
              mess.delete();
              lastmessage.edit({
                embed: FillBed(data[number - 1], colors.konachan, mode),
              });
            });
          })
      )
      .catch((error) => message.reply(error.message));
  },
};
