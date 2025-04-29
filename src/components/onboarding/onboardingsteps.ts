export type StepKey = "welcome" | "profile" | "budget" | "savings" | "complete";

export type OnboardingStepType = {
  id: number;
  type: StepKey;
  title: string;
  description: string;
  mascotMessage: string;
  mascotEmotion?: "happy" | "excited" | "thinking" | "proud";
  buttonText: string;
};

export const onboardingSteps: OnboardingStepType[] = [
  {
    id: 0,
    type: "welcome",
    title: "Welcome to Grip Finance",
    description: "Let's set you up for a smarter, stress-free money life.",
    mascotMessage: "I'm Savvy 🐨 — let's get your budget working *for* you!",
    mascotEmotion: "happy",
    buttonText: "Let's Get Started",
  },
  {
    id: 1,
    type: "profile",
    title: "Let's Create Your Profile",
    description: "Choose a smiling avatar and tell us a bit about yourself.",
    mascotMessage: "Don't worry, I won't ask for your social. 🐾",
    mascotEmotion: "thinking",
    buttonText: "Next",
  },
  {
    id: 2,
    type: "budget",
    title: "Set Your Income and Budget",
    description:
      "Let's figure out your cash flow before we plan your spending.",
    mascotMessage:
      "I'm pretty good at math. Let's see what you're working with! 🧮",
    mascotEmotion: "excited",
    buttonText: "Next",
  },
  {
    id: 3,
    type: "savings",
    title: "What's Your First Savings Goal?",
    description: "Start small or dream big — we'll help you get there.",
    mascotMessage: "Vacation? Emergency fund? I'll cheer you on either way 🐶",
    mascotEmotion: "excited",
    buttonText: "Complete Setup",
  },
  {
    id: 4,
    type: "complete",
    title: "You're All Set!",
    description: "Your personalized dashboard is ready to go.",
    mascotMessage: "High paws! 🐾 You did it. Let's start saving.",
    mascotEmotion: "proud",
    buttonText: "Go to Dashboard",
  },
];
