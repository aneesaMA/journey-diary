import { NavLink } from '@/components/NavLink';
import { Home, MapPin, History, User, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/track', icon: Compass, label: 'Track' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' }
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-xl shadow-lg">
      <div className="flex items-center justify-around py-1 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-300",
              "text-muted-foreground hover:text-primary"
            )}
            activeClassName="text-primary bg-primary/10"
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive && "bg-gradient-to-br from-primary to-primary/80 shadow-glow-primary"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-colors",
                    isActive && "text-primary-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-semibold tracking-wide",
                  isActive && "text-primary"
                )}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
