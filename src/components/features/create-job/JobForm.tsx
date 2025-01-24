import { JobTraitsForm } from "./forms/JobTraitsForm";
import { JobIdealProfilesForm } from "./forms/JobIdealProfilesForm";
import { JobDescriptionForm } from "./forms/JobDescriptionForm";
import { ProgressBar } from "./components/ProgressBar";
import { useJobForm } from "./hooks/useJobForm";
import { KeyTrait, STEPS } from "./types";

interface JobFormProps {
  onSubmit: (
    description: string,
    keyTraits: KeyTrait[],
    jobTitle: string,
    companyName: string,
    ideal_profile_urls: string[]
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
            onConfirm={actions.handleTraitsConfirm}
            onBack={actions.goToPreviousStep}
          />
        );
      case 2:
        return (
          <JobIdealProfilesForm
            onSubmit={actions.handleIdealProfilesSubmit}
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
