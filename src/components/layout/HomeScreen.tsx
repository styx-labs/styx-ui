import React from "react";
import {
  Plus,
  Sparkles,
  Briefcase,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { Job } from "../../types";
import { useNavigate } from "react-router-dom";

interface HomeScreenProps {
  jobs: Job[];
  onCreateJob: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  jobs,
  onCreateJob,
}) => {
  const navigate = useNavigate();
  const activeJobs = jobs.length;

  const recentJobs = jobs
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back to your recruiting hub
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {activeJobs}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-4">
              <button
                onClick={onCreateJob}
                className="w-full flex items-center justify-between p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <Plus className="w-5 h-5 mr-3" />
                  <span className="font-medium">Create New Job</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span className="font-medium">Purchase Search Credits</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="https://chromewebstore.google.com/detail/styx-linkedin-profile-eva/aoehfbedlmpcinddkobkgaddmifnenjl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-3" />
                  <span className="font-medium">Install Chrome Extension</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Jobs
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <p className="font-medium text-gray-900">
                    {job.company_name}
                  </p>
                  <p className="text-sm text-gray-500">{job.job_title}</p>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No jobs created yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Demo Video */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Demo
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Watch how to get the most out of Styx
              </p>
            </div>
            <div className="flex-1 relative">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/HbRXibt4wKA"
                frameBorder="0"
                allowFullScreen
                title="Styx Demo Video"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
