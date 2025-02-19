import { HomeScreen } from "./components/layout/HomeScreen";
import { JobForm } from "./components/features/create-job/JobForm";
import { JobDetail } from "./components/features/jobs/JobDetail";
import { PaymentStatus } from "./components/features/payment/PaymentStatus";
import PricingPage from "./components/features/payment/PricingPage";
import PaymentSuccessPage from "./components/features/payment/PaymentSuccessPage";
import PaymentErrorPage from "./components/features/payment/PaymentErrorPage";
import { SettingsPage } from "./components/features/settings/SettingsPage";
import { CalibratedProfile, Job } from "./types/index";

interface RouteConfig {
  path: string;
  element: React.ReactNode;
}

interface CreateJobFormProps {
  onSubmit: (
    description: string,
    keyTraits: Job["key_traits"],
    jobTitle: string,
    companyName: string,
    calibratedProfiles: CalibratedProfile[]
  ) => Promise<void>;
}

export function getRoutes({
  onCreateJob,
}: {
  onCreateJob: CreateJobFormProps["onSubmit"];
}): RouteConfig[] {
  return [
    {
      path: "/",
      element: <HomeScreen />,
    },
    {
      path: "/create",
      element: <JobForm onSubmit={onCreateJob} />,
    },
    {
      path: "/pricing",
      element: <PricingPage />,
    },
    {
      path: "/jobs/:jobId",
      element: <JobDetail />,
    },
    {
      path: "/pricing/success",
      element: <PaymentSuccessPage />,
    },
    {
      path: "/pricing/error",
      element: <PaymentErrorPage />,
    },
    {
      path: "/settings",
      element: <SettingsPage />,
    },
  ];
}
