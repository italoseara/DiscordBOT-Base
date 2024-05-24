import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import si from "systeminformation";

import { getString, getFormmatedTime } from "../util";
import { Command } from "@/types/commands";
import config from "../../config.json";
import Bot from "@/bot";

const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Shows the bot's and server's info");

async function execute(bot: Bot, interaction: CommandInteraction) {
  const latency = Date.now() - interaction.createdTimestamp;

  const embed = new EmbedBuilder()
  .setTitle("🛈  " + getString("info.title"))
  .setDescription("\u2800")
  .addFields(
    {
      name: "⏱️  " + getString("info.uptime"),
      value: `\`${bot.uptime ? getFormmatedTime(bot.uptime / 1000) : "N/A"}\``,
      inline: true
    },
    {
      name: "🏓  " + getString("info.ping"),
      value: `\`${latency}ms\``,
      inline: true
    },
    {
      name: "🪲  " + getString("info.debug"),
      value: config.debug ? "`🟢 " + getString("info.on") + "`" : "`🔴 " + getString("info.off") + "`",
      inline: true
    },
    {
      name: "⚡  " + getString("info.cpu"),
      value: `\`${(await si.currentLoad()).currentLoad.toFixed(2)}%\``,
      inline: true
    },
    {
      name: "💾  " + getString("info.memory"),
      value: `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\``,
      inline: true
    },
    {
      name: "🌡️  " + getString("info.temperature"),
      value: `\`${(await si.cpuTemperature()).main.toFixed(2)}°C\``,
      inline: true
    },
    {
      name: "👥  " + getString("info.users"),
      value: "`N/A`",
      inline: true
    },
    {
      name: "🔰  " + getString("info.guilds"),
      value: `\`${bot.guilds.cache.size}\``,
      inline: true
    },
    {
      name: "👑  " + getString("info.owners"),
      value: config.owners.map((owner) => `<@${owner}>`).join(", "),
      inline: false
    },
  )
  .setColor("#57f287")
  .setFooter({
    text: getString("info.footer").replace("{user}", interaction.user.tag),
    iconURL: interaction.user.displayAvatarURL(),
  });

  await interaction.reply({ embeds: [embed], ephemeral: true });
};

export default { data, execute, developer: true } as Command;