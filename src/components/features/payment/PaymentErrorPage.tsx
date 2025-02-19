import { PaymentStatus } from "./PaymentStatus";

export default function PaymentErrorPage() {
  return (
    <div className="min-h-screen bg-background">
      <PaymentStatus status="cancel" />
    </div>
  );
}
