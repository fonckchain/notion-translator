// notion.mjs
import { Client, LogLevel } from "@notionhq/client";
import dotenv from 'dotenv';
import * as deepl from './deepl.mjs';
import * as utils from './utils.mjs';

dotenv.config();

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
  logLevel: LogLevel.ERROR,
});

export async function validateToken(options) {
  const { notionApiToken } = options;
  if (!notionApiToken) {
    throw new Error("Notion API token is missing.");
  }
}

export async function getOriginalPage(url) {
  const pageId = utils.extractPageId(url);
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
}

export async function createTranslatedPage(originalPage, translatedBlocks, to) {
  try {
    if (!originalPage || !originalPage.title || originalPage.title.length === 0) {
      throw new Error("Invalid originalPage data");
    }

    console.log("Debugging: Original Page:", JSON.stringify(originalPage, null, 2));

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

export async function buildTranslatedBlocks(id, nestedDepth, from, to) {
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
}

async function appendTranslatedBlocks(newPageId, translatedBlocks) {
  await notion.blocks.children.append({
    block_id: newPageId,
    children: translatedBlocks
  });
}

// Function moved from notionDeepIntegration.mjs
export async function fetchNotionData(pageId) {
  try {
    const notionResponse = await notion.pages.retrieve({ page_id: pageId });
    console.log("Successfully connected to Notion API.");
    return notionResponse;
  } catch (error) {
    console.error(`Failed to connect to Notion API. Status code: ${error.code}`);
    throw error;
  }
}
