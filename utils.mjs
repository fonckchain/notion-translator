// utils.mjs
import * as utils from './utils.mjs';

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
