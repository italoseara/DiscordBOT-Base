import Bot from '@/bot';

export type Event = {
  data: {
    once: boolean;
    name: string;
  };
  execute: (bot: Bot, ...args: any[]) => void;
}

