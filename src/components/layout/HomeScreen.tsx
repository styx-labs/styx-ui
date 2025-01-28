import React from "react";
import {
  Sparkles,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/pricing")}
              className="flex items-center justify-between p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
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
              className="flex items-center justify-between p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center">
                <Sparkles className="w-5 h-5 mr-3" />
                <span className="font-medium">Install Chrome Extension</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Demo Video */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Demo
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Watch how to get the most out of Styx
            </p>
          </div>
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/HbRXibt4wKA"
              frameBorder="0"
              allowFullScreen
              title="Styx Demo Video"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
