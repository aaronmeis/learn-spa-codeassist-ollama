/**
 * useOllama Hook
 * 
 * Custom hook for managing Ollama connection state and operations.
 * Provides connection status, loading states, and generation functions.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { callOllama, generateCode, isOllamaAvailable, DEFAULT_MODEL } from '../utils/ollama.js';
import { extractCode } from '../utils/codeParser.js';
import { logger } from '../utils/logger.js';

/**
 * @typedef {Object} OllamaState
 * @property {boolean} isConnected - Whether Ollama server is reachable
 * @property {boolean} isLoading - Whether a request is in progress
 * @property {boolean} isChecking - Whether connection check is in progress
 * @property {string|null} error - Current error message
 * @property {string|null} lastResponse - Last raw response from Ollama
 * @property {string|null} lastCode - Last extracted code
 * @property {number|null} lastDuration - Last request duration in ms
 */

/**
 * Custom hook for Ollama integration
 * @param {Object} options
 * @param {string} options.model - Model to use
 * @param {boolean} options.autoCheck - Auto-check connection on mount
 * @param {number} options.checkInterval - Interval for connection checks (0 = disabled)
 * @returns {OllamaState & {generate: Function, checkConnection: Function, reset: Function}}
 */
export function useOllama(options = {}) {
  const {
    model = DEFAULT_MODEL,
    autoCheck = true,
    checkInterval = 0 // Set to e.g. 30000 for 30s interval checks
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const [lastResponse, setLastResponse] = useState(null);
  const [lastCode, setLastCode] = useState(null);
  const [lastDuration, setLastDuration] = useState(null);
  const [streamingCode, setStreamingCode] = useState(''); // Real-time streaming code
  const [tokens, setTokens] = useState({ prompt: 0, generated: 0, total: 0 }); // Token usage

  // Refs for cleanup
  const mountedRef = useRef(true);
  const intervalRef = useRef(null);

  /**
   * Check if Ollama is available
   */
  const checkConnection = useCallback(async () => {
    if (!mountedRef.current) return false;
    
    setIsChecking(true);
    logger.ollama('connection-check', { model });
    
    try {
      const available = await isOllamaAvailable();
      
      if (mountedRef.current) {
        setIsConnected(available);
        if (!available) {
          setError('Ollama not available. Run: ollama serve');
        } else {
          setError(null);
        }
      }
      
      return available;
    } catch (err) {
      if (mountedRef.current) {
        setIsConnected(false);
        setError(err.message);
      }
      return false;
    } finally {
      if (mountedRef.current) {
        setIsChecking(false);
      }
    }
  }, [model]);

  /**
   * Generate code from a goal (with streaming support)
   */
  const generate = useCallback(async (goal, context = '', ollamaOptions = {}) => {
    if (!mountedRef.current) return null;
    
    setIsLoading(true);
    setError(null);
    setStreamingCode(''); // Reset streaming code
    
    logger.ui('generate-start', { goal: goal.slice(0, 50) });
    
    // Track streaming response for real-time updates
    let accumulatedResponse = '';
    
    try {
      const result = await generateCode(goal, context, {
        model,
        ...ollamaOptions,
        // Add streaming callback for real-time updates
        onChunk: (chunk) => {
          if (!mountedRef.current) return;
          accumulatedResponse += chunk;
          // Extract code from accumulated response and update streaming state
          const code = extractCode(accumulatedResponse);
          setStreamingCode(code);
          setLastResponse(accumulatedResponse);
        }
      });
      
      if (!mountedRef.current) return null;
      
      if (result.success) {
        const code = extractCode(result.response);
        
        setLastResponse(result.response);
        setLastCode(code);
        setStreamingCode(code); // Final update
        setLastDuration(result.duration);
        setTokens(result.tokens || { prompt: 0, generated: 0, total: 0 });
        setError(null);
        
        logger.ui('generate-complete', { 
          success: true, 
          codeLength: code.length,
          duration: result.duration,
          tokens: result.tokens?.total || 0
        });
        
        return {
          success: true,
          code,
          rawResponse: result.response,
          duration: result.duration,
          tokens: result.tokens
        };
      } else {
        setError(result.error);
        setLastResponse(null);
        setLastCode(null);
        setStreamingCode('');
        setLastDuration(result.duration);
        setTokens({ prompt: 0, generated: 0, total: 0 });
        
        logger.ui('generate-complete', { success: false, error: result.error });
        
        return {
          success: false,
          code: null,
          error: result.error,
          duration: result.duration,
          tokens: { prompt: 0, generated: 0, total: 0 }
        };
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        setStreamingCode('');
        logger.error('useOllama', err);
      }
      return {
        success: false,
        code: null,
        error: err.message
      };
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [model]);

  /**
   * Send a raw prompt to Ollama
   */
  const sendPrompt = useCallback(async (prompt, ollamaOptions = {}) => {
    if (!mountedRef.current) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await callOllama(prompt, {
        model,
        ...ollamaOptions
      });
      
      if (!mountedRef.current) return null;
      
      if (result.success) {
        setLastResponse(result.response);
        setLastDuration(result.duration);
        setError(null);
      } else {
        setError(result.error);
      }
      
      return result;
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
      }
      return { success: false, error: err.message };
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [model]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setError(null);
    setLastResponse(null);
    setLastCode(null);
    setStreamingCode('');
    setLastDuration(null);
    setTokens({ prompt: 0, generated: 0, total: 0 });
  }, []);

  // Auto-check connection on mount
  useEffect(() => {
    mountedRef.current = true;
    
    if (autoCheck) {
      checkConnection();
    }
    
    // Set up interval checking if enabled
    if (checkInterval > 0) {
      intervalRef.current = setInterval(checkConnection, checkInterval);
    }
    
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoCheck, checkInterval, checkConnection]);

  return {
    // State
    isConnected,
    isLoading,
    isChecking,
    error,
    lastResponse,
    lastCode,
    streamingCode, // Real-time streaming code
    lastDuration,
    tokens, // Token usage: { prompt, generated, total }
    model,
    
    // Actions
    generate,
    sendPrompt,
    checkConnection,
    reset
  };
}

export default useOllama;
