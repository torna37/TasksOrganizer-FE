import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useThemeEffect } from "@/hooks/use-theme";
import { useSidebarEffect } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import TaskListDashboard from "./pages/TaskListDashboard";
import TaskListView from "./pages/TaskListView";
import AllTasksPage from "./pages/AllTasksPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { useAuthStore } from "@/hooks/use-auth";
import { tsrReactQuery } from "./services/api/tsRestClient";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  if (loading) return null; // or a loading spinner
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function OnlyGuest({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === "/login";
  return (
    <div className="flex min-h-screen w-full">
      {!hideSidebar && <AppSidebar />}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

const App = () => {
  useThemeEffect();
  useSidebarEffect();
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route
              path="/login"
              element={
                <OnlyGuest>
                  <Login />
                </OnlyGuest>
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <TaskListDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/all-tasks"
              element={
                <RequireAuth>
                  <AllTasksPage />
                </RequireAuth>
              }
            />
            <Route
              path="/task-list/:id"
              element={
                <RequireAuth>
                  <TaskListView />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
