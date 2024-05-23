import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Command } from "@/types/commands";
import Bot from "@/bot";

const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Visualize as informações do seu personagem.");

async function execute(bot: Bot, interaction: CommandInteraction) {
  await interaction.reply("Vida: 100/100\nMana: 50/50\nAtaque: 10\nDefesa: 5");
};

export default { data, execute, ownerOnly: true } as Command;