import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "@/types/commands";
import Bot from "@/bot";

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

async function execute(bot: Bot, interaction: CommandInteraction) {
  await interaction.reply(`🏓 Pong! \`${Date.now() - interaction.createdTimestamp}ms\``);
};

export default { data, execute } as Command;