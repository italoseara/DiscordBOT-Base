import fs from 'fs';

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