import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

interface SelectionListenerProps {
  apiUrl: string;
  onSelection?: (selectedText: string) => void;
  onAnalysis?: (analysis: string) => void;
}

const SelectionListener: React.FC<SelectionListenerProps> = ({
  apiUrl,
  onSelection,
  onAnalysis
}) => {
  const [selectedText, setSelectedText] = useState<string>('');
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';

      if (text) {
        // Get the position for the tooltip
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setTooltipPosition({
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY - 40 // Position above the selection
          });
        }

        setSelectedText(text);
        setShowTooltip(true);

        // Call the onSelection callback if provided
        if (onSelection) {
          onSelection(text);
        }
      } else {
        setShowTooltip(false);
      }
    };

    // Add event listeners
    document.addEventListener('mouseup', handleSelection);

    // Cleanup
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, [onSelection]);

  const handleAnalyze = async () => {
    if (!selectedText) return;

    try {
      const response = await fetch(`${apiUrl}/api/analyze-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedText,
          context_url: window.location.pathname,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      // Hide the tooltip after clicking analyze
      setShowTooltip(false);

      // Call the onAnalysis callback if provided
      if (onAnalysis) {
        onAnalysis(data.explanation);
      } else {
        // If no callback is provided, we could open the chat with the selected text
        // For now, just show an alert with the analysis
        alert(`Analysis: ${data.explanation}`);
      }
    } catch (error) {
      console.error('Error analyzing selection:', error);
      alert('Error analyzing selection. Please try again.');
    }
  };

  if (!showTooltip || !selectedText) {
    return null;
  }

  return (
    <div
      className={styles.selectionTooltip}
      style={{
        left: `${tooltipPosition.x}px`,
        top: `${tooltipPosition.y}px`,
      }}
    >
      <button
        className={styles.tooltipButton}
        onClick={handleAnalyze}
      >
        Ask AI
      </button>
    </div>
  );
};

export default SelectionListener;