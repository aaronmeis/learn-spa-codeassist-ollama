/**
 * Health Check Utility
 * 
 * Verifies all required dependencies are available before the user
 * gets frustrated with cryptic errors.
 * 
 * Checks:
 * - Ollama server running and accessible
 * - Required model downloaded
 * - IndexedDB available (for future phases)
 * - Web Workers supported (for future phases)
 * - WebAssembly supported (for embeddings in future phases)
 */

import { logger } from './logger.js';
import { DEFAULT_MODEL } from './ollama.js';

const OLLAMA_BASE_URL = 'http://localhost:11434';

/**
 * Check if Ollama server is running
 * @returns {Promise<{ok: boolean, models: string[], error: string|null}>}
 */
export async function checkOllama() {
  logger.health('ollama-check', { url: OLLAMA_BASE_URL });
  
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const models = data.models?.map(m => m.name) || [];
    
    logger.health('ollama-check-result', { ok: true, modelCount: models.length });
    
    return {
      ok: true,
      models,
      error: null
    };
  } catch (error) {
    const errorMessage = error.name === 'TimeoutError' 
      ? 'Connection timeout - is Ollama running?'
      : error.message.includes('fetch') 
        ? 'Cannot connect to Ollama - is it running on port 11434?'
        : error.message;
    
    logger.health('ollama-check-result', { ok: false, error: errorMessage });
    
    return {
      ok: false,
      models: [],
      error: errorMessage
    };
  }
}

/**
 * Check if a specific model is available
 * @param {string} modelName - Model to check for
 * @returns {Promise<{ok: boolean, error: string|null}>}
 */
export async function checkModel(modelName = DEFAULT_MODEL) {
  const ollamaStatus = await checkOllama();
  
  if (!ollamaStatus.ok) {
    return { ok: false, error: ollamaStatus.error };
  }
  
  // Normalize model name for comparison (remove tags if needed)
  const normalizedName = modelName.split(':')[0];
  const hasModel = ollamaStatus.models.some(m => 
    m.toLowerCase().startsWith(normalizedName.toLowerCase())
  );
  
  if (!hasModel) {
    return {
      ok: false,
      error: `Model "${modelName}" not found. Run: ollama pull ${modelName}`
    };
  }
  
  return { ok: true, error: null };
}

/**
 * Check if IndexedDB is available
 * @returns {{ok: boolean, error: string|null}}
 */
export function checkIndexedDB() {
  try {
    if (!window.indexedDB) {
      return { ok: false, error: 'IndexedDB not supported in this browser' };
    }
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Check if Web Workers are supported
 * @returns {{ok: boolean, error: string|null}}
 */
export function checkWorkerSupport() {
  try {
    if (!window.Worker) {
      return { ok: false, error: 'Web Workers not supported' };
    }
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Check if WebAssembly is supported (needed for transformers.js)
 * @returns {{ok: boolean, error: string|null}}
 */
export function checkWasmSupport() {
  try {
    if (typeof WebAssembly !== 'object') {
      return { ok: false, error: 'WebAssembly not supported' };
    }
    return { ok: true, error: null };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

/**
 * Run all health checks
 * @param {string} modelName - Model to verify
 * @returns {Promise<{
 *   allOk: boolean,
 *   checks: {
 *     ollama: {ok: boolean, error: string|null, models: string[]},
 *     model: {ok: boolean, error: string|null},
 *     indexedDB: {ok: boolean, error: string|null},
 *     workers: {ok: boolean, error: string|null},
 *     wasm: {ok: boolean, error: string|null}
 *   }
 * }>}
 */
export async function checkAllDependencies(modelName = DEFAULT_MODEL) {
  logger.health('full-check-start', { model: modelName });
  
  const ollama = await checkOllama();
  const model = ollama.ok ? await checkModel(modelName) : { ok: false, error: 'Ollama not available' };
  const indexedDB = checkIndexedDB();
  const workers = checkWorkerSupport();
  const wasm = checkWasmSupport();
  
  const checks = { ollama, model, indexedDB, workers, wasm };
  const allOk = Object.values(checks).every(c => c.ok);
  
  logger.health('full-check-complete', { allOk, checks });
  
  return { allOk, checks };
}

/**
 * Get a user-friendly status message
 * @param {Awaited<ReturnType<typeof checkAllDependencies>>} results 
 * @returns {string}
 */
export function getStatusMessage(results) {
  if (results.allOk) {
    return '✅ All systems ready!';
  }
  
  const issues = [];
  
  if (!results.checks.ollama.ok) {
    issues.push(`Ollama: ${results.checks.ollama.error}`);
  } else if (!results.checks.model.ok) {
    issues.push(`Model: ${results.checks.model.error}`);
  }
  
  if (!results.checks.indexedDB.ok) {
    issues.push(`Storage: ${results.checks.indexedDB.error}`);
  }
  
  if (!results.checks.workers.ok) {
    issues.push(`Workers: ${results.checks.workers.error}`);
  }
  
  return issues.join('\n');
}

export { DEFAULT_MODEL };

export default {
  checkOllama,
  checkModel,
  checkIndexedDB,
  checkWorkerSupport,
  checkWasmSupport,
  checkAllDependencies,
  getStatusMessage,
  OLLAMA_BASE_URL,
  DEFAULT_MODEL
};
