const fetch = require("node-fetch");
const config = require("../config.js");
const crypto = require("crypto");


module.exports = {
  name: "send",
  aliases: ["migrate"],
  cooldown: 5,
  args: false,
  description: "migration",
  async execute(message, args) {
      let leftOverList = [
        "Nitsuppi Boss Fight",
"Rushi Boss Fight",
"Nothing Boss Fight",
"Lightbulbe Boss Fight",
"Main Menu",
"Pause Menu",
"Nom Character Specification",
"Nom First Skill",
"Khanh Character Specification",
"Khanh Loom Light and Heavy Attack",
"Khanh first and second skill",
"Emu Character Specification",
"Emu Loom Light Attack",
"Nothing Character Specification",
"Rushi Character Specification",
"Lightbulbe Character Specification",
"Nitsu Character Specification",
"Aonahara Design And Layout",
"QA Basement Design And Layout"
  ]
    let timeout = 1000;
    for ( let i = 0; i < leftOverList.length; i++ ){
        try {
          await message.channel.send(`${leftOverList[i]}\n`)
          timeout = 1000;
        } catch (ex) {
          if (ex.code === 50013) {
            console.log("No perms, skipping");
          } else if (ex.httpStatus === 429) {
            members.push(member);
            console.log("Rate limited, sleeping");
            await new Promise((resolve) => setTimeout(resolve, timeout));
            timeout *= 2;
          } else {
            console.error("Unknown error");
            console.error(ex);
          }
        }
      }
    }
};
