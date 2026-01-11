/**
 * Code Parser Utility
 * 
 * LLMs typically wrap code in markdown code blocks like:
 * ```javascript
 * function add(a, b) { return a + b; }
 * ```
 * 
 * This utility extracts the actual code from these responses.
 */

import { logger } from './logger.js';

/**
 * Extract code from a markdown-formatted LLM response
 * @param {string} response - Raw LLM response
 * @returns {string} - Extracted code or original response if no code block found
 */
export function extractCode(response) {
  if (!response || typeof response !== 'string') {
    logger.error('codeParser', 'Invalid response provided to extractCode');
    return '';
  }

  // Try to match code blocks with language specifier
  const codeBlockWithLang = response.match(/```(?:javascript|js|jsx|typescript|ts)?\n([\s\S]*?)```/);
  
  if (codeBlockWithLang) {
    const extracted = codeBlockWithLang[1].trim();
    logger.agent('code-extracted', { 
      originalLength: response.length, 
      extractedLength: extracted.length,
      hasCodeBlock: true 
    });
    return extracted;
  }

  // Try to match generic code blocks
  const genericCodeBlock = response.match(/```\n?([\s\S]*?)```/);
  
  if (genericCodeBlock) {
    const extracted = genericCodeBlock[1].trim();
    logger.agent('code-extracted', { 
      originalLength: response.length, 
      extractedLength: extracted.length,
      hasCodeBlock: true,
      generic: true 
    });
    return extracted;
  }

  // No code block found, return trimmed response
  logger.agent('code-extracted', { 
    originalLength: response.length, 
    hasCodeBlock: false,
    note: 'No code block found, returning raw response' 
  });
  return response.trim();
}

/**
 * Extract multiple code blocks from a response
 * @param {string} response - Raw LLM response
 * @returns {Array<{language: string, code: string}>} - Array of code blocks
 */
export function extractAllCodeBlocks(response) {
  if (!response || typeof response !== 'string') {
    return [];
  }

  const blocks = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(response)) !== null) {
    blocks.push({
      language: match[1] || 'plaintext',
      code: match[2].trim()
    });
  }

  logger.agent('code-blocks-extracted', { count: blocks.length });
  return blocks;
}

/**
 * Check if a string contains valid JavaScript syntax (basic check)
 * @param {string} code - Code string to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateJavaScript(code) {
  try {
    // Use Function constructor to parse without executing
    new Function(code);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: e.message };
  }
}

/**
 * Clean up common LLM response artifacts
 * @param {string} code - Code that may contain artifacts
 * @returns {string} - Cleaned code
 */
export function cleanCodeArtifacts(code) {
  if (!code) return '';
  
  let cleaned = code;
  
  // Remove common prefixes LLMs add
  cleaned = cleaned.replace(/^(?:Here's|Here is|The following|This is).*?:\s*/i, '');
  
  // Remove trailing explanations
  cleaned = cleaned.replace(/\n\n(?:This|The|Note|Explanation).*$/s, '');
  
  // Remove "Copy code" artifacts
  cleaned = cleaned.replace(/Copy code\s*/g, '');
  
  return cleaned.trim();
}

export default {
  extractCode,
  extractAllCodeBlocks,
  validateJavaScript,
  cleanCodeArtifacts
};
