import { JobTraitsForm } from "./forms/JobTraitsForm";
import { JobCalibrationProfilesForm } from "./forms/JobCalibrationProfilesForm";
import { JobDescriptionForm } from "./forms/JobDescriptionForm";
import { ProgressBar } from "./components/ProgressBar";
import { useJobForm } from "./hooks/useJobForm";
import { KeyTrait, STEPS } from "./types";
import type { CalibratedProfile } from "@/types/index";

interface JobFormProps {
  onSubmit: (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string,
    calibratedProfiles: CalibratedProfile[]
  ) => void;
}

export const JobForm: React.FC<JobFormProps> = ({ onSubmit }) => {
  const { state, actions } = useJobForm({ onSubmit });

  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 3:
        return (
          <JobTraitsForm
            suggestedTraits={state.suggestedTraits}
            jobTitle={state.jobTitle}
            companyName={state.companyName}
            calibratedProfiles={state.calibratedProfiles}
            onConfirm={actions.handleTraitsConfirm}
            onBack={actions.goToPreviousStep}
          />
        );
      case 2:
        return (
          <JobCalibrationProfilesForm
            onSubmit={actions.handleCalibrateProfilesSubmit}
            onBack={actions.goToPreviousStep}
          />
        );
      default:
        return (
          <JobDescriptionForm
            description={state.description}
            onDescriptionChange={actions.setDescription}
            onSubmit={actions.handleDescriptionSubmit}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProgressBar currentStep={state.currentStep} steps={STEPS} />
      {renderCurrentStep()}
    </div>
  );
};
