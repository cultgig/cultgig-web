import { lazy, type ReactNode } from "react";
import { matchPath, Navigate } from "@/lib/router";
import { NotFoundState } from "@/components/shared/states";
import { RequireAuth, RequireRole } from "./guards";
import { HomePage } from "@/pages/public/HomePage";
import { ExplorePage } from "@/pages/public/ExplorePage";
import { CategoriesIndexPage, CategoryDetailPage } from "@/pages/public/CategoriesPages";
import { ArtistProfilePage } from "@/pages/public/ArtistProfilePage";
import {
  AboutPage,
  FaqPage,
  ForArtistsPage,
  ForBusinessesPage,
  GuideDetailPage,
  GuidesIndexPage,
  HowItWorksPage,
  PricingPage,
  TrustAndSafetyPage,
} from "@/pages/public/MarketingPages";
import { LegalDocumentPage, legalKinds, type LegalKind } from "@/pages/public/LegalPages";
import { SupportPage } from "@/pages/public/SupportPage";
import { AccessibilityPage } from "@/pages/public/AccessibilityPage";
import {
  AuthCallbackPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
} from "@/pages/auth/AuthPages";

// Signed-in areas are code-split so public visitors don't download workspace code.
const OnboardingChooser = lazy(() => import("@/pages/auth/OnboardingPages").then((m) => ({ default: m.OnboardingChooserPage })));
const ArtistOnboarding = lazy(() => import("@/pages/auth/OnboardingPages").then((m) => ({ default: m.ArtistOnboardingPage })));
const ClientOnboarding = lazy(() => import("@/pages/auth/OnboardingPages").then((m) => ({ default: m.ClientOnboardingPage })));

const ArtistDashboard = lazy(() => import("@/pages/artist/ArtistDashboardPage"));
const ArtistProfileEdit = lazy(() => import("@/pages/artist/ArtistProfileEditPage"));
const ArtistPortfolio = lazy(() => import("@/pages/artist/ArtistPortfolioPage"));
const ArtistServices = lazy(() => import("@/pages/artist/ArtistServicesPage"));
const ArtistGigs = lazy(() => import("@/pages/artist/ArtistGigsPage"));
const ArtistGigDetail = lazy(() => import("@/pages/artist/ArtistGigDetailPage"));
const ArtistApplications = lazy(() => import("@/pages/artist/ArtistApplicationsPage"));
const ArtistProposals = lazy(() => import("@/pages/artist/ArtistProposalsPage"));
const ArtistAvailability = lazy(() => import("@/pages/artist/ArtistAvailabilityPage"));
const ArtistEarnings = lazy(() => import("@/pages/artist/ArtistEarningsPage"));

const ClientDashboard = lazy(() => import("@/pages/client/ClientDashboardPage"));
const ClientSaved = lazy(() => import("@/pages/client/ClientSavedArtistsPage"));
const ClientGigs = lazy(() => import("@/pages/client/ClientGigsPage"));
const ClientGigEditor = lazy(() => import("@/pages/client/ClientGigEditorPage"));
const ClientGigDetail = lazy(() => import("@/pages/client/ClientGigDetailPage"));
const ClientApplications = lazy(() => import("@/pages/client/ClientApplicationsPage"));
const ClientPayments = lazy(() => import("@/pages/client/ClientPaymentsPage"));

const Messages = lazy(() => import("@/pages/shared/MessagesPage"));
const BookingsList = lazy(() => import("@/pages/shared/BookingsPages").then((m) => ({ default: m.BookingsListPage })));
const BookingDetail = lazy(() => import("@/pages/shared/BookingsPages").then((m) => ({ default: m.BookingDetailPage })));
const Notifications = lazy(() => import("@/pages/shared/NotificationsPage"));
const Settings = lazy(() => import("@/pages/shared/SettingsPage"));
const Checkout = lazy(() => import("@/pages/shared/CheckoutPages").then((m) => ({ default: m.CheckoutPage })));
const PaymentStatus = lazy(() => import("@/pages/shared/CheckoutPages").then((m) => ({ default: m.PaymentStatusPage })));
const Readiness = lazy(() => import("@/pages/shared/ReadinessPage"));

