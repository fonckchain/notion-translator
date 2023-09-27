import dotenv from 'dotenv';
dotenv.config();
console.log("Debugging: dotenv.config() called");  // Debugging log 1

import * as config from './config.mjs';
import * as notionClient from './notion.mjs';
import * as deeplClient from './deepl.mjs';
import * as utils from './utils.mjs';
import * as cli from './cli.mjs';

async function handleNotionOperations(options) {
  console.log("Debugging: Inside handleNotionOperations");  // Debugging log 2

  const notionApiToken = process.env.NOTION_API_TOKEN;
  console.log("Debugging: Notion API Token inside handleNotionOperations:", notionApiToken);  // Debugging log 3

  const fullOptions = { ...options, notionApiToken };
  await notionClient.validateToken(fullOptions);

  const originalPage = await notionClient.getOriginalPage(options.url);
  const translatedBlocks = await notionClient.translatePage(originalPage, options.from, options.to);
  await notionClient.createTranslatedPage(originalPage, translatedBlocks, options.to);
}

async function main() {
  console.log("Debugging: Inside main function");  // Debugging log 4

  const options = cli.getOptions();
  await handleNotionOperations(options);
}

console.log("Debugging: Notion API Token before API call in getOriginalPage:", process.env.NOTION_API_TOKEN);


main().catch(err => {
  console.error("Error Caught:", err);
  console.error("Error Stack:", err.stack);
  process.exit(1);
});
