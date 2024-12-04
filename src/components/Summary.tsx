import React, { useRef, useEffect } from 'react';

interface SummaryProps {
  text: string;
  onCitationClick: (index: number) => void;
}

export function Summary({ text, onCitationClick }: SummaryProps) {
  // Replace citations [n] with clickable spans
  const formattedText = text.split(/(\[\d+\])/).map((part, index) => {
    const citation = part.match(/\[(\d+)\]/);
    if (citation) {
      const citationNumber = parseInt(citation[1], 10);
      return (
        <button
          key={index}
          onClick={() => onCitationClick(citationNumber - 1)}
          className="text-blue-600 hover:text-blue-700 font-medium px-0.5"
        >
          {part}
        </button>
      );
    }
    return <span key={index}>{part}</span>;
  });

  return (
    <p className="text-gray-700 leading-relaxed">
      {formattedText}
    </p>
  );
}