export interface ResolvedRoute {
  element: ReactNode;
  layout: "public" | "workspace" | "bare";
}

type Params = Record<string, string>;
interface RouteDef {
  path: string;
  layout?: ResolvedRoute["layout"];
  render: (params: Params) => ReactNode;
}

const artist = (node: ReactNode) => <RequireRole role="artist">{node}</RequireRole>;
const client = (node: ReactNode) => <RequireRole role="client">{node}</RequireRole>;
const authed = (node: ReactNode) => <RequireAuth>{node}</RequireAuth>;

const routes: RouteDef[] = [
  // Public marketplace
  { path: "/", render: () => <HomePage /> },
  { path: "/explore", render: () => <ExplorePage /> },
  { path: "/categories", render: () => <CategoriesIndexPage /> },
  { path: "/categories/:slug", render: (p) => <CategoryDetailPage slug={p.slug} /> },
  { path: "/artists/:slug", render: (p) => <ArtistProfilePage slug={p.slug} /> },
  { path: "/how-it-works", render: () => <HowItWorksPage /> },
  { path: "/for-artists", render: () => <ForArtistsPage /> },
  { path: "/for-businesses", render: () => <ForBusinessesPage /> },
  { path: "/pricing", render: () => <PricingPage /> },
  { path: "/faq", render: () => <FaqPage /> },
  { path: "/about", render: () => <AboutPage /> },
  { path: "/guides", render: () => <GuidesIndexPage /> },
  { path: "/guides/:slug", render: (p) => <GuideDetailPage slug={p.slug} /> },
  { path: "/safety", render: () => <TrustAndSafetyPage /> },
  { path: "/trust-and-safety", render: () => <Navigate to="/safety" /> },
  { path: "/support", render: () => <SupportPage /> },
  { path: "/contact", render: () => <SupportPage /> },
  { path: "/accessibility", render: () => <AccessibilityPage /> },
  { path: "/legal/:kind", render: (p) => (legalKinds.includes(p.kind as LegalKind) ? <LegalDocumentPage kind={p.kind as LegalKind} /> : <NotFoundState />) },
  { path: "/terms", render: () => <Navigate to="/legal/terms" /> },
  { path: "/privacy", render: () => <Navigate to="/legal/privacy" /> },
  { path: "/system/readiness", render: () => <Readiness /> },

  // Auth
  { path: "/sign-in", layout: "bare", render: () => <SignInPage /> },
  { path: "/sign-up", layout: "bare", render: () => <SignUpPage /> },
  { path: "/verify-email", layout: "bare", render: () => <VerifyEmailPage /> },
  { path: "/forgot-password", layout: "bare", render: () => <ForgotPasswordPage /> },
  { path: "/reset-password", layout: "bare", render: () => <ResetPasswordPage /> },
  { path: "/auth/callback", layout: "bare", render: () => <AuthCallbackPage /> },
  { path: "/onboarding", layout: "bare", render: () => authed(<OnboardingChooser />) },
  { path: "/onboarding/artist", layout: "bare", render: () => authed(<ArtistOnboarding />) },
  { path: "/onboarding/client", layout: "bare", render: () => authed(<ClientOnboarding />) },

  // Artist workspace
  { path: "/artist/dashboard", layout: "workspace", render: () => artist(<ArtistDashboard />) },
  { path: "/artist/profile", layout: "workspace", render: () => artist(<ArtistProfileEdit />) },
  { path: "/artist/portfolio", layout: "workspace", render: () => artist(<ArtistPortfolio />) },
  { path: "/artist/services", layout: "workspace", render: () => artist(<ArtistServices />) },
  { path: "/artist/gigs", layout: "workspace", render: () => artist(<ArtistGigs />) },
  { path: "/artist/gigs/:gigId", layout: "workspace", render: (p) => artist(<ArtistGigDetail gigId={p.gigId} />) },
  { path: "/artist/applications", layout: "workspace", render: () => artist(<ArtistApplications />) },
  { path: "/artist/proposals", layout: "workspace", render: () => artist(<ArtistProposals />) },
  { path: "/artist/bookings", layout: "workspace", render: () => artist(<BookingsList role="artist" />) },
  { path: "/artist/availability", layout: "workspace", render: () => artist(<ArtistAvailability />) },
  { path: "/artist/earnings", layout: "workspace", render: () => artist(<ArtistEarnings />) },

  // Client workspace
  { path: "/client/dashboard", layout: "workspace", render: () => client(<ClientDashboard />) },
  { path: "/client/saved", layout: "workspace", render: () => client(<ClientSaved />) },
  { path: "/client/gigs", layout: "workspace", render: () => client(<ClientGigs />) },
  { path: "/client/gigs/new", layout: "workspace", render: () => client(<ClientGigEditor />) },
  { path: "/client/gigs/:gigId/edit", layout: "workspace", render: (p) => client(<ClientGigEditor gigId={p.gigId} />) },
  { path: "/client/gigs/:gigId", layout: "workspace", render: (p) => client(<ClientGigDetail gigId={p.gigId} />) },
  { path: "/client/applications", layout: "workspace", render: () => client(<ClientApplications />) },
  { path: "/client/bookings", layout: "workspace", render: () => client(<BookingsList role="client" />) },
  { path: "/client/payments", layout: "workspace", render: () => client(<ClientPayments />) },

  // Shared signed-in areas (role-agnostic, use the active role's shell)
  { path: "/messages", layout: "workspace", render: () => authed(<Messages />) },
  { path: "/messages/:conversationId", layout: "workspace", render: (p) => authed(<Messages conversationId={p.conversationId} />) },
  { path: "/bookings/:bookingId", layout: "workspace", render: (p) => authed(<BookingDetail bookingId={p.bookingId} />) },
  { path: "/notifications", layout: "workspace", render: () => authed(<Notifications />) },
  { path: "/settings", layout: "workspace", render: () => authed(<Settings />) },
  { path: "/checkout/:bookingId", render: (p) => authed(<Checkout bookingId={p.bookingId} />) },
  { path: "/payment/:status", render: (p) => <PaymentStatus status={p.status} /> },

  // Legacy aliases from the previous route map
  { path: "/artist/opportunities", render: () => <Navigate to="/artist/gigs" /> },
  { path: "/artist/opportunities/:gigId", render: (p) => <Navigate to={`/artist/gigs/${p.gigId}`} /> },
  { path: "/artist/profile/edit", render: () => <Navigate to="/artist/profile" /> },
  { path: "/artist/settings", render: () => <Navigate to="/settings" /> },
  { path: "/artist/bookings/:bookingId", render: (p) => <Navigate to={`/bookings/${p.bookingId}`} /> },
  { path: "/client/bookings/:bookingId", render: (p) => <Navigate to={`/bookings/${p.bookingId}`} /> },
  { path: "/client/artists/saved", render: () => <Navigate to="/client/saved" /> },
  { path: "/client/messages", render: () => <Navigate to="/messages" /> },
  { path: "/client/settings/profile", render: () => <Navigate to="/settings" /> },
  { path: "/client/settings/billing", render: () => <Navigate to="/client/payments" /> },
];

export function resolveRoute(pathname: string): ResolvedRoute {
  for (const route of routes) {
    const params = matchPath(route.path, pathname);
    if (params) return { element: route.render(params), layout: route.layout ?? "public" };
  }
  return { element: <NotFoundState />, layout: "public" };
}
