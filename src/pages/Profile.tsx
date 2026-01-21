import { AppLayout } from '@/components/layout/AppLayout';
import { useTripStore } from '@/hooks/useTripStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, Settings, Bell, MapPin, Shield, Download, 
  LogOut, ChevronRight, Award, TrendingUp 
} from 'lucide-react';

export default function Profile() {
  const { getTripStats } = useTripStore();
  const stats = getTripStats();

  const achievements = [
    { name: 'First Trip', earned: true, icon: '🎯' },
    { name: '10 Trips', earned: stats.totalTrips >= 10, icon: '🏆' },
    { name: '100 km', earned: stats.totalDistance >= 100, icon: '🚗' },
    { name: 'Explorer', earned: stats.totalTrips >= 5, icon: '🗺️' },
  ];

  const menuItems = [
    { icon: Bell, label: 'Notifications', hasSwitch: true },
    { icon: MapPin, label: 'Location Services', hasSwitch: true, defaultOn: true },
    { icon: Shield, label: 'Privacy Settings', hasArrow: true },
    { icon: Download, label: 'Export My Data', hasArrow: true },
    { icon: Settings, label: 'App Settings', hasArrow: true },
  ];

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              TU
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-bold">Travel User</h1>
          <p className="text-sm text-muted-foreground">Member since Jan 2026</p>
          <Button variant="outline" size="sm" className="mt-3">
            Edit Profile
          </Button>
        </div>

        {/* Stats Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Your Journey Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{stats.totalTrips}</p>
                <p className="text-xs text-muted-foreground">Trips</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">{stats.totalDistance.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">km</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-foreground">
                  {Math.floor(stats.totalDuration / 60)}h
                </p>
                <p className="text-xs text-muted-foreground">traveled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.name}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl ${
                    achievement.earned 
                      ? 'bg-accent/50' 
                      : 'bg-muted/50 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="text-xs text-center">{achievement.name}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progress to next level</span>
                <span className="font-medium">Level 2</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <Card>
          <CardContent className="p-2">
            {menuItems.map((item, idx) => (
              <div
                key={item.label}
                className={`flex items-center justify-between p-3 ${
                  idx !== menuItems.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.hasSwitch ? (
                  <Switch defaultChecked={item.defaultOn} />
                ) : item.hasArrow ? (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>

        {/* App Info */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          TripTracker v1.0.0 • NATPAC Research Project
        </p>
      </div>
    </AppLayout>
  );
}
