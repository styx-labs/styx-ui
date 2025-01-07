import React, { useState } from 'react';
import { UserPlus, Plus, Minus, Loader2, Info } from 'lucide-react';

interface CandidateFormProps {
  onSubmit: (name?: string, context?: string, url?: string) => Promise<void>;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [url, setUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState<'nameContext' | 'url'>('nameContext');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((formType === 'nameContext' && name.trim() && context.trim()) || (formType === 'url' && url.trim())) {
      setIsLoading(true);
      try {
        if (formType === 'nameContext') {
          await onSubmit(name, context);
          setName('');
          setContext('');
        } else {
          await onSubmit(undefined, undefined, url);
          setUrl('');
        }
        setIsExpanded(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors mb-4"
      >
        <Plus size={20} className="mr-2" />
        Manually Add Candidate
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative mt-4 mb-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1.5 bg-white text-gray-500 hover:text-gray-700 rounded-full shadow-sm border border-gray-200 hover:bg-gray-50"
          title="Close form"
        >
          <Minus size={16} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setFormType('nameContext')}
            className={`px-4 py-2 rounded-md ${formType === 'nameContext' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Name & Context
          </button>
          <button
            type="button"
            onClick={() => setFormType('url')}
            className={`px-4 py-2 rounded-md ${formType === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            LinkedIn
          </button>
        </div>

        {formType === 'nameContext' ? (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Candidate Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700">
                Candidate Context
                <div className="group relative inline-block">
                  <Info 
                    size={16} 
                    className="inline-block ml-2 text-gray-400 hover:text-gray-600"
                  />
                  <div className="absolute hidden group-hover:block w-64 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg -right-64 top-6">
                    Enter some basic information about the candidate to aid in our search. Info copy/pasted from their LinkedIn works great.
                  </div>
                </div>
              </label>
              <textarea
                id="context"
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">
              Candidate LinkedIn URL
            </label>
            <input
              type="url"
              id="url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : (
            <UserPlus size={16} className="mr-2" />
          )}
          {isLoading ? 'Evaluating...' : 'Evaluate Candidate'}
        </button>
      </form>
    </div>
  );
};