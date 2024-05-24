import fs from 'fs';
import config from '../config.json';

export const getFilesInDirectory = (directory: string, extension: string): string[] => {
  try {
    const files = fs.readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(extension))
      .map((dirent) => dirent.name.replace(new RegExp(extension + '$'), ''));

    const subdirectories = fs.readdirSync(directory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const subdirectory of subdirectories) {
      const subdirectoryFiles = fs.readdirSync(`${directory}/${subdirectory}`, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.endsWith(extension))
        .map((dirent) => dirent.name.replace(new RegExp(extension + '$'), ''));

      files.push(...subdirectoryFiles.map((file) => `${subdirectory}/${file}`));
    }

    return files;
  }
  catch (error) {
    console.error(`❌ Error getting files in directory: ${error}`);
    return [];
  }
}

const locales = new Map<string, any>();

export const loadLocales = (directory: string): void => {
  try {
    console.log("🔧 Loading locales...");
    const files = getFilesInDirectory(directory, '.json');

    for (const file of files) {
      const locale = JSON.parse(fs.readFileSync(`${directory}/${file}.json`, 'utf-8'));
      locales.set(file, locale);
      console.log(`🌎 Locale ${file} is loaded`);
    }
    console.log();
  }
  catch (error) {
    console.error(`❌ Error loading locales: ${error}`);
  }
}

export const getString = (key: string): string => {
  const keys = key.split('.');
  let message = locales.get(config.locale);
  if (!message) return key;

  for (const key of keys) {
    message = message[key];
    if (!message) return key;
  }

  if (Array.isArray(message)) {
    message = message.join('\n');
  }

  return message;
}

export const getFormmatedTime = (time: number): string => {
  const days = Math.floor(time / 86400);
  const hours = Math.floor(time / 3600) % 24;
  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time) % 60;

  return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'm ' : ''}${seconds > 0 ? seconds + 's' : ''}`;
}
