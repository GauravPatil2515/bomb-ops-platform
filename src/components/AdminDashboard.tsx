import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipForward, 
  Users, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Download
} from "lucide-react";

const AdminDashboard = () => {
  const [boothStatus, setBoothStatus] = useState<"open" | "closed">("open");
  
  // Mock queue data
  const queueData = [
    { id: 1, team: "ALPHA SQUAD", mode: "Full", difficulty: "Expert", paid: true, eta: "Now", status: "playing" },
    { id: 2, team: "DEFUSE FORCE", mode: "Quick", difficulty: "Pro", paid: true, eta: "12 min", status: "waiting" },
    { id: 3, team: "BOMB HUNTERS", mode: "Full", difficulty: "Novice", paid: true, eta: "24 min", status: "waiting" },
    { id: 4, team: "CODE BREAKERS", mode: "Quick", difficulty: "Pro", paid: false, eta: "Pending", status: "payment" },
  ];

  const todayStats = {
    totalTeams: 247,
    revenue: 89750,
    successRate: 73,
    avgTime: "03:24",
    currentlyPlaying: 3,
    inQueue: 8
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "playing": return "text-accent border-accent/30 bg-accent/10";
      case "waiting": return "text-primary border-primary/30 bg-primary/10";
      case "payment": return "text-destructive border-destructive/30 bg-destructive/10";
      default: return "text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "playing": return <Play className="w-4 h-4" />;
      case "waiting": return <Clock className="w-4 h-4" />;
      case "payment": return <DollarSign className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20 bg-gradient-terminal">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4 text-glow">
                <span className="text-primary">MISSION</span> CONTROL
              </h2>
              <p className="text-muted-foreground font-mono">Operations dashboard and queue management</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                boothStatus === "open" 
                  ? "border-primary/30 bg-primary/10 text-primary" 
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  boothStatus === "open" ? "bg-primary animate-countdown-pulse" : "bg-destructive"
                }`} />
                <span className="font-mono font-bold">
                  BOOTH {boothStatus.toUpperCase()}
                </span>
              </div>
              
              <Button
                onClick={() => setBoothStatus(boothStatus === "open" ? "closed" : "open")}
                className={boothStatus === "open" ? "danger-button" : "mission-button"}
              >
                {boothStatus === "open" ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {boothStatus === "open" ? "Close Booth" : "Open Booth"}
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary text-glow">{todayStats.totalTeams}</div>
                <div className="text-xs text-muted-foreground font-mono">Total Teams</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent text-glow">₹{(todayStats.revenue / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground font-mono">Revenue</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary text-glow">{todayStats.successRate}%</div>
                <div className="text-xs text-muted-foreground font-mono">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary text-glow">{todayStats.avgTime}</div>
                <div className="text-xs text-muted-foreground font-mono">Avg Time</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent text-glow">{todayStats.currentlyPlaying}</div>
                <div className="text-xs text-muted-foreground font-mono">Playing Now</div>
              </CardContent>
            </Card>
            <Card className="terminal-card text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary text-glow">{todayStats.inQueue}</div>
                <div className="text-xs text-muted-foreground font-mono">In Queue</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Queue */}
            <div className="lg:col-span-2">
              <Card className="terminal-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-primary flex items-center space-x-2">
                      <Users className="w-5 h-5" />
                      <span>Live Queue</span>
                    </CardTitle>
                    <CardDescription className="font-mono">Current mission queue status</CardDescription>
                  </div>
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <SkipForward className="w-4 h-4 mr-2" />
                    Call Next
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {queueData.map((team, index) => (
                      <div
                        key={team.id}
                        className={`p-4 border-b border-border last:border-b-0 flex items-center justify-between hover:bg-primary/5 transition-colors ${
                          team.status === "playing" ? "bg-accent/5 border-l-4 border-l-accent" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-mono font-bold text-muted-foreground w-8">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="font-bold font-mono text-primary">{team.team}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {team.mode} • {team.difficulty}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm font-mono text-muted-foreground">ETA</div>
                            <div className="font-bold text-accent">{team.eta}</div>
                          </div>
                          
                          <Badge variant="outline" className={`font-mono ${getStatusColor(team.status)}`}>
                            {getStatusIcon(team.status)}
                            <span className="ml-1">{team.status.toUpperCase()}</span>
                          </Badge>
                          
                          {team.status === "playing" && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full mission-button">
                    <Play className="w-4 h-4 mr-2" />
                    Start Next Mission
                  </Button>
                  <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Mark No-Show
                  </Button>
                  <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Completions */}
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Recent Completions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-primary/5 rounded border border-primary/20">
                      <div>
                        <div className="font-mono font-bold text-primary">WIRE WIZARDS</div>
                        <div className="text-xs text-muted-foreground">Expert • 0 strikes</div>
                      </div>
                      <div className="text-sm font-mono text-accent">SUCCESS</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-destructive/5 rounded border border-destructive/20">
                      <div>
                        <div className="font-mono font-bold text-primary">PANIC SQUAD</div>
                        <div className="text-xs text-muted-foreground">Pro • 3 strikes</div>
                      </div>
                      <div className="text-sm font-mono text-destructive">FAILED</div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-primary/5 rounded border border-primary/20">
                      <div>
                        <div className="font-mono font-bold text-primary">ELITE FORCE</div>
                        <div className="text-xs text-muted-foreground">Novice • 1 strike</div>
                      </div>
                      <div className="text-sm font-mono text-accent">SUCCESS</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="terminal-card border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-countdown-pulse" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Gateway</span>
                      <span className="text-primary">ONLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Queue System</span>
                      <span className="text-primary">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Game Stations</span>
                      <span className="text-primary">3/3 READY</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;