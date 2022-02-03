module.exports = {
  name: "time",
  aliases: ["time"],
  cooldown: 5,
  args: false,
  description: "time is finite",
  async execute(message, args) {
  const release = new Date('March 31, 2022 00:00:00 +0900');
  const today = new Date;
  const embed = {
  "title": "Time Left",
  "description": "Until the original full release target",
  "color": 14298947,
  "image": {
    "url": "https://cdn.discordapp.com/emojis/858256309026553876.png?size=2048&quality=lossless"
  },
  "fields": [
    {
      "name": "Hours left",
      "value": Math.floor((release-today)/(3.6e+6)),
      "inline": false
    },
    {
      "name": "Days left",
      "value": Math.floor((release-today)/(8.64e+7)),
      "inline": false
    },
    {
      "name": "Weeks left",
      "value": Math.floor((release-today)/(6.048e+8)),
      "inline": true
    },
    {
      "name": "Months left",
      "value": Math.floor((release-today)/(2629746000)),
      "inline": true
    }
  ]
};
message.channel.send({ embed });
}};
