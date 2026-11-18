import { useEffect } from "react";
import { Footer } from "../components/layout/Footer";
import { Header } from "../components/layout/Header";
import { RouterProvider, useRouter } from "../lib/router";
import { ArtistProfilePage } from "../pages/ArtistProfilePage";
import {
  ArtistApplicationsPage,
  ArtistAvailabilityPage,
  ArtistBookingsPage,
  ArtistDashboardPage,
  ArtistEarningsPage,
  ArtistOpportunitiesPage,
  ArtistOpportunityDetailPage,
  ArtistPortfolioPage,
  ArtistProfileEditPage,
  ArtistProposalsPage,
  ArtistSettingsPage,
} from "../pages/ArtistWorkspacePages";
import {
  OnboardingPage,
  PasswordRecoveryPage,
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
} from "../pages/AuthPages";
import { CategoriesIndexPage, CategoryDetailPage } from "../pages/CategoriesPages";
import {
  BookingDetailPage,
  ClientApplicationsPage,
  ClientBookingsPage,
  ClientDashboardPage,
  ClientGigDetailPage,
  ClientGigsListPage,
  ClientNewGigPage,
  ClientSavedArtistsPage,
  ClientSettingsPage,
} from "../pages/ClientWorkspacePages";
import {
  CheckoutPage,
  ContactAndSupportPage,
  LegalDocumentPage,
  NotFoundPage,
  PaymentStatusPage,
} from "../pages/ComplianceAndCheckoutPages";
import { ExplorePage } from "../pages/ExplorePage";
import { HomePage } from "../pages/HomePage";
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
} from "../pages/MarketingAndGuidePages";
import {
  ConversationThreadPage,
  MessagesInboxPage,
  NotificationsPage,
} from "../pages/NegotiationAndSharedPages";
import { AuthProviderRoot, useAuth } from "../state/AuthContext";
import { MarketplaceProvider } from "../state/MarketplaceContext";
import { OnboardingProvider } from "../state/onboardingContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { pathname, search, navigate } = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const next = encodeURIComponent(`${pathname}${search}`);
      navigate(`/sign-in?next=${next}`, { replace: true });
    }
  }, [loading, user, pathname, search, navigate]);

  if (loading || !user) {
    return (
      <main id="main-content" className="max-w-[780px] mx-auto px-4 py-16 text-center">
        <p className="type-body text-ink-secondary">Checking session...</p>
      </main>
    );
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { pathname } = useRouter();
  const cleanPath = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (cleanPath === "/") return <HomePage />;
  if (cleanPath === "/explore") return <ExplorePage />;
  if (cleanPath === "/categories") return <CategoriesIndexPage />;
  if (cleanPath.startsWith("/categories/")) {
    return <CategoryDetailPage slug={cleanPath.replace("/categories/", "")} />;
  }
  if (cleanPath.startsWith("/artists/")) {
    return <ArtistProfilePage slug={cleanPath.replace("/artists/", "")} />;
  }
  if (cleanPath === "/how-it-works") return <HowItWorksPage />;
  if (cleanPath === "/for-artists") return <ForArtistsPage />;
  if (cleanPath === "/for-businesses") return <ForBusinessesPage />;
  if (cleanPath === "/about") return <AboutPage />;
  if (cleanPath === "/pricing") return <PricingPage />;
  if (cleanPath === "/guides") return <GuidesIndexPage />;
  if (cleanPath.startsWith("/guides/")) {
    return <GuideDetailPage slug={cleanPath.replace("/guides/", "")} />;
  }
  if (cleanPath === "/faq") return <FaqPage />;
  if (cleanPath === "/contact" || cleanPath === "/support") return <ContactAndSupportPage />;
  if (cleanPath.startsWith("/support/requests/")) {
    return <ContactAndSupportPage ticketId={cleanPath.replace("/support/requests/", "")} />;
  }
  if (cleanPath === "/safety" || cleanPath === "/trust-and-safety") {
    return <TrustAndSafetyPage />;
  }

  // Legal pages (with legacy aliases)
  if (cleanPath === "/legal/terms" || cleanPath === "/terms") {
    return <LegalDocumentPage kind="terms" />;
  }
  if (cleanPath === "/legal/privacy" || cleanPath === "/privacy") {
    return <LegalDocumentPage kind="privacy" />;
  }
  if (cleanPath === "/legal/refunds") return <LegalDocumentPage kind="refunds" />;
  if (cleanPath === "/legal/cancellation") return <LegalDocumentPage kind="cancellation" />;
  if (cleanPath === "/legal/community-guidelines") {
    return <LegalDocumentPage kind="community-guidelines" />;
  }
  if (cleanPath === "/legal/artist-agreement") {
    return <LegalDocumentPage kind="artist-agreement" />;
  }
  if (cleanPath === "/legal/client-agreement") {
    return <LegalDocumentPage kind="client-agreement" />;
  }

  // Auth & onboarding
  if (cleanPath === "/sign-in") return <SignInPage />;
  if (cleanPath === "/sign-up") return <SignUpPage />;
  if (cleanPath === "/verify-email") return <VerifyEmailPage />;
  if (cleanPath === "/forgot-password") return <PasswordRecoveryPage mode="forgot" />;
  if (cleanPath === "/reset-password") return <PasswordRecoveryPage mode="reset" />;
  if (cleanPath === "/onboarding") return <OnboardingPage />;

  // Protected Client Workspace
  if (cleanPath === "/client/dashboard") {
    return (
      <ProtectedRoute>
        <ClientDashboardPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/gigs") {
    return (
      <ProtectedRoute>
        <ClientGigsListPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/gigs/new") {
    return (
      <ProtectedRoute>
        <ClientNewGigPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath.startsWith("/client/gigs/")) {
    return (
      <ProtectedRoute>
        <ClientGigDetailPage gigId={cleanPath.replace("/client/gigs/", "")} />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/artists/saved") {
    return (
      <ProtectedRoute>
        <ClientSavedArtistsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/applications") {
    return (
      <ProtectedRoute>
        <ClientApplicationsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/messages" || cleanPath === "/messages") {
    return (
      <ProtectedRoute>
        <MessagesInboxPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/bookings") {
    return (
      <ProtectedRoute>
        <ClientBookingsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath.startsWith("/client/bookings/")) {
    return (
      <ProtectedRoute>
        <BookingDetailPage bookingId={cleanPath.replace("/client/bookings/", "")} />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/settings/profile") {
    return (
      <ProtectedRoute>
        <ClientSettingsPage section="profile" />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/client/settings/billing") {
    return (
      <ProtectedRoute>
        <ClientSettingsPage section="billing" />
      </ProtectedRoute>
    );
  }

  // Protected Artist Workspace
  if (cleanPath === "/artist/dashboard") {
    return (
      <ProtectedRoute>
        <ArtistDashboardPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/profile/edit") {
    return (
      <ProtectedRoute>
        <ArtistProfileEditPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/portfolio") {
    return (
      <ProtectedRoute>
        <ArtistPortfolioPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/opportunities") {
    return (
      <ProtectedRoute>
        <ArtistOpportunitiesPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath.startsWith("/artist/opportunities/")) {
    return (
      <ProtectedRoute>
        <ArtistOpportunityDetailPage gigId={cleanPath.replace("/artist/opportunities/", "")} />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/applications") {
    return (
      <ProtectedRoute>
        <ArtistApplicationsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/proposals") {
    return (
      <ProtectedRoute>
        <ArtistProposalsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/bookings") {
    return (
      <ProtectedRoute>
        <ArtistBookingsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath.startsWith("/artist/bookings/")) {
    return (
      <ProtectedRoute>
        <BookingDetailPage bookingId={cleanPath.replace("/artist/bookings/", "")} />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/availability") {
    return (
      <ProtectedRoute>
        <ArtistAvailabilityPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/earnings") {
    return (
      <ProtectedRoute>
        <ArtistEarningsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/artist/settings") {
    return (
      <ProtectedRoute>
        <ArtistSettingsPage />
      </ProtectedRoute>
    );
  }

  // Shared protected routes
  if (cleanPath.startsWith("/messages/")) {
    return (
      <ProtectedRoute>
        <ConversationThreadPage conversationId={cleanPath.replace("/messages/", "")} />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/notifications") {
    return (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    );
  }
  if (cleanPath.startsWith("/checkout/")) {
    return (
      <ProtectedRoute>
        <CheckoutPage bookingId={cleanPath.replace("/checkout/", "")} />
      </ProtectedRoute>
    );
  }
  if (cleanPath === "/payment/success") return <PaymentStatusPage status="success" />;
  if (cleanPath === "/payment/failed") return <PaymentStatusPage status="failed" />;
  if (cleanPath === "/payment/pending") return <PaymentStatusPage status="pending" />;

  return <NotFoundPage />;
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProviderRoot>
        <OnboardingProvider>
          <MarketplaceProvider>
            <div className="min-h-screen flex flex-col bg-canvas text-ink-primary font-sans">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 bg-plum text-white px-4 py-2 rounded-md font-semibold shadow-card"
              >
                Skip to main content
              </a>
              <Header />
              <div className="flex-1">
                <AppRoutes />
              </div>
              <Footer />
            </div>
          </MarketplaceProvider>
        </OnboardingProvider>
      </AuthProviderRoot>
    </RouterProvider>
  );
}
