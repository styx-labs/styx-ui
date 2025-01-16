import React from "react";
import { Check } from "lucide-react";

interface PricingOption {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
  isPopular?: boolean;
}

const pricingOptions: PricingOption[] = [
  {
    id: "basic",
    name: "Basic",
    price: 10,
    credits: 100,
    features: [
      "100 candidate searches",
      "AI-powered candidate evaluation",
      "LinkedIn profile analysis",
      "Email generation",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 45,
    credits: 500,
    features: [
      "500 candidate searches",
      "AI-powered candidate evaluation",
      "LinkedIn profile analysis",
      "Email generation",
      "Priority support",
    ],
    isPopular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 85,
    credits: 1000,
    features: [
      "1,000 candidate searches",
      "AI-powered candidate evaluation",
      "LinkedIn profile analysis",
      "Email generation",
      "Priority support",
      "Best value (8.5¢ per search)",
    ],
  },
];

interface PricingOptionsProps {
  onSelectPlan: (planId: string) => Promise<void>;
}

export const PricingOptions: React.FC<PricingOptionsProps> = ({
  onSelectPlan,
}) => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Select the number of candidate searches you need
        </p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-3 sm:gap-6 sm:space-y-0">
        {pricingOptions.map((option) => (
          <div
            key={option.id}
            className={`rounded-lg shadow-sm divide-y divide-gray-200 ${
              option.isPopular
                ? "border-2 border-purple-500 relative"
                : "border border-gray-200"
            }`}
          >
            {option.isPopular && (
              <div className="absolute -top-5 inset-x-0">
                <div className="inline-block px-4 py-1 text-sm font-semibold tracking-wider text-white transform bg-purple-500 rounded-full">
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-6">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                {option.name}
              </h3>
              <p className="mt-8">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  ${option.price}
                </span>
              </p>
              <p className="mt-4 text-sm text-gray-500">
                {option.credits.toLocaleString()} candidate searches
              </p>
              <p className="mt-1 text-sm text-purple-600 font-medium">
                ${(option.price / option.credits).toFixed(2)} per search
              </p>

              <button
                onClick={() => onSelectPlan(option.id)}
                className={`mt-8 block w-full py-3 px-6 border rounded-md text-sm font-medium text-center ${
                  option.isPopular
                    ? "bg-purple-600 border-transparent text-white hover:bg-purple-700"
                    : "border-purple-600 text-purple-600 hover:bg-purple-50"
                }`}
              >
                Get Started
              </button>
            </div>

            <div className="pt-6 pb-8 px-6">
              <h4 className="text-sm font-medium text-gray-900 tracking-wide">
                What's included
              </h4>
              <ul className="mt-4 space-y-3">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="ml-3 text-sm text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
