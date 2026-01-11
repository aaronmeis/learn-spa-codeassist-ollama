/**
 * Debug Panel Component
 * 
 * Shows the raw prompts and responses for learning purposes.
 * Helps users understand what's actually being sent to/from the LLM.
 */

import { useState } from 'react';
import HelpButton from './HelpButton.jsx';

function DebugPanel({ 
  prompt = '', 
  response = '', 
  duration = null,
  error = null,
  isLoading = false 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('prompt');

  if (!prompt && !response && !error && !isLoading) {
    return null;
  }

  const helpContent = (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>What is this panel?</h4>
      <p style={{ marginTop: 0, marginBottom: '12px', color: '#1f2937' }}>The Debug Panel shows the raw prompts sent to Ollama and the complete responses received. This is useful for learning and debugging.</p>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>What you'll see:</h4>
      <ul style={{ marginTop: 0, marginBottom: '12px', paddingLeft: '20px', color: '#1f2937' }}>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Prompt tab:</strong> The exact prompt sent to Ollama (includes instructions and your goal)</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Response tab:</strong> The complete raw response from Ollama (includes markdown formatting)</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Duration:</strong> How long the request took in milliseconds</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Error messages:</strong> If something goes wrong, you'll see the error here</li>
      </ul>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Files involved:</h4>
      <ul style={{ marginTop: 0, marginBottom: '12px', paddingLeft: '20px', color: '#1f2937' }}>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/components/DebugPanel.jsx</code> - This component</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/utils/ollama.js</code> - Generates prompts and handles responses</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/utils/codeParser.js</code> - Extracts code from responses</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/App.jsx</code> - Passes prompt/response data to this panel</li>
      </ul>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>How it works:</h4>
      <p style={{ marginTop: 0, marginBottom: 0, color: '#1f2937' }}>When you submit a goal, the app creates a prompt using templates from <code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>ollama.js</code>. This prompt is sent to Ollama, and the response is displayed here. The Code Viewer extracts just the code portion, but this panel shows everything.</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.header}
        >
          <div style={styles.headerLeft}>
            <span style={styles.headerIcon}>🔍</span>
            <span style={styles.headerTitle}>Debug Panel</span>
            {duration && (
              <span style={styles.duration}>{duration}ms</span>
            )}
            {isLoading && (
              <span style={styles.loadingBadge}>Loading...</span>
            )}
            {error && (
              <span style={styles.errorBadge}>Error</span>
            )}
          </div>
          <span style={styles.expandIcon}>
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
        <HelpButton content={helpContent} title="Debug Panel Help" />
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={styles.content}>
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              onClick={() => setActiveTab('prompt')}
              style={{
                ...styles.tab,
                ...(activeTab === 'prompt' ? styles.activeTab : {}),
              }}
            >
              Prompt Sent
              {prompt && <span style={styles.tabBadge}>{prompt.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab('response')}
              style={{
                ...styles.tab,
                ...(activeTab === 'response' ? styles.activeTab : {}),
              }}
            >
              Raw Response
              {response && <span style={styles.tabBadge}>{response.length}</span>}
            </button>
            {error && (
              <button
                onClick={() => setActiveTab('error')}
                style={{
                  ...styles.tab,
                  ...(activeTab === 'error' ? styles.activeTab : {}),
                  color: '#ef4444',
                }}
              >
                Error
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div style={styles.tabContent}>
            {activeTab === 'prompt' && (
              <div style={styles.codeBlock}>
                {prompt ? (
                  <>
                    <div style={styles.codeHeader}>
                      <span>Prompt sent to Ollama</span>
                      <CopyButton text={prompt} />
                    </div>
                    <pre style={styles.pre}>{prompt}</pre>
                  </>
                ) : (
                  <div style={styles.empty}>
                    No prompt sent yet
                  </div>
                )}
              </div>
            )}

            {activeTab === 'response' && (
              <div style={styles.codeBlock}>
                {isLoading ? (
                  <div style={styles.loading}>
                    <span style={styles.spinner}>⟳</span>
                    Waiting for response...
                  </div>
                ) : response ? (
                  <>
                    <div style={styles.codeHeader}>
                      <span>Raw response from Ollama</span>
                      <CopyButton text={response} />
                    </div>
                    <pre style={styles.pre}>{response}</pre>
                  </>
                ) : (
                  <div style={styles.empty}>
                    No response received yet
                  </div>
                )}
              </div>
            )}

            {activeTab === 'error' && error && (
              <div style={styles.errorBlock}>
                <div style={styles.errorHeader}>
                  ❌ Error Details
                </div>
                <pre style={styles.errorPre}>{error}</pre>
                <div style={styles.errorHints}>
                  <strong>Common fixes:</strong>
                  <ul style={styles.hintsList}>
                    <li>Ensure Ollama is running: <code>ollama serve</code></li>
                    <li>Check if model is downloaded: <code>ollama pull codellama:7b</code></li>
                    <li>Verify Ollama is on port 11434</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Learning Info */}
          <div style={styles.learnSection}>
            <span style={styles.learnIcon}>💡</span>
            <span style={styles.learnText}>
              {activeTab === 'prompt' 
                ? "This is the exact text sent to the LLM. Notice how we structure the request for better results."
                : activeTab === 'response'
                ? "This is the raw LLM output. We extract the code from within the ```javascript``` markers."
                : "Check the suggestions above to resolve the error."
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} style={styles.copyButton}>
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  );
}

const styles = {
  container: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    border: '1px solid #2a2a4a',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#0d1117',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    color: 'inherit',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  headerIcon: {
    fontSize: '16px',
  },
  headerTitle: {
    fontWeight: '500',
    color: '#eaeaea',
    fontSize: '14px',
  },
  duration: {
    padding: '2px 8px',
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    color: '#4ade80',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  },
  loadingBadge: {
    padding: '2px 8px',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  },
  errorBadge: {
    padding: '2px 8px',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#ef4444',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
  },
  expandIcon: {
    color: '#6b7280',
    fontSize: '12px',
  },
  content: {
    borderTop: '1px solid #2a2a4a',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #2a2a4a',
    backgroundColor: '#0d1117',
  },
  tab: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#6b7280',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px',
  },
  activeTab: {
    color: '#eaeaea',
    borderBottomColor: '#e94560',
  },
  tabBadge: {
    padding: '1px 6px',
    backgroundColor: '#2a2a4a',
    borderRadius: '4px',
    fontSize: '10px',
  },
  tabContent: {
    maxHeight: '400px',
    overflow: 'auto',
  },
  codeBlock: {
    padding: '12px',
  },
  codeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
    color: '#6b7280',
    fontSize: '12px',
  },
  copyButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: '1px solid #2a2a4a',
    borderRadius: '4px',
    color: '#a0a0a0',
    fontSize: '11px',
    cursor: 'pointer',
  },
  pre: {
    margin: 0,
    padding: '12px',
    backgroundColor: '#0a0a0f',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#a0a0a0',
    fontFamily: "'Fira Code', 'Consolas', monospace",
  },
  empty: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '40px 20px',
    color: '#fbbf24',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
    fontSize: '20px',
  },
  errorBlock: {
    padding: '12px',
  },
  errorHeader: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#ef4444',
    marginBottom: '12px',
  },
  errorPre: {
    margin: 0,
    padding: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    color: '#ef4444',
    fontFamily: "'Fira Code', 'Consolas', monospace",
    marginBottom: '16px',
  },
  errorHints: {
    padding: '12px',
    backgroundColor: '#0a0a0f',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#a0a0a0',
  },
  hintsList: {
    margin: '8px 0 0 0',
    paddingLeft: '20px',
  },
  learnSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderTop: '1px solid #2a2a4a',
  },
  learnIcon: {
    fontSize: '16px',
  },
  learnText: {
    color: '#a0a0a0',
    fontSize: '12px',
    lineHeight: '1.5',
  },
};

export default DebugPanel;
