import React, { useState } from 'react';
import { FormInput, CandidateEvaluation } from './types';
import { evaluateCandidate } from './services/api';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { TextArea } from './components/TextArea';
import { EvaluationResult } from './components/EvaluationResult';

const initialState: FormInput = {
  jobDescription: '',
  candidateInfo: '',
};

function App() {
  const [formState, setFormState] = useState<FormInput>(initialState);
  const [evaluation, setEvaluation] = useState<CandidateEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.jobDescription || !formState.candidateInfo) {
      setError('Please fill in both the job description and candidate information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await evaluateCandidate(formState);
      setEvaluation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate candidate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TextArea
              label="Job Description"
              value={formState.jobDescription}
              onChange={(value) =>
                setFormState((prev) => ({ ...prev, jobDescription: value }))
              }
              placeholder="Paste the complete job description here..."
            />
            <TextArea
              label="Candidate Information"
              value={formState.candidateInfo}
              onChange={(value) =>
                setFormState((prev) => ({ ...prev, candidateInfo: value }))
              }
              placeholder="Paste the candidate's information, resume, or profile here..."
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button type="submit" loading={loading}>
              Evaluate Candidate
            </Button>

            {error && (
              <div className="text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </div>
        </form>

        {evaluation && <EvaluationResult evaluation={evaluation} />}
      </main>
    </div>
  );
}

export default App;