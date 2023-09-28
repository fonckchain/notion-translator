// index.mjs
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

  if (!options || !options.url) {
    console.error("Error: Missing required options or URL.");
    return;
  }

  const notionApiToken = process.env.NOTION_API_TOKEN;
  console.log("Debugging: Notion API Token inside handleNotionOperations:", notionApiToken);  // Debugging log 3
  console.log("Debugging: Options inside handleNotionOperations:", options);  // New Debugging log

  const fullOptions = { ...options, notionApiToken };
  await notionClient.validateToken(fullOptions);

  const originalPage = await notionClient.getOriginalPage(options.url);
  const translatedBlocks = await notionClient.buildTranslatedBlocks(originalPage.id, 0, options.from, options.to);  // Changed this line
  await notionClient.createTranslatedPage(originalPage, translatedBlocks, options.to);
}

async function main() {
  console.log("Debugging: Inside main function");  // Debugging log 4

  const options = cli.getOptions();
  console.log("Debugging: Options in main function:", options);
  await handleNotionOperations(options);
}

console.log("Debugging: Notion API Token before API call in getOriginalPage:", process.env.NOTION_API_TOKEN);

main().catch(err => {
  console.error("Error Caught:", err);
  console.error("Error Stack:", err.stack);
  
  process.exit(1);
});
