// index.mjs
import dotenv from 'dotenv';
dotenv.config();
import * as config from './config.mjs';
import * as notionClient from './notion.mjs';
import * as deeplClient from './deepl.mjs';
import * as utils from './utils.mjs';
import * as cli from './cli.mjs';

async function main() {
  // Debugging Step 1: Inspect the options object
  const options = cli.getOptions();
  console.log("Debugging Step 1: Options Object:", options);

  // Debugging Step 2: Check Environment Variables
  console.log("Debugging Step 2: Environment Variables:", process.env);

  // Debugging Step 3: Check Command Line Arguments
  console.log("Debugging Step 3: Command Line Arguments:", process.argv);

  // Validate API tokens
  await notionClient.validateToken(options);
  await deeplClient.validateToken(options);
  
  // Fetch and translate the Notion page
  const originalPage = await notionClient.fetchPage(options.url);
  const translatedBlocks = await notionClient.translatePage(originalPage, options.from, options.to);
  
  // Create the translated page in Notion
  await notionClient.createTranslatedPage(originalPage, translatedBlocks, options.to);
}

// Debugging Step 4: Validate Inside validateToken Function
// This step should be implemented inside your validateToken function in notion.mjs

console.log(utils.toPrettifiedJSON({ key: "value" }));


main().catch(err => {
  console.error("Debugging Step 5: Error Caught", err);
  process.exit(1);
});
