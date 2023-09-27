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

console.log("Notion API Token from Env:", process.env.NOTION_API_TOKEN);

// Function to validate the Notion API token
export async function validateToken(options) {
  const { notionApiToken } = options;
  if (!notionApiToken) {
    throw new Error("Notion API token is missing.");
  }

  // Token Format Validation
  if (notionApiToken.length < 40 || notionApiToken.length > 60) {
    throw new Error("Invalid Notion API token length.");
  }

  // Additional validation logic can be added here
}

// Function to fetch the original Notion page using its URL
export async function getOriginalPage(url) {
  // Debug log to print the URL
  console.log("Debugging: URL passed to getOriginalPage:", url);

  try {
    // Extract the page ID from the URL using utility function
    const pageId = utils.extractPageId(url);
    // Retrieve the page details from Notion
    const response = await notion.pages.retrieve({ page_id: pageId });
    return response;
  } catch (error) {
    console.error("Failed to retrieve original page:", error);
    throw new Error("Failed to retrieve original page.");
  }
}

// Function to recursively fetch and translate blocks from a Notion page
export async function buildTranslatedBlocks(id, nestedDepth, from, to) {
  try {
    // Fetch child blocks of the given block ID from Notion
    const blocks = await notion.blocks.children.list({
      block_id: id,
      page_size: 50 // Number of blocks to fetch per request
    });

    const translatedBlocks = [];

    // Loop through each block to translate and handle nested blocks
    for (const block of blocks.results) {
      // Recursively handle nested blocks up to 2 levels deep
      if (nestedDepth < 2) {
        const nestedTranslatedBlocks = await buildTranslatedBlocks(block.id, nestedDepth + 1, from, to);
        translatedBlocks.push({
          ...block,
          children: nestedTranslatedBlocks
        });
      }

      // Translate the text content of the block using DeepL
      const translatedText = await deepl.translateText(block.paragraph.text, from, to);
      translatedBlocks.push({
        ...block,
        paragraph: {
          text: translatedText
        }
      });
    }

    return translatedBlocks;
  } catch (error) {
    console.error("Failed to build translated blocks:", error);
    throw new Error("Failed to build translated blocks.");
  }
}

// Function to create a new Notion page for the translated content
export async function createNewPageForTranslation(originalPage, to) {
  try {
    // Create a new Notion page with similar properties as the original
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
    return newPage.id;
  } catch (error) {
    console.error("Failed to create new page:", error);
    throw new Error("Failed to create new page.");
  }
}

// Function to append the translated blocks to the new Notion page
export async function appendTranslatedBlocks(newPageId, translatedBlocks) {
  try {
    // Append the translated blocks to the new Notion page
    await notion.blocks.children.append({
      block_id: newPageId,
      children: translatedBlocks
    });
  } catch (error) {
    console.error("Failed to append translated blocks:", error);
    throw new Error("Failed to append translated blocks.");
  }
}
