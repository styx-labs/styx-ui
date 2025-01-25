import React, { useState } from 'react';
import { Job, TraitType } from '../../../../types';
import { apiService } from '../../../../api';
import { toast } from 'react-hot-toast';
import { TraitCard } from '../../create-job/components/TraitCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface EditKeyTraitsProps {
  job: Job;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditKeyTraits: React.FC<EditKeyTraitsProps> = ({
  job,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [traits, setTraits] = useState<Job['key_traits']>(job.key_traits);

  const handleSubmit = async () => {
    if (!traits.length) {
      toast.error('At least one trait is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.editKeyTraits(job.id!, traits);
      toast.success('Key traits updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating key traits:', error);
      toast.error('Failed to update key traits');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTrait = () => {
    setTraits([
      ...traits,
      {
        trait: '',
        description: '',
        trait_type: TraitType.SCORE,
        required: false,
      },
    ]);
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const updateTrait = (index: number, updates: Partial<Job['key_traits'][0]>) => {
    const newTraits = [...traits];
    newTraits[index] = { ...newTraits[index], ...updates };
    setTraits(newTraits);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Edit Key Traits</h2>
                <p className="text-sm text-muted-foreground">
                  Update the key traits for {job.job_title} at {job.company_name}
                </p>
              </div>

              <div className="space-y-4">
                {traits.map((trait, index) => (
                  <TraitCard
                    key={index}
                    trait={trait}
                    index={index}
                    onRemove={removeTrait}
                    onUpdate={updateTrait}
                  />
                ))}

                <Button onClick={addTrait} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add another trait
                </Button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 