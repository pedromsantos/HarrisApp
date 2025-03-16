import React from 'react';

interface LineNotationProps {
  line: string[];
  tabData: string[] | string | undefined;
  notationRef: (el: HTMLDivElement | null) => void;
  index: number;
}

export const LineNotation: React.FC<LineNotationProps> = ({
  line,
  tabData,
  notationRef,
  index,
}) => (
  <div key={index} className="p-3">
    {/* Pitch notation */}
    <div className="p-2 rounded-t mb-1 bg-primary/10">
      <code className="text-sm block font-medium text-foreground">{line.join(', ')}</code>
    </div>

    {/* Music notation */}
    <div ref={notationRef} className="p-2 mb-1 bg-background rounded overflow-auto"></div>

    {/* Tab notation */}
    <div className="p-2 rounded-b bg-muted/30">
      <pre className="p-0 m-0 font-mono text-sm overflow-x-auto whitespace-pre text-foreground">
        {tabData
          ? Array.isArray(tabData)
            ? tabData.join('\n') || ''
            : typeof tabData === 'string'
              ? String(tabData || '')
              : 'Invalid tab format'
          : 'No tab data available'}
      </pre>
    </div>
  </div>
);
