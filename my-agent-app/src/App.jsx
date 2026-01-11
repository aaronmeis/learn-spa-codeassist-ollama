/**
 * Main Application Component
 * 
 * Phase 1: Hello Ollama
 * - Health check on load
 * - Goal input with examples
 * - Code generation via Ollama
 * - Code display with Monaco editor
 * - Debug panel showing prompts/responses
 */

import { useState, useEffect, useCallback } from 'react';
import HealthCheck from './components/HealthCheck.jsx';
import GoalInput from './components/GoalInput.jsx';
import CodeViewer from './components/CodeViewer.jsx';
import DebugPanel from './components/DebugPanel.jsx';
import { useOllama } from './hooks/useOllama.js';
import { PROMPTS } from './utils/ollama.js';
import { logger } from './utils/logger.js';
import './App.css';

function App() {
  // Ollama hook for LLM interaction
  const {
    isConnected,
    isLoading,
    isChecking,
    error,
    lastResponse,
    lastCode,
    streamingCode,
    lastDuration,
    tokens,
    generate,
    checkConnection,
  } = useOllama({ autoCheck: true });

  // Local state
  const [currentGoal, setCurrentGoal] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [useMockMode, setUseMockMode] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [showHealthDetails, setShowHealthDetails] = useState(true);

  // Handle health status changes
  const handleHealthStatus = useCallback((status) => {
    setHealthStatus(status);
    logger.health('status-updated', { allOk: status.allOk });
    
    // Auto-collapse health panel if all OK
    if (status.allOk) {
      setTimeout(() => setShowHealthDetails(false), 2000);
    }
  }, []);

  // Handle goal submission
  const handleGoalSubmit = async (goal) => {
    setCurrentGoal(goal);
    
    // Generate the prompt (for debug panel)
    const prompt = PROMPTS.codeGeneration(goal, '');
    setCurrentPrompt(prompt);
    
    logger.agent('goal-submitted', { goal, useMockMode });
    
    // Call Ollama
    const result = await generate(goal, '', { useMock: useMockMode });
    
    if (result?.success) {
      logger.success('code-generated', { 
        codeLength: result.code?.length,
        duration: result.duration 
      });
    }
  };

  // Toggle mock mode
  const toggleMockMode = () => {
    setUseMockMode(!useMockMode);
    logger.ui('mock-mode-toggled', { enabled: !useMockMode });
  };

  // Log app initialization
  useEffect(() => {
    logger.ui('app-initialized', { phase: 1 });
    console.log(
      '%c🤖 Self-Improving Coding Agent - Phase 1',
      'font-size: 16px; font-weight: bold; color: #e94560;'
    );
    console.log(
      '%cType enableDebug() for verbose logging',
      'color: #6b7280; font-style: italic;'
    );
  }, []);

  return (
    <div className="app">
      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <div className="app-title-section">
            <h1 className="app-title">
              🤖 Self-Improving Coding Agent
            </h1>
            <p className="app-subtitle">
              <span className="phase-badge">Phase 1</span>
              Ollama Integration + Code Generation
            </p>
          </div>
          
          <HealthCheck 
            compact={!showHealthDetails}
            onStatusChange={handleHealthStatus}
          />
        </header>

        {/* Mock Mode Banner */}
        {useMockMode && (
          <div className="mock-banner fade-in">
            <span className="mock-banner-icon">🎭</span>
            <span className="mock-banner-text">
              Mock mode enabled - responses are simulated (no Ollama required)
            </span>
            <button 
              className="mock-banner-button"
              onClick={toggleMockMode}
            >
              Disable
            </button>
          </div>
        )}

        {/* Connection Warning */}
        {!isConnected && !isChecking && !useMockMode && (
          <div className="mock-banner fade-in" style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)'
          }}>
            <span className="mock-banner-icon">⚠️</span>
            <span className="mock-banner-text" style={{ color: '#ef4444' }}>
              Ollama not connected. Start it with <code>ollama serve</code> or enable mock mode.
            </span>
            <button 
              className="mock-banner-button"
              onClick={toggleMockMode}
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              Use Mock Mode
            </button>
          </div>
        )}

        {/* Main Layout */}
        <main className="main-layout">
          {/* Input Section */}
          <section className="input-section">
            <div className="section-card">
              <h2 className="section-title">
                📝 Goal Input
              </h2>
              <GoalInput
                onSubmit={handleGoalSubmit}
                isLoading={isLoading}
                disabled={!isConnected && !useMockMode}
              />
            </div>

            {/* Debug Panel */}
            <DebugPanel
              prompt={currentPrompt}
              response={lastResponse}
              duration={lastDuration}
              error={error}
              isLoading={isLoading}
            />
          </section>

          {/* Output Section */}
          <section className="output-section">
            <div className="section-card">
              <h2 className="section-title">
                💻 Generated Code
              </h2>
              <CodeViewer
                code={streamingCode || lastCode || ''}
                title={currentGoal ? `Code for: ${currentGoal.slice(0, 40)}...` : 'Generated Code'}
                height="400px"
              />
            </div>

            {/* Generation Stats */}
            {(lastCode || streamingCode) && lastDuration && (
              <div className="section-card fade-in">
                <h2 className="section-title">
                  📊 Generation Stats
                </h2>
                <div style={styles.statsGrid}>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Duration</span>
                    <span style={styles.statValue}>{lastDuration}ms</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Code Length</span>
                    <span style={styles.statValue}>{(streamingCode || lastCode || '').length} chars</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Lines</span>
                    <span style={styles.statValue}>{(streamingCode || lastCode || '').split('\n').length}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span style={styles.statLabel}>Mode</span>
                    <span style={{
                      ...styles.statValue,
                      color: useMockMode ? '#fbbf24' : '#4ade80'
                    }}>
                      {useMockMode ? 'Mock' : 'Live'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            <span className={`status-dot ${isChecking ? 'loading' : isConnected ? 'connected' : 'disconnected'}`} />
            <span>
              Ollama: {isChecking ? 'Checking...' : isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className="status-item">
            <span>Model: codellama:7b</span>
          </div>
          <div className="status-item">
            <button 
              onClick={checkConnection}
              className="btn btn-secondary"
              style={{ padding: '4px 12px', fontSize: '12px' }}
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Self-Improving Coding Agent MVP • Phase 1: Hello Ollama
          </p>
          <p>
            💡 Open DevTools console for logs • 
            Type <code>enableDebug()</code> for verbose output
          </p>
        </footer>
      </div>
      
      {/* Token Counter - Bottom Right */}
      {tokens.total > 0 && (
        <div style={styles.tokenCounter}>
          <div style={styles.tokenLabel}>Tokens Used</div>
          <div style={styles.tokenValue}>{tokens.total.toLocaleString()}</div>
          <div style={styles.tokenBreakdown}>
            <span style={styles.tokenDetail}>Prompt: {tokens.prompt.toLocaleString()}</span>
            <span style={styles.tokenDetail}>Generated: {tokens.generated.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    backgroundColor: '#0d1117',
    borderRadius: '8px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#eaeaea',
  },
  tokenCounter: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    padding: '12px 16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
    minWidth: '160px',
    backdropFilter: 'blur(10px)',
  },
  tokenLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
    fontWeight: '600',
  },
  tokenValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#60a5fa',
    marginBottom: '6px',
  },
  tokenBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    fontSize: '11px',
    color: '#6b7280',
  },
  tokenDetail: {
    display: 'block',
  },
};

export default App;
