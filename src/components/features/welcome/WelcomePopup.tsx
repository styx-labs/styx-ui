import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { apiService } from "@/api";
import styxLogo from "@/assets/styx_name_logo_transparent.png";

export function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkShowPopup = async () => {
      try {
        const { data } = await apiService.getShowPopup();
        setShowPopup(data.show_popup);
      } catch (error) {
        console.error("Error checking popup status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkShowPopup();
  }, []);

  const handleClose = async () => {
    if (dontShowAgain) {
      try {
        await apiService.setShowPopup();
      } catch (error) {
        console.error("Error updating popup status:", error);
      }
    }
    setShowPopup(false);
  };

  if (isLoading) return null;

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent 
        className="w-[95vw] max-w-[900px] md:w-[85vw] lg:w-[80vw] xl:w-[70vw] max-h-[90vh] overflow-hidden z-50"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
      >
        <div className="py-4 space-y-4 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="flex justify-center">
                <img src={styxLogo} alt="Styx Logo" className="h-12 object-contain" />
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight">Welcome to Styx! </DialogTitle>
            <DialogDescription className="text-lg mt-2">
                Start leveraging AI to source better candidates, faster
            </DialogDescription>
          <div className="space-y-2">
            <h3 className="font-semibold">Install our Chrome Extension for integration with LinkedIn:</h3>
            <Button
              variant="default"
              className="mt-2"
              onClick={() => window.open("https://chromewebstore.google.com/detail/styx-linkedin-profile-eva/aoehfbedlmpcinddkobkgaddmifnenjl", "_blank")}
            >
              Get Chrome Extension
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Learn how to get the most out of Styx:</h3>
            <div className="relative w-full aspect-video mt-2">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/HbRXibt4wKA"
                frameBorder="0"
                allowFullScreen
                title="Styx Demo Video"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
            />
            <label
              htmlFor="dont-show"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Don't show this again
            </label>
          </div>
          <Button onClick={handleClose}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 