import { Step } from "../types";

export const stepsData: Step[] = [
  {
    stepNumber: 1,
    stepLabel: "STEP 1",
    title: "Pick from 20 trusted services",
    description:
      "Browse 20 services in the Pronto app - from hourly bookings to per-task jobs to express cleans.",
    screens: [
      "/assets/app-screens/step-1-a.webp",
      "/assets/app-screens/step-1-b.webp",
      "/assets/app-screens/step-1-c.webp",
    ],
  },
  {
    stepNumber: 2,
    stepLabel: "STEP 2",
    title: "Add it to your cart",
    description:
      "Stack multiple tasks into one booking. Your Pro handles them all in a single visit.",
    screens: ["/assets/app-screens/step-2.webp"],
  },
  {
    stepNumber: 3,
    stepLabel: "STEP 3",
    title: "Choose instant, scheduled, or recurring. Pay & done!",
    description:
      "Get a Pro in minutes, book for later, or set up a recurring slot.",
    screens: [
      "/assets/app-screens/step-3-a-instant.webp",
      "/assets/app-screens/step-3-b-scheduled.webp",
      "/assets/app-screens/step-3-c-recurring.webp",
    ],
  },
];
