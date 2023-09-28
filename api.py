import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize API Tokens
notion_api_token = os.getenv("NOTION_API_TOKEN")
deepl_api_token = os.getenv("DEEPL_API_TOKEN")

# Set up headers
notion_headers = {
    "Authorization": notion_api_token,
    "Notion-Version": "2021-08-16"
}
deepl_headers = {
    "Authorization": f"DeepL-Auth-Key {deepl_api_token}"
}

# Notion API request
page_id = "your_page_id_here"
notion_url = f"https://api.notion.com/v1/pages/dc02f31b-c5f4-4ac4-80e2-0c0a58da2d28"
notion_response = requests.get(notion_url, headers=notion_headers)


# DeepL API request
text_to_translate = "Hello, world!"
deepl_url = "https://api.deepl.com/v2/translate"
deepl_data = {
    "text": text_to_translate,
    "target_lang": "ES"
}
deepl_response = requests.post(deepl_url, headers=deepl_headers, data=deepl_data)

# Check responses
if notion_response.status_code == 200:
    print("Successfully connected to Notion API.")
else:
    print(f"Failed to connect to Notion API. Status code: {notion_response.status_code}")

if deepl_response.status_code == 200:
    print("Successfully connected to DeepL API.")
else:
    print(f"Failed to connect to DeepL API. Status code: {deepl_response.status_code}")
