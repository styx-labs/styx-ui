import React from "react";
import {
  Plus,
  Users,
  Sparkles,
  BarChart2,
  Clock,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { Job, Candidate } from "../../../types";
import { useNavigate } from "react-router-dom";

interface HomeScreenProps {
  jobs: Job[];
  candidates: Candidate[];
  onCreateJob: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  jobs,
  candidates,
  onCreateJob,
}) => {
  const navigate = useNavigate();
  const activeJobs = jobs.length;
  const totalCandidates = candidates.length;
  const recentCandidates = candidates
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);

  const recentJobs = jobs
    .sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
      const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back to your recruiting hub
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Candidates
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalCandidates}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {candidates.length > 0
                  ? (
                      candidates.reduce(
                        (acc, curr) => acc + (curr.overall_score || 0),
                        0
                      ) / candidates.length
                    ).toFixed(1)
                  : "-"}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Candidates
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentCandidates.map((candidate) => (
              <div key={candidate.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {candidate.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {candidate.current_title || "No title"}
                    </p>
                  </div>
                  {candidate.overall_score !== undefined && (
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        candidate.overall_score >= 8
                          ? "bg-green-100 text-green-800"
                          : candidate.overall_score >= 6
                          ? "bg-blue-100 text-blue-800"
                          : candidate.overall_score >= 4
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {candidate.overall_score.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {recentCandidates.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No candidates yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
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
      </div>
    </div>
  );
};
