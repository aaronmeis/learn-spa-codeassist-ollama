/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs the error, and displays a fallback UI instead of crashing the app.
 * 
 * Learning: Error boundaries are React's way of handling runtime errors.
 * They must be class components (hooks don't support componentDidCatch yet).
 */

import React from 'react';
import { logger } from '../utils/logger.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging
    logger.error('ErrorBoundary', {
      error: error.toString(),
      componentStack: errorInfo.componentStack
    });

    this.setState({ errorInfo });

    // You could also send to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null,
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>😵 Something went wrong</h1>
            
            <p style={styles.message}>
              The application encountered an unexpected error. This has been logged for debugging.
            </p>
            
            {this.state.error && (
              <details style={styles.details}>
                <summary style={styles.summary}>Error Details</summary>
                <pre style={styles.errorText}>
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
            
            <div style={styles.actions}>
              <button 
                onClick={this.handleReset}
                style={styles.button}
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={styles.buttonSecondary}
              >
                Reload Page
              </button>
            </div>

            <p style={styles.hint}>
              💡 Tip: Open the browser console (F12) for more details
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#1a1a2e',
  },
  card: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #2a2a4a',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: '16px',
  },
  message: {
    color: '#a0a0a0',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  details: {
    textAlign: 'left',
    backgroundColor: '#0d1117',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  summary: {
    cursor: 'pointer',
    color: '#e94560',
    fontWeight: '500',
    marginBottom: '12px',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '14px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: '12px',
  },
  stackTrace: {
    color: '#6b7280',
    fontSize: '12px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    maxHeight: '200px',
    overflow: 'auto',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: '#a0a0a0',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  hint: {
    color: '#6b7280',
    fontSize: '14px',
  },
};

export default ErrorBoundary;
