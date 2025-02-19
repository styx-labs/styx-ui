import { PaymentStatus } from "./PaymentStatus";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <PaymentStatus status="success" />
    </div>
  );
} 