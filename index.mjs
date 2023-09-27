import dotenv from 'dotenv';
dotenv.config();
import * as config from './config.mjs';
import * as notionClient from './notion.mjs';
import * as deeplClient from './deepl.mjs';
import * as utils from './utils.mjs';
import * as cli from './cli.mjs';

async function handleNotionOperations(options) {
  const notionApiToken = process.env.NOTION_API_TOKEN;
  const fullOptions = { ...options, notionApiToken };

  // Keep this debug line to check the token before making the API call
  console.log("Debugging: Notion API Token before API call:", notionApiToken);

  await notionClient.validateToken(fullOptions);

  const originalPage = await notionClient.getOriginalPage(options.url);
  const translatedBlocks = await notionClient.translatePage(originalPage, options.from, options.to);

  await notionClient.createTranslatedPage(originalPage, translatedBlocks, options.to);
}

async function main() {
  const options = cli.getOptions();
  await handleNotionOperations(options);
}

main().catch(err => {
  console.error("Error Caught:", err);
  console.error("Error Stack:", err.stack);
  process.exit(1);
});

