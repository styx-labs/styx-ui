import React from "react";
import { Plus, BookOpenCheck, Users, Sparkles, Globe } from "lucide-react";

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
        <p className="text-xl text-gray-600">Your sourcing co-pilot</p>
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
            Start by creating a job. Add the job description, and Styx will
            automatically identify key traits and details.
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
              Install Our Chrome Extension
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            Get our Chrome extension to seamlessly evaluate profiles on LinkedIn
            against job descriptions. No need to learn new tools or workflows.
          </p>
          <a
            href="https://chromewebstore.google.com/detail/styx-linkedin-profile-eva/aoehfbedlmpcinddkobkgaddmifnenjl"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add to Chrome
          </a>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              Source Candidates
            </h3>
            <p className="text-gray-600 text-sm">
              Go through you normal sourcing workflow on LinkedIn - our Chrome
              extension will help you gather candidates and add them to Styx.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">AI Search</h3>
            <p className="text-gray-600 text-sm">
              Our AI agents will search the web for additional information about
              the candidates you source.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-4">
              <BookOpenCheck className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Evaluation</h3>
            <p className="text-gray-600 text-sm">
              We'll automatically assess the candidates, providing accurate
              scores and a detailed report with citations so you know we got it
              right.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
