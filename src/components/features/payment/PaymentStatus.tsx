import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          {status === "success" ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
          )}
        </CardHeader>
        <CardContent className="text-center">
          <CardTitle className="text-2xl mb-2">
            {status === "success" ? "Payment Successful!" : "Payment Cancelled"}
          </CardTitle>
          <p className="text-muted-foreground mb-6">
            {status === "success"
              ? "Thank you for your purchase. Your credits have been added to your account."
              : "Your payment was not completed. Please try again or contact support if you need assistance."}
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to {status === "success" ? "home" : "pricing"} page in 5
            seconds...
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => navigate(redirectPath)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {status === "success" ? "Return to Home" : "Return to Pricing"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
