import React from "react";
import { Profile } from "../../../../types";

interface ProfileContentProps {
  profile: Profile;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ profile }) => {
  return (
    <div className="space-y-8 p-6 bg-white rounded-lg shadow-sm">
      {/* Header Information */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">
          {profile.full_name}
        </h2>
        <div className="space-y-1">
          <p className="text-lg font-medium text-blue-600">
            {profile.headline}
          </p>
          <p className="text-gray-600">{profile.occupation}</p>
        </div>
        {profile.summary && (
          <p className="text-gray-700 mt-4 leading-relaxed">
            {profile.summary}
          </p>
        )}
      </div>

      {/* Experience Section */}
      {profile.experiences && profile.experiences.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Experience
          </h3>
          <div className="space-y-8">
            {profile.experiences.map((exp, index) => (
              <div
                key={index}
                className="relative pl-6 border-l-2 border-blue-100 hover:border-blue-500 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {exp.title}
                      </h4>
                      <p className="text-blue-600 font-medium">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {exp.starts_at} - {exp.ends_at}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{exp.location}</p>
                  {exp.description && (
                    <p className="text-gray-700 mt-2 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.summarized_job_description && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-gray-700 font-medium">
                        AI Summary
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {exp.summarized_job_description.job_description}
                      </p>
                      {exp.summarized_job_description.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-blue-100">
                          <p className="text-xs text-gray-500">Sources:</p>
                          <div className="mt-1 space-y-1">
                            {exp.summarized_job_description.sources.map(
                              (source, idx) => (
                                <a
                                  key={idx}
                                  href={source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                                >
                                  {source}
                                </a>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {profile.education && profile.education.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Education
          </h3>
          <div className="space-y-8">
            {profile.education.map((edu, index) => (
              <div
                key={index}
                className="relative pl-6 border-l-2 border-purple-100 hover:border-purple-500 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {edu.degree_name}
                      </h4>
                      <p className="text-purple-600 font-medium">
                        {edu.school}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {edu.field_of_study}
                      </p>
                    </div>
                    {(edu.starts_at || edu.ends_at) && (
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {edu.starts_at} - {edu.ends_at || "Present"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
