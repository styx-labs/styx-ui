import React from "react";
import { AlertCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotEnoughCreditsErrorProps {
  creditsNeeded: number;
  creditsAvailable: number;
}

export const NotEnoughCreditsError: React.FC<NotEnoughCreditsErrorProps> = ({
  creditsNeeded,
  creditsAvailable,
}) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Not enough credits
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              You need {creditsNeeded} credits to perform this action, but you
              only have {creditsAvailable} credits available.
            </p>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
                onClick={() => navigate("/pricing")}
                className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
              >
                <CreditCard className="h-4 w-4" />
                Purchase Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
