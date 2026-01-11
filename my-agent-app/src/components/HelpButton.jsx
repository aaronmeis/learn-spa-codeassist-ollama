/**
 * Help Button Component
 * 
 * Displays a help icon that shows information about the panel when clicked.
 */

import { useState } from 'react';

function HelpButton({ content, title = 'Help' }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div style={styles.container}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.button}
        title={title}
        aria-label={title}
      >
        <span style={styles.icon}>ℹ️</span>
      </button>
      
      {isOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsOpen(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{title}</h3>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.closeButton}
                aria-label="Close help"
              >
                ×
              </button>
            </div>
            <div style={styles.modalContent}>
              {content}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  button: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '16px',
    lineHeight: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  icon: {
    fontSize: '18px',
    opacity: 0.7,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '70vh', // Reduced from 80vh to fit better on standard screens
    overflow: 'auto',
    zIndex: 1001,
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px', // Reduced padding
    borderBottom: '2px solid #d1d5db', // Darker border for better contrast
    backgroundColor: '#f9fafb', // Light gray background for header
    flexShrink: 0,
  },
  modalTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '700', // Bolder for better contrast
    color: '#111827', // Much darker for better contrast
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#374151', // Darker for better contrast
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  modalContent: {
    padding: '16px', // Reduced padding
    color: '#111827', // Much darker text for better contrast
    lineHeight: '1.5', // Tighter line height
    fontSize: '14px', // Slightly smaller font to fit more content
    overflow: 'auto',
    flex: 1,
  },
};

export default HelpButton;
