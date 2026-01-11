/**
 * Structured logging utility for debugging and learning
 * 
 * Usage:
 *   import { logger } from './utils/logger';
 *   logger.ollama('request', { prompt: '...' });
 *   logger.agent('plan', { iteration: 1 });
 * 
 * Enable verbose mode:
 *   localStorage.setItem('DEBUG', 'true');
 */

const isDebugEnabled = () => {
  try {
    return localStorage.getItem('DEBUG') === 'true';
  } catch {
    return false;
  }
};

const formatTimestamp = () => {
  return new Date().toISOString().split('T')[1].slice(0, -1);
};

const createLogger = (emoji, category) => (event, data) => {
  const timestamp = formatTimestamp();
  const prefix = `${emoji} [${timestamp}] [${category}:${event}]`;
  
  if (isDebugEnabled()) {
    console.group(prefix);
    console.log('Data:', data);
    console.groupEnd();
  } else {
    console.log(prefix, typeof data === 'object' ? '' : data);
    if (typeof data === 'object' && data !== null) {
      console.log('  └─', data);
    }
  }
};

export const logger = {
  // Ollama/LLM related logs
  ollama: createLogger('🦙', 'ollama'),
  
  // Agent loop logs
  agent: createLogger('🤖', 'agent'),
  
  // Database/storage logs
  db: createLogger('💾', 'db'),
  
  // Embedding/vector logs
  embed: createLogger('🧮', 'embed'),
  
  // Web Worker logs
  worker: createLogger('⚙️', 'worker'),
  
  // UI/component logs
  ui: createLogger('🖥️', 'ui'),
  
  // Health check logs
  health: createLogger('🏥', 'health'),
  
  // Error logs (always visible)
  error: (category, error) => {
    console.error(`❌ [${formatTimestamp()}] [error:${category}]`, error);
  },
  
  // Success logs
  success: createLogger('✅', 'success'),
};

// Helper to enable debug mode
export const enableDebug = () => {
  localStorage.setItem('DEBUG', 'true');
  console.log('🔧 Debug mode enabled. Refresh to see verbose logs.');
};

// Helper to disable debug mode
export const disableDebug = () => {
  localStorage.removeItem('DEBUG');
  console.log('🔧 Debug mode disabled.');
};

// Expose to window for easy console access
if (typeof window !== 'undefined') {
  window.enableDebug = enableDebug;
  window.disableDebug = disableDebug;
}

export default logger;
