import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { KeyTraitsEditor } from './KeyTraitsEditor';
import { apiService } from '../api';
import { toast } from 'react-hot-toast';

interface JobFormProps {
  onSubmit: (description: string, keyTraits: string[]) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTraits, setSuggestedTraits] = useState<string[]>([]);
  const [isEditingTraits, setIsEditingTraits] = useState(false);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await apiService.getKeyTraits(description);
        setSuggestedTraits(response.data.key_traits);
        setIsEditingTraits(true);
      } catch (error) {
        toast.error('Failed to get key traits');
        console.error('Error getting key traits:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleTraitsConfirm = async (traits: string[]) => {
    setIsSubmitting(true);
    try {
      await onSubmit(description, traits);
      setDescription('');
      setIsEditingTraits(false);
      setSuggestedTraits([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditingTraits) {
    return (
      <KeyTraitsEditor
        suggestedTraits={suggestedTraits}
        onConfirm={handleTraitsConfirm}
        onCancel={() => setIsEditingTraits(false)}
      />
    );
  }

  return (
    <form onSubmit={handleInitialSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
          placeholder="Enter job description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !description.trim()}
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
          ${isSubmitting || !description.trim() 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
      >
        <Send size={16} className="mr-2" />
        {isSubmitting ? 'Processing...' : 'Continue'}
      </button>
    </form>
  );
};