import { useState, useEffect } from "react";
import { Router, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LoginForm } from "@/components/login-form";
import { storage } from "@/lib/localStorage";
import Home from "@/pages/home";
import Stats from "@/pages/stats";
import Goals from "@/pages/goals";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";



function App() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    // Inject minimal essential styles only
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .gradient-primary {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      .gradient-secondary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .gradient-success {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      }
      .gradient-danger {
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      }
      .gradient-warning {
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      }
      .slide-up {
        animation: slideUp 0.3s ease-out;
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .fade-in {
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(styleElement);

    // Check for logged-in user
    const savedUser = storage.getCurrentUser();
    if (savedUser) {
      setCurrentUserId(savedUser.id);
    }

    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const handleLogin = (userId: string) => {
    setCurrentUserId(userId);
    storage.setCurrentUser(userId);
  };

  const handleLogout = () => {
    setCurrentUserId(null);
    storage.logout();
  };

  const handleDataUpdate = () => {
    setDataVersion(prev => prev + 1);
  };

  if (!currentUserId) {
    return (
      <div className="login-container">
        <LoginForm onLogin={handleLogin} />
        <Toaster />
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
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
        
        <BottomNavigation />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;