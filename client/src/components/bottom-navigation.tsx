import { Home, BarChart3, Trophy, User } from "lucide-react";
import { useLocation, Link } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/stats", icon: BarChart3, label: "Stats" },
    { path: "/goals", icon: Trophy, label: "Goals" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-6 py-4 fixed bottom-0 left-0 right-0 max-w-md mx-auto">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
