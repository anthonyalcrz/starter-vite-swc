import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseclient";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface TutorialModalProps {
  userId: string | null;
}

export default function TutorialModal({ userId }: TutorialModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [completingTutorial, setCompletingTutorial] = useState(false);

  useEffect(() => {
    const checkTutorialStatus = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("tutorial_complete")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error checking tutorial status:", error.message);
        setIsLoadingUser(false);
        return;
      }

      if (data && !data.tutorial_complete) {
        setIsOpen(true);
      }

      setIsLoadingUser(false);
    };

    checkTutorialStatus();
  }, [userId]);

  const handleCompleteTutorial = async () => {
    if (!userId) return;

    setCompletingTutorial(true);

    const { error } = await supabase
      .from("profiles")
      .update({ tutorial_complete: true })
      .eq("id", userId);

    if (error) {
      console.error("Error updating tutorial status:", error.message);
      toast.error("Failed to save tutorial completion.");
    } else {
      toast.success("Tutorial completed! 🎉");
    }

    setIsOpen(false);
    setCompletingTutorial(false);
  };

  if (isLoadingUser) return null; // 🛡️ Don't render anything while checking user status

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-lg space-y-6"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <h2 className="text-2xl font-bold text-center dark:text-white">
              Welcome to Grip Dashboard!
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              Here's a quick walkthrough to help you track expenses, smash your
              goals, and stay on budget!
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-2">
                <span>✅</span>
                <span>Track daily expenses easily in your Weekly Budget.</span>
              </div>
              <div className="flex items-start gap-2">
                <span>🎯</span>
                <span>
                  Stay motivated by hitting your Monthly Savings Goals!
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span>📅</span>
                <span>
                  Use the Monthly Calendar to monitor your budget health.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span>🔁</span>
                <span>
                  Manage recurring bills like rent, subscriptions, and more.
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="ghost"
                className="text-sm"
                onClick={handleCompleteTutorial}
                disabled={completingTutorial}
              >
                {completingTutorial ? "Finishing..." : "Skip"}
              </Button>
              <Button
                className="text-sm"
                onClick={handleCompleteTutorial}
                disabled={completingTutorial}
              >
                {completingTutorial ? "Finishing..." : "Let's Go!"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
