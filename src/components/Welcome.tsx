import React from "react";
import { Plus, Search, Users, Sparkles } from "lucide-react";

interface WelcomeProps {
  onCreateClick: () => void;
}

export const Welcome: React.FC<WelcomeProps> = ({ onCreateClick }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Styx
        </h1>
        <p className="text-xl text-gray-600">
          Your AI-powered recruiting assistant
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 ml-3">
              Create Your First Job
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Start by creating a job posting. Add the job description, and Styx
            will automatically identify key traits.
          </p>
          <button
            onClick={onCreateClick}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Job
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 ml-3">
              AI-Powered Matching
            </h2>
          </div>
          <p className="text-gray-600">
            Our AI analyzes job descriptions and candidate profiles to find the
            perfect match based on key traits and qualifications.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <Plus className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Create a Job</h3>
            <p className="text-gray-600 text-sm">
              Add your job description and let AI identify key traits
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Add Candidates</h3>
            <p className="text-gray-600 text-sm">
              Import candidates from various sources
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Match & Analyze</h3>
            <p className="text-gray-600 text-sm">
              Get AI-powered insights and matching scores
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
