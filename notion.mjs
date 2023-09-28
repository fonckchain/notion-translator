// Import required modules from Notion SDK, DeepL, and utility file
import dotenv from 'dotenv';
dotenv.config();
import { Client, LogLevel } from '@notionhq/client';
import * as deepl from './deepl.mjs';
import * as utils from './utils.mjs';

// Initialize the Notion client with API token and log level
const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
  logLevel: LogLevel.ERROR,
});

// Function to validate the Notion API token
export async function validateToken(options) {
  const { notionApiToken } = options;
  if (!notionApiToken) {
    throw new Error("Notion API token is missing.");
  }
  // Additional validation logic can be added here
}

// Function to fetch the original Notion page using its URL
export async function getOriginalPage(url) {
  try {
    const pageId = utils.extractPageId(url);
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.error("Detailed Error in getOriginalPage:", error.message, error.stack);
    throw new Error(`Failed to retrieve original page. Original Error: ${error.message}`);
  }
}

// Function to create a new Notion page with translated content
export async function createTranslatedPage(originalPage, translatedBlocks, to) {
  try {
    const newPage = await notion.pages.create({
      parent: { database_id: originalPage.parent.database_id },
      properties: originalPage.properties,
      title: [
        {
          type: "text",
          text: {
            content: `${originalPage.title[0].plain_text} (Translated to ${to})`
          }
        }
      ]
    });
    await appendTranslatedBlocks(newPage.id, translatedBlocks);
    return newPage.id;
  } catch (error) {
    console.error("Detailed Error in createTranslatedPage:", error.message, error.stack);
    throw new Error(`Failed to create translated page. Original Error: ${error.message}`);
  }
}

// Function to recursively fetch and translate blocks from a Notion page
export async function buildTranslatedBlocks(id, nestedDepth, from, to) {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: id,
      page_size: 50
    });
    const translatedBlocks = [];

    for (const block of blocks.results) {
      if (nestedDepth < 2) {
        const nestedTranslatedBlocks = await buildTranslatedBlocks(block.id, nestedDepth + 1, from, to);
        translatedBlocks.push({
          ...block,
          children: nestedTranslatedBlocks
        });
      }

      if (block.paragraph && block.paragraph.text) {
        const translatedText = await deepl.translateText(block.paragraph.text, from, to);
        translatedBlocks.push({
          ...block,
          paragraph: {
            text: translatedText
          }
        });
      } else {
        translatedBlocks.push(block);
      }
    }
    return translatedBlocks;
  } catch (error) {
    console.error("Detailed Error in buildTranslatedBlocks:", error.message, error.stack);
    throw new Error(`Failed to build translated blocks. Original Error: ${error.message}`);
  }
}

// Function to append the translated blocks to the new Notion page
async function appendTranslatedBlocks(newPageId, translatedBlocks) {
  try {
    await notion.blocks.children.append({
      block_id: newPageId,
      children: translatedBlocks
    });
  } catch (error) {
    console.error("Detailed Error in appendTranslatedBlocks:", error.message, error.stack);
    throw new Error(`Failed to append translated blocks. Original Error: ${error.message}`);
  }
}
