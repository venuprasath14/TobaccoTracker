import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { LoginForm } from "./components/login-form";
import { BottomNavigation } from "./components/bottom-navigation";
import { storage } from "./lib/localStorage";
import Home from "./pages/home";
import Stats from "./pages/stats";
import Goals from "./pages/goals";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";

function AuthenticatedApp({ currentUserId }: { currentUserId: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="pb-16">
      <Switch>
        <Route path="/">
          <Home 
            currentUserId={currentUserId} 
            onDataUpdate={handleDataUpdate}
            key={`home-${refreshKey}`}
          />
        </Route>
        <Route path="/stats">
          <Stats 
            currentUserId={currentUserId}
            key={`stats-${refreshKey}`}
          />
        </Route>
        <Route path="/goals">
          <Goals 
            currentUserId={currentUserId}
            key={`goals-${refreshKey}`}
          />
        </Route>
        <Route path="/profile">
          <Profile 
            currentUserId={currentUserId}
            onLogout={() => window.location.reload()}
            key={`profile-${refreshKey}`}
          />
        </Route>
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user.id);
    }
    
    // Initialize demo user if no users exist
    const users = storage.getUsers();
    if (users.length === 0) {
      const demoUser = storage.createUser("demo", "demo");
      // Add some demo data for the demo user
      initializeDemoData(demoUser.id);
    }
    
    setIsLoading(false);
  }, []);

  const initializeDemoData = (userId: string) => {
    // Create some demo entries
    const today = new Date();
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      storage.createOrUpdateDailyEntry(userId, dateStr, true);
    }
    
    // Update stats to reflect the entries
    storage.updateUserStats(userId);
    
    // Award initial achievements
    storage.checkAndAwardAchievements(userId);
  };

  const handleLogin = (userId: string) => {
    setCurrentUser(userId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-success flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <TooltipProvider>
        <Toaster />
        <LoginForm onLogin={handleLogin} />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Toaster />
      <AuthenticatedApp currentUserId={currentUser} />
    </TooltipProvider>
  );
}

export default App;