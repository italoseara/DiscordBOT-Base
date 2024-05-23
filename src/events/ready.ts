import { Event } from "@/types/events";
import Bot from "@/bot";

const data = {
  once: true,
  name: "ready",
};

async function execute(bot: Bot) {
  console.log(`🚀 ${bot.user?.tag} is ready!`);
}

export default { data, execute } as Event;