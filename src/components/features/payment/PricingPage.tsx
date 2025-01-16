import React from "react";
import { CreditCard, Loader2, Coins } from "lucide-react";
import { usePricing } from "../../../hooks/usePricing";
import { useSearchCredits } from "../../../hooks/useSearchCredits";

const pricingTiers = [
  {
    name: "Basic",
    price: 9.99,
    credits: 100,
    costPerSearch: "$0.10",
    description:
      "Perfect for small teams or individual recruiters getting started with AI-powered recruiting.",
  },
  {
    name: "Growth",
    price: 44.99,
    credits: 500,
    costPerSearch: "$0.09",
    popular: true,
    description:
      "Ideal for growing teams who need advanced features and higher volume candidate processing.",
  },
  {
    name: "Enterprise",
    isEnterprise: true,
    description:
      "Custom solutions for large organizations with high-volume recruiting needs.",
  },
];

export const PricingPage: React.FC = () => {
  const { handleSelectPlan, isLoading } = usePricing();
  const { searchCredits, loading: creditsLoading } = useSearchCredits();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Search Credits
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Power up your recruiting with AI-driven candidate evaluation and
          outreach. Choose the plan that best fits your needs.
        </p>
        {!creditsLoading && searchCredits !== null && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full text-purple-700">
            <Coins className="w-5 h-5" />
            <span className="font-medium">
              {searchCredits} search credits remaining
            </span>
          </div>
        )}
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-white rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 ${
              tier.popular ? "border-2 border-purple-500" : ""
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-5 inset-x-0 flex justify-center">
                <span className="inline-block bg-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-md">
                  Most Popular
                </span>
              </div>
            )}
            <div className="p-8 flex flex-col h-full">
              <div className="flex-grow">
                <div className="h-32">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h2>
                  <p className="text-gray-600 text-sm">{tier.description}</p>
                </div>

                <div className="h-24">
                  {!tier.isEnterprise ? (
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-900">
                        ${tier.price}
                      </span>
                      <span className="text-gray-500 ml-2">/package</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">
                      Custom Pricing
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-8">
                  {!tier.isEnterprise ? (
                    <>
                      <div className="text-lg font-semibold text-gray-900">
                        {tier.credits} credits
                      </div>
                      <div className="text-gray-600 text-sm">
                        {tier.costPerSearch} per search
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-lg font-semibold text-gray-900">
                        500-50,000 credits
                      </div>
                      <div className="text-gray-600 text-sm">
                        Volume-based pricing
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-8">
                <button
                  onClick={() =>
                    tier.isEnterprise
                      ? (window.location.href = "mailto:support@styxlabs.co")
                      : handleSelectPlan(tier.name.toLowerCase())
                  }
                  disabled={!tier.isEnterprise && isLoading}
                  className={`w-full flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium transition-colors ${
                    tier.popular
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : tier.isEnterprise
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {!tier.isEnterprise ? (
                    isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Get Started
                      </>
                    )
                  ) : (
                    "Contact Sales"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ or Additional Info */}
      <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          About Search Credits
        </h2>
        <div className="text-gray-600 space-y-6">
          <p className="text-lg">
            Search credits power our AI-driven candidate evaluation system. Each
            credit unlocks:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Profile Analysis
              </h3>
              <p className="text-sm">
                Comprehensive LinkedIn profile evaluation using advanced AI
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Trait Scoring
              </h3>
              <p className="text-sm">
                AI-powered assessment of candidate traits against job
                requirements
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Email Discovery
              </h3>
              <p className="text-sm">
                Automated email finding for candidate outreach
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Smart Messaging
              </h3>
              <p className="text-sm">
                AI-generated personalized outreach messages
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            Credits never expire and can be used across any job posting in your
            account. Higher tier plans include additional features and premium
            support options.
          </p>
        </div>
      </div>
    </div>
  );
};
