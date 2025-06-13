import { useState, useEffect } from "react";
import { Router, Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoginForm } from "@/components/login-form";
import { BottomNavigation } from "@/components/bottom-navigation";
import Home from "@/pages/home";
import Stats from "@/pages/stats";
import Goals from "@/pages/goals";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { storage } from "@/lib/localStorage";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [dataVersion, setDataVersion] = useState<number>(0);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      setCurrentUserId(currentUser.id);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userId: string) => {
    setCurrentUserId(userId);
    setIsAuthenticated(true);
    storage.setCurrentUser(userId);
  };

  const handleLogout = () => {
    setCurrentUserId("");
    setIsAuthenticated(false);
    storage.logout();
  };

  const handleDataUpdate = () => {
    setDataVersion(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <LoginForm onLogin={handleLogin} />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Router>
            <Switch>
              <Route path="/" component={() => 
                <Home 
                  currentUserId={currentUserId} 
                  onDataUpdate={handleDataUpdate}
                  key={dataVersion}
                />
              } />
              <Route path="/stats" component={() => 
                <Stats 
                  currentUserId={currentUserId}
                  key={dataVersion}
                />
              } />
              <Route path="/goals" component={() => 
                <Goals 
                  currentUserId={currentUserId}
                  key={dataVersion}
                />
              } />
              <Route path="/profile" component={() => 
                <Profile 
                  currentUserId={currentUserId} 
                  onLogout={handleLogout}
                  key={dataVersion}
                />
              } />
              <Route component={NotFound} />
            </Switch>
          </Router>
          
          <BottomNavigation />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;