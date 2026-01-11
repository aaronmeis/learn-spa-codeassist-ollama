/**
 * Health Check Component
 * 
 * Displays the status of all required dependencies.
 * Helps users diagnose issues before they get frustrated.
 */

import { useState, useEffect } from 'react';
import { checkAllDependencies, DEFAULT_MODEL } from '../utils/healthCheck.js';
import { logger } from '../utils/logger.js';
import HelpButton from './HelpButton.jsx';

function HealthCheck({ onStatusChange, compact = false }) {
  const [status, setStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const runHealthCheck = async () => {
    setIsChecking(true);
    logger.health('check-started', {});
    
    try {
      const results = await checkAllDependencies(DEFAULT_MODEL);
      setStatus(results);
      setLastChecked(new Date());
      
      if (onStatusChange) {
        onStatusChange(results);
      }
    } catch (error) {
      logger.error('HealthCheck', error);
      setStatus({ allOk: false, error: error.message });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  if (isChecking && !status) {
    return (
      <div style={styles.container}>
        <div style={styles.checking}>
          <span style={styles.spinner}>⟳</span>
          Checking dependencies...
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div style={styles.compactContainer}>
        <span 
          style={{
            ...styles.statusDot,
            backgroundColor: status?.allOk ? '#4ade80' : '#ef4444'
          }}
        />
        <span style={styles.compactText}>
          {status?.allOk ? 'Ready' : 'Issues detected'}
        </span>
        <button 
          onClick={runHealthCheck} 
          style={styles.refreshButton}
          disabled={isChecking}
          title="Refresh status"
        >
          {isChecking ? '⟳' : '↻'}
        </button>
      </div>
    );
  }

  const helpContent = (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>What is this panel?</h4>
      <p style={{ marginTop: 0, marginBottom: '12px', color: '#1f2937' }}>The Health Check panel verifies all dependencies required for the app to work properly.</p>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>What does it check?</h4>
      <ul style={{ marginTop: 0, marginBottom: '12px', paddingLeft: '20px', color: '#1f2937' }}>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Ollama:</strong> Verifies the Ollama server is running and accessible at http://localhost:11434</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Model:</strong> Checks if the required model ({DEFAULT_MODEL}) is downloaded</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>IndexedDB:</strong> Browser storage for future persistence features</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>Web Workers:</strong> Required for code sandbox execution (Phase 2+)</li>
        <li style={{ marginBottom: '6px' }}><strong style={{ color: '#111827', fontWeight: '600' }}>WebAssembly:</strong> Needed for embeddings (Phase 4+)</li>
      </ul>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Files involved:</h4>
      <ul style={{ marginTop: 0, marginBottom: '12px', paddingLeft: '20px', color: '#1f2937' }}>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/utils/healthCheck.js</code> - Health check logic</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/components/HealthCheck.jsx</code> - This component</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/utils/ollama.js</code> - Ollama connection check</li>
      </ul>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>How it works:</h4>
      <p style={{ marginTop: 0, marginBottom: 0, color: '#1f2937' }}>On app load, it automatically checks all dependencies. Click the refresh button (↻) to re-check manually.</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3 style={styles.title}>System Status</h3>
          <HelpButton content={helpContent} title="Health Check Help" />
        </div>
        <button 
          onClick={runHealthCheck} 
          style={styles.refreshButton}
          disabled={isChecking}
        >
          {isChecking ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      <div style={styles.checks}>
        {/* Ollama Server */}
        <StatusItem
          label="Ollama Server"
          status={status?.checks?.ollama?.ok}
          error={status?.checks?.ollama?.error}
          hint="Run: ollama serve"
        />

        {/* Model */}
        <StatusItem
          label={`Model (${DEFAULT_MODEL})`}
          status={status?.checks?.model?.ok}
          error={status?.checks?.model?.error}
          hint={`Run: ollama pull ${DEFAULT_MODEL}`}
        />

        {/* IndexedDB */}
        <StatusItem
          label="IndexedDB"
          status={status?.checks?.indexedDB?.ok}
          error={status?.checks?.indexedDB?.error}
          hint="Browser storage for persistence"
        />

        {/* Web Workers */}
        <StatusItem
          label="Web Workers"
          status={status?.checks?.workers?.ok}
          error={status?.checks?.workers?.error}
          hint="Needed for code sandbox"
        />
      </div>

      {/* Available Models */}
      {status?.checks?.ollama?.ok && status?.checks?.ollama?.models?.length > 0 && (
        <div style={styles.modelsSection}>
          <span style={styles.modelsLabel}>Available models:</span>
          <span style={styles.modelsList}>
            {status.checks.ollama.models.slice(0, 5).join(', ')}
            {status.checks.ollama.models.length > 5 && ` +${status.checks.ollama.models.length - 5} more`}
          </span>
        </div>
      )}

      {/* Overall Status */}
      <div style={{
        ...styles.overallStatus,
        backgroundColor: status?.allOk ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        borderColor: status?.allOk ? '#4ade80' : '#ef4444',
      }}>
        {status?.allOk ? (
          <>✅ All systems ready!</>
        ) : (
          <>⚠️ Some dependencies need attention</>
        )}
      </div>

      {lastChecked && (
        <div style={styles.timestamp}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

function StatusItem({ label, status, error, hint }) {
  const isOk = status === true;
  const isPending = status === undefined || status === null;

  return (
    <div style={styles.statusItem}>
      <div style={styles.statusLeft}>
        <span style={{
          ...styles.statusIcon,
          color: isPending ? '#fbbf24' : isOk ? '#4ade80' : '#ef4444'
        }}>
          {isPending ? '○' : isOk ? '✓' : '✗'}
        </span>
        <span style={styles.statusLabel}>{label}</span>
      </div>
      <div style={styles.statusRight}>
        {!isOk && !isPending && error && (
          <span style={styles.errorText} title={hint}>
            {error.length > 40 ? error.slice(0, 40) + '...' : error}
          </span>
        )}
        {isOk && (
          <span style={styles.okText}>OK</span>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #2a2a4a',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#eaeaea',
  },
  refreshButton: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: '#a0a0a0',
    border: '1px solid #2a2a4a',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#0d1117',
    borderRadius: '6px',
  },
  statusLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  statusIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  statusLabel: {
    color: '#eaeaea',
    fontSize: '14px',
  },
  statusRight: {
    display: 'flex',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  okText: {
    color: '#4ade80',
    fontSize: '12px',
    fontWeight: '500',
  },
  modelsSection: {
    padding: '8px 12px',
    backgroundColor: '#0d1117',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '12px',
  },
  modelsLabel: {
    color: '#a0a0a0',
    marginRight: '8px',
  },
  modelsList: {
    color: '#eaeaea',
  },
  overallStatus: {
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: '500',
    border: '1px solid',
    marginBottom: '8px',
  },
  timestamp: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '12px',
  },
  checking: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#a0a0a0',
    justifyContent: 'center',
    padding: '20px',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  compactContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#16213e',
    borderRadius: '8px',
    border: '1px solid #2a2a4a',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  compactText: {
    color: '#eaeaea',
    fontSize: '14px',
  },
};

export default HealthCheck;
