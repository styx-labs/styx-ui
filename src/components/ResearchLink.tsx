import React, { forwardRef } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { SearchResult } from '../types';

interface ResearchLinkProps {
  link: SearchResult;
  index: number;
}

export const ResearchLink = forwardRef<HTMLDivElement, ResearchLinkProps>(
  ({ link, index }, ref) => {
    return (
      <div
        ref={ref}
        id={`link-${index}`}
        className="border rounded-lg p-4 hover:border-blue-500 transition-colors duration-200 scroll-mt-8"
      >
        <div className="flex items-center justify-between">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            {link.url}
          </a>
          <span className="text-sm font-medium text-gray-500">
            [{index + 1}]
          </span>
        </div>
        <p className="mt-2 text-gray-700">{link.summary}</p>
        <p className="text-sm text-gray-500 mt-2">
          Relevance: {link.relevance}
        </p>
      </div>
    );
  }
);