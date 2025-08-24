import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Layout } from "./components/Layout";
import { UserRole } from "./types";

// Pages
import React, { Suspense } from "react";
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Marketplace = React.lazy(() => import("./pages/Marketplace"));
const DesignDetail = React.lazy(() => import("./pages/DesignDetail"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Chat = React.lazy(() => import("./pages/Chat"));
const AIMeasurement = React.lazy(() => import("./pages/AIMeasurement"));
const CreateRequest = React.lazy(() => import("./pages/CreateRequest"));
const MyRequests = React.lazy(() => import("./pages/MyRequests"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const CreateDesign = React.lazy(() => import("./pages/CreateDesign"));
const EditRequest = React.lazy(() => import("./pages/EditRequest"));
const OAuthSuccess = React.lazy(() => import("./pages/OAuthSuccess"));

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: UserRole;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-screen">
                    Loading...
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/oauth-success" element={<OAuthSuccess />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/marketplace/:id" element={<DesignDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/designs/new"
                    element={
                      <ProtectedRoute requiredRole={UserRole.TAILOR}>
                        <CreateDesign />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <Wishlist />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/measurements/ai-update"
                    element={
                      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
                        <AIMeasurement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests/new"
                    element={
                      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
                        <CreateRequest />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests"
                    element={
                      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
                        <MyRequests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/requests/:id"
                    element={
                      <ProtectedRoute requiredRole={UserRole.CUSTOMER}>
                        <EditRequest />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </WishlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
