import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

interface PaymentStatusProps {
  status: "success" | "cancel";
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  const navigate = useNavigate();
  const redirectPath = status === "success" ? "/" : "/pricing";

  useEffect(() => {
    // Redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate(redirectPath);
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, redirectPath]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
        {status === "success" ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your credits have been added to your
              account.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to home page in 5 seconds...
            </div>
          </div>
        ) : (
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Cancelled
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment was not completed. Please try again or contact
              support if you need assistance.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to pricing page in 5 seconds...
            </div>
          </div>
        )}
        <button
          onClick={() => navigate(redirectPath)}
          className="mt-6 w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {status === "success" ? "Return to Home" : "Return to Pricing"}
        </button>
      </div>
    </div>
  );
};
