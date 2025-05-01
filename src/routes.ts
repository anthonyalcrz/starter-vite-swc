// src/routes.ts

type RouteConfig = {
  path: string;
  requiresAuth?: boolean;
  requiresOnboarding?: boolean;
  role?: "admin";
  title?: string;
};

const routes: Record<string, RouteConfig> = {
  home: { path: "/", title: "Home" },
  signin: { path: "/signin", title: "Sign In" },
  signup: { path: "/signup", title: "Sign Up" },
  onboarding: {
    path: "/onboarding",
    requiresAuth: true,
    title: "Get Started",
  },
  dashboard: {
    path: "/dashboard",
    requiresAuth: true,
    requiresOnboarding: true,
    title: "Dashboard",
  },
  settings: {
    path: "/settings",
    requiresAuth: true,
    requiresOnboarding: true,
    title: "Settings",
  },
  admin: {
    path: "/admin",
    requiresAuth: true,
    requiresOnboarding: true,
    role: "admin",
    title: "Admin Panel",
  },
  savings: {
    path: "/savings",
    requiresAuth: true,
    requiresOnboarding: true,
    title: "Savings Beta",
  },
  transactionHistory: {
    path: "/transactionhistory",
    requiresAuth: true,
    requiresOnboarding: true,
    title: "Transactions",
  },
  forgotPassword: { path: "/forgot-password", title: "Forgot Password" },
  resetPassword: { path: "/reset-password", title: "Reset Password" },
  emailConfirmed: { path: "/email-confirmed", title: "Email Confirmed" },
  terms: { path: "/terms", title: "Terms of Service" },
  privacy: { path: "/privacy", title: "Privacy Policy" },
  contact: { path: "/contact", title: "Contact Us" },
  notFound: { path: "/404", title: "Page Not Found" },
};

export default routes;

export type RouteKey = keyof typeof routes;
