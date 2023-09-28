// deepl.mjs
import deepl from 'deepl-node';
import { promisify } from 'util';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();
const sleep = promisify(setTimeout);
let translator;
let deeplHeaders;

export function init() {
  const apiToken = process.env.DEEPL_API_TOKEN;
  if (!apiToken) {
    throw new Error("DeepL API token is missing. Please initialize with a valid token.");
  }
  translator = new deepl.Translator(apiToken);
  deeplHeaders = {
    'Authorization': `DeepL-Auth-Key ${apiToken}`
  };
}

export function validateLanguage(from, to) {
  const supportedLanguages = ['EN', 'ES', 'DE', 'FR', 'PT', 'ZH', 'RU', 'NL', 'IT', 'PL', 'JA'];
  if (!supportedLanguages.includes(from) || !supportedLanguages.includes(to)) {
    throw new Error("Unsupported source or target language.");
  }
}

export async function translateText(richTextArray, from, to) {
  validateLanguage(from, to);
  const translatedArray = [];

  for (const textObj of richTextArray) {
    try {
      const response = await translator.translateText(textObj.text, from, to);

      if (response.statusCode === 429) {
        console.log('Rate limit reached. Sleeping for 60 seconds.');
        await sleep(60000);
        continue;
      }

      translatedArray.push({
        ...textObj,
        text: response.text
      });

    } catch (error) {
      console.error("Translation failed:", error);
      throw new Error("Translation failed.");
    }
  }

  return translatedArray;
}

export async function fetchDeepLTranslation(textToTranslate, targetLang) {
  const deeplUrl = "https://api.deepl.com/v2/translate";
  const deeplData = {
    text: textToTranslate,
    target_lang: targetLang
  };
  try {
    const deeplResponse = await axios.post(deeplUrl, deeplData, { headers: deeplHeaders });
    return deeplResponse.data.translations[0].text;
  } catch (error) {
    console.error(`Failed to connect to DeepL API. Status code: ${error.response.status}`);
    throw error;
  }
}

// Initialize DeepL with API token from .env
init();

// Test the translation function
async function testTranslate() {
  const result = await translateText([{ text: 'Hello, world!' }], 'EN', 'ES');
  console.log(result[0].text);
}

// Uncomment to run the test
testTranslate();
