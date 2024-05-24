import { Client, IntentsBitField, REST, Routes, SlashCommandBuilder } from "discord.js";

import { Event } from "@/types/events";
import { Command } from "@/types/commands";
import { getFilesInDirectory, getString, loadLocales } from "./util";
import config from "../config.json";

const { DISCORD_TOKEN } = process.env;

export default class Bot extends Client {
  public commands: Map<string, SlashCommandBuilder>;

  constructor() {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
      ],
    });

    this.commands = new Map();
  }

  public start = async () => {
    loadLocales("./src/locales");
    this.handleEvents();
    this.handleCommands();
    this.refreshCommands();
    await this.login(DISCORD_TOKEN);
  }

  private handleEvents = () => {
    try {
      console.log("🔧 Loading events...");
      const eventFiles = getFilesInDirectory("./src/events", ".ts");

      for (const file of eventFiles) {
        const { data, execute } = require(`./events/${file}`).default as Event;

        if (data.once) {
          this.once(data.name, (...args) => execute(this, ...args));
        } else {
          this.on(data.name, (...args) => execute(this, ...args));
        }

        console.log(`✅ Event ${data.name} is loaded`);
      }
      console.log();
    } catch (error) {
      console.error(`❌ Error loading events: ${error}`);
    }
  }

  private handleCommands = () => {
    try {
      console.log("🔧 Loading commands...");
      const commandFiles = getFilesInDirectory("./src/commands", ".ts");

      for (const file of commandFiles) {
        const { data, execute, developer } = require(`./commands/${file}`).default as Command;

        this.commands.set(data.name, data);
        this.on("interactionCreate", async (interaction) => {
          if (!interaction.isCommand()) return;

          const { commandName } = interaction;
          if (commandName === data.name) {
            if (developer && !config.owners.includes(interaction.user.id)) {
              await interaction.reply({ 
                content: getString("command.developer"), 
                ephemeral: true 
              });
              return;
            }

            try {
              await execute(this, interaction);
            } catch (error) {
              console.error(`❌ Error executing command /${commandName}: ${error}`);
              await interaction.reply({ 
                content: getString("command.error"),
                ephemeral: true 
              });
            }
          }
        });

        console.log(`✅ Command /${data.name} is loaded`);
      }
      console.log();
    } catch (error) {
      console.error(`❌ Error loading commands: ${error}`);
    }
  }

  private refreshCommands = async () => {
    try {
      console.log("🔧 Refreshing commands...");
      const commands = Array.from(this.commands.values());
      const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN || "");

      if (config.debug) {
        await rest.put(
          Routes.applicationGuildCommands(config.applicationId, config.guildId),
          { body: commands }
        );
      } else {
        await rest.put(
          Routes.applicationCommands(config.applicationId),
          { body: commands }
        );
      }

      console.log(`🔧 Successfully refreshed ${commands.length} commands\n`);
    } catch (error) {
      console.error(`❌ Error refreshing commands: ${error}`);
    }
  }
}