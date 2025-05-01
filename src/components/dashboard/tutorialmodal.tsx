import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import supabase from "@/lib/supabaseClient";

interface TutorialModalProps {
  userId: string | null;
}

const steps = [
  {
    title: "Welcome to your Dashboard 🎉",
    description: "Let’s take a quick tour of how widgets help you stay on top of your budget.",
  },
  {
    title: "Weekly Budget",
    description: "This widget shows how much you’ve spent this week compared to your budget.",
  },
  {
    title: "Savings Streak",
    description: "Track how many weeks in a row you’ve stayed within budget. Keep your streak alive!",
  },
  {
    title: "Weekly Summary",
    description: "Every week, we’ll summarize your activity and highlight trends that matter.",
  },
];

export default function TutorialModal({ userId }: TutorialModalProps) {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const checkTourStatus = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("dashboard_tour_seen")
        .eq("id", userId)
        .single();

      if (!error && data && data.dashboard_tour_seen === false) {
        setShow(true);
      }
    };

    checkTourStatus();
  }, [userId]);

  const handleClose = async () => {
    setShow(false);

    if (userId) {
      await supabase
        .from("profiles")
        .update({ dashboard_tour_seen: true })
        .eq("id", userId);
    }
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={show}>
      <DialogContent className="max-w-md text-center space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{steps[step].title}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">{steps[step].description}</p>

        <div className="flex justify-between mt-6">
          <Button variant="ghost" disabled={step === 0} onClick={handleBack}>
            Back
          </Button>
          <Button onClick={handleNext}>
            {step === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Step {step + 1} of {steps.length}
        </p>
      </DialogContent>
    </Dialog>
  );
}
