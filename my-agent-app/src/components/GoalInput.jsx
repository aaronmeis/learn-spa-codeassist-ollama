/**
 * Goal Input Component
 * 
 * Form for entering coding goals with example presets.
 * Phase 1: Basic input with examples
 * Phase 2+: Will include test case inputs
 */

import { useState } from 'react';
import { EXAMPLE_GOALS, getRandomExample } from '../data/examples.js';
import { logger } from '../utils/logger.js';
import HelpButton from './HelpButton.jsx';

function GoalInput({ onSubmit, isLoading = false, disabled = false }) {
  const [goal, setGoal] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!goal.trim()) {
      return;
    }

    logger.ui('goal-submit', { goal: goal.slice(0, 50) });
    onSubmit(goal.trim());
  };

  const handleExampleSelect = (example) => {
    setGoal(example.goal);
    setShowExamples(false);
    logger.ui('example-selected', { id: example.id, title: example.title });
  };

  const handleRandomExample = () => {
    const example = getRandomExample();
    setGoal(example.goal);
    logger.ui('random-example', { id: example.id });
  };

  const handleClear = () => {
    setGoal('');
    logger.ui('goal-cleared', {});
  };

  const helpContent = (
    <div>
      <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>What is this panel?</h4>
      <p style={{ marginTop: 0, marginBottom: '12px', color: '#1f2937' }}>The Goal Input panel is where you describe what code you want the AI to generate.</p>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>How to use it:</h4>
      <ul style={{ marginTop: 0, marginBottom: '12px', paddingLeft: '20px', color: '#1f2937' }}>
        <li style={{ marginBottom: '6px' }}>Type a description of the code you want (e.g., "Write a function that reverses a string")</li>
        <li style={{ marginBottom: '6px' }}>Click "Generate Code" or press Enter to send your goal to Ollama</li>
        <li style={{ marginBottom: '6px' }}>Use example goals for quick testing - click "Show Examples" to see preset goals</li>
        <li style={{ marginBottom: '6px' }}>The code will stream in real-time to the Code Viewer panel</li>
      </ul>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>Files involved:</h4>
      <ul style={{ marginTop: 0, marginBottom: '12px', paddingLeft: '20px', color: '#1f2937' }}>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/components/GoalInput.jsx</code> - This component</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/data/examples.js</code> - Example goals data</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/utils/ollama.js</code> - Code generation logic</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/hooks/useOllama.js</code> - Ollama state management</li>
        <li style={{ marginBottom: '6px' }}><code style={{ backgroundColor: '#f3f4f6', color: '#111827', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace', border: '1px solid #d1d5db' }}>src/App.jsx</code> - Handles goal submission</li>
      </ul>
      
      <h4 style={{ marginTop: '12px', marginBottom: '8px', fontSize: '15px', fontWeight: '700', color: '#111827' }}>How it works:</h4>
      <p style={{ marginTop: 0, marginBottom: 0, color: '#1f2937' }}>When you submit a goal, it's sent to Ollama (or mock mode) which generates JavaScript code. The code streams in real-time and appears in the Code Viewer panel below.</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <label htmlFor="goal-input" style={styles.label}>
            What should the code do?
          </label>
          <HelpButton content={helpContent} title="Goal Input Help" />
        </div>
        
        <textarea
          id="goal-input"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g., Write a function called 'add' that takes two numbers and returns their sum"
          style={styles.textarea}
          rows={3}
          disabled={disabled || isLoading}
        />

        <div style={styles.actions}>
          <div style={styles.leftActions}>
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              style={styles.secondaryButton}
              disabled={disabled || isLoading}
            >
              {showExamples ? 'Hide Examples' : 'Show Examples'}
            </button>
            <button
              type="button"
              onClick={handleRandomExample}
              style={styles.secondaryButton}
              disabled={disabled || isLoading}
              title="Load a random example"
            >
              🎲 Random
            </button>
            {goal && (
              <button
                type="button"
                onClick={handleClear}
                style={styles.clearButton}
                disabled={isLoading}
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              opacity: (!goal.trim() || isLoading || disabled) ? 0.5 : 1,
            }}
            disabled={!goal.trim() || isLoading || disabled}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}>⟳</span>
                Generating...
              </>
            ) : (
              'Generate Code'
            )}
          </button>
        </div>
      </form>

      {/* Examples Panel */}
      {showExamples && (
        <div style={styles.examplesPanel}>
          <div style={styles.examplesHeader}>
            <span style={styles.examplesTitle}>Example Goals</span>
            <span style={styles.examplesHint}>Click to load</span>
          </div>
          
          <div style={styles.examplesList}>
            {EXAMPLE_GOALS.map((example) => (
              <button
                key={example.id}
                onClick={() => handleExampleSelect(example)}
                style={styles.exampleItem}
                disabled={isLoading}
              >
                <div style={styles.exampleHeader}>
                  <span style={styles.exampleTitle}>{example.title}</span>
                  <span style={{
                    ...styles.difficultyBadge,
                    backgroundColor: 
                      example.difficulty === 'easy' ? 'rgba(74, 222, 128, 0.2)' :
                      example.difficulty === 'medium' ? 'rgba(251, 191, 36, 0.2)' :
                      'rgba(239, 68, 68, 0.2)',
                    color:
                      example.difficulty === 'easy' ? '#4ade80' :
                      example.difficulty === 'medium' ? '#fbbf24' :
                      '#ef4444',
                  }}>
                    {example.difficulty}
                  </span>
                </div>
                <div style={styles.exampleGoal}>
                  {example.goal.length > 80 
                    ? example.goal.slice(0, 80) + '...' 
                    : example.goal}
                </div>
                <div style={styles.exampleMeta}>
                  <span style={styles.categoryTag}>{example.category}</span>
                  <span style={styles.testCount}>
                    {example.tests.length} test{example.tests.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div style={styles.tips}>
        <span style={styles.tipIcon}>💡</span>
        <span style={styles.tipText}>
          Be specific about function names and expected behavior for better results
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#eaeaea',
  },
  textarea: {
    padding: '12px',
    backgroundColor: '#0d1117',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    color: '#eaeaea',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '80px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  leftActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  secondaryButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#a0a0a0',
    border: '1px solid #2a2a4a',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  clearButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  examplesPanel: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    border: '1px solid #2a2a4a',
    overflow: 'hidden',
  },
  examplesHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #2a2a4a',
    backgroundColor: '#0d1117',
  },
  examplesTitle: {
    fontWeight: '500',
    color: '#eaeaea',
    fontSize: '14px',
  },
  examplesHint: {
    color: '#6b7280',
    fontSize: '12px',
  },
  examplesList: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  exampleItem: {
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #2a2a4a',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: 'inherit',
  },
  exampleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  exampleTitle: {
    fontWeight: '500',
    color: '#eaeaea',
    fontSize: '14px',
  },
  difficultyBadge: {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  exampleGoal: {
    color: '#a0a0a0',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  exampleMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  categoryTag: {
    color: '#6b7280',
    fontSize: '11px',
    backgroundColor: '#2a2a4a',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  testCount: {
    color: '#6b7280',
    fontSize: '11px',
  },
  tips: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    backgroundColor: 'rgba(233, 69, 96, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(233, 69, 96, 0.2)',
  },
  tipIcon: {
    fontSize: '16px',
  },
  tipText: {
    color: '#a0a0a0',
    fontSize: '13px',
  },
};

export default GoalInput;
