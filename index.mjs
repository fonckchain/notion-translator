import dotenv from 'dotenv';
dotenv.config();
import * as config from './config.mjs';
import * as notionClient from './notion.mjs';
import * as deeplClient from './deepl.mjs';
import * as utils from './utils.mjs';
import * as cli from './cli.mjs';

console.log("Debugging Step 6: Directly log Notion API Token:", process.env.NOTION_API_TOKEN);

async function main() {
  const options = cli.getOptions();
  console.log("Debugging Step 1: Options Object:", options);
  console.log("Debugging Step 2: Environment Variables:", process.env);
  console.log("Debugging Step 3: Command Line Arguments:", process.argv);

  console.log("Debugging Step 7: Before validateToken");
  await notionClient.validateToken(options);
  console.log("Debugging Step 7: After validateToken");

  console.log("Debugging Step 8: DeepL API Token:", process.env.DEEPL_API_TOKEN);

  const originalPage = await notionClient.fetchPage(options.url);
  console.log("Debugging Step 9: Original Page:", originalPage);

  const translatedBlocks = await notionClient.translatePage(originalPage, options.from, options.to);
  console.log("Debugging Step 9: Translated Blocks:", translatedBlocks);

  await notionClient.createTranslatedPage(originalPage, translatedBlocks, options.to);
}

console.log(utils.toPrettifiedJSON({ key: "value" }));
console.log("Notion API Token:", process.env.NOTION_API_TOKEN);

main().catch(err => {
  console.error("Debugging Step 5: Error Caught", err);
  console.error("Debugging Step 10: Error Stack:", err.stack);
  process.exit(1);
});
