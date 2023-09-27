import deepl from 'deepl-node';
import { promisify } from 'util';

const sleep = promisify(setTimeout);
let translator;

export function init(apiToken) {
  if (!apiToken) {
    throw new Error("DeepL API token is missing. Please initialize with a valid token.");
  }
  translator = new deepl.Translator(apiToken);
}

export function validateLanguage(from, to) {
  const supportedLanguages = ['EN', 'DE', 'FR', 'PT', 'ZH', 'RU', 'NL', 'IT', 'PL', 'JA'];
  if (!supportedLanguages.includes(from) || !supportedLanguages.includes(to)) {
    throw new Error("Unsupported source or target language.");
  }
}

export async function translateText(richTextArray, from, to) {
  validateLanguage(from, to);
  const translatedArray = [];

  for (const textObj of richTextArray) {
    try {
      const response = await translator.translate({
        text: textObj.text,
        source_lang: from,
        target_lang: to
      });

      if (response.statusCode === 429) {
        console.log('Rate limit reached. Sleeping for 60 seconds.');
        await sleep(60000);
        continue;
      }

      translatedArray.push({
        ...textObj,
        text: response.data.translations[0].text
      });

    } catch (error) {
      console.error("Translation failed:", error);
      throw new Error("Translation failed.");
    }
  }

  return translatedArray;
}
