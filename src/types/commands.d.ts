import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Bot from '@/bot';

export type Command = {
  data: SlashCommandBuilder;
  developer?: boolean;
  execute: (bot: Bot, interaction: CommandInteraction) => Promise<void>;
};