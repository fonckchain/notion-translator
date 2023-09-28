// notionDeepIntegration.mjs
import { Client } from "@notionhq/client";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Initialize API Tokens
const notionApiToken = process.env.NOTION_API_TOKEN;
const deeplApiToken = process.env.DEEPL_API_TOKEN;

// Initialize Notion Client
const notion = new Client({ auth: notionApiToken });

// Set up headers for DeepL
const deeplHeaders = {
  'Authorization': `DeepL-Auth-Key ${deeplApiToken}`
};

// Notion API request
const pageId = "dc02f31b-c5f4-4ac4-80e2-0c0a58da2d28";  // Replace with Notion page ID

async function fetchNotionData() {
  try {
    const notionResponse = await notion.pages.retrieve({ page_id: pageId });
    console.log("Successfully connected to Notion API.");
    console.log("Notion API Data:", notionResponse);
  } catch (error) {
    console.log(`Failed to connect to Notion API. Status code: ${error.code}`);
  }
}

// DeepL API request
const textToTranslate = "Hello, world!";
const deeplUrl = "https://api.deepl.com/v2/translate";
const deeplData = {
  text: textToTranslate,
  target_lang: "ES"
};

async function fetchDeepLTranslation() {
  try {
    const deeplResponse = await axios.post(deeplUrl, deeplData, { headers: deeplHeaders });
    console.log("Successfully connected to DeepL API.");
    console.log("Translated Text:", deeplResponse.data.translations[0].text);
  } catch (error) {
    console.log(`Failed to connect to DeepL API. Status code: ${error.response.status}`);
  }
}

// Execute API calls
fetchNotionData();
fetchDeepLTranslation();
