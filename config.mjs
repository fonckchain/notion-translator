// config.mjs
import open from 'open';

// Validate environment variables
export function validateEnvVariables(options) {
  // Validate Notion API Token
  if (!options.notionToken) {
    throw new Error("Notion API token is missing. Please set it in the environment variables or pass it as an option.");
  }

  // Validate DeepL API Token
  if (!options.deeplToken) {
    throw new Error("DeepL API token is missing. Please set it in the environment variables or pass it as an option.");
  }

  // Validate source and target languages
  if (!options.from || !options.to) {
    throw new Error("Source and/or target language is missing. Please specify both.");
  }

  // Validate Notion Page URL
  if (!options.url) {
    throw new Error("Notion Page URL is missing. Please specify it.");
  }
}

// Open Notion page in the default web browser
export async function openNotionPage(url) {
  if (url) {
    await open(url);
  }
}
