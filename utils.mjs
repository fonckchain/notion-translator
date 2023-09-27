// Extracts the page ID from a Notion URL
export function extractPageId(url) {
  // Check if URL is undefined or null
  if (!url) {
    throw new Error("URL is undefined or null.");
  }

  // Use regex to extract Notion page ID from the URL
  const match = url.match(/([a-fA-F0-9]{32})/);  // Adjust regex as needed

  // Check if regex found a match
  if (!match || match.length < 1) {
    throw new Error("Failed to extract page ID.");
  }

  return match[0];  // Return the extracted page ID
}


// Prettify JSON object for better readability
export function toPrettifiedJSON(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    console.error("Failed to prettify JSON:", error);
    throw new Error("Failed to prettify JSON.");
  }
}

// Remove unnecessary properties from an object
export function removeUnnecessaryProperties(obj, propertiesToRemove) {
  try {
    const cleanedObj = { ...obj };
    for (const prop of propertiesToRemove) {
      delete cleanedObj[prop];
    }
    return cleanedObj;
  } catch (error) {
    console.error("Failed to remove unnecessary properties:", error);
    throw new Error("Failed to remove unnecessary properties.");
  }
}

// Deep copy an object using JSON methods (not the most efficient but works for this use case)
export function deepCopy(obj) {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    console.error("Failed to deep copy object:", error);
    throw new Error("Failed to deep copy object.");
  }
}
