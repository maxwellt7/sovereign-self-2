import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingPage } from '@/components/LoadingSpinner';

// Layouts
import AuthLayout from '@/components/layouts/AuthLayout';
import AppLayout from '@/components/layouts/AppLayout';

// Pages
import DashboardPage from '@/pages/DashboardPage';
import JournalPage from '@/pages/JournalPage';
import JournalEditorPage from '@/pages/JournalEditorPage';
import KnowledgePage from '@/pages/KnowledgePage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import AdminPage from '@/pages/AdminPage';
import OnboardingPage from '@/pages/OnboardingPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <LoadingPage text="Loading your account..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route
            path="/sign-in"
            element={
              <AuthLayout>
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
              </AuthLayout>
            }
          />
          <Route
            path="/sign-up"
            element={
              <AuthLayout>
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
              </AuthLayout>
            }
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* App routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <JournalPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/journal/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <JournalEditorPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <KnowledgePage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AnalyticsPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AdminPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;

