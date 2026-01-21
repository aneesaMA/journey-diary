import { AppLayout } from '@/components/layout/AppLayout';
import { useTripStore } from '@/hooks/useTripStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, Clock, Route, Settings, Bell, 
  Moon, ChevronRight, Award, Target, Flame, Star,
  Shield, Download, LogOut, Sparkles
} from 'lucide-react';

export default function Profile() {
  const { getTripStats } = useTripStore();
  const stats = getTripStats();

  const achievements = [
    { icon: Flame, label: 'Week Streak', value: '7', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Target, label: 'Monthly Goal', value: '85%', color: 'text-success', bg: 'bg-success/10' },
    { icon: Star, label: 'Top Explorer', value: 'Gold', color: 'text-accent-foreground', bg: 'bg-accent/20' },
    { icon: Award, label: 'Total Points', value: '2.4K', color: 'text-secondary', bg: 'bg-secondary/10' }
  ];

  const settingsItems = [
    { icon: Bell, label: 'Notifications', hasToggle: true },
    { icon: MapPin, label: 'Location Services', hasToggle: true },
    { icon: Moon, label: 'Dark Mode', hasToggle: true },
    { icon: Shield, label: 'Privacy Settings', hasToggle: false },
    { icon: Download, label: 'Export Data', hasToggle: false }
  ];

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        <div className="relative">
          <div className="h-32 gradient-sunset rounded-2xl" />
          <Card className="mx-4 -mt-16 relative border-0 shadow-lg">
            <CardContent className="pt-14 pb-6 text-center">
              <Avatar className="h-24 w-24 absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-card shadow-xl">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" />
                <AvatarFallback className="text-2xl font-bold gradient-primary text-primary-foreground">JD</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2">John Doe</h2>
              <p className="text-sm text-muted-foreground">Explorer since 2024</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge className="bg-primary/10 text-primary border-0 gap-1">
                  <Sparkles className="h-3 w-3" />Pro Traveler
                </Badge>
              </div>
              <Button className="mt-4 rounded-xl gap-2 gradient-primary" size="sm">
                <Settings className="h-4 w-4" />Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-primary/10">
                <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold text-primary">{stats.totalTrips}</p>
                <p className="text-xs text-muted-foreground">Trips</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/10">
                <Route className="h-5 w-5 text-secondary mx-auto mb-1" />
                <p className="text-2xl font-bold text-secondary">{stats.totalDistance.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Kilometers</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-success/10">
                <Clock className="h-5 w-5 text-success mx-auto mb-1" />
                <p className="text-2xl font-bold text-success">{Math.round(stats.totalDuration / 60)}</p>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-accent-foreground" />Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`p-4 rounded-xl ${bg} flex items-center gap-3`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                  <div>
                    <p className={`text-lg font-bold ${color}`}>{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {settingsItems.map(({ icon: Icon, label, hasToggle }, index) => (
              <div key={label} className={`flex items-center justify-between p-4 ${index !== settingsItems.length - 1 ? 'border-b border-border/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
                {hasToggle ? <Switch /> : <ChevronRight className="h-5 w-5 text-muted-foreground" />}
              </div>
            ))}
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full h-12 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/30 gap-2">
          <LogOut className="h-5 w-5" />Sign Out
        </Button>
        <p className="text-center text-xs text-muted-foreground pb-4">TripTracker v1.0.0 • Made with ❤️</p>
      </div>
    </AppLayout>
  );
}
